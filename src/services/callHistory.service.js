import AsyncStorage from '@react-native-async-storage/async-storage';

const CALL_HISTORY_KEY = '@call_history';

const callHistoryService = {
  // Get all call history
  getCallHistory: async () => {
    try {
      const historyJson = await AsyncStorage.getItem(CALL_HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        // Sort by date (newest first)
        return history.sort((a, b) => new Date(b.calledAt) - new Date(a.calledAt));
      }
      return [];
    } catch (error) {
      console.error('❌ Get call history error:', error);
      return [];
    }
  },

  // Add call to history
  addCallHistory: async (worker) => {
    try {
      if (!worker || !worker.id) {
        console.error('❌ Invalid worker data for call history');
        return {success: false, message: 'Invalid worker data'};
      }

      const history = await callHistoryService.getCallHistory();
      
      const callRecord = {
        id: `call_${Date.now()}`,
        workerId: worker.id || worker._id,
        workerName: worker.name || 'Unknown Worker',
        workerCategory: worker.category || 'Worker',
        workerPhone: worker.mobile || worker.phone || 'N/A',
        workerPhoto: worker.profilePhoto || null,
        workerCity: worker.city || '',
        workerRating: worker.rating || 0,
        verified: worker.verified || false,
        calledAt: new Date().toISOString(),
        callDuration: null, // Can be updated later
      };

      history.unshift(callRecord); // Add to beginning
      
      await AsyncStorage.setItem(CALL_HISTORY_KEY, JSON.stringify(history));
      console.log('✅ Call history added:', callRecord.workerName);
      
      return {
        success: true,
        message: 'Call history saved',
        data: history,
      };
    } catch (error) {
      console.error('❌ Add call history error:', error);
      return {
        success: false,
        message: 'Failed to save call history',
      };
    }
  },

  // Delete call history entry
  deleteCallHistory: async (callId) => {
    try {
      const history = await callHistoryService.getCallHistory();
      const updatedHistory = history.filter(call => call.id !== callId);
      
      await AsyncStorage.setItem(CALL_HISTORY_KEY, JSON.stringify(updatedHistory));
      
      return {
        success: true,
        message: 'Call history deleted',
        data: updatedHistory,
      };
    } catch (error) {
      console.error('❌ Delete call history error:', error);
      return {
        success: false,
        message: 'Failed to delete call history',
      };
    }
  },

  // Clear all call history
  clearCallHistory: async () => {
    try {
      await AsyncStorage.removeItem(CALL_HISTORY_KEY);
      return {
        success: true,
        message: 'All call history cleared',
      };
    } catch (error) {
      console.error('❌ Clear call history error:', error);
      return {
        success: false,
        message: 'Failed to clear call history',
      };
    }
  },
};

export default callHistoryService;
