from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from database import get_db
from models.user import User, RefreshToken, PasswordResetToken, UserRole
import auth
from auth import (
    UserCreate, UserLogin, Token, PasswordReset, PasswordResetRequest,
    get_password_hash, verify_password, create_access_token, create_refresh_token,
    create_password_reset_token, get_current_user, TokenData
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Validate role
    try:
        role = UserRole(user_data.role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {[r.value for r in UserRole]}"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
        role=role,
        is_active=True,
        is_verified=False  # Require email verification in production
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access/refresh tokens"""
    
    # Find user
    user = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(
        data={"sub": user.username, "user_id": user.id}
    )
    
    # Store refresh token in database
    refresh_token_expires = datetime.utcnow() + timedelta(days=auth.REFRESH_TOKEN_EXPIRE_DAYS)
    db_refresh_token = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=refresh_token_expires
    )
    db.add(db_refresh_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Get new access token using refresh token"""
    
    # Verify refresh token in database
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()
    
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Get user
    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id, "role": user.role.value}
    )
    
    new_refresh_token = create_refresh_token(
        data={"sub": user.username, "user_id": user.id}
    )
    
    # Revoke old refresh token
    db_token.revoked = True
    
    # Store new refresh token
    refresh_token_expires = datetime.utcnow() + timedelta(days=auth.REFRESH_TOKEN_EXPIRE_DAYS)
    new_db_token = RefreshToken(
        user_id=user.id,
        token=new_refresh_token,
        expires_at=refresh_token_expires
    )
    db.add(new_db_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(
    refresh_token: str,
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Logout and revoke refresh token"""
    
    # Revoke refresh token
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.user_id == current_user.user_id
    ).first()
    
    if db_token:
        db_token.revoked = True
        db.commit()
    
    return {"message": "Logged out successfully"}

@router.post("/request-password-reset")
async def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Request password reset email"""
    
    user = db.query(User).filter(User.email == request.email).first()
    
    # Don't reveal if email exists (security best practice)
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Create reset token
    reset_token = create_password_reset_token()
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    db_reset_token = PasswordResetToken(
        user_id=user.id,
        token=reset_token,
        expires_at=expires_at
    )
    db.add(db_reset_token)
    db.commit()
    
    # TODO: Send email with reset link
    # send_email(user.email, f"Reset link: http://yourapp.com/reset?token={reset_token}")
    
    return {"message": "If the email exists, a reset link has been sent"}

@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    """Reset password using token"""
    
    # Verify token
    db_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == reset_data.token,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()
    
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Get user and update password
    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.hashed_password = get_password_hash(reset_data.new_password)
    db_token.used = True
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/me")
async def get_current_user_info(
    current_user: TokenData = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    
    user = db.query(User).filter(User.id == current_user.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role.value,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat(),
        "last_login": user.last_login.isoformat() if user.last_login else None
    }
