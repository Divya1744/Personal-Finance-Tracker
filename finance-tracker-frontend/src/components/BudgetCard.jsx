import React from 'react';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const BudgetCard = ({ title, value, type }) => {
    const getColor = () => {
        switch (type) {
            case 'income':
                return 'bg-green-100 text-income';
            case 'expense':
                return 'bg-red-100 text-expense';
            case 'balance':
                return value >= 0 ? 'bg-indigo-100 text-primary' : 'bg-red-100 text-expense';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'income':
                return <ArrowUp className="w-5 h-5" />;
            case 'expense':
                return <ArrowDown className="w-5 h-5" />;
            default:
                return <DollarSign className="w-5 h-5" />;
        }
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg ${getColor()} transition transform hover:scale-[1.02] duration-300`}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
                <div className="p-1 rounded-full bg-white bg-opacity-30">
                    {getIcon()}
                </div>
            </div>
            <p className="mt-4 text-3xl font-bold">₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
    );
};

export default BudgetCard;