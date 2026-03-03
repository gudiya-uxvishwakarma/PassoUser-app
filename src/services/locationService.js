import {API_CONFIG, isApiKeyConfigured} from '../config/api';

// Nominatim (OpenStreetMap) - Free geocoding service, no API key required
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Get current location using device GPS coordinates with Nominatim (OpenStreetMap)
 * Free service, no API key required
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Location details with address
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Use Nominatim (OpenStreetMap) - Free, no API key required
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    
    console.log('Nominatim API Request:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PaasoApp/1.0', // Required by Nominatim
      },
    });
    
    const data = await response.json();
    
    console.log('Nominatim API Response:', data);
    
    if (!data || data.error) {
      throw new Error(data.error || 'No results found');
    }

    const address = data.address || {};

    return {
      success: true,
      address: data.display_name,
      city: address.city || address.town || address.village || address.county || address.state_district,
      state: address.state,
      country: address.country,
      postcode: address.postcode,
      formatted: data.display_name,
      raw: data,
    };
  } catch (error) {
    console.error('Nominatim Reverse geocode error:', error);
    // Fallback to basic location
    return {
      success: true,
      address: `Location detected`,
      city: 'Your City',
      state: 'Your State',
      country: 'India',
      postcode: '',
      formatted: `Your Location`,
      warning: 'Could not fetch detailed address',
    };
  }
};

/**
 * Search location by query (city, pincode, address) using Nominatim
 * @param {string} query 
 * @returns {Promise<Array>} Array of location results
 */
export const searchLocation = async (query) => {
  try {
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=10&addressdetails=1`;
    
    console.log('Nominatim Search Request:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PaasoApp/1.0',
      },
    });
    
    const data = await response.json();
    
    console.log('Nominatim Search Response:', data);

    if (!data || data.length === 0) {
      return {
        success: true,
        results: [],
      };
    }

    return {
      success: true,
      results: data.map(item => {
        const address = item.address || {};
        return {
          displayName: item.display_name,
          city: address.city || address.town || address.village || address.county,
          state: address.state,
          postcode: address.postcode,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          formatted: item.display_name,
          raw: item,
        };
      }),
    };
  } catch (error) {
    console.error('Nominatim Search location error:', error);
    return {
      success: false,
      error: error.message || 'Failed to search location',
      results: [],
    };
  }
};

/**
 * Search by pincode using Nominatim
 * @param {string} pincode 
 * @returns {Promise<Object>} Location details
 */
export const searchByPincode = async (pincode) => {
  try {
    const url = `${NOMINATIM_BASE_URL}/search?format=json&postalcode=${pincode}&countrycodes=in&limit=1&addressdetails=1`;
    
    console.log('Nominatim Pincode Search Request:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PaasoApp/1.0',
      },
    });
    
    const data = await response.json();
    
    console.log('Nominatim Pincode Response:', data);

    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Pincode not found',
      };
    }

    const location = data[0];
    const address = location.address || {};
    
    return {
      success: true,
      city: address.city || address.town || address.village || address.county,
      state: address.state,
      postcode: address.postcode || pincode,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      formatted: location.display_name,
      displayName: location.display_name,
      raw: location,
    };
  } catch (error) {
    console.error('Nominatim Pincode search error:', error);
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
