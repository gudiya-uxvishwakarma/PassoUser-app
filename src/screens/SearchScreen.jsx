import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {categories, services} from '../data/mockData';

export const SearchScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Plumber',
    'Electrician',
    'Cleaning',
  ]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices([]);
      setFilteredCategories([]);
    } else {
      const query = searchQuery.toLowerCase();
      
      const matchedServices = services.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
      
      const matchedCategories = categories.filter(category =>
        category.name.toLowerCase().includes(query)
      );
      
      setFilteredServices(matchedServices);
      setFilteredCategories(matchedCategories);
    }
  }, [searchQuery]);

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

  const handleSearch = (query) => {
    if (query.trim() !== '') {
      if (!recentSearches.includes(query)) {
        setRecentSearches([query, ...recentSearches.slice(0, 4)]);
      }
    }
  };

  const handleServicePress = (service) => {
    handleSearch(service.name);
    navigation.navigate('WorkerDiscovery', {
      selectedCategory: service.category,
      selectedService: service.name,
    });
  };

  const handleCategoryPress = (category) => {
    handleSearch(category.name);
    navigation.navigate('WorkerDiscovery', {
      selectedCategory: category.name,
    });
  };

  const handleRecentSearchPress = (search) => {
    setSearchQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchQuery)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() === '' ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => handleRecentSearchPress(search)}>
                    <Icon name="time-outline" size={20} color={colors.textLight} />
                    <Text style={styles.recentText}>{search}</Text>
                    <Icon name="arrow-forward" size={18} color={colors.textLight} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Popular Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Categories</Text>
              <View style={styles.categoryGrid}>
                {categories.slice(0, 6).map((category) => {
                  const IconComponent = getIconComponent(category.iconFamily);
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => handleCategoryPress(category)}>
                      <View style={styles.categoryIconContainer}>
                        <IconComponent name={category.icon} size={24} color={colors.primary} />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Search Results */}
            {filteredCategories.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                {filteredCategories.map((category) => {
                  const IconComponent = getIconComponent(category.iconFamily);
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.resultItem}
                      onPress={() => handleCategoryPress(category)}>
                      <View style={styles.resultIconContainer}>
                        <IconComponent name={category.icon} size={24} color={colors.primary} />
                      </View>
                      <Text style={styles.resultText}>{category.name}</Text>
                      <Icon name="arrow-forward" size={18} color={colors.textLight} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {filteredServices.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Services</Text>
                {filteredServices.map((service) => {
                  const IconComponent = getIconComponent(service.imageFamily);
                  return (
                    <TouchableOpacity
                      key={service.id}
                      style={styles.serviceResultCard}
                      onPress={() => handleServicePress(service)}>
                      <View style={styles.serviceResultIcon}>
                        <IconComponent name={service.image} size={32} color={colors.primary} />
                      </View>
                      <View style={styles.serviceResultInfo}>
                        <Text style={styles.serviceResultName}>{service.name}</Text>
                        <Text style={styles.serviceResultCategory}>{service.category}</Text>
                        <View style={styles.serviceResultDetails}>
                          <View style={styles.ratingContainer}>
                            <Icon name="star" size={14} color={colors.rating} />
                            <Text style={styles.ratingText}>{service.rating}</Text>
                          </View>
                          <Text style={styles.priceText}>₹{service.price}</Text>
                        </View>
                      </View>
                      <Icon name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {filteredCategories.length === 0 && filteredServices.length === 0 && (
              <View style={styles.noResults}>
                <Icon name="search-outline" size={64} color={colors.border} />
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsText}>
                  Try searching for different services or categories
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + 10,
    gap: spacing.sm,
    ...shadows.small,
  },
  backButton: {
    padding: spacing.xs,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  clearText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  resultIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  serviceResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceResultIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceResultInfo: {
    flex: 1,
  },
  serviceResultName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  serviceResultCategory: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  serviceResultDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.accent,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
