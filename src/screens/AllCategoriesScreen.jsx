import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {categoryService} from '../services';

export const AllCategoriesScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animated Category Card Component
  const AnimatedCategoryCard = ({item, index}) => {
    const iconScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Continuous pulse animation for icon only
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(iconScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }, []);

    const IconComponent = item.iconFamily === 'MaterialCommunityIcons' 
      ? MaterialCommunityIcons 
      : Icon;
    const iconName = item.icon || 'briefcase';
    
    // Gradient colors for variety
    const gradientColors = [
      '#667eea', // Purple
      '#f093fb', // Pink
      '#4facfe', // Blue
      '#43e97b', // Green
      '#fa709a', // Orange
      '#30cfd0', // Teal
      '#a8edea', // Light
      '#ff9a9e', // Rose
    ];
    
    const iconColor = gradientColors[index % gradientColors.length];

    return (
      <View style={styles.categoryCard}>
        <TouchableOpacity
          style={styles.categoryCardInner}
          activeOpacity={0.8}
          onPress={() => handleViewService(item)}>
          
          {/* Icon Container with Animation and Colored Background */}
          <View style={styles.iconContainer}>
            <Animated.View 
              style={[
                styles.iconCircle,
                {
                  backgroundColor: iconColor,
                  transform: [{scale: iconScale}],
                },
              ]}>
              <IconComponent name={iconName} size={28} color="#FFFFFF" />
            </Animated.View>
          </View>
          
          {/* Category Name */}
          <Text style={styles.categoryName} numberOfLines={2}>
            {item.name}
          </Text>
          
          {/* Worker Count Badge */}
          {item.totalWorkers > 0 && (
            <View style={styles.workerBadge}>
              <Icon name="people" size={10} color={colors.primary} />
              <Text style={styles.workerCount}>{item.totalWorkers}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('❌ Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewService = (category) => {
    // Navigate to Worker Discovery with selected category
    navigation.navigate('WorkerDiscovery', {
      selectedCategory: category.name,
    });
  };

  const renderCategoryCard = ({item, index}) => {
    return <AnimatedCategoryCard item={item} index={index} />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <Navbar navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>All Services</Text>
          <Text style={styles.pageSubtitle}>Choose and book your service</Text>

          {/* Categories Grid */}
          <FlatList
            data={filteredCategories}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
            keyExtractor={(item) => item._id}
            renderItem={renderCategoryCard}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="search-outline" size={60} color={colors.textLight} />
                <Text style={styles.emptyText}>No categories found</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.textLight,
  },
  content: {
    padding: spacing.md,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  gridContainer: {
    paddingBottom: spacing.lg,
  },
  categoryCard: {
    width: '31%',
    margin: '1%',
    aspectRatio: 0.85,
  },
  categoryCardInner: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 15,
    minHeight: 30,
  },
  workerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workerCount: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: spacing.md,
  },
});
