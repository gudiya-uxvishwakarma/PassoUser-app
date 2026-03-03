import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import {Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {reverseGeocode} from '../services/locationService';

export const BookingFormScreen = ({route, navigation}) => {
  const {service} = route.params;
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load saved location on mount
  useEffect(() => {
    if (global.selectedLocation) {
      const loc = global.selectedLocation;
      if (loc.fullAddress) {
        setAddress(loc.fullAddress);
      }
      if (loc.pincode) {
        setPincode(loc.pincode);
      }
    }
  }, []);

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const h = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time = `${h}:${min === 0 ? '00' : min} ${ampm}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'});
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', {weekday: 'short'});
    return {full: `${day} ${month} ${year}`, day, month, weekday};
  };

  // Success animation effect
  useEffect(() => {
    if (showSuccessModal) {
      // Reset animations
      scaleAnim.setValue(0);
      checkmarkAnim.setValue(0);
      fadeAnim.setValue(0);

      // Start animations sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale up circle
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Show checkmark with delay
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 400,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSuccessModal]);

  const handleBooking = () => {
    if (!name || !mobile || !address || !pincode) {
      Alert.alert('Error', 'Please fill all required fields including pincode');
      return;
    }

    if (pincode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    // Show success modal first
    setShowSuccessModal(true);

    // Navigate to payment after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate('PaymentMethod', {
        service: service,
        bookingDetails: {
          customerName: name,
          mobile,
          address,
          pincode,
          date: formatDate(selectedDate).full,
          time: selectedTime,
          instructions: instructions || 'No special instructions',
        },
      });
    }, 2000);
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

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Location permission is required to detect your current address. Please allow location access.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => {
            if (Platform.OS === 'android') {
              Linking.openSettings();
            }
          }},
        ]
      );
      setIsLoadingLocation(false);
      return;
    }

    // Try location with fallback strategy
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
      console.log('GPS Coordinates:', {latitude, longitude});
      
      try {
        const result = await reverseGeocode(latitude, longitude);
        console.log('Geocoding Result:', result);
        
        if (result.success) {
          setAddress(result.formatted || result.address);
          if (result.postcode) {
            setPincode(result.postcode);
          }
          Alert.alert(
            'Success!',
            'Your location has been detected successfully.',
            [{text: 'OK'}]
          );
        } else {
          Alert.alert(
            'Location Error',
            result.error || 'Could not fetch location details. Please enter address manually.',
            [{text: 'OK'}]
          );
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        Alert.alert(
          'Error',
          'Failed to get location details. Please check your internet connection and try again.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.error('GPS Location error:', error);
      let errorMessage = '';
      let errorTitle = 'Location Error';
      
      switch (error.code) {
        case 1:
          errorTitle = 'Permission Denied';
          errorMessage = 'Please allow location access in your device settings.';
          break;
        case 2:
          errorTitle = 'Location Unavailable';
          errorMessage = 'Please enable GPS/Location services in your device settings.';
          break;
        case 3:
          errorTitle = 'Location Timeout';
          errorMessage = 'Could not detect location. Please:\n\n1. Enable GPS/Location services\n2. Go to an open area\n3. Try again or enter address manually';
          break;
        default:
          errorMessage = 'Could not detect location. Please enter address manually.';
      }
      
      Alert.alert(errorTitle, errorMessage, [
        {text: 'Try Again', onPress: handleGetCurrentLocation},
        {text: 'Cancel', style: 'cancel'}
      ]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const dates = generateDates();
  const timeSlots = generateTimeSlots();

  return (
    <View style={styles.container}>
      <Navbar
        navigation={navigation}
        title="Book Your Service"
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="9876543210"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <Text style={styles.label}>Address *</Text>
            <View style={styles.addressContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter your complete address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={colors.textLight}
                />
              </View>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleGetCurrentLocation}
                disabled={isLoadingLocation}>
                {isLoadingLocation ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <>
                    <Icon name="locate" size={20} color={colors.primary} />
                    <Text style={styles.locationButtonText}>Use Current Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Pincode *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDateModal(true)}>
              <Text style={styles.input}>
                {formatDate(selectedDate).full}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Select Time</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowTimeModal(true)}>
              <Text style={styles.input}>{selectedTime}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Special Instructions (Optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special requirements..."
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
          <Icon
            name="checkmark-circle"
            size={20}
            color="#FFFFFF"
            style={{marginRight: 8}}
          />
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal - Enhanced */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Icon name="calendar" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Select Date</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDateModal(false)}>
                <Icon name="close-circle" size={28} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}>
              <View style={styles.dateGrid}>
                {dates.map((date, index) => {
                  const formatted = formatDate(date);
                  const isSelected =
                    date.toDateString() === selectedDate.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dateItem,
                        isSelected && styles.dateItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedDate(date);
                        setShowDateModal(false);
                      }}>
                      {isToday && (
                        <View style={styles.todayBadge}>
                          <Text style={styles.todayText}>Today</Text>
                        </View>
                      )}
                      <View style={styles.dateItemContent}>
                        <Text
                          style={[
                            styles.dateWeekday,
                            isSelected && styles.dateTextSelected,
                          ]}>
                          {formatted.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.dateDay,
                            isSelected && styles.dateTextSelected,
                          ]}>
                          {formatted.day}
                        </Text>
                        <Text
                          style={[
                            styles.dateMonth,
                            isSelected && styles.dateTextSelected,
                          ]}>
                          {formatted.month}
                        </Text>
                      </View>
                      {isSelected && (
                        <View style={styles.selectedIndicator}>
                          <Icon name="checkmark-circle" size={24} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal - Enhanced */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Icon name="time" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Select Time</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowTimeModal(false)}>
                <Icon name="close-circle" size={28} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}>
              <View style={styles.timeGrid}>
                {timeSlots.map((time, index) => {
                  const isSelected = time === selectedTime;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeItem,
                        isSelected && styles.timeItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedTime(time);
                        setShowTimeModal(false);
                      }}>
                      <Icon
                        name="time"
                        size={22}
                        color={isSelected ? '#FFFFFF' : colors.primary}
                      />
                      <Text
                        style={[
                          styles.timeText,
                          isSelected && styles.timeTextSelected,
                        ]}>
                        {time}
                      </Text>
                      {isSelected && (
                        <Icon name="checkmark-circle" size={20} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Confirmation Modal with Animation */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => {}}>
        <Animated.View 
          style={[
            styles.successModalOverlay,
            {opacity: fadeAnim}
          ]}>
          <View style={styles.successModalContent}>
            <Animated.View
              style={[
                styles.successCircle,
                {
                  transform: [{scale: scaleAnim}],
                },
              ]}>
              <Animated.View
                style={{
                  opacity: checkmarkAnim,
                  transform: [
                    {
                      scale: checkmarkAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                }}>
                <Icon name="checkmark" size={80} color="#FFFFFF" />
              </Animated.View>
            </Animated.View>
            
            <Animated.View style={{opacity: checkmarkAnim}}>
              <Text style={styles.successTitle}>Booking Confirmed!</Text>
              <Text style={styles.successMessage}>
                Your service has been booked successfully
              </Text>
            </Animated.View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  content: {
    padding: spacing.md,
  },
  form: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  inputContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 55,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  addressContainer: {
    marginBottom: spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    height: 55,
  },
  dateTimeValueCentered: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalScroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  dateItem: {
    width: '31%',
    aspectRatio: 0.85,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dateItemSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  todayBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  todayText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  dateItemContent: {
    alignItems: 'center',
    gap: 4,
  },
  dateWeekday: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  dateMonth: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  timeItem: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.xs,
    minHeight: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timeItemSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  successCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    elevation: 10,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
