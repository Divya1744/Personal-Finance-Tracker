import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR: ATTACHES TOKEN TO EVERY PROTECTED REQUEST
api.interceptors.request.use(
    (config) => {
        // Reads the token from localStorage on every new request
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

// RESPONSE INTERCEPTOR: HANDLES TOKEN REFRESH ON 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const authData = JSON.parse(localStorage.getItem('authData'));

        // Check for 401 and make sure it's not a retry (to prevent infinite loops)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (authData && authData.refreshToken) {
                try {
                    // 1. Call the refresh endpoint (this endpoint is public/unprotected)
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: authData.refreshToken,
                    });

                    if (res.status === 200) {
                        const newAuthData = {
                            ...authData,
                            accessToken: res.data.accessToken,
                        };
                        localStorage.setItem('authData', JSON.stringify(newAuthData));
                        
                        // 2. Update the default header for future calls
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                        
                        // 3. Retry the original failing request
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // 4. If refresh fails, log out and redirect to login
                    localStorage.removeItem('authData');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // 5. If no refresh token exists, force logout
                localStorage.removeItem('authData');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;