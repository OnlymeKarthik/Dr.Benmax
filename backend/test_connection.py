"""
PostgreSQL Connection Test Script
Run this to check if PostgreSQL is properly configured
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    print("=" * 60)
    print("PostgreSQL Connection Test")
    print("=" * 60)
    
    # Check if psycopg2 is installed
    try:
        import psycopg2
        print("[OK] psycopg2-binary is installed")
    except ImportError:
        print("[FAIL] psycopg2-binary not found")
        print("   Install with: pip install psycopg2-binary")
        return False
    
    # Check environment variables
    print("\nEnvironment Configuration:")
    db_url = os.getenv("DATABASE_URL")
    db_host = os.getenv("DATABASE_HOST", "localhost")
    db_port = os.getenv("DATABASE_PORT", "5432")
    db_name = os.getenv("DATABASE_NAME", "mumbai_hacks")
    db_user = os.getenv("DATABASE_USER", "postgres")
    db_pass = os.getenv("DATABASE_PASSWORD", "postgres")
    
    print(f"   Host: {db_host}")
    print(f"   Port: {db_port}")
    print(f"   Database: {db_name}")
    print(f"   User: {db_user}")
    print(f"   Password: {'*' * len(db_pass)}")
    
    # Test connection
    print("\nTesting Connection...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_pass
        )
        print("[OK] Successfully connected to PostgreSQL!")
        
        # Test query
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"\nPostgreSQL Version:")
        print(f"   {version[0]}")
        
        # Check if tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        
        if tables:
            print(f"\nExisting Tables ({len(tables)}):")
            for table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
                count = cursor.fetchone()[0]
                print(f"   - {table[0]}: {count} rows")
        else:
            print("\n[WARN] No tables found. Run 'python init_db.py' to create tables.")
        
        cursor.close()
        conn.close()
        
        print("\n" + "=" * 60)
        print("[PASS] Connection test PASSED!")
        print("=" * 60)
        return True
        
    except psycopg2.OperationalError as e:
        print(f"[FAIL] Connection FAILED: {e}")
        print("\nTroubleshooting:")
        print("   1. Make sure PostgreSQL is installed and running")
        print("   2. Check if database 'mumbai_hacks' exists")
        print("   3. Verify credentials in .env file")
        print("   4. Check if PostgreSQL is listening on port 5432")
        print("\nSee DATABASE_SETUP.md for installation instructions")
        return False
    except Exception as e:
        print(f"[FAIL] Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
