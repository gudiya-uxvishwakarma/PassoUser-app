import {API_CONFIG, isApiKeyConfigured} from '../config/api';

// OpenCage Geocoding API Service
const OPENCAGE_API_KEY = API_CONFIG.OPENCAGE.API_KEY;
const OPENCAGE_BASE_URL = API_CONFIG.OPENCAGE.BASE_URL;

/**
 * Get current location using device GPS coordinates with OpenCage API
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Location details with address
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Check if API key is configured
    if (!isApiKeyConfigured()) {
      throw new Error('OpenCage API key not configured. Please add your API key in src/config/api.js');
    }

    const url = `${OPENCAGE_BASE_URL}/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&language=en&pretty=1`;
    
    console.log('OpenCage API Request:', url.replace(OPENCAGE_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    console.log('OpenCage API Response Status:', data.status);
    
    if (data.status && data.status.code !== 200) {
      throw new Error(data.status.message || 'API Error');
    }

    if (!data.results || data.results.length === 0) {
      throw new Error('No results found');
    }

    const result = data.results[0];
    const components = result.components;

    return {
      success: true,
      address: result.formatted,
      city: components.city || components.town || components.village || components.county,
      state: components.state || components.state_district,
      country: components.country,
      postcode: components.postcode,
      formatted: result.formatted,
      raw: result,
    };
  } catch (error) {
    console.error('OpenCage Reverse geocode error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch location',
    };
  }
};

/**
 * Search location by query (city, pincode, address) using OpenCage API
 * @param {string} query 
 * @returns {Promise<Array>} Array of location results
 */
export const searchLocation = async (query) => {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('OpenCage API key not configured');
    }

    const url = `${OPENCAGE_BASE_URL}/json?q=${encodeURIComponent(query)}&key=${OPENCAGE_API_KEY}&countrycode=in&limit=10&language=en&pretty=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.status && data.status.code !== 200) {
      throw new Error(data.status.message || 'API Error');
    }

    if (!data.results || data.results.length === 0) {
      return {
        success: true,
        results: [],
      };
    }

    return {
      success: true,
      results: data.results.map(item => ({
        displayName: item.formatted,
        city: item.components.city || item.components.town || item.components.village,
        state: item.components.state || item.components.state_district,
        postcode: item.components.postcode,
        latitude: item.geometry.lat,
        longitude: item.geometry.lng,
        formatted: item.formatted,
        raw: item,
      })),
    };
  } catch (error) {
    console.error('OpenCage Search location error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search location',
      results: [],
    };
  }
};

/**
 * Search by pincode using OpenCage API
 * @param {string} pincode 
 * @returns {Promise<Object>} Location details
 */
export const searchByPincode = async (pincode) => {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('OpenCage API key not configured');
    }

    const url = `${OPENCAGE_BASE_URL}/json?q=${pincode}&key=${OPENCAGE_API_KEY}&countrycode=in&limit=1&language=en&pretty=1`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.status && data.status.code !== 200) {
      throw new Error(data.status.message || 'API Error');
    }

    if (!data.results || data.results.length === 0) {
      throw new Error('Pincode not found');
    }

    const location = data.results[0];
    const components = location.components;
    
    return {
      success: true,
      city: components.city || components.town || components.village || components.county,
      state: components.state || components.state_district,
      postcode: components.postcode || pincode,
      latitude: location.geometry.lat,
      longitude: location.geometry.lng,
      formatted: location.formatted,
      displayName: location.formatted,
      raw: location,
    };
  } catch (error) {
    console.error('OpenCage Pincode search error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search pincode',
    };
  }
};

/**
 * Format address object into readable string
 * @param {Object} address 
 * @returns {string} Formatted address
 */
const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.house_number) parts.push(address.house_number);
  if (address.road) parts.push(address.road);
  if (address.suburb) parts.push(address.suburb);
  if (address.city || address.town || address.village) {
    parts.push(address.city || address.town || address.village);
  }
  if (address.state) parts.push(address.state);
  if (address.postcode) parts.push(address.postcode);
  
  return parts.join(', ');
};

/**
 * Get device current location using GPS
 * @returns {Promise<Object>} Current location coordinates
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    // For React Native, we need to use Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            success: true,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject({
            success: false,
            error: error.message,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      reject({
        success: false,
        error: 'Geolocation is not supported',
      });
    }
  });
};

/**
 * Get current location with full address
 * @returns {Promise<Object>} Current location with address
 */
export const getCurrentLocationWithAddress = async () => {
  try {
    const position = await getCurrentPosition();
    if (!position.success) {
      return position;
    }

    const address = await reverseGeocode(position.latitude, position.longitude);
    return {
      ...position,
      ...address,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get location',
    };
  }
};
