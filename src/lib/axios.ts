import axios from 'axios';
import { getApiUrl } from '@/constants/URI';

// Create axios instance with default headers
const instance = axios.create({
  baseURL: 'https://algoz-backend-68rt.onrender.com', // Direct backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor for debugging and error handling
instance.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Response: ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log error responses in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Response Error:', error.response?.status, error.response?.data || error.message);
    }
    
    // Handle rate limiting (429 Too Many Requests)
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
      // You could implement a retry with exponential backoff here
    }
    
    // Handle network errors
    if (error.response?.status === 0 || error.code === 'ECONNABORTED') {
      console.error('Network error or server not responding');
    }
    
    return Promise.reject(error);
  }
);

export default instance;