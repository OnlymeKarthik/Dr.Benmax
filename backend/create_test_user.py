"""
Create a test user for login testing
"""
from database import SessionLocal
from models.user import User, UserRole
from auth import get_password_hash

def create_test_user():
    """Create a test user account"""
    db = SessionLocal()
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == "testuser").first()
        if existing_user:
            print("[!] Test user already exists")
            print(f"    Username: testuser")
            print(f"    Email: {existing_user.email}")
            print(f"    Role: {existing_user.role.value}")
            return
        
        # Create test user
        test_user = User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("password123"),
            full_name="Test User",
            role=UserRole.PATIENT,
            is_active=True,
            is_verified=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("[+] Test user created successfully!")
        print(f"    Username: testuser")
        print(f"    Password: password123")
        print(f"    Email: test@example.com")
        print(f"    Role: patient")
        
    except Exception as e:
        print(f"[-] Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
