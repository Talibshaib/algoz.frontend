import axios from 'axios';
import { API_URL } from '@/constants/URI';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
  timeout: 15000, // 15 second timeout
});

// Add retry logic for network errors
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Store retry count in config
    config.retryCount = config.retryCount || 0;
    
    // Add Authorization header with JWT token if available in localStorage
    if (typeof window !== 'undefined') {
      // Check for admin token first
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        try {
          const parsedAdmin = JSON.parse(adminUser);
          // If we have an accessToken in the admin object
          if (parsedAdmin.accessToken) {
            // Ensure headers object exists
            config.headers = config.headers || {};
            // Set Authorization header with Bearer token
            config.headers.Authorization = `Bearer ${parsedAdmin.accessToken}`;
            // Remove excessive logging in production
            if (process.env.NODE_ENV === 'development') {
              console.log("Admin Authorization header set with token");
            }
            return config;
          }
        } catch (error) {
          console.error('Error parsing admin from localStorage:', error);
          // Clear invalid admin data
          localStorage.removeItem('adminUser');
        }
      }

      // If no admin token, check for user token
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          // If we have an accessToken directly in the user object
          if (parsedUser.accessToken) {
            // Ensure headers object exists
            config.headers = config.headers || {};
            // Set Authorization header with Bearer token
            config.headers.Authorization = `Bearer ${parsedUser.accessToken}`;
            // Remove excessive logging in production
            if (process.env.NODE_ENV === 'development') {
              console.log("User Authorization header set with token");
            }
          } else {
            console.warn("No accessToken found in user object - user may need to re-login");
            // If we're in a browser environment, redirect to login
            if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
              console.log("Redirecting to login due to missing token");
              // Use a timeout to avoid interrupting the current request
              setTimeout(() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }, 0);
            }
          }
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
          // Clear invalid user data
          localStorage.removeItem('user');
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here before it reaches the component
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if we should retry the request
    if (
      (error.code === 'ERR_NETWORK' || 
       error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NAME_NOT_RESOLVED' ||
       (error.response && error.response.status >= 500)) && 
      originalRequest.retryCount < MAX_RETRIES
    ) {
      originalRequest.retryCount += 1;
      
      console.log(`Retrying request (${originalRequest.retryCount}/${MAX_RETRIES}) after network error: ${error.message}`);
      
      // Wait before retrying
      await delay(RETRY_DELAY * originalRequest.retryCount);
      
      // Return the retry request
      return axiosInstance(originalRequest);
    }
    
    // Handle common errors here (e.g., 401 unauthorized, network errors)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        console.error('Authentication error: You may need to log in again');
        // Clear user data and redirect to login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          console.log("Redirecting to login due to 401 error");
          localStorage.removeItem('user');
          // Use a timeout to avoid interrupting the current request handling
          setTimeout(() => {
            window.location.href = '/login';
          }, 0);
        }
      }
      // Log more detailed error information
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.message);
      
      // Specific handling for DNS resolution issues
      if (error.code === 'ERR_NAME_NOT_RESOLVED') {
        console.error('DNS resolution failed. The API server domain could not be resolved.');
        // Show a more user-friendly message
        error.userFriendlyMessage = "Unable to connect to the server. This could be due to network issues or the server may be temporarily unavailable. Please try again later.";
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;