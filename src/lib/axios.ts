import axios from 'axios';
import { getApiUrl } from '@/constants/URI';

// Create axios instance with default headers
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to handle CORS
instance.interceptors.request.use(
  (config) => {
    // Add CORS headers to every request
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    
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
    return Promise.reject(error);
  }
);

export default instance;