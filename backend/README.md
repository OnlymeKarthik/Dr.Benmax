# Mumbai Hacks Healthcare Claims System - Backend

## Overview
This is the backend service for the Autonomous Healthcare Claims Processing System. It handles claim submissions, AI-based fraud detection, IPFS document storage, and blockchain settlement.

## Features
- **FastAPI**: High-performance async API
- **PostgreSQL**: Persistent data storage
- **AI/ML**: Fraud detection using Scikit-learn & SpaCy
- **Blockchain**: Smart contract interaction via Web3.py (Polygon Mumbai)
- **IPFS**: Secure document storage via Pinata (AES-256 Encrypted)
- **Security**: JWT Authentication, Rate Limiting, Input Validation

## Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 15+
- Node.js (for Hardhat)

### Installation
1. Create virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`
   - `PINATA_API_KEY`
   - `PRIVATE_KEY`
   - `MUMBAI_RPC_URL`

### Database Setup
```bash
python init_db.py
```

### Running the Server
```bash
python -m uvicorn main:app --reload
```
API Docs available at: http://localhost:8000/docs

## API Endpoints
- `POST /api/token`: Get JWT access token
- `POST /api/claims/submit`: Submit a new claim (Protected)
- `GET /api/claims/{id}`: Get claim status
- `GET /api/stats`: Get system statistics

## Testing
```bash
pytest
```
