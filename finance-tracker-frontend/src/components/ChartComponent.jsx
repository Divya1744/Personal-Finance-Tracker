import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ transactions }) => {
    // Group transactions by month and type (INCOME/EXPENSE)
    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.timestamp).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { INCOME: 0, EXPENSE: 0 };
        }
        if (t.type === 'INCOME') {
            acc[month].INCOME += t.amount;
        } else if (t.type === 'EXPENSE') {
            acc[month].EXPENSE += t.amount;
        }
        return acc;
    }, {});

    const labels = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
    const incomeData = labels.map(month => monthlyData[month].INCOME);
    const expenseData = labels.map(month => monthlyData[month].EXPENSE);

    const data = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: '#10b981', // income color
            },
            {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#ef4444', // expense color
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Income vs. Expense',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount (₹)',
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Financial Overview</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ChartComponent;