@echo off
echo ========================================
echo Healthcare Blockchain Claims System
echo Complete Application Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/6] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [2/6] Setting up Database...
python setup.py
if errorlevel 1 (
    echo ERROR: Database setup failed
    pause
    exit /b 1
)

echo.
echo [3/6] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application, run these commands in separate terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   python -m uvicorn main:app --reload
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
