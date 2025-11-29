# 🏥 Dr.Benmax

**AI-Powered Healthcare Claims Processing System**

A decentralized healthcare insurance claims processing platform built with blockchain technology, AI-powered fraud detection, and modern web technologies. Dr.Benmax revolutionizes the healthcare claims process with transparency, security, and efficiency.

![Medical Theme](https://img.shields.io/badge/Theme-Medical-2A9D8F)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.14-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![Blockchain](https://img.shields.io/badge/Blockchain-Polygon-8247E5)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 🤖 **AI Fraud Detection** - Machine learning model to detect fraudulent claims
- ⛓️ **Blockchain Integration** - Immutable claim records on Polygon network
- 📊 **Real-time Dashboard** - Track claim status and analytics
- 🎨 **Modern UI** - Medical-themed design with Tailwind CSS
- 🔒 **Data Encryption** - End-to-end encryption for sensitive medical data
- 📁 **IPFS Storage** - Decentralized document storage

## 🚀 Quick Start

### Prerequisites

- Python 3.14+
- Node.js 18+
- PostgreSQL 12+
- MetaMask (optional, for blockchain features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/OnlymeKarthik/Dr.Benmax.git
cd Dr.Benmax
```

2. **Set up the database**
```bash
# Create PostgreSQL database
createdb mumbai_hacks

# Run migrations
cd backend
python init_db.py
```

3. **Configure environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit .env with your credentials

# Frontend
cp frontend/.env.example frontend/.env
```

4. **Install dependencies**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

5. **Start the application**
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Default Login
- **Username**: `testuser`
- **Password**: `password123`

## 🏗️ Architecture

```
├── backend/              # FastAPI backend
│   ├── main.py          # Main application
│   ├── auth.py          # Authentication logic
│   ├── blockchain_client.py  # Web3 integration
│   ├── ml_service.py    # AI fraud detection
│   └── database.py      # Database models
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   └── App.jsx      # Main app component
│   └── tailwind.config.js
└── contracts/           # Smart contracts
    └── ClaimSettlement.sol
```

## 🎨 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM
- **Web3.py** - Blockchain interaction
- **scikit-learn** - Machine learning
- **JWT** - Authentication tokens

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool
- **ethers.js** - Ethereum library

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **Polygon** - Layer 2 scaling solution

## 📖 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
{
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string",
  "role": "patient|hospital|insurer"
}

# Login
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}
```

### Claims
```bash
# Submit claim
POST /api/claims/submit
{
  "hospital_id": "string",
  "amount": 0,
  "currency": "INR|USD|EUR",
  "patient_details": {...},
  "diagnosis": "string"
}

# Get claim status
GET /api/claims/{claim_id}
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Data encryption at rest

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-chain support (Ethereum, BSC)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Document OCR integration
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- [@OnlymeKarthik](https://github.com/OnlymeKarthik)

## 🙏 Acknowledgments

- Built for Mumbai Hacks Hackathon
- Inspired by the need for transparent healthcare claims processing
- Thanks to the open-source community

## 📞 Support

For support, email support@example.com or join our Slack channel.

## 🔗 Links

- [Documentation](https://docs.example.com)
- [Demo Video](https://youtube.com/example)
- [Live Demo](https://demo.example.com)

---

**Dr.Benmax** - Transforming Healthcare Claims with Blockchain & AI  
Made with ❤️ for Mumbai Hacks 2025
"# Dr.Benmax" 
"# Dr.Benmax" 
