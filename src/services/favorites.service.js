import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites_workers';

const favoritesService = {
  // Get all favorite workers
  getFavorites: async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        const favorites = JSON.parse(favoritesJson);
        // Filter out any invalid entries
        const validFavorites = favorites.filter(fav => fav && fav.id);
        console.log('📦 Loaded favorites:', validFavorites.length, 'valid out of', favorites.length);
        return validFavorites;
      }
      return [];
    } catch (error) {
      console.error('❌ Get favorites error:', error);
      return [];
    }
  },

  // Add worker to favorites
  addFavorite: async (worker) => {
    try {
      if (!worker || !worker.id) {
        console.error('❌ Invalid worker data:', worker);
        return {
          success: false,
          message: 'Invalid worker data',
        };
      }

      const favorites = await favoritesService.getFavorites();
      console.log('📋 Current favorites count:', favorites.length);
      
      // Check if already exists - if yes, just return success
      const existingIndex = favorites.findIndex(fav => fav.id === worker.id);
      if (existingIndex !== -1) {
        console.log('🔄 Updating existing favorite:', worker.name);
        // Update existing entry instead of adding duplicate
        favorites[existingIndex] = {
          id: worker.id,
          name: worker.name || 'Unknown',
          category: worker.category || 'Worker',
          rating: worker.rating || 0,
          reviews: worker.reviews || 0,
          city: worker.city || '',
          verified: worker.verified || false,
          featured: worker.featured || false,
          profilePhoto: worker.profilePhoto || null,
          mobile: worker.mobile || null,
          phone: worker.phone || null,
          unlocked: worker.unlocked || false,
          addedAt: favorites[existingIndex].addedAt, // Keep original date
        };
        
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        console.log('✅ Favorite updated. Total:', favorites.length);
        
        return {
          success: true,
          message: 'Favorites updated',
          data: favorites,
        };
      }

      // Add to favorites
      console.log('➕ Adding new favorite:', worker.name);
      const newFavorite = {
        id: worker.id,
        name: worker.name || 'Unknown',
        category: worker.category || 'Worker',
        rating: worker.rating || 0,
        reviews: worker.reviews || 0,
        city: worker.city || '',
        verified: worker.verified || false,
        featured: worker.featured || false,
        profilePhoto: worker.profilePhoto || null,
        mobile: worker.mobile || null,
        phone: worker.phone || null,
        unlocked: worker.unlocked || false,
        addedAt: new Date().toISOString(),
      };
      
      favorites.push(newFavorite);

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      console.log('✅ Favorite added. Total:', favorites.length);
      console.log('📦 New favorite data:', newFavorite);
      
      return {
        success: true,
        message: 'Added to favorites',
        data: favorites,
      };
    } catch (error) {
      console.error('❌ Add favorite error:', error);
      return {
        success: false,
        message: 'Failed to add to favorites',
      };
    }
  },

  // Remove worker from favorites
  removeFavorite: async (workerId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== workerId);
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      
      return {
        success: true,
        message: 'Removed from favorites',
        data: updatedFavorites,
      };
    } catch (error) {
      console.error('❌ Remove favorite error:', error);
      return {
        success: false,
        message: 'Failed to remove from favorites',
      };
    }
  },

  // Check if worker is in favorites
  isFavorite: async (workerId) => {
    try {
      const favorites = await favoritesService.getFavorites();
      return favorites.some(fav => fav.id === workerId);
    } catch (error) {
      console.error('❌ Check favorite error:', error);
      return false;
    }
  },

  // Clear all favorites
  clearFavorites: async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
      return {
        success: true,
        message: 'All favorites cleared',
      };
    } catch (error) {
      console.error('❌ Clear favorites error:', error);
      return {
        success: false,
        message: 'Failed to clear favorites',
      };
    }
  },
};

export default favoritesService;
