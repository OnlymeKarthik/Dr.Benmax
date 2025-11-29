import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login({ onSwitchToRegister }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.username, formData.password);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-medical-gradient p-4 relative overflow-hidden">
            {/* Decorative glassmorphic blobs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl backdrop-blur-lg"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/15 rounded-full blur-3xl backdrop-blur-lg"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-medical-cyan/20 rounded-full blur-3xl backdrop-blur-lg"></div>

            {/* Medical icon decorations - DNA strand */}
            <div className="absolute top-40 left-40 w-40 h-40 opacity-30">
                <svg viewBox="0 0 100 100" className="text-white animate-pulse" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="30" cy="20" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
                    <ellipse cx="70" cy="30" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
                    <ellipse cx="30" cy="50" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
                    <ellipse cx="70" cy="60" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
                    <ellipse cx="30" cy="80" rx="8" ry="8" fill="currentColor" opacity="0.6"/>
                    <path d="M 30 20 Q 50 25 70 30 M 70 30 Q 50 40 30 50 M 30 50 Q 50 55 70 60 M 70 60 Q 50 70 30 80" strokeWidth="3"/>
                </svg>
            </div>

            {/* Heartbeat line decoration */}
            <div className="absolute bottom-40 right-32 w-48 h-24 opacity-40">
                <svg viewBox="0 0 200 100" className="text-white" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M 0 50 L 40 50 L 50 30 L 60 70 L 70 40 L 80 50 L 200 50" strokeLinecap="round"/>
                </svg>
            </div>

            {/* Medical cross decoration */}
            <div className="absolute bottom-1/4 left-1/4 w-32 h-32 opacity-25">
                <svg viewBox="0 0 100 100" className="text-white" fill="currentColor">
                    <rect x="40" y="10" width="20" height="80" rx="4"/>
                    <rect x="10" y="40" width="80" height="20" rx="4"/>
                </svg>
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-6">
                    {/* Medical Icon */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-medical-teal/10 rounded-full mb-4">
                            <svg className="w-10 h-10 text-medical-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-medical-dark">Welcome Back!</h2>
                        <p className="text-gray-500 mt-2 text-sm">Sign in to continue to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-medical-teal mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-medical-teal mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="Enter your password"
                                required
                            />
                            <div className="text-right mt-2">
                                <button type="button" className="text-sm text-medical-teal hover:text-medical-teal-dark">
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-medical-teal text-white py-3.5 rounded-xl font-semibold hover:bg-medical-teal-dark transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-medical-teal/30"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'SIGN IN'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="font-medium text-gray-700">Continue with Google</span>
                    </button>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-medical-teal hover:text-medical-teal-dark font-semibold"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
