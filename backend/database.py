"""
Database connection and models for Mumbai Hacks Claims System
"""
import os
from typing import Optional, List
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Numeric, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/mumbai_hacks")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Models
class Hospital(Base):
    __tablename__ = "hospitals"
    
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    claims = relationship("Claim", back_populates="hospital")

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String(50), unique=True, nullable=False, index=True)
    hospital_id = Column(String(50), ForeignKey("hospitals.hospital_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient_name = Column(String(255), nullable=False)
    patient_id = Column(String(100))
    diagnosis = Column(Text, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), nullable=False, default="INR")
    status = Column(String(50), nullable=False, default="Submitted")
    fraud_score = Column(Integer)
    ipfs_hash = Column(String(100))
    tx_hash = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    hospital = relationship("Hospital", back_populates="claims")
    user = relationship("User", back_populates="claims", foreign_keys=[user_id])
    events = relationship("ClaimEvent", back_populates="claim")

class ClaimEvent(Base):
    __tablename__ = "claim_events"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(String(50), ForeignKey("claims.claim_id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    event_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    claim = relationship("Claim", back_populates="events")

# Database dependency
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions
def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("[+] Database tables created successfully")

def drop_db():
    """Drop all database tables"""
    Base.metadata.drop_all(bind=engine)
    print("[!] All database tables dropped")

if __name__ == "__main__":
    # Test connection
    try:
        engine.connect()
        print("[+] Database connection successful")
        init_db()
    except Exception as e:
        print(f"[!] Database connection failed: {e}")
