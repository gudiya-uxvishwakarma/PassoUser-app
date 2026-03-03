import apiService from './api.service';
import {ENDPOINTS} from '../config/api';

const workerService = {
  // Get all workers (public)
  getAllWorkers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.workerType) params.append('workerType', filters.workerType);
      if (filters.verified !== undefined) params.append('verified', filters.verified);
      if (filters.featured !== undefined) params.append('featured', filters.featured);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const url = queryString ? `${ENDPOINTS.WORKERS}?${queryString}` : ENDPOINTS.WORKERS;
      
      const response = await apiService.get(url);
      return {
        success: true,
        data: response.data.data || [], // Backend returns {data: workers}
        pagination: response.data.pagination || {},
      };
    } catch (error) {
      console.error('❌ Get workers error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch workers',
        data: [],
      };
    }
  },

  // Get worker by ID
  getWorkerById: async workerId => {
    try {
      const response = await apiService.get(ENDPOINTS.WORKER_BY_ID(workerId));
      return {
        success: true,
        data: response.data.data, // Backend returns {data: worker}
      };
    } catch (error) {
      console.error('❌ Get worker error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch worker details',
        data: null,
      };
    }
  },

  // Send OTP
  sendOTP: async mobile => {
    try {
      const response = await apiService.post(ENDPOINTS.SEND_OTP, {mobile});
      return {
        success: true,
        message: response.data.message,
        otp: response.data.otp, // For display on screen
        expiresIn: response.data.expiresIn,
      };
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP',
      };
    }
  },

  // Verify OTP
  verifyOTP: async (mobile, otp, fcmToken = null) => {
    try {
      const payload = {mobile, otp};
      if (fcmToken) {
        payload.fcmToken = fcmToken;
        payload.platform = 'android'; // or 'ios'
      }
      
      const response = await apiService.post(ENDPOINTS.VERIFY_OTP, payload);
      
      // Set auth token if provided
      if (response.data.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return {
        success: true,
        message: response.data.message,
        exists: response.data.exists,
        worker: response.data.worker,
        token: response.data.token,
      };
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP',
      };
    }
  },

  // Check if mobile exists
  checkMobile: async mobile => {
    try {
      const response = await apiService.post(ENDPOINTS.CHECK_MOBILE, {mobile});
      return {
        success: true,
        exists: response.data.exists,
        worker: response.data.worker,
      };
    } catch (error) {
      console.error('❌ Check mobile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to check mobile',
        exists: false,
      };
    }
  },

  // Search workers by category and location
  searchWorkers: async (category, city, filters = {}) => {
    try {
      return await workerService.getAllWorkers({
        category,
        city,
        ...filters,
      });
    } catch (error) {
      console.error('❌ Search workers error:', error);
      return {
        success: false,
        message: error.message || 'Failed to search workers',
        data: [],
      };
    }
  },
};

export default workerService;
