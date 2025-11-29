import React, { useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [claimId, setClaimId] = useState('');
    const [claimData, setClaimData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStatus = async () => {
        if (!claimId) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/claims/${claimId}`);
            setClaimData(response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                setClaimData(null);
                alert('Claim not found');
            } else {
                alert('Error fetching claim status');
            }
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-medical-dark">Claims Dashboard</h2>
            <p className="text-gray-600 mb-8">Track and monitor insurance claim status</p>

            <div className="flex space-x-4 mb-8">
                <input
                    type="text"
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    placeholder="Enter Claim ID"
                    className="flex-1 px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-medical-teal focus:bg-white transition-all outline-none rounded-t-lg"
                />
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="bg-medical-teal text-white px-8 py-3 rounded-xl font-semibold hover:bg-medical-teal-dark transition-all shadow-lg shadow-medical-teal/30 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Track Claim'}
                </button>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-medical-teal"></div>
                    <p className="text-gray-500 mt-4">Fetching claim data...</p>
                </div>
            )}

            {claimData && (
                <div className="border-2 border-medical-teal/20 rounded-2xl overflow-hidden">
                    <div className="bg-medical-teal/10 p-5 border-b-2 border-medical-teal/20">
                        <h3 className="font-bold text-xl text-medical-dark">Claim #{claimData.id}</h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Current Status</p>
                            <p className={`text-2xl font-bold ${claimData.status === 'Approved' || claimData.status === 'Settled' ? 'text-green-600' :
                                    claimData.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                {claimData.status}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-2">AI Fraud Score</p>
                            <p className="text-2xl font-bold text-medical-dark">
                                {claimData.fraud_score !== null ? claimData.fraud_score : 'Pending...'}
                                <span className="text-sm font-normal text-gray-400 ml-2">/ 100</span>
                            </p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm text-gray-500 mb-2">Blockchain Transaction Hash</p>
                            <p className="font-mono text-sm bg-medical-teal/5 p-3 rounded-lg break-all text-medical-teal">
                                {claimData.tx_hash || 'Waiting for settlement...'}
                            </p>
                        </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="bg-gray-50 p-6 border-t-2 border-medical-teal/20">
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                            <span>Submitted</span>
                            <span>AI Validated</span>
                            <span>Settled</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r from-medical-teal to-medical-teal-light transition-all duration-500 ${claimData.status === 'Submitted' ? 'w-1/3' :
                                        claimData.status === 'Approved' ? 'w-2/3' :
                                            claimData.status === 'Settled' ? 'w-full' : 'w-1/3'
                                    }`}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
