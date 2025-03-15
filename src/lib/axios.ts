import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_URL, getApiUrl, setApiUrl, getAllApiEndpoints } from '@/constants/URI';

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
    
    // If this was a successful request, save the working API URL
    if (response.config.baseURL) {
      setApiUrl(response.config.baseURL);
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

// Create a function to try multiple endpoints for a request
export async function tryMultipleEndpoints<T>(
  requestFn: (instance: AxiosInstance) => Promise<T>,
  endpoints = getAllApiEndpoints()
): Promise<T> {
  let lastError: any = null;
  let attemptCount = 0;
  const maxAttempts = endpoints.length * 2; // Allow multiple attempts per endpoint
  
  // Shuffle endpoints to avoid always trying them in the same order
  // This helps distribute load and find working endpoints faster
  const shuffledEndpoints = [...endpoints].sort(() => Math.random() - 0.5);
  
  // Add the current working endpoint to the beginning if available
  const currentWorkingEndpoint = getApiUrl();
  if (currentWorkingEndpoint && shuffledEndpoints.includes(currentWorkingEndpoint)) {
    // Remove it from its current position
    const index = shuffledEndpoints.indexOf(currentWorkingEndpoint);
    shuffledEndpoints.splice(index, 1);
    // Add it to the beginning
    shuffledEndpoints.unshift(currentWorkingEndpoint);
  }
  
  console.log("Trying endpoints in order:", shuffledEndpoints);
  
  // Try each endpoint in sequence
  while (attemptCount < maxAttempts) {
    // Get the next endpoint to try (cycling through the list)
    const endpoint = shuffledEndpoints[attemptCount % shuffledEndpoints.length];
    attemptCount++;
    
    try {
      // Create a fresh axios instance for this attempt
      const instance = axios.create({
        baseURL: endpoint,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000, // Shorter timeout for endpoint testing
      });
      
      // Copy auth headers from main instance if available
      const user = localStorage.getItem('user');
      const admin = localStorage.getItem('adminUser');
      
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.accessToken) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${userData.accessToken}`;
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      } else if (admin) {
        try {
          const adminData = JSON.parse(admin);
          if (adminData.accessToken) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${adminData.accessToken}`;
          }
        } catch (e) {
          console.error("Error parsing admin data:", e);
        }
      }
      
      // Try the request with this endpoint
      console.log(`Attempt ${attemptCount}/${maxAttempts}: Trying endpoint: ${endpoint}`);
      const result = await requestFn(instance);
      
      // If successful, save this endpoint as the working one
      setApiUrl(endpoint);
      console.log(`Successfully connected to: ${endpoint}`);
      
      return result;
    } catch (error: any) {
      console.error(`Failed to connect to ${endpoint}:`, error);
      
      // If this is a 401/403 error, don't retry with other endpoints as it's likely an auth issue
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log("Authentication error, not trying other endpoints");
        throw error;
      }
      
      // If this is a 404 Not Found for a specific resource, don't retry with other endpoints
      if (error?.response?.status === 404 && !error.message?.includes("Network Error")) {
        console.log("Resource not found, not trying other endpoints");
        throw error;
      }
      
      lastError = error;
      // Continue to the next endpoint
      
      // Add a small delay between attempts to avoid overwhelming the network
      await delay(300);
    }
  }
  
  // If we get here, all endpoints failed
  console.error("All endpoints failed after", attemptCount, "attempts");
  throw lastError || new Error("Failed to connect to any API endpoint");
}

export default axiosInstance;