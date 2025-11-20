import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const CATEGORIES = ["FOOD", "TRAVEL", "EDUCATION", "BILLS", "SALARY"]; // From Category.java

const AddTransactionModal = ({ isOpen, onClose, onSave, transactionToEdit }) => {
    const initialState = {
        amount: '',
        type: 'EXPENSE', // Default to EXPENSE
        category: 'FOOD', // Default to FOOD
        note: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                id: transactionToEdit.id,
                amount: transactionToEdit.amount,
                type: transactionToEdit.type,
                category: transactionToEdit.category,
                note: transactionToEdit.note || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [transactionToEdit]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await onSave(formData);
            setFormData(initialState);
            onClose();
        } catch (err) {
            // --- ENHANCED ERROR CAPTURE ---
            const responseData = err.response?.data;
            
            let customError = 'Failed to save transaction.';
            
            if (typeof responseData === 'string' && responseData.includes('funds')) {
                // CAPTURES: The specific plain text error from the Spring RuntimeException.
                customError = responseData; 
            } else if (responseData?.message) {
                // CAPTURES: Standard JSON error format { message: "..." }
                customError = responseData.message;
            } else {
                // Fallback for general network or unexpected errors
                customError = 'Failed to save transaction. Please check your connection or server logs.';
            }

            setError(customError);
            // -----------------------------
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* Type Selector */}
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg cursor-pointer flex-1">
                            <input 
                                type="radio" 
                                name="type" 
                                value="INCOME"
                                checked={formData.type === 'INCOME'}
                                onChange={handleChange}
                                className="text-income focus:ring-income"
                                required
                            />
                            <span className="font-medium text-income">Income</span>
                        </label>
                        <label className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg cursor-pointer flex-1">
                            <input 
                                type="radio" 
                                name="type" 
                                value="EXPENSE"
                                checked={formData.type === 'EXPENSE'}
                                onChange={handleChange}
                                className="text-expense focus:ring-expense"
                            />
                            <span className="font-medium text-expense">Expense</span>
                        </label>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g. 500.00"
                            min="0.01"
                            step="0.01"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                            required
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                            ))}
                        </select>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows="2"
                            placeholder="What was this for?"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 transition"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Saving...' : transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;