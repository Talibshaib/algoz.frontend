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
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://algoz-backend-68rt.onrender.com/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Track retry attempts for each request
const retryCount = new Map();
const MAX_RETRIES = 2;

// Flag to prevent multiple simultaneous token refreshes
let isRefreshing = false;
// Queue of callbacks to be executed after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add callback to the queue
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to execute all callbacks with new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Function to refresh the token
const refreshToken = async (): Promise<string | null> => {
  try {
    // Check for user token
    let refreshToken = null;
    let isAdmin = false;
    
    if (typeof window !== 'undefined') {
      // Try user refresh token first
      const user = sessionStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.refreshToken) {
            refreshToken = userData.refreshToken;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      // If no user refresh token, try admin refresh token
      if (!refreshToken) {
        const admin = sessionStorage.getItem('adminUser');
        if (admin) {
          try {
            const adminData = JSON.parse(admin);
            if (adminData.refreshToken) {
              refreshToken = adminData.refreshToken;
              isAdmin = true;
            }
          } catch (error) {
            console.error("Error parsing admin data:", error);
          }
        }
      }
    }
    
    if (!refreshToken) {
      return null;
    }
    
    // Make refresh token request
    const endpoint = isAdmin ? '/admin/refresh-token' : '/users/refresh-token';
    const response = await axios.post(`${getApiUrl()}${endpoint}`, { refreshToken });
    
    if (response.status === 200 && response.data.data && response.data.data.accessToken) {
      const newToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken || refreshToken;
      
      // Update token in storage
      if (typeof window !== 'undefined') {
        if (isAdmin) {
          const admin = sessionStorage.getItem('adminUser');
          if (admin) {
            try {
              const adminData = JSON.parse(admin);
              adminData.accessToken = newToken;
              adminData.refreshToken = newRefreshToken;
              adminData.loginTimestamp = Date.now();
              adminData.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
              sessionStorage.setItem('adminUser', JSON.stringify(adminData));
            } catch (error) {
              console.error("Error updating admin token:", error);
            }
          }
        } else {
          const user = sessionStorage.getItem('user');
          if (user) {
            try {
              const userData = JSON.parse(user);
              userData.accessToken = newToken;
              userData.refreshToken = newRefreshToken;
              userData.loginTimestamp = Date.now();
              userData.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
              sessionStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
              console.error("Error updating user token:", error);
            }
          }
        }
      }
      
      return newToken;
    }
    
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

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
    
    // Get tokens from sessionStorage
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Check for user token
      const user = sessionStorage.getItem('user');
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
        const admin = sessionStorage.getItem('adminUser');
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
    
    // If this response is from a working endpoint, store it
    if (typeof window !== 'undefined' && response.config.baseURL) {
      sessionStorage.setItem('workingApiEndpoint', response.config.baseURL);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestId = originalRequest?.headers?.["X-Request-ID"];
    
    // Handle token expiration (401 errors)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent multiple simultaneous token refreshes
      if (!isRefreshing) {
        isRefreshing = true;
        
        const newToken = await refreshToken();
        
        isRefreshing = false;
        
        if (newToken) {
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest._retry = true;
          
          // Notify all waiting requests that token has been refreshed
          onTokenRefreshed(newToken);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // If refresh failed, clear auth data
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('adminUser');
          }
          
          // Redirect to login page if in browser
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        // If another request is already refreshing the token, wait for it
        return new Promise(resolve => {
          subscribeTokenRefresh(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
    
    // Handle retry logic for network errors and 5xx server errors
    if (
      (error.code === 'ECONNABORTED' || 
       error.code === 'ERR_NETWORK' || 
       error.response?.status >= 500) && 
      requestId
    ) {
      const currentRetryCount = retryCount.get(requestId) || 0;
      
      if (currentRetryCount < MAX_RETRIES) {
        retryCount.set(requestId, currentRetryCount + 1);
        
        // Exponential backoff
        const delay = Math.pow(2, currentRetryCount) * 1000;
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return axiosInstance(originalRequest);
      }
      
      // Clean up retry count if we're not retrying anymore
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