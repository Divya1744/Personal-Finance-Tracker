import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { DollarSign, Zap, Camera, Lock, Mail } from 'lucide-react';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    // If the user is already authenticated, redirect them to the Dashboard immediately
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
                {/* Hero Section */}
                <div className="pt-10 bg-white sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                                <div className="lg:py-24">
                                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                        <span className="block">Take control of your</span>
                                        <span className="block text-primary">financial future.</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        Track every income and expense, manage your budget, and get personalized financial advice powered by Google's Gemini AI.
                                    </p>
                                    <div className="mt-10 sm:mt-12">
                                        <Link
                                            to="/register"
                                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 sm:w-auto"
                                        >
                                            Get Started for Free
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    {/* Placeholder Image for visual appeal */}
                                    <img 
                                        className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto transform lg:translate-x-12 xl:translate-x-20 rounded-xl shadow-2xl" 
                                        src="https://images.unsplash.com/photo-1551288258-28cec28d3e91?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                        alt="Financial Dashboard Illustration" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Section */}
                <div className="py-16 bg-gray-50 overflow-hidden lg:py-24">
                    <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
                        <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Powerful Features
                        </h2>
                        <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                            Backed by a secure Spring Boot API, we offer advanced tools to manage your money.
                        </p>

                        <div className="mt-12">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                                <FeatureItem 
                                    icon={DollarSign}
                                    name="Real-time Budgeting"
                                    description="Securely log all your income, expenses, and track your remaining budget instantly. Transactions update your financial summary in real-time."
                                />
                                <FeatureItem 
                                    icon={Zap}
                                    name="AI Financial Advice"
                                    description="Ask the Gemini AI model questions about your spending habits, and receive personalized advice based on your full transaction history."
                                />
                                <FeatureItem 
                                    icon={Camera}
                                    name="Receipt OCR Scanning"
                                    description="Instantly upload a picture of a receipt. Our system uses a multi-modal Gemini model to extract transaction details and save them automatically to your account."
                                />
                                <FeatureItem 
                                    icon={Lock}
                                    name="Secure & Verified Accounts"
                                    description="High security using JWT authentication, refresh tokens, and mandatory email verification via OTP, all managed by Spring Security."
                                />
                            </dl>
                        </div>
                    </div>
                </div>
                
                {/* Contact Section - Static Content */}
                <div id="contact" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Contact Us
                            </h2>
                            <p className="mt-4 text-xl text-gray-500 lg:mx-auto">
                                We are here to help you get started with the Finance Tracker.
                            </p>
                        </div>
                        <div className="mt-10 flex flex-col items-center">
                             <div className="flex items-center space-x-3 text-lg text-gray-600">
                                <Mail className="w-6 h-6 text-primary" />
                                <span className="font-medium text-gray-900">Email:</span>
                                <span>support@finance-tracker-app.com</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                This is a static placeholder. Actual contact functionality would require a backend endpoint.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

const FeatureItem = ({ icon: Icon, name, description }) => (
    <div className="relative">
        <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{name}</p>
        </dt>
        <dd className="mt-2 ml-16 text-base text-gray-500">{description}</dd>
    </div>
);

export default LandingPage;