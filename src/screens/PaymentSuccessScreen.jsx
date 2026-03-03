import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {colors, spacing} from '../theme';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { amount, transactionId, bookingDetails } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(checkmarkScale, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Success Header with Gradient Effect */}
      <View style={styles.successHeader}>
        <Animated.View style={[styles.checkCircleOuter, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.checkCircleMiddle}>
            <Animated.View style={[styles.checkCircleInner, { transform: [{ scale: checkmarkScale }] }]}>
              <Icon name="check-bold" size={50} color="#fff" />
            </Animated.View>
          </View>
        </Animated.View>
        
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.successAmount}>{amount || 319}</Text>
          </View>
          <View style={styles.successBadge}>
            <IoniconsIcon name="checkmark-circle" size={16} color="#4ADE80" />
            <Text style={styles.successSubtitle}>Your booking is confirmed</Text>
          </View>
        </Animated.View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Transaction Details Card */}
        <Animated.View style={[styles.detailsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <IoniconsIcon name="receipt-outline" size={24} color={colors.primary} />
            <Text style={styles.cardHeaderTitle}>Transaction Details</Text>
          </View>

          <View style={styles.detailsContent}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="document-text-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Transaction ID</Text>
              </View>
              <Text style={styles.detailValue} numberOfLines={1}>{transactionId || `TXN${Date.now()}`}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="calendar-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Date & Time</Text>
              </View>
              <Text style={styles.detailValue}>{currentDate}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="card-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Payment Method</Text>
              </View>
              <View style={styles.paymentMethodBadge}>
                <Text style={styles.paymentMethodText}>UPI</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="construct-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Service</Text>
              </View>
              <Text style={styles.detailValue}>{bookingDetails?.serviceName || 'Fan Repair'}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="person-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Worker</Text>
              </View>
              <Text style={styles.detailValue}>{bookingDetails?.workerName || 'Rajesh Kumar'}</Text>
            </View>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount Paid</Text>
              <Text style={styles.totalAmount}>₹{amount || 319}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={[styles.featuresCard, { opacity: fadeAnim }]}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <IoniconsIcon name="shield-checkmark" size={22} color={colors.success} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Secure Payment</Text>
              <Text style={styles.featureDesc}>Your payment is 100% secure</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <IoniconsIcon name="notifications" size={22} color={colors.primary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant Confirmation</Text>
              <Text style={styles.featureDesc}>Booking confirmed immediately</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <IoniconsIcon name="headset" size={22} color={colors.secondary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>24/7 Support</Text>
              <Text style={styles.featureDesc}>We're here to help anytime</Text>
            </View>
          </View>
        </Animated.View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => {
            navigation.replace('BookingConfirmation', {
              booking: {
                id: bookingDetails?.id || `#BK${Date.now()}`,
                serviceName: bookingDetails?.serviceName || 'Fan Repair Service',
                customerName: bookingDetails?.customerName || 'Customer',
                mobile: bookingDetails?.mobile || '9876543210',
                address: bookingDetails?.address || 'Address',
                date: bookingDetails?.date || 'Mar 3, 2026',
                time: bookingDetails?.time || '10:00 AM',
                status: 'Confirmed',
                instructions: bookingDetails?.instructions || 'No special instructions',
                paymentStatus: 'Paid',
                transactionId: transactionId,
              }
            });
          }}
          activeOpacity={0.8}>
          <IoniconsIcon name="checkmark-circle" size={22} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>View Booking Details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.8}>
          <IoniconsIcon name="home-outline" size={20} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  successHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkCircleMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginRight: 4,
  },
  successAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary + '08',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  detailsContent: {
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.xs,
  },
  paymentMethodBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentMethodText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  totalSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default PaymentSuccessScreen;
