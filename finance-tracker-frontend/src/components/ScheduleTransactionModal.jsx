import React, { useState } from 'react';
import { X, CalendarClock } from 'lucide-react';

// CATEGORIES array is removed as it's no longer needed for the UI dropdown

const ScheduleTransactionModal = ({ isOpen, onClose, onSave }) => {
    // Initial state sets hardcoded mandatory values and includes the form inputs
    const initialState = {
        amount: '',
        type: 'EXPENSE',      // <-- HARDCODED: Mandatory field in backend entity.
        category: 'BILLS',    // <-- HARDCODED: Mandatory field in backend entity.
        note: '',
        scheduledDate: '',    // <-- Mandatory user input
    };
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!formData.scheduledDate) {
            setError("Scheduled date is required.");
            setLoading(false);
            return;
        }

        try {
            await onSave(formData);
            setFormData(initialState);
            onClose();
        } catch (err) {
            const errorMessage = 
                err.response?.data?.message ||
                'Failed to schedule transaction.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Schedule Future Transaction
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    {/* Date Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                        <input
                            type="date"
                            name="scheduledDate"
                            value={formData.scheduledDate}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-secondary focus:ring-secondary"
                            required
                        />
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

                    {/* Type/Category Information Display 
                    <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-200">
                        Note: This transaction will be saved as **Expense** under the **BILLS** category.
                    </div>*/}

                    {/* Note (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows="2"
                            placeholder="What is this recurring expense for?"
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:border-primary focus:ring-primary"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-secondary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 transition"
                        >
                            <CalendarClock className="w-5 h-5 mr-2" />
                            {loading ? 'Scheduling...' : 'Schedule Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleTransactionModal;