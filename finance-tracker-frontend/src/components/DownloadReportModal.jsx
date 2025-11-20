import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils'; // Only imports CSV utility

const DownloadReportModal = ({ isOpen, onClose, transactions }) => {
    // Removed 'format' state as only CSV is supported
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Added error state

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // 1. Filter transactions based on date range (optional for user)
        const filteredData = transactions
            .filter(t => {
                const txDate = new Date(t.timestamp);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;
                
                // Adjust end date to include the whole day
                if (end) end.setDate(end.getDate() + 1);

                return (!start || txDate >= start) && (!end || txDate < end);
            })
            // Sort by date for proper CSV order
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 2. Generate and download the file (CSV only)
        try {
            const dateStr = `${startDate || 'all'}_to_${endDate || 'all'}`;
            const filename = `finance_report_${dateStr}.csv`;
            exportToCSV(filteredData, filename);
            onClose();
        } catch (err) {
            console.error(err);
            setError("Error generating report: Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">Download CSV Report</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <p className='text-sm text-gray-500'>The report will be generated as a **CSV file** (Excel compatible) using the currently loaded transactions.</p>
                    
                    {/* Date Range Filters */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date (Optional)</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Report Format Display (Removed selector) */}
                    <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                        **Format:** CSV (.csv)
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-secondary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 transition"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            {loading ? 'Generating CSV...' : 'Download Report (.csv)'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DownloadReportModal;