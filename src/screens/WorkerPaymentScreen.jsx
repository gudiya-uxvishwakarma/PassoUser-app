import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, borderRadius, shadows} from '../theme';

export const WorkerPaymentScreen = ({route, navigation}) => {
  const {worker, unlockPrice, onSuccess} = route.params;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [showBundleOffer, setShowBundleOffer] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      fullName: 'Google Pay, PhonePe, Paytm',
      icon: 'qr-code-outline',
      iconFamily: 'Ionicons',
      color: '#7C3AED',
      badge: 'Instant',
    },
    {
      id: 'card',
      name: 'Card',
      fullName: 'Debit/Credit Card',
      icon: 'credit-card-outline',
      iconFamily: 'MaterialCommunityIcons',
      color: '#2563EB',
      badge: 'Secure',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      fullName: 'Paytm, PhonePe',
      icon: 'wallet-outline',
      iconFamily: 'Ionicons',
      color: '#DC2626',
      badge: 'Fast',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      fullName: 'All Banks',
      icon: 'bank-outline',
      iconFamily: 'MaterialCommunityIcons',
      color: '#059669',
      badge: 'Trusted',
    },
  ];

  const handlePayment = () => {
    setShowPaymentModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const processPayment = () => {
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      
      Alert.alert(
        'Payment Successful! 🎉',
        `Contact unlocked for ${worker.businessName || worker.name}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.();
              navigation.goBack();
            },
          },
        ]
      );
    }, 2000);
  };

  const handleBundleOffer = () => {
    Alert.alert(
      'Bundle Offer',
      'Buy 10 unlocks for ₹90 and save 10%!',
      [
        {text: 'Maybe Later', style: 'cancel'},
        {text: 'Buy Bundle', onPress: () => navigation.navigate('WorkerDiscovery')},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#242767" barStyle="light-content" />
      
      {/* Gradient Background */}
      <View style={styles.gradientBackground}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{width: 40}} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Bundle Offer Banner */}
          {showBundleOffer && (
            <View style={styles.bundleOfferBanner}>
              <TouchableOpacity 
                style={styles.bundleOfferContent}
                onPress={handleBundleOffer}
                activeOpacity={0.8}>
                <Icon name="gift" size={40} color="#FFFFFF" />
                <View style={styles.bundleOfferText}>
                  <Text style={styles.bundleOfferTitle}>Save More with Bundles!</Text>
                  <Text style={styles.bundleOfferDesc}>Get 10 unlocks @ ₹90 (10% off)</Text>
                </View>
                <Icon name="chevron-forward" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeBundleOffer}
                onPress={() => setShowBundleOffer(false)}>
                <Icon name="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Worker Info Card */}
          <View style={styles.workerCard}>
            <Text style={styles.workerName}>{worker.businessName || worker.name}</Text>
            <Text style={styles.workerCategory}>{worker.category}</Text>
            <View style={styles.workerDetails}>
              <Icon name="location" size={16} color={colors.textLight} />
              <Text style={styles.detailText}>{worker.distance} KM away</Text>
            </View>
          </View>

          {/* Amount Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Unlock Amount</Text>
            <Text style={styles.amount}>₹{unlockPrice}</Text>
            <Text style={styles.amountNote}>One-time payment to unlock contact</Text>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentMethodsContainer}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            {paymentMethods.map((method) => {
              const IconComponent = method.iconFamily === 'MaterialCommunityIcons' 
                ? MaterialCommunityIcons 
                : Icon;
              const isSelected = selectedMethod === method.id;

              return (
                <Animated.View
                  key={method.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}],
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.methodCard,
                      isSelected && styles.methodCardActive,
                    ]}
                    onPress={() => setSelectedMethod(method.id)}
                    activeOpacity={0.7}>
                    <View style={styles.methodLeft}>
                      <View style={[
                        styles.methodIconContainer, 
                        isSelected && {backgroundColor: method.color + '20'}
                      ]}>
                        <IconComponent 
                          name={method.icon} 
                          size={26} 
                          color={isSelected ? method.color : '#8B8B8B'} 
                        />
                      </View>
                      <View style={styles.methodTextContainer}>
                        <View style={styles.methodNameRow}>
                          <Text style={[styles.methodName, isSelected && {color: method.color}]}>
                            {method.name}
                          </Text>
                          {method.badge && (
                            <View style={[styles.badgePill, {backgroundColor: method.color + '20'}]}>
                              <Text style={[styles.badgeText, {color: method.color}]}>{method.badge}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.methodFullName}>{method.fullName}</Text>
                      </View>
                    </View>
                    <View style={[styles.radio, isSelected && {borderColor: method.color, backgroundColor: method.color + '15'}]}>
                      {isSelected && <View style={[styles.radioDot, {backgroundColor: method.color}]} />}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Icon name="shield-checkmark" size={22} color="#00BFA5" />
            <Text style={styles.securityText}>
              100% Secure payment powered by Razorpay
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#00BFA5" />
              <Text style={styles.featureText}>Instant unlock after payment</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#00BFA5" />
              <Text style={styles.featureText}>Secure & encrypted transaction</Text>
            </View>
          </View>

          <View style={{height: 100}} />
        </ScrollView>
      </View>

      {/* Payment Processing Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !processing && setShowPaymentModal(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {transform: [{scale: modalScale}]},
            ]}>
            {!processing ? (
              <>
                <View style={styles.modalIconContainer}>
                  <Icon name="shield-checkmark" size={60} color={colors.primary} />
                </View>
                <Text style={styles.modalTitle}>Confirm Payment</Text>
                <Text style={styles.modalSubtitle}>
                  Unlock contact for {worker.businessName || worker.name}
                </Text>
                
                <View style={styles.modalDetails}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Payment Method</Text>
                    <Text style={styles.modalValue}>
                      {paymentMethods.find(m => m.id === selectedMethod)?.name}
                    </Text>
                  </View>
                  <View style={styles.modalDivider} />
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Unlock Amount</Text>
                    <Text style={styles.modalAmount}>₹{unlockPrice}</Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => setShowPaymentModal(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalConfirmButton}
                    onPress={processPayment}>
                    <Text style={styles.modalConfirmText}>Confirm & Pay</Text>
                    <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.processingContainer}>
                  <View style={styles.processingCircle}>
                    <Icon name="sync" size={40} color={colors.primary} />
                  </View>
                  <Text style={styles.processingTitle}>Processing Payment</Text>
                  <Text style={styles.processingSubtitle}>Please wait...</Text>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Pay Button - Fixed at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
          activeOpacity={0.8}>
          <Text style={styles.payButtonText}>Pay ₹{unlockPrice}</Text>
          <Icon name="arrow-forward-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#E8E4F3', // Light purple gradient effect
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    paddingTop: spacing.xl,
    backgroundColor: '#242767',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  // Bundle Offer Banner
  bundleOfferBanner: {
    backgroundColor: '#242767',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    position: 'relative',
    elevation: 3,
    shadowColor: '#242767',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bundleOfferContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bundleOfferText: {
    flex: 1,
  },
  bundleOfferTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bundleOfferDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  closeBundleOffer: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Worker Card
  workerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: 3,
  },
  workerCategory: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  workerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#8B8B8B',
    fontWeight: '500',
  },
  // Amount Card
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  amountLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 4,
    fontWeight: '500',
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#242767',
    marginBottom: 4,
  },
  amountNote: {
    fontSize: 12,
    color: '#8B8B8B',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Payment Methods
  paymentMethodsContainer: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  methodCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
    elevation: 3,
    shadowOpacity: 0.12,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTextContainer: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 3,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodFullName: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  // Security Badge
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    backgroundColor: '#E8F5F3',
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  securityText: {
    fontSize: 12,
    color: '#00BFA5',
    fontWeight: '600',
  },
  // Features
  featuresContainer: {
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  // Footer
  footer: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242767',
    paddingVertical: 14,
    borderRadius: 12,
    gap: spacing.xs,
    elevation: 4,
    shadowColor: '#242767',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  modalDetails: {
    backgroundColor: colors.lightBg,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  modalAmount: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textLight,
  },
  modalConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  processingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  processingSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
});
