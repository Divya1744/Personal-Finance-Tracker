import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import BudgetCard from '../components/BudgetCard';
import TransactionTable from '../components/TransactionTable';
import ChartComponent from '../components/ChartComponent';
import AddTransactionModal from '../components/AddTransactionModal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { 
    getBudgetSummary, 
    getTransactions, 
    addTransaction, 
    deleteTransaction 
} from '../services/financeService';
import { Plus, Download as DownloadIcon } from 'lucide-react'; // <-- ADD DownloadIcon
import DownloadReportModal from '../components/DownloadReportModal'; // <-- ADD IMPORT

const DashboardPage = () => {
    const { userId } = useAuth();
    const [budget, setBudget] = useState({ totalIncome: 0, totalExpense: 0, remainingBudget: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false); // <-- NEW STATE
    const [transactionToEdit, setTransactionToEdit] = useState(null);
    const [filter, setFilter] = useState({ type: '', category: '' });

    const fetchData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [budgetRes, transactionsRes] = await Promise.all([
                getBudgetSummary(userId),
                getTransactions(userId),
            ]);
            setBudget(budgetRes.data);
            // Ensure types are correctly set for transactions, default to EXPENSE if missing for robustness
            setTransactions(transactionsRes.data.map(t => ({
                ...t,
                type: t.type?.toUpperCase() || 'EXPENSE' 
            })));
        } catch (error) {
            console.error('Failed to fetch data', error);
            alert('Failed to load dashboard data. Check console for details.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveTransaction = async (formData) => {
        // NOTE: The current backend only has an addTransaction endpoint. 
        // For a full implementation, you'd need a separate PUT/PATCH endpoint for editing.
        
        if(formData.id) {
             alert("The backend only supports 'add' and 'delete' for transactions. Edit functionality is not fully implemented in the current backend API.");
             return;
        }

        await addTransaction(formData, userId);
        fetchData(); // Refresh data
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id, userId);
                alert('Transaction deleted successfully!');
                fetchData(); // Refresh data
            } catch (error) {
                console.error('Failed to delete transaction', error);
                alert(error.response?.data || 'Failed to delete transaction.');
            }
        }
    };

    const handleEditClick = (transaction) => {
        setTransactionToEdit(transaction);
        setModalOpen(true);
        // Added alert based on previous advice since the backend doesn't support edit
        alert("Edit functionality is currently disabled because the backend lacks a dedicated PUT/PATCH endpoint for transactions.");
    };

    if (loading) return <Loader />;

    // Calculate Net Balance for the Budget Card
    const netBalance = budget.totalIncome - budget.totalExpense;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
                    
                    {/* BUTTONS CONTAINER */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setReportModalOpen(true)} // <-- OPEN REPORT MODAL
                            className="bg-secondary hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center"
                        >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Download Report
                        </button>

                        <button
                            onClick={() => { setTransactionToEdit(null); setModalOpen(true); }}
                            className="bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Budget Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BudgetCard title="Total Income" value={budget.totalIncome || 0} type="income" />
                    <BudgetCard title="Total Expenses" value={budget.totalExpense || 0} type="expense" />
                    <BudgetCard title="Remaining Budget" value={budget.remainingBudget || netBalance} type="balance" />
                </div>

                {/* Charts */}
                <div className="mt-8">
                    <ChartComponent transactions={transactions} />
                </div>

                {/* Transaction Table */}
                <TransactionTable 
                    transactions={transactions} 
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditClick}
                    filter={filter}
                    setFilter={setFilter}
                />
            </div>
            
            {/* ADD/EDIT MODAL */}
            <AddTransactionModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={handleSaveTransaction}
                transactionToEdit={transactionToEdit}
            />
            
            {/* DOWNLOAD REPORT MODAL */}
            <DownloadReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                transactions={transactions} // Pass all loaded transactions for client-side export
            />
        </div>
    );
};

export default DashboardPage;