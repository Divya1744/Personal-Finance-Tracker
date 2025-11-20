import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import DashboardPage from './pages/DashboardPage';
import AiAdvicePage from './pages/AiAdvicePage';
import OcrScanPage from './pages/OcrScanPage';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Unauthenticated Landing Page (Public Home) */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyEmailPage />} />
                    
                    {/* Protected Routes (All features requiring auth) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/ai" element={<AiAdvicePage />} />
                        <Route path="/ocr" element={<OcrScanPage />} />
                    </Route>

                    {/* Fallback to Unauthenticated Home */}
                    <Route path="*" element={<LandingPage />} /> 
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;