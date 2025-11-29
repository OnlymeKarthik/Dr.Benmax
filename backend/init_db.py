"""
Database initialization script for Mumbai Hacks Claims System
Run this script to set up the PostgreSQL database
"""
import os
import sys
from database import init_db, engine, SessionLocal, Hospital
import models.user # Register user models

def setup_database():
    """Initialize database and seed initial data"""
    print("Starting database setup...")
    
    # Create tables
    print("\n[1] Creating database tables...")
    init_db()
    
    # Seed initial data
    print("\n[2] Seeding initial hospital data...")
    db = SessionLocal()
    try:
        # Check if hospitals already exist
        existing = db.query(Hospital).first()
        if existing:
            print("[!] Hospitals already exist, skipping seed data")
        else:
            hospitals = [
                Hospital(
                    hospital_id="APOLLO-DEL-001",
                    name="Apollo Hospital Delhi",
                    address="New Delhi, India"
                ),
                Hospital(
                    hospital_id="APOLLO-MUM-001",
                    name="Apollo Hospital Mumbai",
                    address="Mumbai, India"
                ),
                Hospital(
                    hospital_id="MAX-DEL-001",
                    name="Max Hospital Delhi",
                    address="New Delhi, India"
                )
            ]
            db.add_all(hospitals)
            db.commit()
            print(f"[+] Added {len(hospitals)} hospitals")
    except Exception as e:
        print(f"[-] Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("\n[+] Database setup complete!")
    print("\nConnection details:")
    print(f"   Database URL: {os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/mumbai_hacks')}")

if __name__ == "__main__":
    try:
        setup_database()
    except Exception as e:
        print(f"\n[-] Setup failed: {e}")
        print("\nMake sure PostgreSQL is running and credentials are correct in .env file")
        sys.exit(1)
