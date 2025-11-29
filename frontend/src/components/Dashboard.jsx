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
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto border-2 border-medical-teal/10">
            <h2 className="text-3xl font-bold mb-6 text-medical-dark">Claims Dashboard</h2>
            <p className="text-gray-600 mb-8">Track and monitor insurance claim status</p>

            <div className="flex space-x-4 mb-8">
                <input
                    type="text"
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    placeholder="Enter Claim ID"
                    className="flex-1 px-4 py-3 bg-medical-light/50 border-b-2 border-medical-teal/30 focus:border-medical-cyan focus:bg-white transition-all outline-none rounded-t-lg"
                />
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="bg-gradient-to-r from-medical-cyan to-medical-teal text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-medical-teal/40 transition-all disabled:opacity-50 transform hover:scale-105"
                >
                    {loading ? 'Searching...' : 'Track Claim'}
                </button>
            </div>

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-medical-cyan"></div>
                    <p className="text-gray-500 mt-4 font-medium">Fetching claim data...</p>
                </div>
            )}

            {claimData && (
                <div className="border-2 border-medical-teal/30 rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-medical-teal/20 to-medical-cyan/20 p-5 border-b-2 border-medical-teal/30">
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
                            <p className="font-mono text-sm bg-gradient-to-r from-medical-teal/10 to-medical-cyan/10 p-3 rounded-lg break-all text-medical-teal border border-medical-teal/20">
                                {claimData.tx_hash || 'Waiting for settlement...'}
                            </p>
                        </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="bg-gradient-to-br from-medical-light/50 to-white p-6 border-t-2 border-medical-teal/30">
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-3">
                            <span>Submitted</span>
                            <span>AI Validated</span>
                            <span>Settled</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full bg-gradient-to-r from-medical-cyan to-medical-teal transition-all duration-500 shadow-lg ${claimData.status === 'Submitted' ? 'w-1/3' :
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
