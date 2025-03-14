import axios, { AxiosError } from 'axios';
import { API_URL, getApiUrl, setApiUrl } from '@/constants/URI';

// Define a custom error interface that includes the 'code' property
interface NetworkError extends Error {
  code?: string;
  config?: any;
  request?: any;
  response?: any;
  userFriendlyMessage?: string;
}

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: getApiUrl(),
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
    
    // Always use the most up-to-date API URL
    config.baseURL = getApiUrl();
    
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
  async (error: AxiosError & NetworkError) => {
    // Get the request ID from the config
    const requestId = error.config?.headers?.["X-Request-ID"];
    
    // Handle network errors and retry logic
    if (error.code === "ERR_NETWORK" || 
        error.code === "ECONNABORTED" || 
        error.code === "ERR_NAME_NOT_RESOLVED" ||
        error.message.includes("Network Error") ||
        error.message.includes("timeout")) {
      
      // Check if we should retry
      if (requestId && retryCount.has(requestId) && error.config) {
        const currentRetryCount = retryCount.get(requestId);
        
        if (currentRetryCount < MAX_RETRIES) {
          // Increment retry count
          retryCount.set(requestId, currentRetryCount + 1);
          
          // Exponential backoff delay
          const delayTime = Math.pow(2, currentRetryCount) * 1000;
          
          await delay(delayTime);
          
          // Retry the request
          return axiosInstance(error.config);
        }
      }
      
      // Clean up retry count if we're not retrying
      if (requestId) {
        retryCount.delete(requestId);
      }
      
      // Provide a user-friendly error message
      let userFriendlyMessage = "";
      
      if (error.code === "ERR_NAME_NOT_RESOLVED") {
        userFriendlyMessage = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.code === "ERR_NETWORK") {
        userFriendlyMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        userFriendlyMessage = "The server is taking too long to respond. Please try again later.";
      } else {
        userFriendlyMessage = "Network error. Please check your connection and try again.";
      }
      
      const customError = new Error(userFriendlyMessage) as NetworkError;
      
      // Preserve the original error properties
      customError.name = "NetworkError";
      customError.code = error.code;
      customError.config = error.config;
      customError.request = error.request;
      customError.userFriendlyMessage = userFriendlyMessage;
      
      return Promise.reject(customError);
    }
    
    // Handle other types of errors
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        error.userFriendlyMessage = "Your session has expired. Please log in again.";
      }
      
      // Handle server errors
      if (status >= 500) {
        error.userFriendlyMessage = "Server error. Please try again later.";
      }
      
      // Handle 404 errors
      if (status === 404) {
        error.userFriendlyMessage = "The requested resource was not found. Please check the URL and try again.";
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