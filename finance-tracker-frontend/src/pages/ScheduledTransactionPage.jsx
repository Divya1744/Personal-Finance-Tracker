import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ScheduleTransactionModal from '../components/ScheduleTransactionModal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { scheduleTransaction, getScheduledTransactions } from '../services/financeService'; 
import { Plus, CalendarClock, CheckCircle, Clock } from 'lucide-react';
import moment from 'moment'; // Recommended for date formatting

const ScheduledTransactionPage = () => {
    const { userId } = useAuth();
    const [loading, setLoading] = useState(true); 
    const [modalOpen, setModalOpen] = useState(false);
    const [scheduledTransactions, setScheduledTransactions] = useState([]);
    const [error, setError] = useState(null);

    // Function to fetch data from the backend
    const fetchScheduledTransactions = useCallback(async () => {
        // Essential check: prevent API call if userId hasn't loaded yet
        if (!userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Data is now reliably an array thanks to the service layer fix
            const transactions = await getScheduledTransactions(userId); 
            
            // Sort by scheduled date (newest first for visibility)
            transactions.sort((a, b) => new Date(b.scheduledTimestamp) - new Date(a.scheduledTimestamp));
            setScheduledTransactions(transactions);
        } catch (err) {
            console.error('Failed to fetch scheduled transactions', err);
            // Provide more specific error if available from the response
            const errorMessage = err.response?.data?.message || 'Failed to load scheduled transactions.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Fetch data when the component mounts or userId changes
    useEffect(() => {
        fetchScheduledTransactions();
    }, [fetchScheduledTransactions]);


    const handleScheduleSave = async (formData) => {
        setLoading(true);
        try {
            await scheduleTransaction(formData, userId);
            alert('Transaction successfully scheduled! A notification will be sent near the due date.');
            
            // Refresh the transaction list after a successful save
            await fetchScheduledTransactions(); 
            
            // Close the modal and reset state
            setModalOpen(false); 
        } catch (error) {
            console.error('Failed to schedule transaction', error);
            const errorMessage = error.response?.data?.message || 'Failed to schedule transaction.';
            throw new Error(errorMessage); // Throw to be caught by the modal for display
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Logic ---

    if (loading && scheduledTransactions.length === 0) return <Loader />;

    // Helper component for the table content
    const TransactionsTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount (₹)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Note
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reminder
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {scheduledTransactions.map((tx) => (
                        <tr key={tx.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {moment(tx.scheduledTimestamp).format('MMM D, YYYY')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={tx.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'}>
                                    {tx.type === 'EXPENSE' ? '- ' : '+ '}{tx.amount.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">
                                {tx.note || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {tx.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tx.notified ? ( // Use tx.notified field from the backend response
                                    <span className="inline-flex items-center text-green-500">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Sent
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-yellow-500">
                                        <Clock className="w-4 h-4 mr-1" /> Pending
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    // --- Main Component Return ---

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 flex items-center">
                        <CalendarClock className="w-7 h-7 mr-2 text-secondary" /> Scheduled Transactions
                    </h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-secondary hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Schedule New
                    </button>
                </div>

                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

                <div className="bg-white p-8 rounded-xl shadow-lg min-h-[300px]">
                    {scheduledTransactions.length === 0 ? (
                        <div className='text-center text-gray-500 flex flex-col items-center justify-center h-full'>
                            <p className='text-lg font-medium mb-2'>No scheduled transactions found.</p>
                            <p>Click "Schedule New" to set up a future income or expense.</p>
                            <p className='mt-4 text-sm'>
                                (Reminders will be sent via SMS one week before the scheduled date.)
                            </p>
                        </div>
                    ) : (
                        <TransactionsTable />
                    )}
                </div>
            </div>
            
            <ScheduleTransactionModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={handleScheduleSave}
            />
        </div>
    );
};

export default ScheduledTransactionPage;