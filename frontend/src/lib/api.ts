import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth store if unauthorized (token expired/invalid)
      const isAuthRequest = error.config.url?.includes('/auth/');
      if (!isAuthRequest) {
        // You could dispatch an event here or call useAuthStore.getState().logout()
        // But importing the store here might cause a circular dependency
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-unauthorized'));
        }
      }
    }
    return Promise.reject(error);
  }
);
