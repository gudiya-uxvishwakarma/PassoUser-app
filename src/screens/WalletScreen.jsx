import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {useLanguage} from '../context/LanguageContext';

export const WalletScreen = ({navigation}) => {
  const {t} = useLanguage();
  const walletBalance = 1250;

  const transactions = [
    {id: 1, type: 'credit', amount: 500, desc: 'Refund - Booking #1234', date: '2024-03-01'},
    {id: 2, type: 'debit', amount: 350, desc: 'Payment - AC Service', date: '2024-02-28'},
    {id: 3, type: 'credit', amount: 1000, desc: 'Added to Wallet', date: '2024-02-25'},
    {id: 4, type: 'debit', amount: 200, desc: 'Payment - Plumbing', date: '2024-02-20'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <Navbar
        navigation={navigation}
        title={t('profile.wallet')}
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Icon name="wallet" size={40} color="#FFFFFF" />
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₹{walletBalance}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="arrow-forward-circle" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Send Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={[
                styles.transactionIcon,
                {backgroundColor: transaction.type === 'credit' ? '#4CAF50' : '#FF5252'}
              ]}>
                <Icon 
                  name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDesc}>{transaction.desc}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                {color: transaction.type === 'credit' ? '#4CAF50' : '#FF5252'}
              ]}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: spacing.md,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: colors.textLight,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
