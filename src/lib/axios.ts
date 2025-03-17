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

export default instance;