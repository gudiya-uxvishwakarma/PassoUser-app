import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {services} from '../data/mockData';

export const ServiceListScreen = ({route, navigation}) => {
  const {category} = route.params;
  const [sortBy, setSortBy] = useState('Recommended');

  const filteredServices = services.filter(s => s.category === category);

  const handleSortPress = () => {
    // Toggle sort options
    const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
  };

  const getIconComponent = (iconFamily) => {
    switch (iconFamily) {
      case 'FontAwesome':
        return FontAwesome;
      case 'MaterialCommunityIcons':
        return MaterialCommunityIcons;
      default:
        return Icon;
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar Component */}
      <Navbar
        navigation={navigation}
        title={category}
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      {/* Sort and Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
          <Icon name="swap-vertical" size={18} color={colors.text} />
          <Text style={styles.sortText}>Sort: {sortBy}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={20} color={colors.text} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredServices}
        contentContainerStyle={styles.list}
        renderItem={({item}) => {
          const IconComponent = getIconComponent(item.imageFamily);
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ServiceDetail', {service: item})}>
              <Card style={styles.serviceCard}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceImageContainer}>
                    <IconComponent name={item.image} size={45} color={colors.primary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <View style={styles.detailsRow}>
                      <View style={styles.ratingRow}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                        <Text style={styles.reviewCount}>({item.reviews})</Text>
                      </View>
                      <View style={styles.durationRow}>
                        <Icon name="time-outline" size={14} color={colors.textLight} />
                        <Text style={styles.durationText}>{item.duration}</Text>
                      </View>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>₹{item.price}</Text>
                      <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={() => navigation.navigate('ServiceDetail', {service: item})}>
                        <Text style={styles.bookButtonText}>Call Now</Text>
                        <Icon name="call" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={80} color={colors.border} />
            <Text style={styles.emptyText}>No services available</Text>
            <Text style={styles.emptySubtext}>Try browsing other categories</Text>
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
  filterBar: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  list: {
    padding: spacing.md,
  },
  serviceCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
    elevation: 0,
    shadowOpacity: 0,
  },
  serviceRow: {
    flexDirection: 'row',
  },
  serviceImageContainer: {
    width: 85,
    height: 85,
    borderRadius: 14,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  serviceInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: colors.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
    elevation: 0,
    shadowOpacity: 0,
  },
  bookButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
