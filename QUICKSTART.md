# Healthcare Blockchain Claims System - Quick Start Guide

## 🚀 Complete Setup Instructions

### Prerequisites
- ✅ Python 3.11+ installed
- ✅ Node.js 18+ installed
- ✅ PostgreSQL 15+ installed and running
- ✅ MetaMask browser extension installed

---

## Step 1: Environment Configuration

### 1.1 Backend Configuration

1. **Copy environment template:**
   ```bash
   cd backend
   copy .env.example .env
   ```

2. **Edit `.env` file with your settings:**
   ```bash
   notepad .env
   ```

3. **Required environment variables:**
   ```env
   # Generate SECRET_KEY with:
   # python -c "import secrets; print(secrets.token_urlsafe(32))"
   SECRET_KEY=your-generated-secret-key-here
   SESSION_SECRET=your-generated-session-secret-here
   
   # Generate ENCRYPTION_KEY with:
   # python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ENCRYPTION_KEY=your-generated-encryption-key-here
   
   # Database (update password)
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mumbai_hacks
   
   # Blockchain (optional for now)
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
   PRIVATE_KEY=your-private-key-without-0x
   
   # IPFS (optional - will use mock if not provided)
   PINATA_API_KEY=
   PINATA_SECRET_API_KEY=
   ```

---

## Step 2: Backend Setup

### 2.1 Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2.2 Initialize Database

```bash
# Create database tables
python init_db.py
```

### 2.3 Create Admin User (Optional)

Create a file `create_admin.py`:
```python
from database import SessionLocal
from models.user import User, UserRole
from auth import get_password_hash

db = SessionLocal()

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
print("✅ Admin user created: admin / admin123")
```

Run it:
```bash
python create_admin.py
```

### 2.4 Start Backend Server

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be running at:** http://localhost:8000
**API Documentation:** http://localhost:8000/docs

---

## Step 3: Frontend Setup

### 3.1 Install Node Dependencies

```bash
cd frontend
npm install
```

### 3.2 Start Frontend Development Server

```bash
npm run dev
```

**Frontend will be running at:** http://localhost:5173

---

## Step 4: Blockchain Setup (Optional)

### 4.1 Install Hardhat Dependencies

```bash
cd contracts
npm install
```

### 4.2 Start Local Hardhat Node

```bash
npx hardhat node
```

This will:
- Start a local blockchain on http://127.0.0.1:8545
- Provide test accounts with ETH
- Display private keys for testing

### 4.3 Deploy Smart Contracts

In a new terminal:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

---

## Step 5: Access the Application

### 5.1 Open Browser

Navigate to: **http://localhost:5173**

### 5.2 Register a New Account

1. Click "Sign up"
2. Fill in the registration form:
   - Full Name: Your Name
   - Username: yourusername
   - Email: your@email.com
   - Role: Select "Hospital" or "Patient"
   - Password: (min 8 characters)
3. Click "Create Account"

### 5.3 Login

1. Enter your username and password
2. Click "Sign In"

### 5.4 Connect MetaMask Wallet

1. Click "Connect Wallet" button in the top navigation
2. MetaMask will open - click "Connect"
3. Your wallet address and balance will appear

### 5.5 Submit a Claim

1. Fill in the claim form:
   - Hospital ID: HOSP-001
   - Patient Name: John Doe
   - Patient ID: PAT-12345
   - Currency: INR
   - Amount: 5000
   - Diagnosis: Medical condition description
2. (Optional) Upload documents (PDF, PNG, JPG)
3. Click "Submit Claim"

---

## 🔧 Troubleshooting

### Backend Issues

**Error: "SECRET_KEY environment variable is required"**
- Solution: Generate and add SECRET_KEY to `.env` file

**Error: "ENCRYPTION_KEY environment variable is required"**
- Solution: Generate and add ENCRYPTION_KEY to `.env` file

**Error: "Database connection failed"**
- Solution: Check PostgreSQL is running and password in `.env` is correct

**Error: "Module not found"**
- Solution: Run `pip install -r requirements.txt` again

### Frontend Issues

**Error: "Cannot connect to backend"**
- Solution: Ensure backend is running on http://localhost:8000

**Error: "MetaMask not detected"**
- Solution: Install MetaMask browser extension

**Error: "Module not found"**
- Solution: Run `npm install` again

### Database Issues

**PostgreSQL not running:**
```bash
# Check status
sc query postgresql-x64-15

# Start service
net start postgresql-x64-15
```

**Database doesn't exist:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mumbai_hacks;

# Exit
\q
```

---

## 📝 Quick Commands Reference

### Start Everything (3 terminals needed)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Blockchain (Optional):**
```bash
cd contracts
npx hardhat node
```

### Stop Everything

Press `Ctrl+C` in each terminal

---

## 🧪 Testing the Application

### 1. Test Authentication
- ✅ Register new user
- ✅ Login with credentials
- ✅ Logout
- ✅ View user profile

### 2. Test Wallet Connection
- ✅ Connect MetaMask
- ✅ View wallet address
- ✅ View balance
- ✅ Disconnect wallet

### 3. Test Claim Submission
- ✅ Fill claim form
- ✅ Upload documents
- ✅ Submit claim
- ✅ View success message

### 4. Test Dashboard
- ✅ View submitted claims
- ✅ Track claim status
- ✅ View fraud scores

---

## 🎯 Default Test Credentials

After running `create_admin.py`:
- **Username:** admin
- **Password:** admin123
- **Role:** Admin

---

## 🔐 Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

1. **Never commit `.env` file to Git**
2. **Use strong, unique SECRET_KEY and ENCRYPTION_KEY**
3. **Change default admin password**
4. **Use HTTPS in production**
5. **Enable CORS only for trusted domains**
6. **Use hardware wallet for blockchain transactions**
7. **Enable email verification for new users**

---

## 📚 Additional Resources

- **API Documentation:** http://localhost:8000/docs
- **Hardhat Documentation:** https://hardhat.org/
- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **React Documentation:** https://react.dev/
- **Ethers.js Documentation:** https://docs.ethers.org/

---

## 🆘 Need Help?

If you encounter issues:

1. Check all services are running
2. Verify environment variables are set
3. Check console for error messages
4. Review logs in terminal windows
5. Ensure PostgreSQL is running
6. Verify MetaMask is installed

---

**System Status Checklist:**
- [ ] PostgreSQL running
- [ ] Backend running (http://localhost:8000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Blockchain running (optional)
- [ ] MetaMask installed
- [ ] Environment variables configured

**Ready to go!** 🚀
