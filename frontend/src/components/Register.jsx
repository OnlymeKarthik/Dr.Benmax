import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Register({ onSwitchToLogin }) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        role: 'patient'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => onSwitchToLogin(), 2000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-bg-start via-medical-teal to-medical-bg-end p-4">
                <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-medical-dark mb-2">Registration Successful!</h2>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-bg-start via-medical-teal to-medical-bg-end p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-medical-teal/10 rounded-full mb-4">
                            <svg className="w-10 h-10 text-medical-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-medical-dark">Create Account</h2>
                        <p className="text-gray-500 mt-2 text-sm">Join the healthcare blockchain revolution</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-medical-teal mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-medical-teal mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                    placeholder="johndoe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-medical-teal mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-medical-teal mb-2">
                                Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                            >
                                <option value="patient">Patient</option>
                                <option value="hospital">Hospital</option>
                                <option value="insurer">Insurer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-medical-teal mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-medical-teal mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                                    placeholder="••••••••"
                                    required
                                />
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
                                    Creating account...
                                </span>
                            ) : (
                                'CREATE ACCOUNT'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-medical-teal hover:text-medical-teal-dark font-semibold"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
