import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import Login from './components/Login';
import Register from './components/Register';
import HospitalPortal from './components/HospitalPortal';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { account, balance, connect, disconnect, connecting, isConnected } = useWallet();
  const [view, setView] = useState('hospital');
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-bg-start via-medical-teal to-medical-bg-end">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-medical-teal/5 to-medical-teal/10">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-medical-teal/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-medical-teal to-medical-teal-dark rounded-xl flex items-center justify-center shadow-lg shadow-medical-teal/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-medical-dark">
                  Healthcare Claims
                </h1>
                <p className="text-xs text-medical-teal">Blockchain Powered</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('hospital')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${view === 'hospital'
                    ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                    : 'text-gray-600 hover:bg-medical-teal/10 hover:text-medical-teal'
                  }`}
              >
                Submit Claim
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${view === 'dashboard'
                    ? 'bg-medical-teal text-white shadow-lg shadow-medical-teal/30'
                    : 'text-gray-600 hover:bg-medical-teal/10 hover:text-medical-teal'
                  }`}
              >
                Dashboard
              </button>
            </div>

            {/* User Info & Wallet */}
            <div className="flex items-center space-x-4">
              {/* Wallet Connection */}
              {isConnected ? (
                <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-600">{parseFloat(balance).toFixed(4)} MATIC</p>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-red-600 hover:text-red-700"
                    title="Disconnect"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  disabled={connecting}
                  className="flex items-center space-x-2 bg-gradient-to-r from-medical-teal to-medical-teal-dark text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-medical-teal/30 transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}

              {/* User Menu */}
              <div className="flex items-center space-x-3 bg-medical-teal/10 px-4 py-2 rounded-xl border border-medical-teal/20">
                <div className="w-9 h-9 bg-gradient-to-br from-medical-teal to-medical-teal-dark rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-medical-dark">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-medical-teal capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {view === 'hospital' ? <HospitalPortal /> : <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>© 2025 Healthcare Blockchain Claims System. Powered by Polygon.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </AuthProvider>
  );
}
