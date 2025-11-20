import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const authData = JSON.parse(localStorage.getItem('authData'));
        if (authData && authData.accessToken) {
            config.headers.Authorization = `Bearer ${authData.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh (minimal implementation)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const authData = JSON.parse(localStorage.getItem('authData'));

        // Check for 401 and not an auth endpoint
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (authData && authData.refreshToken) {
                try {
                    // Call the refresh endpoint
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: authData.refreshToken,
                    });

                    if (res.status === 200) {
                        const newAuthData = {
                            ...authData,
                            accessToken: res.data.accessToken,
                        };
                        localStorage.setItem('authData', JSON.stringify(newAuthData));
                        
                        // Update headers and retry the original request
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed', refreshError);
                    // Force logout on refresh failure
                    localStorage.removeItem('authData');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, force logout
                localStorage.removeItem('authData');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;