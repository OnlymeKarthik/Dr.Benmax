# 🦊 MetaMask, IPFS & Blockchain Setup Guide

## 📱 Part 1: MetaMask Setup

### Step 1: Install MetaMask

1. **Download MetaMask:**
   - Go to: https://metamask.io/download/
   - Click "Install MetaMask for Chrome" (or your browser)
   - Click "Add to Chrome" → "Add Extension"

2. **Create a Wallet:**
   - Click the MetaMask fox icon in your browser
   - Click "Create a new wallet"
   - Create a password (remember this!)
   - **IMPORTANT:** Write down your Secret Recovery Phrase (12 words)
   - Store it somewhere safe - you'll need it to recover your wallet

3. **Confirm Setup:**
   - Confirm your Secret Recovery Phrase
   - Click "Got it!" to complete setup

### Step 2: Get Test MATIC Tokens (For Testing)

1. **Switch to Polygon Mumbai Testnet:**
   - Click the network dropdown (top of MetaMask)
   - Click "Show test networks" in settings
   - Select "Polygon Mumbai"

2. **Get Free Test MATIC:**
   - Go to: https://faucet.polygon.technology/
   - Select "Mumbai"
   - Paste your wallet address
   - Click "Submit"
   - Wait 1-2 minutes for tokens to arrive

### Step 3: Get Your Private Key (For Backend - OPTIONAL)

⚠️ **WARNING:** Never share your private key! Only use for testing with test accounts!

**Method 1: From MetaMask (Recommended for Testing)**

1. Click MetaMask icon
2. Click the 3 dots (⋮) next to your account
3. Click "Account Details"
4. Click "Show Private Key"
5. Enter your MetaMask password
6. Click "Confirm"
7. **Copy the private key** (starts with 0x)
8. **Remove the "0x" prefix** before pasting in .env

**Example:**
```
MetaMask shows: 0xabcd1234...
In .env use:     abcd1234...
```

**Method 2: Create a New Test Account (Safer)**

1. In MetaMask, click your account icon (top right)
2. Click "Create Account"
3. Name it "Test Account" or "Development"
4. Get private key from this account (steps above)
5. **Only use this account for testing!**

### Step 4: Add Private Key to .env (OPTIONAL)

Open `backend\.env` and add:
```env
PRIVATE_KEY=your_private_key_here_without_0x
```

**Example:**
```env
PRIVATE_KEY=abcd1234ef567890abcd1234ef567890abcd1234ef567890abcd1234ef567890
```

---

## 📦 Part 2: IPFS/Pinata Setup

### Step 1: Sign Up for Pinata (Free)

1. **Go to Pinata:**
   - Visit: https://www.pinata.cloud/
   - Click "Start Building for Free"

2. **Create Account:**
   - Enter your email
   - Create a password
   - Verify your email

3. **Complete Profile:**
   - Enter your name
   - Skip payment (free tier is enough)

### Step 2: Get API Keys

1. **Navigate to API Keys:**
   - Click your profile icon (top right)
   - Click "API Keys"

2. **Create New Key:**
   - Click "New Key" button
   - **Permissions:** Check "Admin" (for testing)
   - **Key Name:** "Healthcare Claims Dev"
   - Click "Create Key"

3. **Copy Your Keys:**
   - **API Key:** Copy this (looks like: `abc123def456...`)
   - **API Secret:** Copy this (looks like: `xyz789uvw456...`)
   - ⚠️ **IMPORTANT:** Save these now! Secret only shows once!

### Step 3: Add to .env File

Open `backend\.env` and add:
```env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_API_KEY=your_secret_key_here
```

**Example:**
```env
PINATA_API_KEY=abc123def456ghi789
PINATA_SECRET_API_KEY=xyz789uvw456rst123
```

---

## 🔗 Part 3: Blockchain RPC Setup (OPTIONAL)

### Option A: Use Public RPC (Easiest)

Already configured in your `.env`:
```env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
```

**No action needed!** This works out of the box.

### Option B: Use Alchemy (Better Performance)

1. **Sign up for Alchemy:**
   - Go to: https://www.alchemy.com/
   - Click "Get Started for Free"
   - Create account

2. **Create App:**
   - Click "Create App"
   - **Chain:** Polygon
   - **Network:** Mumbai (testnet)
   - **Name:** "Healthcare Claims"
   - Click "Create App"

3. **Get API Key:**
   - Click "View Key"
   - Copy the **HTTPS URL**
   - Example: `https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY`

