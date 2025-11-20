import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Zap, Camera, LogIn, UserPlus, LogOut } from 'lucide-react';

const Header = () => {
    const { logout, isAuthenticated } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <Link to="/" className="text-xl font-bold text-primary flex items-center">
                    <span className="text-2xl font-black mr-1">💸</span> Finance Tracker
                </Link>

                {isAuthenticated ? (
                    // Authenticated Navigation
                    <nav className="flex items-center space-x-4">
                        <NavLink to="/dashboard" icon={Home} label="Dashboard" />
                        <NavLink to="/ai" icon={Zap} label="AI Advice" />
                        <NavLink to="/ocr" icon={Camera} label="OCR Scan" />
                        
                        <button
                            onClick={logout}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </nav>
                ) : (
                    // Unauthenticated Navigation (Links for Landing Page)
                    <nav className="flex items-center space-x-4">
                        <NavLink to="/login" icon={LogIn} label="Login" />
                        <Link
                             to="/register"
                             className="p-2 rounded-lg text-white bg-primary hover:bg-indigo-700 transition duration-150 ease-in-out flex items-center"
                        >
                            <UserPlus className="h-5 w-5 mr-1" />
                            <span className="hidden sm:inline">Sign Up</span>
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
};

const NavLink = ({ to, icon: Icon, label }) => (
    <Link 
        to={to} 
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition duration-150 ease-in-out flex items-center"
    >
        <Icon className="h-5 w-5 mr-1" />
        <span className="hidden sm:inline">{label}</span>
    </Link>
);

export default Header;