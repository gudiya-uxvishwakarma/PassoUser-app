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

const PaymentFailedScreen = ({ navigation, route }) => {
  const { amount, reason, service } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
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

  const commonReasons = [
    {
      icon: 'wallet-outline',
      title: 'Insufficient Balance',
      desc: 'Your account doesn\'t have enough funds',
    },
    {
      icon: 'wifi-off',
      title: 'Network Issue',
      desc: 'Poor internet connection during payment',
    },
    {
      icon: 'card-outline',
      title: 'Card Declined',
      desc: 'Your bank declined the transaction',
    },
    {
      icon: 'time-outline',
      title: 'Session Timeout',
      desc: 'Payment session expired',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.error} />
      
      {/* Failed Header */}
      <View style={styles.failedHeader}>
        <Animated.View style={[
          styles.errorCircleOuter, 
          { 
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim }
            ] 
          }
        ]}>
          <View style={styles.errorCircleMiddle}>
            <View style={styles.errorCircleInner}>
              <Icon name="close-thick" size={50} color="#fff" />
            </View>
          </View>
        </Animated.View>
        
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.failedTitle}>Payment Failed</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.failedAmount}>{amount || 319}</Text>
          </View>
          <View style={styles.failedBadge}>
            <IoniconsIcon name="alert-circle" size={16} color="#FCA5A5" />
            <Text style={styles.failedSubtitle}>Transaction was not completed</Text>
          </View>
        </Animated.View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Error Details Card */}
        <Animated.View style={[styles.detailsCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <IoniconsIcon name="information-circle-outline" size={24} color={colors.error} />
            <Text style={styles.cardHeaderTitle}>What went wrong?</Text>
          </View>

          <View style={styles.detailsContent}>
            <View style={styles.reasonBox}>
              <IoniconsIcon name="alert-circle" size={32} color={colors.error} />
              <View style={styles.reasonTextContainer}>
                <Text style={styles.reasonTitle}>Reason</Text>
                <Text style={styles.reasonText}>{reason || 'Payment could not be processed'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="calendar-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Attempted On</Text>
              </View>
              <Text style={styles.detailValue}>{currentDate}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="construct-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Service</Text>
              </View>
              <Text style={styles.detailValue}>{service?.name || 'Fan Repair'}</Text>
            </View>

            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <IoniconsIcon name="cash-outline" size={18} color={colors.textLight} />
                <Text style={styles.detailLabel}>Amount</Text>
              </View>
              <Text style={styles.amountValue}>₹{amount || 319}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Common Reasons Card */}
        <Animated.View style={[styles.reasonsCard, { opacity: fadeAnim }]}>
          <Text style={styles.reasonsTitle}>Common Reasons for Failure</Text>
          {commonReasons.map((item, index) => (
            <View key={index} style={styles.reasonItem}>
              <View style={styles.reasonIconContainer}>
                <IoniconsIcon name={item.icon} size={20} color={colors.textLight} />
              </View>
              <View style={styles.reasonItemText}>
                <Text style={styles.reasonItemTitle}>{item.title}</Text>
                <Text style={styles.reasonItemDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Help Card */}
        <Animated.View style={[styles.helpCard, { opacity: fadeAnim }]}>
          <IoniconsIcon name="help-circle" size={28} color={colors.primary} />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpDesc}>Contact our support team for assistance</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <IoniconsIcon name="headset" size={20} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        <View style={{height: 20}} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <IoniconsIcon name="refresh" size={22} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Retry Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.changeMethodButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <IoniconsIcon name="card-outline" size={20} color={colors.primary} />
          <Text style={styles.changeMethodButtonText}>Change Payment Method</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.8}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
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
  failedHeader: {
    backgroundColor: colors.error,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  errorCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorCircleMiddle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCircleInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failedTitle: {
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
  failedAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  failedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  failedSubtitle: {
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
    backgroundColor: colors.error + '08',
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
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '08',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reasonTextContainer: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: '700',
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
  amountValue: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  reasonsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  reasonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonItemText: {
    flex: 1,
  },
  reasonItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  reasonItemDesc: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '08',
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  helpDesc: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
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
  retryButton: {
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
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  changeMethodButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  changeMethodButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: colors.border,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PaymentFailedScreen;
