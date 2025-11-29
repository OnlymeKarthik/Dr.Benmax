import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import axios from 'axios';

export default function HospitalPortal() {
    const { account, isConnected } = useWallet();
    const [formData, setFormData] = useState({
        hospital_id: '',
        amount: '',
        currency: 'INR',
        patient_name: '',
        patient_id: '',
        diagnosis: ''
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [claimId, setClaimId] = useState('');

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Validate file count
        if (selectedFiles.length > 5) {
            setError('Maximum 5 files allowed');
            return;
        }

        // Validate file size (5MB each)
        const oversized = selectedFiles.find(f => f.size > 5 * 1024 * 1024);
        if (oversized) {
            setError(`File ${oversized.name} exceeds 5MB limit`);
            return;
        }

        // Validate file types
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        const invalid = selectedFiles.find(f => !validTypes.includes(f.type));
        if (invalid) {
            setError(`File ${invalid.name} has invalid type. Only PDF, PNG, JPG allowed`);
            return;
        }

        setFiles(selectedFiles);
        setError('');
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Prepare claim data
            const claimData = {
                hospital_id: formData.hospital_id,
                amount: parseFloat(formData.amount),
                currency: formData.currency,
                patient_details: {
                    name: formData.patient_name,
                    id: formData.patient_id
                },
                diagnosis: formData.diagnosis
            };

            // Submit claim
            const response = await axios.post('http://localhost:8000/api/claims/submit', claimData);

            setSuccess(true);
            setClaimId(response.data.claim_id);

            // Reset form
            setFormData({
                hospital_id: '',
                amount: '',
                currency: 'INR',
                patient_name: '',
                patient_id: '',
                diagnosis: ''
            });
            setFiles([]);

            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit claim');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 text-center border-2 border-medical-teal/10">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-medical-dark mb-4">Claim Submitted Successfully!</h2>
                    <div className="bg-gradient-to-r from-medical-teal/10 to-medical-cyan/10 border-2 border-medical-teal/30 rounded-xl p-5 mb-6 shadow-sm">
                        <p className="text-sm text-gray-600 mb-2">Claim ID</p>
                        <p className="text-2xl font-mono font-bold text-medical-teal">{claimId}</p>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Your claim is being processed. You can track its status in the dashboard.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="bg-gradient-to-r from-medical-cyan to-medical-teal text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:shadow-medical-teal/40 transition-all transform hover:scale-105"
                    >
                        Submit Another Claim
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-2 border-medical-teal/10">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-medical-dark mb-2">Submit New Claim</h2>
                    <p className="text-gray-600">Fill in the details below to submit a new insurance claim</p>
                </div>

                {/* Wallet Warning */}
                {!isConnected && (
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex items-start">
                            <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-yellow-900">Wallet Not Connected</h3>
                                <p className="text-sm text-yellow-700">Connect your wallet to sign blockchain transactions</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hospital & Patient Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Hospital ID *
                            </label>
                            <input
                                type="text"
                                value={formData.hospital_id}
                                onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                                className="w-full px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="HOSP-001"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Patient Name *
                            </label>
                            <input
                                type="text"
                                value={formData.patient_name}
                                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                className="w-full px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Patient ID *
                            </label>
                            <input
                                type="text"
                                value={formData.patient_id}
                                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                className="w-full px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="PAT-12345"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Currency *
                            </label>
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                                required
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Claim Amount *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                {formData.currency === 'INR' ? '₹' : formData.currency === 'USD' ? '$' : '€'}
                            </span>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Diagnosis *
                        </label>
                        <textarea
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            className="w-full px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                            placeholder="Describe the medical condition and treatment..."
                            rows={4}
                            required
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Documents (Optional)
                        </label>
                        <div className="border-2 border-dashed border-medical-teal/30 rounded-xl p-6 text-center hover:border-medical-cyan hover:bg-medical-light/20 transition-all">
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG up to 5MB (Max 5 files)</p>
                            </label>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gradient-to-r from-medical-light/50 to-medical-light/30 px-4 py-3 rounded-lg border border-medical-teal/20">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-medical-cyan to-medical-teal text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-medical-teal/40 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing Claim...
                            </span>
                        ) : (
                            'Submit Claim'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
