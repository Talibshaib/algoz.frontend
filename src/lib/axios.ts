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

// Create axios instance with base URL and default headers
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://algoz-backend-68rt.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials to handle CORS properly
  withCredentials: true,
  // Increase timeout for better reliability
  timeout: 15000,
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

// Add request interceptor to add auth token
instance.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is set
    config.withCredentials = true;
    
    // Get token from sessionStorage
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Try to get user token first
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
      
      // If no user token, try admin token
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
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error detected:', error);
      
      // If we're not already refreshing, try to use a different endpoint
      if (!isRefreshing) {
        try {
          // Get all endpoints
          const endpoints = getAllApiEndpoints();
          // Get current endpoint
          const currentEndpoint = getApiUrl();
          // Find the next endpoint to try
          const currentIndex = endpoints.indexOf(currentEndpoint);
          const nextIndex = (currentIndex + 1) % endpoints.length;
          const nextEndpoint = endpoints[nextIndex];
          
          // Set the new endpoint
          setApiUrl(nextEndpoint);
          console.log(`Switching to endpoint: ${nextEndpoint} due to network error`);
          
          // If this is a request that can be retried, retry with the new endpoint
          if (error.config) {
            error.config.baseURL = nextEndpoint;
            return axios(error.config);
          }
        } catch (retryError) {
          console.error('Error while trying to switch endpoints:', retryError);
        }
      }
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Try to refresh the token if possible
      if (!isRefreshing) {
        try {
          const newToken = await refreshToken();
          if (newToken && error.config) {
            // Retry the request with the new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
      
      // If token refresh failed or we're already refreshing, redirect to login
      if (typeof window !== 'undefined') {
        // Clear user data
        sessionStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
      }
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

export default instance;