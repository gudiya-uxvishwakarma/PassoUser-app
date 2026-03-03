import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {favoritesService} from '../services';

export const FavoritesScreen = ({navigation}) => {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const animatedValues = React.useRef({}).current;

  useEffect(() => {
    loadFavorites();
    
    // Listen for navigation focus to reload favorites
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favs = await favoritesService.getFavorites();
      console.log('✅ Loaded favorites:', favs.length);
      setFavorites(favs);
    } catch (error) {
      console.error('❌ Load favorites error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

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

  const removeFavorite = async (workerId, workerName) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${workerName} from favorites?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const result = await favoritesService.removeFavorite(workerId);
            if (result.success) {
              setFavorites(result.data);
              console.log('✅ Removed from favorites. Remaining:', result.data.length);
            }
          },
        },
      ]
    );
  };

  const navigateToWorkerDetail = (workerId) => {
    navigation.navigate('WorkerDetail', {workerId});
  };

  const renderFavorite = ({item, index}) => {
    if (!item || !item.id) {
      console.warn('⚠️ Invalid item in favorites:', item);
      return null;
    }

    // Create or get existing animation value for this item
    const itemKey = item.id.toString();
    if (!animatedValues[itemKey]) {
      animatedValues[itemKey] = new Animated.Value(0);
      
      // Animate only once when card is first created
      Animated.timing(animatedValues[itemKey], {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }

    const translateY = animatedValues[itemKey].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    return (
      <Animated.View 
        style={[
          styles.favoriteCard,
          {
            opacity: animatedValues[itemKey],
            transform: [{translateY}],
          },
        ]}>
        <TouchableOpacity 
          style={styles.cardTouchable}
          onPress={() => navigateToWorkerDetail(item.id)}
          activeOpacity={0.7}>
          
          {/* Top Section - Profile & Basic Info */}
          <View style={styles.topSection}>
            {/* Profile Photo */}
            <View style={[styles.avatar, !item.profilePhoto && {backgroundColor: getAvatarColor(item.name)}]}>
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

            {/* Worker Basic Info */}
            <View style={styles.basicInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.favoriteName} numberOfLines={2}>
                  {item.name}
                </Text>
                {item.verified && (
                  <Icon name="checkmark-circle" size={20} color="#10B981" />
                )}
              </View>
              
              <Text style={styles.favoriteCategory} numberOfLines={2}>
                {Array.isArray(item.category) ? item.category.join(', ') : item.category}
              </Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation();
                removeFavorite(item.id, item.name);
              }}
              activeOpacity={0.7}>
              <Icon name="heart" size={28} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Bottom Section - Details & Actions */}
          <View style={styles.bottomSection}>
            {/* Rating & Location */}
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="star" size={16} color={colors.rating} />
                <Text style={styles.detailText}>{item.rating || 0}</Text>
                <Text style={styles.detailTextLight}>({item.reviews || 0})</Text>
              </View>
              
              {item.city && (
                <View style={styles.detailItem}>
                  <Icon name="location" size={16} color={colors.primary} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {item.city}
                  </Text>
                </View>
              )}
            </View>

            {/* Status & Actions */}
            <View style={styles.actionsRow}>
              {item.unlocked ? (
                <>
                  <View style={styles.unlockedBadge}>
                    <Icon name="lock-open" size={13} color="#10B981" />
                    <Text style={styles.unlockedText}>Unlocked</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      Alert.alert('Call', `Calling ${item.name}`);
                    }}>
                    <Icon name="call" size={15} color="#FFFFFF" />
                    <Text style={styles.callButtonText}>Call Now</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.lockedBadge}>
                    <Icon name="lock-closed" size={13} color="#FFFFFF" />
                    <Text style={styles.lockedText}>Contact Locked</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.unlockButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('WorkerDetail', {workerId: item.id});
                    }}>
                    <Icon name="lock-open" size={15} color="#FFFFFF" />
                    <Text style={styles.unlockButtonText}>Unlock</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar
        navigation={navigation}
        title="My Favorites"
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      {/* Header Stats */}
      {favorites.length > 0 && (
        <View style={styles.headerStats}>
          <View style={styles.statBox}>
            <Icon name="heart" size={20} color="#EF4444" />
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="lock-open" size={20} color="#10B981" />
            <Text style={styles.statNumber}>
              {favorites.filter(f => f.unlocked).length}
            </Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="star" size={20} color={colors.rating} />
            <Text style={styles.statNumber}>
              {favorites.length > 0 
                ? (favorites.reduce((sum, f) => sum + (f.rating || 0), 0) / favorites.length).toFixed(1)
                : '0.0'}
            </Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Icon name="heart-outline" size={80} color={colors.border} />
          </View>
          <Text style={styles.emptyText}>No Favorites Yet</Text>
          <Text style={styles.emptySubtext}>
            Add workers to favorites for quick access{'\n'}
            Tap the heart icon on any worker profile
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('WorkerDiscovery')}>
            <Icon name="search" size={20} color="#FFFFFF" />
            <Text style={styles.exploreButtonText}>Explore Workers</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item, index) => item?.id?.toString() || `favorite-${index}`}
          extraData={favorites.length}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={{height: spacing.lg}} />}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  headerStats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  list: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    marginBottom: 4,
  },
  cardTouchable: {
    width: '100%',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  favoriteBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  basicInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  favoriteCategory: {
    fontSize: 14,
    color: '#3ba6cf',
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  removeButton: {
    padding: 10,
    marginTop: -4,
    borderRadius: 24,
  },
  divider: {
    height: 0,
    backgroundColor: 'transparent',
  },
  bottomSection: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
  },
  detailTextLight: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 7,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  unlockedText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#49b0d8',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    gap: 7,
    borderWidth: 0,
  },
  lockedText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  callButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  unlockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b2d6c',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#2b2d6c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  unlockButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
    borderWidth: 3,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.medium,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
