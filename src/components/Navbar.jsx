import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from '../theme';

export const Navbar = ({
  navigation,
  title = '',
  showBack = false,
  showLocationAndNotification = true,
  showSearchBar = true,
  showUserProfile = false,
  showBothProfileAndNotification = false,
  rightIcon = null,
  onSearchChange = null,
  searchValue = '',
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Bangalore, Karnataka');
  
  // Update location when screen comes into focus
  useEffect(() => {
    const updateLocation = () => {
      if (global.selectedLocation && global.selectedLocation.formatted) {
        setCurrentLocation(global.selectedLocation.formatted);
      }
    };
    
    // Update immediately
    updateLocation();
    
    // Listen for navigation focus events
    const unsubscribe = navigation?.addListener?.('focus', updateLocation);
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);
  
  const handleSearchChange = (text) => {
    setLocalSearchQuery(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const currentSearchValue = searchValue !== undefined ? searchValue : localSearchQuery;
  return (
    <>
      <StatusBar backgroundColor="#2a2d6c" barStyle="light-content" />
      <View style={styles.navbar}>
        <View style={styles.navbarTop}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <View style={styles.backIconCircle}>
                <Icon name="arrow-back" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) : showLocationAndNotification ? (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => navigation.navigate('LocationSelection')}>
              <View style={styles.locationIconCircle}>
                <Icon name="location" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) : null}

          <View style={styles.centerInfo}>
            {showLocationAndNotification ? (
              <>
                <Text style={styles.currentLocationLabel}>Current location</Text>
                <Text style={styles.locationName} numberOfLines={1}>
                  {currentLocation}
                </Text>
              </>
            ) : (
              <Text style={styles.pageTitle}>{title}</Text>
            )}
          </View>

          {rightIcon ? (
            <View style={styles.rightIconContainer}>{rightIcon}</View>
          ) : showBothProfileAndNotification ? (
            <View style={styles.rightButtonsContainer}>
              <TouchableOpacity
                style={styles.notificationButtonCompact}
                onPress={() => navigation.navigate('Notifications')}>
                <View style={styles.notificationIconCircleCompact}>
                  <Icon name="notifications" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.notificationBadgeCompact}>
                  <Text style={styles.badgeTextCompact}>5</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}>
                <View style={styles.profileImageContainer}>
                  <Icon name="person" size={24} color={colors.accent} />
                </View>
                <View style={styles.profileBadge}>
                  <View style={styles.onlineDot} />
                </View>
              </TouchableOpacity>
            </View>
          ) : showUserProfile ? (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}>
              <View style={styles.profileImageContainer}>
                <Icon name="person" size={24} color={colors.accent} />
              </View>
              <View style={styles.profileBadge}>
                <View style={styles.onlineDot} />
              </View>
            </TouchableOpacity>
          ) : showLocationAndNotification ? (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}>
              <View style={styles.notificationIconCircle}>
                <Icon name="notifications" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Search Bar in Navbar */}
        {showSearchBar && (
          <View style={styles.navbarSearchContainer}>
            <View style={styles.navbarSearchBar}>
              <Icon name="search" size={20} color={colors.textLight} />
              <TextInput
                style={styles.navbarSearchInput}
                placeholder="Search services..."
                value={currentSearchValue}
                onChangeText={handleSearchChange}
                placeholderTextColor={colors.textLight}
              />
              {currentSearchValue.length > 0 && (
                <TouchableOpacity onPress={() => handleSearchChange('')}>
                  <Icon name="close-circle" size={20} color={colors.textLight} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#2a2d6c',
    paddingTop: spacing.xl + 10,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navbarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  backIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    marginRight: spacing.sm,
  },
  locationIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 1,
  },
  currentLocationLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2d6c',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notificationButtonCompact: {
    position: 'relative',
  },
  notificationIconCircleCompact: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(135, 150, 220, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeCompact: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2d6c',
  },
  badgeTextCompact: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    position: 'relative',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  profileBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2d6c',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  navbarSearchContainer: {
    marginTop: spacing.xs,
  },
  navbarSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    height: 45,
    gap: spacing.sm,
  },
  navbarSearchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
});
