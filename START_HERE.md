# 🚀 STEP-BY-STEP: How to Run the Application

## 📍 WHERE TO RUN EVERYTHING

Your project is located at:
```
c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\
```

All commands should be run from this directory!

---

## ✅ STEP 1: Configure Environment File

### 1.1 Open the .env file

**Location:** `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\backend\.env`

You can open it with Notepad:
```
Right-click on backend\.env → Open with → Notepad
```

### 1.2 Generate Required Keys

**Open PowerShell or Command Prompt** and run these commands:

**For SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy the output (something like: `xK7mP9nQ2wR5tY8uI1oP4aS6dF3gH0jK`)

**For ENCRYPTION_KEY:**
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```
Copy the output (something like: `abcDEF123ghiJKL456mnoPQR789stuvWXYZ==`)

### 1.3 Update the .env file

Replace these lines in `backend\.env`:

**BEFORE:**
```env
SECRET_KEY=your-secret-key-here-change-in-production
SESSION_SECRET=your-session-secret-here-change-in-production
ENCRYPTION_KEY=your-encryption-key-here-use-fernet-generate-key
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/mumbai_hacks
```

**AFTER:**
```env
SECRET_KEY=xK7mP9nQ2wR5tY8uI1oP4aS6dF3gH0jK
SESSION_SECRET=aB2cD4eF6gH8iJ0kL1mN3oP5qR7sT9uV
ENCRYPTION_KEY=abcDEF123ghiJKL456mnoPQR789stuvWXYZ==
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_POSTGRES_PASSWORD@localhost:5432/mumbai_hacks
```

**Important:** Replace `YOUR_ACTUAL_POSTGRES_PASSWORD` with your real PostgreSQL password!

---

## ✅ STEP 2: Run the Setup Script

### Option A: Double-Click Method (Easiest)

1. Open File Explorer
2. Navigate to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
3. **Double-click on:** `setup.bat`
4. Wait for it to complete (it will install everything)

### Option B: Command Line Method

1. Open Command Prompt
2. Run these commands:
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks"
setup.bat
```

**What this does:**
- ✅ Installs all Python packages
- ✅ Installs all Node.js packages
- ✅ Creates database tables
- ✅ Creates admin user (username: admin, password: admin123)
- ✅ Creates hospital user (username: hospital1, password: hospital123)

---

## ✅ STEP 3: Start the Backend

### Option A: Double-Click Method (Easiest)

1. Open File Explorer
2. Navigate to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
3. **Double-click on:** `start-backend.bat`
4. A terminal window will open showing the backend running
5. **Keep this window open!**

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Option B: Command Line Method

1. Open a NEW Command Prompt window
2. Run:
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\backend"
python -m uvicorn main:app --reload
```

**Backend is now running at:** http://localhost:8000

---

## ✅ STEP 4: Start the Frontend

### Option A: Double-Click Method (Easiest)

1. Open File Explorer
2. Navigate to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
3. **Double-click on:** `start-frontend.bat`
4. A terminal window will open showing the frontend running
5. **Keep this window open!**

You should see:
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Option B: Command Line Method

1. Open ANOTHER NEW Command Prompt window
2. Run:
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\frontend"
npm run dev
```

**Frontend is now running at:** http://localhost:5173

---

## ✅ STEP 5: Open the Application

1. Open your web browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:5173**
3. You should see the login page!

---

## 🎯 Quick Summary

**Files you need to edit:**
- ✅ `backend\.env` - Add SECRET_KEY, ENCRYPTION_KEY, and database password

**Files you need to run:**
1. ✅ `setup.bat` - Run ONCE to install everything
2. ✅ `start-backend.bat` - Run to start backend (keep window open)
3. ✅ `start-frontend.bat` - Run to start frontend (keep window open)

**Then open browser:**
- ✅ http://localhost:5173

---

## 📁 File Locations Quick Reference

```
c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\
│
├── setup.bat                    ← Double-click to install everything
├── start-backend.bat            ← Double-click to start backend
├── start-frontend.bat           ← Double-click to start frontend
├── QUICKSTART.md                ← Full documentation
│
├── backend\
│   ├── .env                     ← EDIT THIS: Add your keys and password
│   ├── main.py                  ← Backend code
│   ├── setup.py                 ← Database setup script
│   └── requirements.txt         ← Python dependencies
│
└── frontend\
    ├── src\
    │   ├── App.jsx              ← Main app
    │   ├── components\          ← UI components
    │   └── contexts\            ← Auth & Wallet
    └── package.json             ← Node dependencies
```

---

## 🆘 Troubleshooting

**"Python is not recognized"**
→ Python is not installed or not in PATH. Install Python 3.11+

**"Node is not recognized"**
→ Node.js is not installed or not in PATH. Install Node.js 18+

**"Database connection failed"**
→ Check that PostgreSQL is running and password in `.env` is correct

**"Port 8000 already in use"**
→ Another program is using port 8000. Close it or change port

**"Port 5173 already in use"**
→ Another program is using port 5173. Close it or change port

---

## ✨ You're Ready!

1. Edit `backend\.env` with your keys
2. Double-click `setup.bat`
3. Double-click `start-backend.bat`
4. Double-click `start-frontend.bat`
5. Open http://localhost:5173

That's it! 🎉
