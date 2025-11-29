from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import random
import asyncio
from web3 import Web3
import json
import os
from dotenv import load_dotenv
from datetime import timedelta

# Import database models and session
from database import get_db, Claim, ClaimEvent, Hospital
import auth

# Load environment variables
load_dotenv()

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Mumbai Hacks Claims API", version="2.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"🔥 Global Exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )

# Add CORS middleware
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"], # Restrict methods
    allow_headers=["Authorization", "Content-Type"], # Restrict headers
)

# --- Pydantic Models ---

class ClaimSubmission(BaseModel):
    hospital_id: str = Field(..., min_length=5, max_length=50)
    amount: float = Field(..., gt=0, description="Claim amount must be positive")
    currency: str = Field(..., pattern="^(INR|EUR|USD)$")
    patient_details: dict
    diagnosis: str = Field(..., min_length=3)

    @validator('patient_details')
    def validate_patient_details(cls, v):
        if not v.get('name') or not v.get('id'):
            raise ValueError("Patient details must contain 'name' and 'id'")
        return v

class ClaimStatusResponse(BaseModel):
    id: str
    status: str
    fraud_score: Optional[int] = None
    tx_hash: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

# Import ML Service
from ml_service import ml_service

# Import IPFS Service
from ipfs_service import ipfs_service

# --- Blockchain Client ---

# Import Blockchain Client
from blockchain_client import blockchain_client

# --- API Endpoints ---

from routers import auth_router
app.include_router(auth_router.router)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting Mumbai Hacks Claims API...")
    blockchain_client.deploy_contract()
    print("✅ API ready")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Mumbai Hacks Autonomous Claims System API",
        "version": "2.0.0",
        "status": "running",
        "database": "PostgreSQL",
        "security": "Enabled"
    }

@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock user authentication - In production, check DB
    if form_data.username != "admin" or form_data.password != "secret":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/claims/submit")
@limiter.limit("5/minute")
async def submit_claim(
    request: Request,
    claim: ClaimSubmission, 
    db: Session = Depends(get_db),
    current_user: auth.TokenData = Depends(auth.get_current_user)
):
    """Submit a new insurance claim"""
    
    # Generate unique claim ID
    claim_id = str(random.randint(10000, 99999))
    
    # 1. Upload docs to IPFS (Simulated)
    ipfs_hash = ipfs_service.upload(b"mock_file_content")
    
    # 2. Create claim in database
    db_claim = Claim(
        claim_id=claim_id,
        hospital_id=claim.hospital_id,
        patient_name=claim.patient_details.get("name", "Unknown"),
        patient_id=claim.patient_details.get("id"),
        diagnosis=claim.diagnosis,
        amount=claim.amount,
        currency=claim.currency,
        status="Submitted",
        ipfs_hash=ipfs_hash
    )
    
    try:
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        
        # Log event
        event = ClaimEvent(
            claim_id=claim_id,
            event_type="CLAIM_SUBMITTED",
            event_data={"hospital_id": claim.hospital_id, "amount": claim.amount}
        )
        db.add(event)
        db.commit()
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    # 3. Trigger AI Validation (Async)
    # Returns: is_valid, fraud_score, extracted_data
    is_valid, fraud_score, extracted_data = await ml_service.process_claim(claim.dict())
    
    # Update claim with fraud score
    db_claim.fraud_score = fraud_score
    
    if is_valid and fraud_score < 20:
        db_claim.status = "Approved"
        
        # Log validation event
        event = ClaimEvent(
            claim_id=claim_id,
            event_type="CLAIM_APPROVED",
            event_data={"fraud_score": fraud_score}
        )
        db.add(event)
        
        # 4. Settle on Blockchain
        tx_hash = blockchain_client.submit_claim_on_chain(claim_id, claim.amount)
        db_claim.tx_hash = tx_hash
        db_claim.status = "Settled"
        
        # Log settlement event
        event = ClaimEvent(
            claim_id=claim_id,
            event_type="CLAIM_SETTLED",
            event_data={"tx_hash": tx_hash}
        )
        db.add(event)
    else:
        db_claim.status = "Rejected"
        
        # Log rejection event
        event = ClaimEvent(
            claim_id=claim_id,
            event_type="CLAIM_REJECTED",
            event_data={"fraud_score": fraud_score, "reason": "High fraud score or invalid"}
        )
        db.add(event)
    
    db.commit()
    db.refresh(db_claim)
        
    return {
        "claim_id": claim_id,
        "status": db_claim.status,
        "fraud_score": fraud_score
    }

@app.get("/api/claims/{claim_id}", response_model=ClaimStatusResponse)
async def get_claim_status(
    claim_id: str, 
    db: Session = Depends(get_db),
    current_user: auth.TokenData = Depends(auth.get_current_user)
):
    """Get claim status by ID"""
    
    claim = db.query(Claim).filter(Claim.claim_id == claim_id).first()
    
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return {
        "id": claim.claim_id,
        "status": claim.status,
        "fraud_score": claim.fraud_score,
        "tx_hash": claim.tx_hash
    }

@app.get("/api/claims")
async def list_claims(
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: auth.TokenData = Depends(auth.get_current_user)
):
    """List all claims with optional filtering"""
    
    query = db.query(Claim)
    
    if status:
        query = query.filter(Claim.status == status)
    
    claims = query.offset(skip).limit(limit).all()
    
    return {
        "total": query.count(),
        "claims": [
            {
                "claim_id": c.claim_id,
                "hospital_id": c.hospital_id,
                "patient_name": c.patient_name,
                "amount": float(c.amount),
                "currency": c.currency,
                "status": c.status,
                "fraud_score": c.fraud_score,
                "created_at": c.created_at.isoformat()
            }
            for c in claims
        ]
    }

@app.get("/api/hospitals")
async def list_hospitals(db: Session = Depends(get_db)):
    """List all registered hospitals"""
    
    hospitals = db.query(Hospital).all()
    
    return {
        "hospitals": [
            {
                "hospital_id": h.hospital_id,
                "name": h.name,
                "address": h.address
            }
            for h in hospitals
        ]
    }

@app.get("/api/stats")
async def get_statistics(
    db: Session = Depends(get_db),
    current_user: auth.TokenData = Depends(auth.get_current_user)
):
    """Get claim statistics"""
    
    total_claims = db.query(Claim).count()
    approved = db.query(Claim).filter(Claim.status == "Approved").count()
    settled = db.query(Claim).filter(Claim.status == "Settled").count()
    rejected = db.query(Claim).filter(Claim.status == "Rejected").count()
    
    total_amount = db.query(Claim).with_entities(
        db.func.sum(Claim.amount)
    ).scalar() or 0
    
    return {
        "total_claims": total_claims,
        "approved": approved,
        "settled": settled,
        "rejected": rejected,
        "total_amount": float(total_amount),
        "approval_rate": (approved / total_claims * 100) if total_claims > 0 else 0
    }
