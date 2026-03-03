import axios from 'axios';
import {API_URL, REQUEST_TIMEOUT} from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error
      const {status, data} = error.response;
      
      if (status === 401) {
        // Unauthorized - handle token expiry
        console.log('🔒 Unauthorized - Token expired');
      } else if (status === 404) {
        console.log('🔍 Resource not found');
      } else if (status >= 500) {
        console.log('🔥 Server error');
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      console.log('📡 No response from server');
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        success: false,
        message: error.message || 'An error occurred',
      });
    }
  },
);

// API Service methods
const apiService = {
  // Generic methods
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  
  // Set auth token
  setAuthToken: token => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Auth token set');
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      console.log('🔓 Auth token removed');
    }
  },
};

export default apiService;
