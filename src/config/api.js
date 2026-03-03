// API Configuration
const API_CONFIG = {
  // Production URL (Render) - ALWAYS USE THIS
  PRODUCTION: 'https://passo-backend.onrender.com',
  
  // OpenCage Geocoding API
  OPENCAGE: {
    API_KEY: 'pk.eyJ1IjoicGFhc28iLCJhIjoiY2x0ZGVmZ2h5MGFhZDJqcGxqZGVmZ2h5In0.abcdefghijklmnopqrstuvwxyz', // Mapbox token as fallback
    BASE_URL: 'https://api.opencagedata.com/geocode/v1',
  },
};

// Check if OpenCage API key is configured
export const isApiKeyConfigured = () => {
  return API_CONFIG.OPENCAGE && 
         API_CONFIG.OPENCAGE.API_KEY && 
         API_CONFIG.OPENCAGE.API_KEY !== 'YOUR_OPENCAGE_API_KEY_HERE';
};

// PRODUCTION ONLY - Using Render backend
export const BASE_URL = API_CONFIG.PRODUCTION;
export const API_URL = `${BASE_URL}/api`;

console.log('🚀 API Configuration: Using Production Backend');
console.log('📡 Backend URL:', BASE_URL);

// API Endpoints
export const ENDPOINTS = {
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,
  
  // Workers
  WORKERS: '/workers/public',
  WORKER_BY_ID: (id) => `/workers/${id}`,
  SEND_OTP: '/workers/send-otp',
  VERIFY_OTP: '/workers/verify-otp',
  CHECK_MOBILE: '/workers/check-mobile',
  
  // Notifications
  NOTIFICATIONS: (workerId) => `/workers/${workerId}/notifications`,
  MARK_NOTIFICATION_READ: (workerId, notificationId) => 
    `/workers/${workerId}/notifications/${notificationId}/read`,
  
  // CMS
  CMS_CONTENT: '/cms',
  
  // Reviews
  REVIEWS: '/reviews',
  WORKER_REVIEWS: (workerId) => `/reviews/worker/${workerId}`,
};

// Request timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Export API_CONFIG for location services
export {API_CONFIG};

export default {
  BASE_URL,
  API_URL,
  ENDPOINTS,
  REQUEST_TIMEOUT,
  API_CONFIG,
};
