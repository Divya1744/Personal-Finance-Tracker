import api from './api';

// The USER_ID default is used for convenience in other functions
const USER_ID = JSON.parse(localStorage.getItem('authData'))?.userId;

// --- AUTH SERVICES (UNCHANGED) ---
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const verifyEmail = (data) => api.post('/auth/verify', data);
export const logout = (email) => api.post('/auth/logout', { email });

// --- TRANSACTION/BUDGET SERVICES (UNCHANGED) ---
export const getBudgetSummary = (userId = USER_ID) => 
    api.get(`/transactions/budget?userId=${userId}`);

export const getTransactions = (userId = USER_ID) => 
    api.get(`/transactions?userId=${userId}`);

export const addTransaction = (transactionData, userId = USER_ID) => {
    const category = transactionData.category.toUpperCase();
    return api.post(`/transactions?userId=${userId}`, {
        ...transactionData,
        category: category,
    });
};

export const deleteTransaction = (id, userId = USER_ID) => 
    api.delete(`/transactions/${id}?userId=${userId}`);

// --- SCHEDULED TRANSACTION SERVICES (NEW) ---
export const scheduleTransaction = (transactionData, userId = USER_ID) => {
    const category = transactionData.category.toUpperCase();
    return api.post(`/scheduled-transactions?userId=${userId}`, {
        ...transactionData,
        category: category,
    });
};

// **FIXED FUNCTION: To retrieve all scheduled transactions**
export const getScheduledTransactions = (userId = USER_ID) => {
    // FIX: Extract the data array from the response object
    return api.get(`/scheduled-transactions?userId=${userId}`)
        .then(response => response.data);
};

// --- AI/OCR SERVICES (UNCHANGED) ---
export const getFinancialAdvice = (question, userId = USER_ID) => 
    api.post(`/finance-ai/ask?userId=${userId}`, question, { 
        headers: { 'Content-Type': 'text/plain' } 
    });

export const scanReceipt = (file, userId = USER_ID) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return api.post('/ocr/scan', formData, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    });
};