import axios from 'axios';
import { API_URL } from '@/constants/URI';
import { getWorkingEndpoint, checkAPIHealth } from '@/services/healthCheck';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
  timeout: 15000, // 15 second timeout
});

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Track retry attempts for each request
const retryCount = new Map();
const MAX_RETRIES = 2;

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Generate a unique request ID for tracking retries
    const requestId = `${config.method}-${config.url}-${Date.now()}`;
    
    // Check if we're retrying and track count
    if (!retryCount.has(requestId)) {
      retryCount.set(requestId, 0);
      // Store the requestId in the config for the response interceptor
      config.headers["X-Request-ID"] = requestId;
    }
    
    // Check if we need to update the baseURL due to DNS issues
    if (retryCount.get(requestId) > 0) {
      try {
        // Force a health check on retry
        const { isOnline, endpoint } = await checkAPIHealth(true);
        if (isOnline && endpoint) {
          // Use the working endpoint for this request
          const url = new URL(config.url || "", API_URL);
          config.url = `${endpoint}${url.pathname}${url.search}`;
        }
      } catch (error) {
        console.error("Failed to check API health during retry:", error);
      }
    }
    
    // Get tokens from localStorage
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Check for user token
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.accessToken) {
            token = userData.accessToken;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // If no user token, check for admin token
      if (!token) {
        const admin = localStorage.getItem('adminUser');
        if (admin) {
          try {
            const adminData = JSON.parse(admin);
            if (adminData.accessToken) {
              token = adminData.accessToken;
            }
          } catch (error) {
            console.error("Error parsing admin data:", error);
          }
        }
      }
    }
    
    // Set Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Clear retry count for successful requests
    const requestId = response.config.headers["X-Request-ID"];
    if (requestId) {
      retryCount.delete(requestId);
    }
    return response;
  },
  async (error) => {
    // Get the request ID from the config
    const requestId = error.config?.headers?.["X-Request-ID"];
    
    // Handle network errors and retry logic
    if (error.code === "ERR_NETWORK" || 
        error.code === "ECONNABORTED" || 
        error.code === "ERR_NAME_NOT_RESOLVED" ||
        error.message.includes("Network Error") ||
        error.message.includes("timeout")) {
      
      // Check if we should retry
      if (requestId && retryCount.has(requestId)) {
        const currentRetryCount = retryCount.get(requestId);
        
        if (currentRetryCount < MAX_RETRIES) {
          // Increment retry count
          retryCount.set(requestId, currentRetryCount + 1);
          
          // Exponential backoff delay
          const delayTime = Math.pow(2, currentRetryCount) * 1000;
          console.log(`Retrying request (${currentRetryCount + 1}/${MAX_RETRIES}) after ${delayTime}ms delay...`);
          
          await delay(delayTime);
          
          // Force a health check before retrying
          await checkAPIHealth(true);
          
          // Retry the request
          return axiosInstance(error.config);
        }
      }
      
      // Clean up retry count if we're not retrying
      if (requestId) {
        retryCount.delete(requestId);
      }
      
      // Provide a user-friendly error message
      const customError = new Error(
        error.code === "ERR_NAME_NOT_RESOLVED" 
          ? "Unable to connect to the server. Please check your internet connection or try again later."
          : "Network error. Please check your connection and try again."
      );
      
      // Preserve the original error properties
      customError.name = "NetworkError";
      customError.code = error.code;
      customError.config = error.config;
      customError.request = error.request;
      
      return Promise.reject(customError);
    }
    
    // Handle other types of errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        // Token might be expired, could implement token refresh here
        console.log("Authentication error - token may be expired");
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error("Server error:", error.response.data);
        error.message = "Server error. Please try again later.";
      }
    }
    
    // Clean up retry count
    if (requestId) {
      retryCount.delete(requestId);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;