import apiService from './api.service';
import {ENDPOINTS} from '../config/api';

const notificationService = {
  // Get notifications for a worker
  getNotifications: async workerId => {
    try {
      const response = await apiService.get(ENDPOINTS.NOTIFICATIONS(workerId));
      return {
        success: true,
        data: response.data.notifications || [],
      };
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch notifications',
        data: [],
      };
    }
  },

  // Mark notification as read
  markAsRead: async (workerId, notificationId) => {
    try {
      const response = await apiService.put(
        ENDPOINTS.MARK_NOTIFICATION_READ(workerId, notificationId),
      );
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('❌ Mark notification read error:', error);
      return {
        success: false,
        message: error.message || 'Failed to mark notification as read',
      };
    }
  },
};

export default notificationService;
