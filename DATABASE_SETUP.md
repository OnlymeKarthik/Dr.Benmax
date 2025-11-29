# PostgreSQL Database Setup Guide

## Option 1: Using Docker (Recommended - Easiest)

### Prerequisites
- Install Docker Desktop for Windows: https://www.docker.com/products/docker-desktop

### Steps

1. **Start PostgreSQL with Docker Compose**
```powershell
# From the project root directory
docker-compose up -d
```

2. **Verify PostgreSQL is running**
```powershell
docker ps
# You should see mumbai_hacks_postgres container running
```

3. **Initialize the database**
```powershell
cd backend
python init_db.py
```

4. **Verify database connection**
```powershell
# Access PostgreSQL shell
docker exec -it mumbai_hacks_postgres psql -U postgres -d mumbai_hacks

# List tables
\dt

# Check hospitals
SELECT * FROM hospitals;

# Exit
\q
```

---

## Option 2: Install PostgreSQL Directly on Windows

### Prerequisites

1. **Download PostgreSQL 15**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (postgresql-15.x-windows-x64.exe)

2. **Install PostgreSQL**
   - Run the installer
   - Default port: 5432
   - Set password for 'postgres' user: `postgres` (or your choice)
   - Install pgAdmin 4 (optional GUI tool)

### Steps

1. **Add PostgreSQL to PATH**
```powershell
# Add to system PATH (Run as Administrator)
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
# Or permanently add: C:\Program Files\PostgreSQL\15\bin to Environment Variables
```

2. **Create the database**
```powershell
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE DATABASE mumbai_hacks;
\c mumbai_hacks
\i C:/Users/abhin/OneDrive/Documents/Mumbai Hacks/backend/schema.sql
\q
```

3. **Update .env if you used a different password**
```bash
# Edit backend/.env
DATABASE_PASSWORD=your_password_here
```

4. **Initialize with Python**
```powershell
cd backend
python init_db.py
```

---

## Option 3: Using Online PostgreSQL (Free Tier)

### Services:
- **ElephantSQL** (https://www.elephantsql.com/) - Free 20MB
- **Supabase** (https://supabase.com/) - Free 500MB
- **Neon** (https://neon.tech/) - Free 3GB

### Steps for ElephantSQL:

1. Sign up at https://www.elephantsql.com/
2. Create a new instance (Tiny Turtle - Free plan)
3. Copy the connection URL (looks like: `postgres://username:password@host/database`)
4. Update `backend/.env`:
```bash
DATABASE_URL=postgres://your_elephantsql_url_here
```
5. Run:
```powershell
cd backend
python init_db.py
```

---

## Verifying Connection

### Test with Python:
```powershell
cd backend
python -c "from database import engine; print('✅ Connection successful!' if engine.connect() else '❌ Failed')"
```

### Check database contents:
```powershell
python
>>> from database import SessionLocal, Hospital, Claim
>>> db = SessionLocal()
>>> hospitals = db.query(Hospital).all()
>>> for h in hospitals:
...     print(f"{h.hospital_id}: {h.name}")
>>> exit()
```

---

## Troubleshooting

### Error: "psycopg2.OperationalError: could not connect"
**Solution:** Make sure PostgreSQL is running
```powershell
# For Docker
docker-compose up -d

# For Windows service
# Open Services (services.msc) and start "postgresql-x64-15"
```

### Error: "database 'mumbai_hacks' does not exist"
**Solution:** Create the database manually
```powershell
# Using psql
psql -U postgres -c "CREATE DATABASE mumbai_hacks;"

# Or using Docker
docker exec -it mumbai_hacks_postgres psql -U postgres -c "CREATE DATABASE mumbai_hacks;"
```

### Error: "authentication failed for user"
**Solution:** Check your password in `.env` file matches PostgreSQL password

### Error: "Connection refused on port 5432"
**Solution:** 
1. Check if PostgreSQL is running
2. Check if port 5432 is in use by another application
3. Check firewall settings

---

## Quick Start (Recommended for beginners)

If you have Docker installed:
```powershell
# 1. Start PostgreSQL
docker-compose up -d

# 2. Wait 5 seconds for PostgreSQL to start

# 3. Initialize database
cd backend
python init_db.py

# 4. Start the backend
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
✅ Database connection successful
✅ Database tables created successfully
```

---

## Next Steps

After PostgreSQL is connected:
1. Test API endpoints: http://localhost:8000/docs
2. Submit a test claim via the frontend
3. Check claim in database:
```sql
SELECT * FROM claims ORDER BY created_at DESC LIMIT 5;
```
