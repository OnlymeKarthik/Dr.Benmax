from database import SessionLocal, init_db
from models.user import User, UserRole
from auth import get_password_hash

# Initialize database tables
print("[*] Initializing database...")
init_db()

# Create admin user
db = SessionLocal()

# Check if admin already exists
existing_admin = db.query(User).filter(User.username == "admin").first()
if existing_admin:
    print("[!] Admin user already exists")
else:
    admin = User(
        email="admin@healthcare.com",
        username="admin",
        hashed_password=get_password_hash("admin123"),
        full_name="System Administrator",
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True
    )
    
    db.add(admin)
    db.commit()
    print("[+] Admin user created successfully!")
    print("   Username: admin")
    print("   Password: admin123")
    print("   Email: admin@healthcare.com")

# Create test hospital user
existing_hospital = db.query(User).filter(User.username == "hospital1").first()
if not existing_hospital:
    hospital = User(
        email="hospital@test.com",
        username="hospital1",
        hashed_password=get_password_hash("hospital123"),
        full_name="Test Hospital",
        role=UserRole.HOSPITAL,
        is_active=True,
        is_verified=True
    )
    
    db.add(hospital)
    db.commit()
    print("[+] Hospital user created successfully!")
    print("   Username: hospital1")
    print("   Password: hospital123")

db.close()
print("\n[+] Setup complete! You can now start the application.")
