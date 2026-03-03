import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Card, Navbar} from '../components';
import {colors, spacing} from '../theme';
import {useBookings} from '../context/BookingContext';

export const BookingConfirmationScreen = ({route, navigation}) => {
  const {booking} = route.params || {};
  const {addBooking} = useBookings();
  const [showCallModal, setShowCallModal] = useState(false);

  useEffect(() => {
    // Save booking to history
    if (booking) {
      addBooking(booking);
    }
  }, [booking]);

  const handleCallWorker = () => {
    setShowCallModal(true);
  };

  const makeCall = (phoneNumber) => {
    setShowCallModal(false);
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make call');
    });
  };

  // Safety check
  if (!booking) {
    return (
      <View style={styles.container}>
        <Navbar
          navigation={navigation}
          title="Booking Confirmation"
          showBack={true}
          showLocationAndNotification={false}
          showSearchBar={false}
        />
        <View style={[styles.content, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={styles.title}>No booking data found</Text>
          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => navigation.navigate('Main')}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleTrackBooking = () => {
    navigation.navigate('MyBookings');
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar
        navigation={navigation}
        title="Booking Confirmation"
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
        onBackPress={() => navigation.navigate('Main')}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Icon name="checkmark-circle" size={100} color={colors.success} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your service has been booked successfully</Text>

        <Card style={styles.detailsCard}>
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>
          
          <View style={styles.divider} />
          
          {booking.paymentStatus && (
            <>
              <View style={styles.row}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <View style={styles.rowContent}>
                  <Text style={styles.label}>Payment Status</Text>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>{booking.paymentStatus}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}
          
          <View style={styles.row}>
            <Icon name="construct" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Service</Text>
              <Text style={styles.value}>{booking.serviceName}</Text>
            </View>
          </View>
          
          <View style={styles.row}>
            <Icon name="person" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Customer Name</Text>
              <Text style={styles.value}>{booking.customerName}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Icon name="call" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{booking.mobile}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Icon name="location" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Address</Text>
              <Text style={[styles.value, styles.addressText]} numberOfLines={2}>
                {booking.address}
              </Text>
            </View>
          </View>
          
          <View style={styles.row}>
            <Icon name="calendar" size={20} color={colors.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>{booking.date}, {booking.time}</Text>
            </View>
          </View>

          {booking.instructions && booking.instructions !== 'No special instructions' && (
            <View style={styles.row}>
              <Icon name="document-text" size={20} color={colors.primary} />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Instructions</Text>
                <Text style={[styles.value, styles.instructionsText]} numberOfLines={2}>
                  {booking.instructions}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.row}>
            <Icon name="checkmark-circle" size={20} color={colors.success} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
            </View>
          </View>
        </Card>

        <TouchableOpacity style={styles.callButton} onPress={handleCallWorker}>
          <Icon name="call" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.callButtonText}>Call Worker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trackButton} onPress={handleTrackBooking}>
          <Icon name="list" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.trackButtonText}>View My Bookings</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Icon name="home" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={handleTrackBooking}
        >
          <Icon name="calendar" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Call Modal */}
      <Modal
        visible={showCallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCallModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.callIconContainer}>
                <Icon name="call" size={40} color="#98ba3d" />
              </View>
              <Text style={styles.modalTitle}>Call Worker</Text>
              <Text style={styles.modalSubtitle}>Choose a number to call</Text>
            </View>

            <TouchableOpacity 
              style={styles.phoneOption}
              onPress={() => makeCall('9876543210')}
            >
              <View style={styles.phoneIconCircle}>
                <Icon name="person" size={24} color="#98ba3d" />
              </View>
              <View style={styles.phoneDetails}>
                <Text style={styles.phoneLabel}>Worker</Text>
                <Text style={styles.phoneNumber}>+91 98765 43210</Text>
              </View>
              <Icon name="call" size={24} color="#98ba3d" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.phoneOption}
              onPress={() => makeCall('1800123456')}
            >
              <View style={styles.phoneIconCircle}>
                <Icon name="headset" size={24} color="#2196F3" />
              </View>
              <View style={styles.phoneDetails}>
                <Text style={styles.phoneLabel}>Customer Support</Text>
                <Text style={styles.phoneNumber}>1800-123-456</Text>
              </View>
              <Icon name="call" size={24} color="#2196F3" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCallModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingIdContainer: {
    backgroundColor: colors.primary + '15',
    padding: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookingIdLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.xs,
  },
  addressText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.xs,
    lineHeight: 18,
  },
  instructionsText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.xs,
    fontSize: 13,
    lineHeight: 18,
  },
  statusBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#98ba3d',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    width: '100%',
    marginBottom: spacing.sm,
    gap: spacing.xs,
    shadowColor: '#98ba3d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    width: '100%',
    marginBottom: spacing.sm,
    gap: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 0,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  paidBadge: {
    backgroundColor: '#98ba3d' + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#98ba3d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  callIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  phoneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  phoneIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phoneDetails: {
    flex: 1,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    height: 65,
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: 32.5,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
  },
  navButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '500',
  },
});