4. **Update .env:**
   ```env
   MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY
   ```

### Option C: Use Infura (Alternative)

1. **Sign up for Infura:**
   - Go to: https://infura.io/
   - Create account

2. **Create Project:**
   - Click "Create New Key"
   - Select "Web3 API"
   - Name: "Healthcare Claims"

3. **Get Endpoint:**
   - Select "Polygon Mumbai"
   - Copy the HTTPS endpoint

4. **Update .env:**
   ```env
   MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR-PROJECT-ID
   ```

---

## 🎯 Complete .env Example

Here's what your `.env` should look like with everything configured:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:iambatman@localhost:5432/mumbai_hacks
DATABASE_PASSWORD=iambatman

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=abcd1234ef567890abcd1234ef567890abcd1234ef567890abcd1234ef567890

# IPFS Configuration
PINATA_API_KEY=abc123def456ghi789
PINATA_SECRET_API_KEY=xyz789uvw456rst123

# Security (Already configured)
SECRET_KEY=mb9qeTIvoiJK-tQmXBVVAzr_UnJry-0hA14bappSkg4
SESSION_SECRET=vK8pLmN2wX5tY9uI3oP6aS4dF7gH1jK0qR2sT5vW8xZ
ENCRYPTION_KEY=xJ9mK2nL5oP8qR1sT4uV7wX0yZ3aB6cD9eF2gH5iJ8k=

# Application Settings
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## ✅ Verification Checklist

### MetaMask Setup:
- [ ] MetaMask extension installed
- [ ] Wallet created with password
- [ ] Secret Recovery Phrase saved safely
- [ ] Switched to Polygon Mumbai testnet
- [ ] Got test MATIC from faucet
- [ ] (Optional) Private key added to .env

### IPFS/Pinata Setup:
- [ ] Pinata account created
- [ ] API keys generated
- [ ] API keys added to .env
- [ ] Keys saved in safe place

### Blockchain RPC:
- [ ] Using public RPC (default) OR
- [ ] Alchemy/Infura account created
- [ ] Custom RPC URL added to .env

---

## 🚀 How to Use in the Application

### Frontend (User Experience):

1. **Open the app:** http://localhost:5173
2. **Login** with your credentials
3. **Click "Connect Wallet"** button
4. **MetaMask popup appears** → Click "Connect"
5. **Your wallet is now connected!**
   - You'll see your address
   - You'll see your MATIC balance
   - You can sign transactions

### Backend (Automatic):

With PRIVATE_KEY configured:
- Backend can automatically sign blockchain transactions
- Claims are submitted to smart contracts
- No manual signing needed

With PINATA_API_KEY configured:
- Files are encrypted and uploaded to IPFS
- Real IPFS hashes are returned
- Files are permanently stored

---

## 🔐 Security Best Practices

### ⚠️ NEVER DO THIS:
- ❌ Share your private key
- ❌ Commit .env to Git
- ❌ Use your main wallet for testing
- ❌ Share your Secret Recovery Phrase

### ✅ ALWAYS DO THIS:
- ✅ Use a separate test wallet
- ✅ Only use test networks (Mumbai)
- ✅ Keep .env file private
- ✅ Use environment variables in production
- ✅ Rotate API keys regularly

---

## 🆘 Troubleshooting

### "MetaMask not detected"
→ Install MetaMask extension and refresh page

### "Insufficient funds"
→ Get test MATIC from faucet: https://faucet.polygon.technology/

### "Wrong network"
→ Switch to Polygon Mumbai in MetaMask

### "IPFS upload failed"
→ Check Pinata API keys are correct in .env

### "Transaction failed"
→ Ensure you have test MATIC in your wallet

---

## 📚 Useful Links

- **MetaMask:** https://metamask.io/
- **Pinata:** https://www.pinata.cloud/
- **Polygon Faucet:** https://faucet.polygon.technology/
- **Alchemy:** https://www.alchemy.com/
- **Infura:** https://infura.io/
- **Polygon Mumbai Explorer:** https://mumbai.polygonscan.com/

---

## 🎓 Quick Summary

**For Basic Testing (No Setup Needed):**
- Just install MetaMask
- Connect from frontend
- Everything else works in mock mode

**For Full Features:**
1. Get MetaMask private key → Add to .env
2. Sign up for Pinata → Add API keys to .env
3. (Optional) Sign up for Alchemy/Infura → Add RPC URL

**You're ready to go!** 🚀
