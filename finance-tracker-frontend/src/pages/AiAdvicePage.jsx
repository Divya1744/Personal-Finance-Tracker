import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getFinancialAdvice } from '../services/financeService';
import { Send, Bot } from 'lucide-react';

const AiAdvicePage = () => {
    const { userId } = useAuth();
    const [question, setQuestion] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAdvice('');
        setLoading(true);

        try {
            const response = await getFinancialAdvice(question, userId);
            setAdvice(response.data); // Backend returns a string response
        } catch (err) {
            console.error('AI Advice failed', err);
            setError(err.response?.data || 'Failed to get financial advice. The Gemini API key or model might be misconfigured on the backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Bot className="w-8 h-8 mr-2 text-primary" /> AI Financial Assistant
                </h1>

                {/* Advice Input */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary"
                            rows="4"
                            placeholder="Ask a question about your finances (e.g., 'Am I spending too much on food?' or 'How can I save money?')"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-indigo-700 disabled:bg-gray-400 transition"
                            disabled={loading}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            {loading ? 'Analyzing...' : 'Get Financial Advice'}
                        </button>
                    </form>
                </div>

                {/* Advice Output */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Response:</h2>
                    <div className="bg-white p-6 rounded-xl shadow-inner min-h-[150px] whitespace-pre-wrap">
                        {error && <p className="text-red-500">{error}</p>}
                        {loading && <p className="text-gray-500">Waiting for AI...</p>}
                        {advice && !loading && (
                            <p className="text-gray-800">
                                {advice}
                            </p>
                        )}
                        {!advice && !error && !loading && (
                            <p className="text-gray-500 italic">Your AI financial advice will appear here.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAdvicePage;