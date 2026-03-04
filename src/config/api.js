// API Configuration
const API_CONFIG = {
  // Production URL (Render)
  PRODUCTION: 'https://passo-backend.onrender.com',
  
  // Development URLs (for local testing if needed)
  LOCAL: 'http://localhost:5000',
  EMULATOR: 'http://10.0.2.2:5000', // Android Emulator
};

// Always use production URL (Render)
export const BASE_URL = API_CONFIG.PRODUCTION;
export const API_URL = `${BASE_URL}/api`;

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

export default {
  BASE_URL,
  API_URL,
  ENDPOINTS,
  REQUEST_TIMEOUT,
};
