import axios from 'axios';
import supabase from './supabase';
import { AUTH_ROUTES } from '@/constants/routes';

// Create axios instance with default headers
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://algoz-backend-68rt.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable sending cookies with requests
});

// Routes that don't require authentication
const publicRoutes = [
  '/api/auth/login', 
  '/api/auth/register', 
  '/api/auth/logout', 
  '/health', 
  '/ping',
  '/api/v1/auth/login',
  '/api/v1/auth/register'
];

// Flag to prevent multiple concurrent token refreshes
let isRefreshing = false;
// Store for queued requests that should be retried after token refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}[] = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers.Authorization = `Bearer ${token}`;
      promise.resolve(instance(promise.config));
    }
  });
  
  failedQueue = [];
};

// Add request interceptor for authentication
instance.interceptors.request.use(
  async (config) => {
    try {
      // Log requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      // Skip authentication for public routes
      const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
      if (isPublicRoute) {
        return config;
      }
      
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      // If session exists, use its access token
      if (session && session.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and token refresh
instance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error responses in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Response Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Handle authentication errors (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent the original request from being retried more than once
      originalRequest._retry = true;
      
      // If token refresh is already in progress, queue this request
      if (isRefreshing) {
        try {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        } catch (err) {
          return Promise.reject(err);
        }
      }
      
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          // If token refresh fails, clear the queue with an error
          processQueue(refreshError, null);
          throw refreshError;
        }
        
        if (data.session) {
          // Update the request header with the new token
          originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
          
          // Process all the requests in the queue with the new token
          processQueue(null, data.session.access_token);
          
          // Retry the original request with the new token
          return instance(originalRequest);
        } else {
          // If no session, clear the queue and redirect to login
          processQueue(new Error('Failed to refresh authentication token'), null);
          
          // Check if we're in a browser environment
          if (typeof window !== 'undefined') {
            window.location.href = AUTH_ROUTES.LOGIN;
          }
          
          throw new Error('Session expired. Please log in again.');
        }
      } catch (refreshError) {
        // Handle token refresh errors
        console.error('Failed to refresh token:', refreshError);
        
        // Redirect to login in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = AUTH_ROUTES.LOGIN;
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error or server not responding:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;