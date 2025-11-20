import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils'; // <-- CORRECTED: IMPORT BOTH UTILITIES

const DownloadReportModal = ({ isOpen, onClose, transactions }) => {
    const [format, setFormat] = useState('CSV');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Filter transactions based on date range 
        const filteredData = transactions
            .filter(t => {
                const txDate = new Date(t.timestamp);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;
                
                // Adjust end date to include the whole day
                if (end) end.setDate(end.getDate() + 1);

                return (!start || txDate >= start) && (!end || txDate < end);
            })
            // Sort by date for proper PDF/CSV order
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 2. Generate and download the file
        try {
            const dateStr = `${startDate || 'all'}_to_${endDate || 'all'}`;

            if (format === 'CSV') {
                const filename = `finance_report_${dateStr}.csv`;
                exportToCSV(filteredData, filename);
            } else if (format === 'PDF') {
                const filename = `finance_report_${dateStr}.pdf`;
                exportToPDF(filteredData, filename); // <-- CALL PDF FUNCTION
            } else {
                alert(`Export format ${format} is not yet supported.`);
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error generating report: Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">Download Report</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <p className='text-sm text-gray-500'>Select your preferences below to generate a report from the data already loaded.</p>
                    
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

                    {/* Format Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Report Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                            required
                        >
                            <option value="CSV">CSV (Current Data Snapshot)</option>
                            <option value="PDF">PDF (Current Data Snapshot)</option> {/* <-- ENABLED PDF */}
                        </select>
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-secondary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 transition"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            {loading ? 'Generating...' : 'Download Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DownloadReportModal;