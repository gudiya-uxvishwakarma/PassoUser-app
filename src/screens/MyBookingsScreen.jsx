import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {useBookings} from '../context/BookingContext';
import {useLanguage} from '../context/LanguageContext';

export const MyBookingsScreen = ({navigation}) => {
  const {t} = useLanguage();
  const [filter, setFilter] = useState('All');
  const {bookings} = useBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'Confirmed':
      case 'Accepted':
        return colors.primary;
      case 'Pending':
        return colors.warning;
      default:
        return colors.textLight;
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar
        navigation={navigation}
        title={t('booking.title')}
        showBack={false}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      {/* Booking History Header with Filter */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>{t('booking.history')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
          <Icon name="funnel-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('BookingConfirmation', {booking: item})
            }>
            <Card style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View style={styles.serviceIconContainer}>
                  <MaterialCommunityIcons name="air-conditioner" size={24} color={colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.serviceName}</Text>
                  <Text style={styles.bookingDate}>{item.date}, {item.time}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(item.status) + '20'},
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      {color: getStatusColor(item.status)},
                    ]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.workerRow}>
                <MaterialCommunityIcons name="account-circle" size={20} color={colors.textLight} />
                <Text style={styles.workerName}> {item.workerName}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
  },
  bookingCard: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  bookingDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerName: {
    fontSize: 13,
    color: colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});
