# PostgreSQL Connection Status

## Current Status: POSTGRES IS INSTALLED AND RUNNING!

Good news! The connection test shows:
- PostgreSQL is installed on your system
- PostgreSQL is running on port 5432
- The issue is just the password authentication

## Error Message:
```
connection to server at "localhost" (::1), port 5432 failed:
FATAL: password authentication failed for user "postgres"
```

---

## Solutions (Pick ONE):

### Option 1: Find Your Actual PostgreSQL Password

Your PostgreSQL was installed previously with a different password. Try:

1. **Check if you remember the password** you set during installation
2. **Update the .env file** with the correct password:

Edit `backend/.env` and change line 7:
```bash
DATABASE_PASSWORD=your_actual_password_here
```

3. Test again:
```powershell
cd backend
python test_connection.py
```

---

### Option 2: Reset PostgreSQL Password (Recommended if you forgot)

#### For Windows PostgreSQL:

1. **Open PowerShell as Administrator**

2. **Locate pg_hba.conf file:**
```powershell
# Usually at: C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf
# Or: C:\ProgramData\PostgreSQL\<version>\data\pg_hba.conf
```

3. **Edit pg_hba.conf:**
   - Find this line:
     ```
     host    all             all             127.0.0.1/32            md5
     ```
   - Change `md5` to `trust`:
     ```
     host    all             all             127.0.0.1/32            trust
     ```

4. **Restart PostgreSQL service:**
```powershell
Restart-Service postgresql-x64-*
```

5. **Connect and reset password:**
```powershell
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
```

6. **Revert pg_hba.conf back to `md5`**

7. **Restart PostgreSQL again:**
```powershell
Restart-Service postgresql-x64-*
```

8. **Test connection:**
```powershell
cd C:\Users\abhin\OneDrive\Documents\Mumbai Hacks\backend
python test_connection.py
```

---

### Option 3: Use Alternative User (If you created one)

If you created a different PostgreSQL user:

1. Update `.env` file:
```bash
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
```

2. Update DATABASE_URL to match:
```bash
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/mumbai_hacks
```

---

### Option 4: Quick Fix with Docker (Clean Slate)

If the above is too complex, you can use Docker instead:

1. **Install Docker Desktop:** https://www.docker.com/products/docker-desktop

2. **Stop existing PostgreSQL:**
```powershell
Stop-Service postgresql-x64-*
```

3. **Start Docker PostgreSQL:**
```powershell
docker-compose up -d
```

This will use the database with password "postgres" as configured in .env

---

## Quick Verification Commands

### Check which PostgreSQL services are running:
```powershell
Get-Service | Where-Object {$_.Name -like "*postgre*"}
```

### Try connecting with psql (to check password):
```powershell
psql -U postgres -W
# Enter password when prompted
```

If this works, use the same password in your .env file.

---

## After Successful Connection

Once `python test_connection.py` shows `[PASS]`, run:

```powershell
cd backend
python init_db.py
python -m uvicorn main:app --reload
```

Then your API will be running at: http://localhost:8000

---

## Need Help?

If none of these work, you can:
1. Uninstall current PostgreSQL
2. Reinstall using the setup script: `.\setup_postgres.ps1` (as Admin)
3. Or use Docker for a cleaner setup

The password issue is the ONLY blocker - everything else is ready!
