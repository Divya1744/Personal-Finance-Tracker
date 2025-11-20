import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { scanReceipt } from '../services/financeService';
import { Upload, FileText, X, Camera } from 'lucide-react';
import TransactionTable from '../components/TransactionTable';

const OcrScanPage = () => {
    const { userId } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [savedTransactions, setSavedTransactions] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setSavedTransactions([]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            return setError('Please select an image file to upload.');
        }

        setError('');
        setLoading(true);

        try {
            const response = await scanReceipt(file, userId);
            setSavedTransactions(response.data);
            setFile(null); // Clear file input on success
            alert(`Successfully processed and saved ${response.data.length} transactions!`);
        } catch (err) {
            console.error('OCR Scan failed', err);
            // The OCRController returns a string error message in the body for bad requests
            const errMsg = err.response?.data || 'Failed to scan receipt. Ensure the Gemini API key is correct and the file is a valid image.';
            setError(`Error: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Camera className="w-8 h-8 mr-2 text-primary" /> OCR Receipt Scanner
                </h1>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <p className="text-gray-600 mb-4">Upload an image of your receipt to automatically extract and save transactions.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label className="flex-1 block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    required
                                />
                                {file ? (
                                    <div className="flex items-center justify-center text-primary">
                                        <FileText className="w-5 h-5 mr-2" />
                                        <span>{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">
                                        <Upload className="w-8 h-8 mx-auto mb-2" />
                                        <p>Drag & drop or click to select file (PNG, JPG)</p>
                                    </div>
                                )}
                            </label>
                            {file && (
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-2 text-red-500 hover:text-red-700 rounded-full bg-red-100"
                                    title="Remove file"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-indigo-700 disabled:bg-gray-400 transition"
                            disabled={loading || !file}
                        >
                            {loading ? 'Processing...' : 'Scan & Save Transactions'}
                        </button>
                    </form>
                </div>
                
                {/* Results Table */}
                {savedTransactions.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Successfully Saved Transactions</h2>
                        <TransactionTable transactions={savedTransactions} onDelete={() => {}} onEdit={() => {}} filter={{type:'', category:''}} setFilter={() => {}} />
                        <p className="mt-4 text-sm text-gray-600">These transactions have been saved to your account. You can manage them on the Dashboard.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OcrScanPage;