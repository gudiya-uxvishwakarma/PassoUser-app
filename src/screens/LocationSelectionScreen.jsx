import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {colors, spacing, borderRadius} from '../theme';
import {
  reverseGeocode,
  searchLocation,
  searchByPincode,
} from '../services/locationService';

const popularCities = [
  {id: '1', name: 'Bangalore', state: 'Karnataka', pincode: '560001'},
  {id: '2', name: 'Mumbai', state: 'Maharashtra', pincode: '400001'},
  {id: '3', name: 'Delhi', state: 'Delhi', pincode: '110001'},
  {id: '4', name: 'Hyderabad', state: 'Telangana', pincode: '500001'},
  {id: '5', name: 'Chennai', state: 'Tamil Nadu', pincode: '600001'},
  {id: '6', name: 'Pune', state: 'Maharashtra', pincode: '411001'},
  {id: '7', name: 'Kolkata', state: 'West Bengal', pincode: '700001'},
  {id: '8', name: 'Ahmedabad', state: 'Gujarat', pincode: '380001'},
];

export const LocationSelectionScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Bangalore, Karnataka');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const filteredCities = searchQuery.length === 0 
    ? popularCities 
    : popularCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.pincode.includes(searchQuery)
      );

  // Search API when user types
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const delaySearch = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Search location using API
  const handleSearch = async (query) => {
    setIsSearching(true);
    
    // Check if query is pincode (6 digits)
    const isPincode = /^\d{6}$/.test(query);
    
    try {
      let result;
      if (isPincode) {
        result = await searchByPincode(query);
        if (result.success) {
          setSearchResults([{
            id: 'pincode-1',
            name: result.city,
            state: result.state,
            pincode: result.postcode,
            displayName: result.displayName,
          }]);
        }
      } else {
        result = await searchLocation(query);
        if (result.success && result.results.length > 0) {
          setSearchResults(result.results.map((item, index) => ({
            id: `search-${index}`,
            name: item.city,
            state: item.state,
            pincode: item.postcode,
            displayName: item.displayName,
          })));
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (city) => {
    const location = city.pincode 
      ? `${city.name}, ${city.state} - ${city.pincode}`
      : `${city.name}, ${city.state}`;
    setSelectedLocation(location);
    
    // Save to global state or AsyncStorage here if needed
    global.selectedLocation = {
      city: city.name,
      state: city.state,
      pincode: city.pincode,
      formatted: location,
    };
    
    Alert.alert(
      'Location Updated',
      `Your location has been set to ${location}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required');
      setIsLoadingLocation(false);
      return;
    }

    // First try with high accuracy
    const tryGetLocation = (useHighAccuracy, timeoutDuration) => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          {
            enableHighAccuracy: useHighAccuracy,
            timeout: timeoutDuration,
            maximumAge: 10000,
          }
        );
      });
    };

    try {
      let position;
      
      // Try high accuracy first (GPS)
      try {
        console.log('Trying high accuracy GPS...');
        position = await tryGetLocation(true, 15000);
      } catch (error) {
        console.log('High accuracy failed, trying network location...');
        // Fallback to network location (faster but less accurate)
        try {
          position = await tryGetLocation(false, 10000);
        } catch (networkError) {
          throw networkError;
        }
      }

      const {latitude, longitude} = position.coords;
      console.log('Location obtained:', {latitude, longitude});
      
      try {
        const result = await reverseGeocode(latitude, longitude);
        
        if (result.success) {
          const location = result.postcode
            ? `${result.city}, ${result.state} - ${result.postcode}`
            : `${result.city}, ${result.state}`;
          
          setSelectedLocation(location);
          
          // Save to global state
          global.selectedLocation = {
            city: result.city,
            state: result.state,
            pincode: result.postcode,
            formatted: location,
            fullAddress: result.formatted,
          };
          
          Alert.alert(
            'Location Detected',
            `Your location: ${location}`,
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } else {
          Alert.alert('Error', 'Could not fetch location details. Please select manually.');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        Alert.alert('Error', 'Failed to get location details. Please select manually.');
      }
    } catch (error) {
      console.error('Location error:', error);
      let errorMessage = '';
      let errorTitle = 'Location Error';
      
      switch (error.code) {
        case 1:
          errorTitle = 'Permission Denied';
          errorMessage = 'Please allow location access in your device settings.';
          break;
        case 2:
          errorTitle = 'Location Unavailable';
          errorMessage = 'Please enable GPS/Location services in your device settings and try again.';
          break;
        case 3:
          errorTitle = 'Location Timeout';
          errorMessage = 'Could not detect location. Please:\n\n1. Enable GPS/Location services\n2. Go to an open area\n3. Try again or select location manually';
          break;
        default:
          errorMessage = 'Could not detect location. Please select manually from the list below.';
      }
      
      Alert.alert(errorTitle, errorMessage, [
        {text: 'OK', style: 'cancel'}
      ]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocation}
        disabled={isLoadingLocation}>
        <View style={styles.currentLocationIcon}>
          {isLoadingLocation ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon name="locate" size={24} color={colors.primary} />
          )}
        </View>
        <View style={styles.currentLocationText}>
          <Text style={styles.currentLocationTitle}>
            {isLoadingLocation ? 'Detecting Location...' : 'Use Current Location'}
          </Text>
          <Text style={styles.currentLocationSubtitle}>
            Enable GPS to detect your location
          </Text>
        </View>
        <Icon name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search city, area or pincode..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="default"
        />
        {isSearching && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
        {searchQuery.length > 0 && !isSearching && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={styles.cityItem}
                onPress={() => handleLocationSelect(city)}>
                <View style={styles.cityIconContainer}>
                  <Icon name="location" size={24} color={colors.primary} />
                </View>
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>{city.name}</Text>
                  <Text style={styles.stateName}>
                    {city.state} {city.pincode ? `- ${city.pincode}` : ''}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={24} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </>
        )}
        
        <Text style={styles.sectionTitle}>
          {searchResults.length > 0 ? 'Popular Cities' : 'Popular Cities'}
        </Text>
        
        {filteredCities.map((city) => (
          <TouchableOpacity
            key={city.id}
            style={styles.cityItem}
            onPress={() => handleLocationSelect(city)}>
            <View style={styles.cityIconContainer}>
              <Icon name="location" size={24} color={colors.primary} />
            </View>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.stateName}>
                {city.state} {city.pincode ? `- ${city.pincode}` : ''}
              </Text>
            </View>
            {selectedLocation.includes(city.name) && (
              <Icon name="checkmark-circle" size={24} color={colors.success} />
            )}
          </TouchableOpacity>
        ))}

        {filteredCities.length === 0 && searchResults.length === 0 && searchQuery.length > 0 && !isSearching && (
          <View style={styles.noResults}>
            <Icon name="search-outline" size={48} color={colors.textLight} />
            <Text style={styles.noResultsText}>No locations found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching with city name or 6-digit pincode
            </Text>
          </View>
        )}

        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#2b2c6c',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonIcon: {
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  currentLocationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  currentLocationText: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  currentLocationSubtitle: {
    fontSize: 12,
    color: colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cityIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  stateName: {
    fontSize: 13,
    color: colors.textLight,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
  },
  noResultsSubtext: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});
