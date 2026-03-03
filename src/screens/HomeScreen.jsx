import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {banners} from '../data/mockData';
import {useLanguage} from '../context/LanguageContext';
import {categoryService} from '../services';

const {width} = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export const HomeScreen = ({navigation}) => {
  const {t} = useLanguage();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const bannerRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animated Category Card Component
  const AnimatedCategoryCard = ({category, index, colorPair}) => {
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

    const IconComponent = category.iconFamily === 'MaterialCommunityIcons' 
      ? MaterialCommunityIcons 
      : Icon;
    const iconName = category.icon || 'briefcase';

    return (
      <View style={styles.categoryCard}>
        <TouchableOpacity
          style={styles.categoryCardInner}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('WorkerDiscovery', {selectedCategory: category.name})
          }>
          
          {/* Icon Container with Animation and Colored Background */}
          <View style={styles.iconContainer}>
            <Animated.View 
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colorPair[0],
                  transform: [{scale: iconScale}],
                },
              ]}>
              <IconComponent name={iconName} size={28} color="#FFFFFF" />
            </Animated.View>
          </View>
          
          {/* Category Name */}
          <Text style={styles.categoryName} numberOfLines={2}>
            {category.name}
          </Text>
          
          {/* Worker Count Badge */}
          {category.totalWorkers > 0 && (
            <View style={styles.workerBadge}>
              <Icon name="people" size={10} color={colors.primary} />
              <Text style={styles.workerCount}>{category.totalWorkers}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Fetch categories and workers from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 HomeScreen: Fetching categories...');
      
      // Fetch categories
      const categoriesResponse = await categoryService.getAllCategories();
      console.log('📊 HomeScreen: Categories response:', {
        success: categoriesResponse.success,
        count: categoriesResponse.data?.length || 0
      });
      
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
        console.log(`✅ HomeScreen: Set ${categoriesResponse.data.length} categories`);
      } else {
        console.error('❌ HomeScreen: Failed to fetch categories:', categoriesResponse.message);
      }
    } catch (error) {
      console.error('❌ HomeScreen: Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll banners every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentBanner + 1) % banners.length;
      setCurrentBanner(nextIndex);
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentBanner]);

  // Banner entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const bannerColors = ['#2c2d6d', '#82af42', '#3ba6cf'];

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar 
          navigation={navigation} 
          showLocationAndNotification={true}
          showSearchBar={true}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </View>
    );
  }

  // Show error state if no categories
  if (!loading && categories.length === 0) {
    return (
      <View style={styles.container}>
        <Navbar 
          navigation={navigation} 
          showLocationAndNotification={true}
          showSearchBar={true}
          onSearchChange={setSearchQuery}
          searchValue={searchQuery}
        />
        <View style={styles.loadingContainer}>
          <Icon name="alert-circle-outline" size={60} color={colors.textLight} />
          <Text style={styles.errorText}>Unable to load categories</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderBanner = ({item, index}) => (
    <Animated.View 
      style={[
        styles.banner, 
        {
          backgroundColor: bannerColors[index % 3],
          transform: [{scale: scaleAnim}],
          opacity: fadeAnim,
        }
      ]}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Grab Now</Text>
          <Icon name="arrow-forward" size={14} color={bannerColors[index % 3]} />
        </TouchableOpacity>
      </View>
      <Icon name="gift" size={70} color="rgba(255,255,255,0.25)" />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Navbar Component with Notification Only */}
      <Navbar 
        navigation={navigation} 
        showLocationAndNotification={true}
        showSearchBar={true}
        onSearchChange={setSearchQuery}
        searchValue={searchQuery}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* Banner Slider with Auto-Scroll */}
        <View style={styles.bannerSection}>
          <FlatList
            ref={bannerRef}
            data={banners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.bannerList}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / (BANNER_WIDTH + 16));
              setCurrentBanner(index);
            }}
            getItemLayout={(data, index) => ({
              length: BANNER_WIDTH + 16,
              offset: (BANNER_WIDTH + 16) * index,
              index,
            })}
          />
          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentBanner && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* All Categories - Directly on Home Page */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
              <Text style={styles.sectionSubtitle}>{t('home.chooseService')}</Text>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((category, index) => {
              // Gradient colors for variety
              const gradientColors = [
                ['#667eea', '#764ba2'], // Purple
                ['#f093fb', '#f5576c'], // Pink
                ['#4facfe', '#00f2fe'], // Blue
                ['#43e97b', '#38f9d7'], // Green
                ['#fa709a', '#fee140'], // Orange
                ['#30cfd0', '#330867'], // Teal
                ['#a8edea', '#fed6e3'], // Light
                ['#ff9a9e', '#fecfef'], // Rose
              ];
              
              const colorPair = gradientColors[index % gradientColors.length];
              
              return (
                <AnimatedCategoryCard
                  key={category._id}
                  category={category}
                  index={index}
                  colorPair={colorPair}
                />
              );
            })}
          </View>
        </View>

        <View style={{height: 20}} />
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
  errorText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  bannerSection: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  bannerList: {
    paddingHorizontal: spacing.md,
  },
  banner: {
    width: BANNER_WIDTH,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 130,
    ...shadows.medium,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  bannerButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 0.85,
    marginBottom: 4,
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
  hexagonBackground: {
    width: 60,
    height: 60,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: spacing.sm,
  },
});
