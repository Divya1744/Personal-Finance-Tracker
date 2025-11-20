import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '' // <-- NEW FIELD for SMS
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        // Basic validation for Twilio format (E.164: +CountryCodeAreaCodeNumber)
        if (formData.phoneNumber && !formData.phoneNumber.match(/^\+\d{10,15}$/)) {
            return setError('Phone number must be in E.164 format (e.g., +919876543210).');
        }

        setLoading(true);

        try {
            await register(formData);
            alert('Registration successful! Please check your email for the verification OTP.');
            navigate('/verify');
        } catch (err) {
            console.error(err);
            // Captures messages from backend (e.g., "User already exists")
            setError(err.response?.data?.message || 'Registration failed.'); 
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'username', type: 'text', placeholder: 'Username' },
        { name: 'email', type: 'email', placeholder: 'Email address' },
        { name: 'password', type: 'password', placeholder: 'Password' },
        { name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
        { name: 'phoneNumber', type: 'text', placeholder: 'Phone Number (+91xxxxxxxxx)' } // <-- NEW FIELD UI
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-8 space-y-8 bg-white rounded-xl shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or <Link to="/login" className="font-medium text-primary hover:text-indigo-500">sign in to your existing account</Link>
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        {fields.map((field, index) => (
                            <div key={field.name}>
                                <label htmlFor={field.name} className="sr-only">{field.placeholder}</label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    required={field.name !== 'phoneNumber'}
                                    className={`appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm ${index === 0 ? 'rounded-t-md' : ''} ${index === fields.length - 1 ? 'rounded-b-md' : ''} ${index > 0 && index < fields.length - 1 ? 'border-t-0' : ''}`}
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                                {field.name === 'phoneNumber' && (
                                    <p className='text-xs text-gray-500 mt-1 px-1'>Required for scheduled transaction SMS reminders.</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;