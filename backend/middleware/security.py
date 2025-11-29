from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
import secrets
import os

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://polygon-rpc.com https://rpc-mumbai.maticvigil.com"
        )
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        return response

class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """CSRF protection for state-changing operations"""
    
    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}
    
    async def dispatch(self, request: Request, call_next):
        # Skip CSRF check for safe methods
        if request.method in self.SAFE_METHODS:
            return await call_next(request)
        
        # Skip CSRF check for API endpoints with Bearer token
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            return await call_next(request)
        
        # Check CSRF token
        csrf_token = request.headers.get("X-CSRF-Token")
        session_token = request.session.get("csrf_token")
        
        if not csrf_token or csrf_token != session_token:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="CSRF token missing or invalid"
            )
        
        return await call_next(request)

def generate_csrf_token() -> str:
    """Generate a new CSRF token"""
    return secrets.token_urlsafe(32)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests for security auditing"""
    
    async def dispatch(self, request: Request, call_next):
        # Log request
        import logging
        logger = logging.getLogger("security")
        
        client_ip = request.client.host if request.client else "unknown"
        logger.info(f"{request.method} {request.url.path} from {client_ip}")
        
        response = await call_next(request)
        
        # Log response status
        logger.info(f"Response: {response.status_code}")
        
        return response

def setup_security_middleware(app):
    """Configure all security middleware"""
    
    # HTTPS redirect in production
    if os.getenv("ENVIRONMENT") == "production":
        app.add_middleware(HTTPSRedirectMiddleware)
    
    # Trusted host middleware
    allowed_hosts = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)
    
    # Session middleware (required for CSRF)
    session_secret = os.getenv("SESSION_SECRET")
    if not session_secret:
        raise ValueError("SESSION_SECRET environment variable is required")
    app.add_middleware(SessionMiddleware, secret_key=session_secret)
    
    # Custom security middleware
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(CSRFProtectionMiddleware)
    app.add_middleware(RequestLoggingMiddleware)
