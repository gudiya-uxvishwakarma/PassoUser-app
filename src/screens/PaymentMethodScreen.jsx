import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card} from '../components';
import {colors, spacing} from '../theme';

const {width} = Dimensions.get('window');

export const PaymentMethodScreen = ({route, navigation}) => {
  const {service} = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Card',
      icon: 'credit-card',
      iconFamily: 'MaterialCommunityIcons',
      description: 'Pay securely using your credit or debit card.',
      color: '#FF8C42',
      bgColor: '#FFF5EE',
      popular: false,
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'bank',
      iconFamily: 'MaterialCommunityIcons',
      description: 'Transfer money directly your back account.',
      color: '#7B8794',
      bgColor: '#F5F7FA',
      popular: false,
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: 'qr-code-outline',
      iconFamily: 'Ionicons',
      description: 'Google Pay, PhonePe, Paytm & more',
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      popular: true,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: 'wallet-outline',
      iconFamily: 'Ionicons',
      description: 'Paytm, Amazon Pay, Mobikwik',
      color: '#DC2626',
      bgColor: '#FEF2F2',
      popular: false,
    },
    {
      id: 'cash',
      name: 'Cash on Service',
      icon: 'cash-outline',
      iconFamily: 'Ionicons',
      description: 'Pay after service completion',
      color: '#16A34A',
      bgColor: '#F0FDF4',
      popular: false,
    },
  ];

  const handlePayment = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return;

    setShowPaymentModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const processPayment = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod);
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);
      
      if (method.id === 'cash') {
        // For cash on service, go directly to booking form
        navigation.navigate('BookingForm', {
          service,
          paymentMethod: method.name,
        });
      } else {
        // For online payments, show success screen
        navigation.navigate('PaymentSuccess', {
          amount: service.price,
          transactionId: `TXN${Date.now()}`,
          bookingDetails: {
            serviceName: service.name,
            id: `#BK${Date.now()}`,
          },
        });
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#242767" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Service Summary Card - Modern Design */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}, {scale: scaleAnim}],
            },
          ]}>
          <View style={styles.summaryCardModern}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIconContainer}>
                <Icon name="receipt-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.summaryHeaderText}>
                <Text style={styles.summaryTitle}>Service Summary</Text>
                <Text style={styles.summarySubtitle}>Review your booking</Text>
              </View>
            </View>

            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryRowLeft}>
                  <Icon name="construct-outline" size={16} color={colors.textLight} />
                  <Text style={styles.summaryLabel}>Service</Text>
                </View>
                <Text style={styles.summaryValue}>{service.name}</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryRowLeft}>
                  <Icon name="time-outline" size={16} color={colors.textLight} />
                  <Text style={styles.summaryLabel}>Duration</Text>
                </View>
                <Text style={styles.summaryValue}>{service.duration}</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryRowLeft}>
                  <Icon name="star" size={16} color={colors.rating} />
                  <Text style={styles.summaryLabel}>Rating</Text>
                </View>
                <Text style={styles.summaryValue}>{service.rating} ⭐</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.totalValue}>{service.price}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Payment Methods - Modern Cards */}
        <View style={styles.methodsSection}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Choose Payment Method</Text>
            <Text style={styles.sectionSubtitle}>Select your preferred option</Text>
          </View>

          {paymentMethods.map((method, index) => {
            const IconComponent =
              method.iconFamily === 'MaterialCommunityIcons'
                ? MaterialCommunityIcons
                : Icon;
            const isSelected = selectedMethod === method.id;

            return (
              <Animated.View
                key={method.id}
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + index * 10],
                        }),
                      },
                    ],
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.methodCardModern,
                    {
                      backgroundColor: '#FFFFFF',
                      borderColor: isSelected ? method.color : colors.border,
                      borderWidth: isSelected ? 3 : 1.5,
                    }
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                  activeOpacity={0.7}>
                  {method.popular && (
                    <View style={styles.popularBadge}>
                      <Icon name="star" size={10} color="#FFFFFF" />
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}

                  <View style={styles.methodContentRow}>
                    <View
                      style={[
                        styles.methodIconModern,
                        {backgroundColor: isSelected ? method.color + '20' : method.color + '15'},
                      ]}>
                      <IconComponent name={method.icon} size={28} color={method.color} />
                    </View>

                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodName, {color: method.color}]}>{method.name}</Text>
                      <Text style={styles.methodDescription}>{method.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Icon name="shield-checkmark" size={18} color="#10B981" />
          <Text style={styles.securityText}>
            100% Secure Payment • SSL Encrypted
          </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

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
                  You are about to pay ₹{service.price} for {service.name}
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
                    <Text style={styles.modalLabel}>Amount</Text>
                    <Text style={styles.modalAmount}>₹{service.price}</Text>
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
                  <Animated.View
                    style={[
                      styles.processingCircle,
                      {
                        transform: [
                          {
                            rotate: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            }),
                          },
                        ],
                      },
                    ]}>
                    <Icon name="sync" size={40} color={colors.primary} />
                  </Animated.View>
                  <Text style={styles.processingTitle}>Processing Payment</Text>
                  <Text style={styles.processingSubtitle}>Please wait...</Text>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Footer - Modern Design */}
      <View style={styles.footerModern}>
        <View style={styles.footerContent}>
          <View style={styles.footerPriceSection}>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerPrice}>₹{service.price}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.proceedButtonModern,
              !selectedMethod && styles.proceedButtonDisabled,
            ]}
            disabled={!selectedMethod}
            onPress={handlePayment}>
            <Text style={styles.proceedButtonText}>
              {selectedMethod ? 'Proceed to Pay' : 'Select Payment Method'}
            </Text>
            <Icon name="arrow-forward-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  header: {
    backgroundColor: '#242767',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    paddingTop: spacing.xl,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
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
    letterSpacing: 0.3,
  },
  // Modern Summary Card
  summaryCardModern: {
    margin: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary + '08',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  summaryContent: {
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  summaryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#242767' + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 10,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#242767',
    marginRight: 2,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#242767',
  },
  // Payment Methods Section
  methodsSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
  },
  sectionHeaderContainer: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  // Modern Method Cards
  methodCardModern: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    position: 'relative',
    minHeight: 110,
  },
  methodContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  popularBadge: {
    position: 'absolute',
    top: -6,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    elevation: 3,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  methodIconModern: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    width: '100%',
  },
  methodName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  methodDescription: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
    lineHeight: 19,
  },
  // Security Badge
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#10B98115',
    borderRadius: 10,
    gap: spacing.xs,
  },
  securityText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  // Modern Footer
  footerModern: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  footerPriceSection: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
    fontWeight: '500',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242767',
  },
  proceedButtonModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242767',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: 12,
    gap: spacing.xs,
    elevation: 4,
    shadowColor: '#242767',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minWidth: 160,
  },
  proceedButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
    elevation: 1,
  },
  proceedButtonText: {
    fontSize: 14,
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
