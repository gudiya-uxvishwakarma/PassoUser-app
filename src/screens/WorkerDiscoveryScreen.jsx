import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {
  workerCategories,
  workerTypes,
  availabilityOptions,
} from '../data/workerData';
import {workerService} from '../services';

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

export const WorkerDiscoveryScreen = ({route, navigation}) => {
  const {selectedCategory: initialCategory, selectedService: initialService} = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [selectedService, setSelectedService] = useState(initialService || null);
  const [selectedWorkerTypes, setSelectedWorkerTypes] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(5);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Set initial category and service if provided
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialCategory, initialService]);

  useEffect(() => {
    fetchWorkers();
  }, [selectedCategory, selectedService, verifiedOnly, searchQuery]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      
      // Build filters
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (verifiedOnly) filters.verified = true;
      if (searchQuery) filters.search = searchQuery;
      
      const response = await workerService.getAllWorkers(filters);
      
      if (response.success) {
        let fetchedWorkers = response.data;
        
        // Apply client-side filters
        if (selectedWorkerTypes.length > 0) {
          fetchedWorkers = fetchedWorkers.filter(w => 
            selectedWorkerTypes.includes(w.workerType)
          );
        }
        
        if (selectedAvailability.length > 0) {
          fetchedWorkers = fetchedWorkers.filter(w => 
            selectedAvailability.includes(w.availability)
          );
        }
        
        setWorkers(fetchedWorkers);
      }
    } catch (error) {
      console.error('❌ Fetch workers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory(initialCategory || null);
    setSelectedService(initialService || null);
    setSelectedWorkerTypes([]);
    setSelectedAvailability([]);
    setVerifiedOnly(false);
    setMaxDistance(5);
    setSearchQuery('');
    fetchWorkers();
  };

  const toggleWorkerType = (typeId) => {
    if (selectedWorkerTypes.includes(typeId)) {
      setSelectedWorkerTypes(selectedWorkerTypes.filter(id => id !== typeId));
    } else {
      setSelectedWorkerTypes([...selectedWorkerTypes, typeId]);
    }
  };

  const toggleAvailability = (availId) => {
    if (selectedAvailability.includes(availId)) {
      setSelectedAvailability(selectedAvailability.filter(id => id !== availId));
    } else {
      setSelectedAvailability([...selectedAvailability, availId]);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return colors.primary;
    const colors_list = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const index = name.charCodeAt(0) % colors_list.length;
    return colors_list[index];
  };

  const renderWorkerCard = ({item}) => {
    const avatarBgColor = getAvatarColor(item.name);
    
    // Vibrant accent colors for left border
    const accentColors = [
      '#8B5CF6', // Vibrant Purple
      '#EC4899', // Hot Pink
      '#3B82F6', // Bright Blue
      '#10B981', // Emerald Green
      '#F59E0B', // Amber Orange
      '#06B6D4', // Cyan
      '#6366F1', // Indigo
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#F97316', // Orange
    ];
    
    // Use name's first character to determine color
    const colorIndex = item.name ? item.name.charCodeAt(0) % accentColors.length : 0;
    const accentColor = accentColors[colorIndex];
    
    return (
      <TouchableOpacity
        style={styles.workerCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('WorkerDetail', {workerId: item._id})}>
        
        {/* Left Accent Bar */}
        <View style={[styles.accentBar, {backgroundColor: accentColor}]} />
        
        {/* Left: Avatar with Badge */}
        <View style={styles.cardLeft}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.cardAvatar, !item.profilePhoto && {backgroundColor: avatarBgColor}]}>
              {item.profilePhoto ? (
                <Image 
                  source={{uri: item.profilePhoto}} 
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarInitials}>{getInitials(item.name)}</Text>
              )}
            </View>
            {item.verified && (
              <View style={styles.cardVerifiedBadge}>
                <Icon name="checkmark-circle" size={16} color="#10B981" />
              </View>
            )}
            {item.online && (
              <View style={styles.onlineDot} />
            )}
          </View>
        </View>

        {/* Center: Worker Info */}
        <View style={styles.cardCenter}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardCategory} numberOfLines={1}>
            {Array.isArray(item.category) ? item.category.join(', ') : item.category}
          </Text>

          {/* Rating & Reviews */}
          <View style={styles.cardStats}>
            <View style={styles.cardStatItem}>
              <Icon name="star" size={14} color={colors.rating} />
              <Text style={styles.cardStatText}>{item.rating || 0}</Text>
            </View>
            <Text style={styles.cardStatDivider}>•</Text>
            <Text style={styles.cardStatText}>{item.reviews || 0} reviews</Text>
          </View>

          {/* Location */}
          <View style={styles.cardLocation}>
            <Icon name="location" size={14} color={colors.textLight} />
            <Text style={styles.cardLocationText} numberOfLines={1}>
              {item.city || 'Location not set'}
            </Text>
          </View>

          {/* Badges */}
          <View style={styles.cardBadges}>
            {item.featured && (
              <View style={styles.featuredBadge}>
                <Icon name="star" size={10} color="#F59E0B" />
                <Text style={styles.badgeText}>Top Rated</Text>
              </View>
            )}
            {item.trusted && (
              <View style={styles.trustedBadge}>
                <Icon name="shield-checkmark" size={10} color="#8B5CF6" />
                <Text style={styles.badgeText}>Trusted</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: View Button */}
        <View style={styles.cardRight}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('WorkerDetail', {workerId: item._id})}>
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Navbar - Same as MyBookings */}
      <Navbar
        navigation={navigation}
        title="Find Workers"
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search & Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search workers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textLight}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.filterIconButton}
            onPress={() => setShowFilters(true)}>
            <Icon name="options-outline" size={22} color={colors.primary} />
            {(selectedWorkerTypes.length > 0 || selectedAvailability.length > 0 || verifiedOnly) && (
              <View style={styles.filterIndicator} />
            )}
          </TouchableOpacity>
        </View>

        {/* Category/Service Tag */}
        {(selectedService || selectedCategory) && (
          <View style={styles.categoryTagContainer}>
            <View style={styles.categoryTag}>
              <Icon name="pricetag" size={14} color={colors.primary} />
              <Text style={styles.categoryTagText}>
                {selectedService || selectedCategory}
              </Text>
              <TouchableOpacity onPress={() => {
                setSelectedService(null);
                setSelectedCategory(null);
              }}>
                <Icon name="close" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Count */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {workers.length} {workers.length === 1 ? 'Worker' : 'Workers'} Found
          </Text>
          {(selectedWorkerTypes.length > 0 || selectedAvailability.length > 0 || verifiedOnly || searchQuery) && (
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Workers List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Finding workers...</Text>
          </View>
        ) : workers.length > 0 ? (
          <View style={styles.listContainer}>
            {workers.map((worker) => (
              <View key={worker._id}>
                {renderWorkerCard({item: worker})}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Icon name="people-outline" size={48} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No Workers Found</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : selectedCategory 
                ? `No workers available in ${selectedCategory}`
                : 'Try adjusting your filters'}
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={resetFilters}>
              <Text style={styles.emptyButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{height: 80}} />
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Workers</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}>
              
              {/* Worker Type Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Worker Type</Text>
                <View style={styles.filterChips}>
                  {workerTypes.map(type => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.chip,
                        selectedWorkerTypes.includes(type.id) && styles.chipActive,
                      ]}
                      onPress={() => toggleWorkerType(type.id)}>
                      <Icon
                        name={type.icon}
                        size={16}
                        color={selectedWorkerTypes.includes(type.id) ? '#FFFFFF' : colors.primary}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          selectedWorkerTypes.includes(type.id) && styles.chipTextActive,
                        ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Availability Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Availability</Text>
                <View style={styles.filterChips}>
                  {availabilityOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.chip,
                        selectedAvailability.includes(option.id) && styles.chipActive,
                      ]}
                      onPress={() => toggleAvailability(option.id)}>
                      <Text
                        style={[
                          styles.chipText,
                          selectedAvailability.includes(option.id) && styles.chipTextActive,
                        ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Verified Only */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  style={styles.verifiedToggle}
                  onPress={() => setVerifiedOnly(!verifiedOnly)}>
                  <View style={styles.verifiedLeft}>
                    <Icon 
                      name={verifiedOnly ? "checkmark-circle" : "checkmark-circle-outline"} 
                      size={24} 
                      color={verifiedOnly ? colors.primary : colors.textLight} 
                    />
                    <View>
                      <Text style={styles.verifiedTitle}>Verified Workers Only</Text>
                      <Text style={styles.verifiedSubtitle}>Show only verified professionals</Text>
                    </View>
                  </View>
                  <View style={[styles.switchToggle, verifiedOnly && styles.switchToggleActive]}>
                    <View style={[styles.switchThumb, verifiedOnly && styles.switchThumbActive]} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Distance Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Maximum Distance</Text>
                <Text style={styles.filterSubtitle}>Within {maxDistance} KM from you</Text>
                <View style={styles.distanceOptions}>
                  {[1, 2, 3, 5, 10].map(distance => (
                    <TouchableOpacity
                      key={distance}
                      style={[
                        styles.distanceChip,
                        maxDistance === distance && styles.distanceChipActive,
                      ]}
                      onPress={() => setMaxDistance(distance)}>
                      <Text
                        style={[
                          styles.distanceChipText,
                          maxDistance === distance && styles.distanceChipTextActive,
                        ]}>
                        {distance} KM
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity 
                style={styles.applyFiltersButton} 
                onPress={() => setShowFilters(false)}>
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  // Search & Filter
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    gap: spacing.sm,
    ...shadows.small,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  filterIconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // Category Tag
  categoryTagContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  // Results Bar
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  resultsText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  resetText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  // List Layout (One card per row)
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  // Worker Card (Full Width)
  workerCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    borderTopLeftRadius: borderRadius.xl,
    borderBottomLeftRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLeft: {
    marginRight: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cardAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '30',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 2,
    ...shadows.small,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: colors.background,
  },
  cardCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
    color: colors.primary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardStatText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
  },
  cardStatDivider: {
    fontSize: 12,
    color: colors.textLight,
    marginHorizontal: spacing.xs,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  cardLocationText: {
    fontSize: 12,
    color: colors.textLight,
    flex: 1,
  },
  cardBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B15',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  trustedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF615',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  cardRight: {
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl * 1.5,
    borderTopRightRadius: borderRadius.xl * 1.5,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    padding: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  verifiedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  verifiedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  verifiedTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  verifiedSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  switchToggle: {
    width: 52,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 3,
    justifyContent: 'center',
  },
  switchToggleActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    ...shadows.small,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  distanceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  distanceChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.lightBg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  distanceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  distanceChipText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  distanceChipTextActive: {
    color: '#FFFFFF',
  },
  applyFiltersButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.medium,
  },
  applyFiltersText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textLight,
  },
});
