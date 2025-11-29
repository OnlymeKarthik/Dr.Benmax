import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_USER = "postgres"
DB_PASSWORD = "iambatman"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "mumbai_hacks"

try:
    # Connect to PostgreSQL server
    print(f"[*] Connecting to PostgreSQL server...")
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database="postgres"  # Connect to default database
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'")
    exists = cursor.fetchone()
    
    if exists:
        print(f"[!] Database '{DB_NAME}' already exists")
    else:
        # Create database
        print(f"[*] Creating database '{DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"[+] Database '{DB_NAME}' created successfully!")
    
    cursor.close()
    conn.close()
    
    print("\n[+] Database setup complete!")
    print(f"    Database: {DB_NAME}")
    print(f"    Host: {DB_HOST}:{DB_PORT}")
    print(f"    User: {DB_USER}")
    
except Exception as e:
    print(f"[!] Error: {e}")
    print("\nPlease make sure:")
    print("1. PostgreSQL is running")
    print("2. Password 'iambatman' is correct")
    print("3. PostgreSQL is listening on port 5432")
