import React, { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';

const CATEGORIES = ["FOOD", "TRAVEL", "EDUCATION", "BILLS", "SALARY"]; // From Category.java

const TransactionTable = ({ transactions, onDelete, onEdit, filter, setFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions
        .filter(t => 
            (filter.type === '' || t.type === filter.type) &&
            (filter.category === '' || t.category === filter.category) &&
            (searchTerm === '' || t.note?.toLowerCase().includes(searchTerm.toLowerCase()) || t.category?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by newest first


    const getCategoryColor = (category) => {
        switch (category) {
            case 'SALARY': return 'bg-green-200 text-green-800';
            case 'FOOD': return 'bg-yellow-200 text-yellow-800';
            case 'TRAVEL': return 'bg-blue-200 text-blue-800';
            case 'BILLS': return 'bg-red-200 text-red-800';
            case 'EDUCATION': return 'bg-purple-200 text-purple-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Transaction History</h2>
            
            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by note or category..."
                    className="p-2 border border-gray-300 rounded-lg flex-grow min-w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border border-gray-300 rounded-lg"
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <select
                    className="p-2 border border-gray-300 rounded-lg"
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto custom-scrollbar max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(t.timestamp).toLocaleDateString()}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                                    {t.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(t.category)}`}>
                                        {t.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {t.note || 'N/A'}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                                    {t.type === 'EXPENSE' ? '-' : ''}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button 
                                        onClick={() => onEdit(t)} 
                                        className="text-primary hover:text-indigo-800"
                                        title="Edit Transaction"
                                    >
                                        <Edit className="w-4 h-4 inline" />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(t.id)} 
                                        className="text-expense hover:text-red-800"
                                        title="Delete Transaction"
                                    >
                                        <Trash2 className="w-4 h-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <p className="text-center py-4 text-gray-500">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionTable;