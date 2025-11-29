# 🚀 HOW TO RUN - Simple 3-Step Guide

## 📍 Your Project Location:
```
c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\
```

---

## ✅ STEP 1: Run Setup (ONE TIME ONLY)

### Method 1: Double-Click (Easiest)
1. Open File Explorer
2. Go to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
3. **Double-click on:** `setup.bat`
4. Wait for it to finish (will install everything)

### Method 2: Command Line
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks"
setup.bat
```

**What this does:**
- Installs Python packages
- Installs Node.js packages
- Creates database tables
- Creates admin user (admin/admin123)

---

## ✅ STEP 2: Start Backend Server

### Method 1: Double-Click (Easiest)
1. Go to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
2. **Double-click on:** `start-backend.bat`
3. **Keep this window open!**

You'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Method 2: Command Line
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks"
start-backend.bat
```

**Backend is now running at:** http://localhost:8000

---

## ✅ STEP 3: Start Frontend Server

### Method 1: Double-Click (Easiest)
1. Go to: `c:\Users\abhin\OneDrive\Documents\Mumbai Hacks\`
2. **Double-click on:** `start-frontend.bat`
3. **Keep this window open!**

You'll see:
```
VITE v7.2.4  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Method 2: Command Line
```bash
cd "c:\Users\abhin\OneDrive\Documents\Mumbai Hacks"
start-frontend.bat
```

**Frontend is now running at:** http://localhost:5173

---

## ✅ STEP 4: Open the Application

1. Open your web browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:5173**
3. You should see the login page!

---

## 🎯 Visual Guide

```
Mumbai Hacks Folder
│
├── setup.bat              ← 1. Double-click this FIRST (one time)
├── start-backend.bat      ← 2. Double-click this (keep open)
├── start-frontend.bat     ← 3. Double-click this (keep open)
│
Then open browser → http://localhost:5173
```

---

## 🔑 Login Credentials

After setup, you can login with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Hospital Account:**
- Username: `hospital1`
- Password: `hospital123`

Or create a new account by clicking "Sign up"

---

## 🛑 How to Stop

To stop the application:
- Press `Ctrl+C` in the backend terminal
- Press `Ctrl+C` in the frontend terminal
- Or just close the terminal windows

---

## ⚠️ Troubleshooting

**"Python is not recognized"**
→ Install Python 3.11+ from python.org

**"Node is not recognized"**
→ Install Node.js 18+ from nodejs.org

**"Database connection failed"**
→ Make sure PostgreSQL is running

**Port already in use:**
→ Close other programs using ports 8000 or 5173

---

## 📝 Summary

1. **One time:** Double-click `setup.bat`
2. **Every time:** Double-click `start-backend.bat`
3. **Every time:** Double-click `start-frontend.bat`
4. **Open:** http://localhost:5173

**That's it!** 🎉
