import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  ActivityIndicator,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {workerService, favoritesService, callHistoryService} from '../services';

export const WorkerDetailScreen = ({route, navigation}) => {
  const {workerId} = route.params;
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const statsSlideAnim = React.useRef(new Animated.Value(30)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    fetchWorkerDetails();
    checkFavoriteStatus();
  }, [workerId]);

  const checkFavoriteStatus = async () => {
    // Use workerId from route params or worker._id
    const id = workerId || worker?.id || worker?._id;
    if (id) {
      const isFav = await favoritesService.isFavorite(id);
      setIsFavorite(isFav);
    }
  };

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const response = await workerService.getWorkerById(workerId);
      console.log('🔍 Worker API Response:', response);
      if (response.success) {
        console.log('✅ Worker Data:', response.data);
        console.log('🆔 Worker ID:', response.data?.id);
        console.log('🆔 Worker _id:', response.data?._id);
        setWorker(response.data);
        startAnimations();
      }
    } catch (error) {
      console.error('❌ Fetch worker details error:', error);
      Alert.alert('Error', 'Failed to load worker details');
    } finally {
      setLoading(false);
    }
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(statsSlideAnim, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for available dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const unlockPrice = 10; // Default unlock price

  const unlockWorker = () => {
    navigation.navigate('WorkerPayment', {
      worker,
      unlockPrice,
      onSuccess: () => {
        setWorker({...worker, unlocked: true});
        Alert.alert('Success', 'Worker contact unlocked successfully!');
      },
    });
  };

  const toggleFavorite = async () => {
    if (!worker) {
      console.error('❌ Worker data is null');
      return;
    }

    // MongoDB uses _id, not id
    const workerId = worker.id || worker._id;
    
    if (!workerId) {
      console.error('❌ Worker ID is missing:', worker);
      Alert.alert('Error', 'Unable to add to favorites. Please try again.');
      return;
    }

    if (isFavorite) {
      // Remove from favorites
      const result = await favoritesService.removeFavorite(workerId);
      if (result.success) {
        setIsFavorite(false);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        Alert.alert('Error', 'Failed to remove from favorites');
      }
    } else {
      // Add to favorites - ensure ID is present
      const workerData = {
        ...worker,
        id: workerId, // Ensure id field exists
      };
      
      console.log('📦 Adding worker to favorites:', workerData);
      
      const result = await favoritesService.addFavorite(workerData);
      if (result.success) {
        setIsFavorite(true);
        Alert.alert(
          'Added to Favorites',
          'Worker added to your favorites list',
          [
            {text: 'OK', style: 'cancel'},
            {
              text: 'View Favorites',
              onPress: () => navigation.navigate('Favorites'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to add to favorites');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} title="Worker Details" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading worker details...</Text>
        </View>
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={styles.container}>
        <Navbar navigation={navigation} title="Worker Details" showBack={true} />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color={colors.textLight} />
          <Text style={styles.errorText}>Worker not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleCall = async () => {
    if (worker.unlocked) {
      const phone = worker.mobile || worker.phone;
      if (phone) {
        try {
          // Save to call history
          await callHistoryService.addCallHistory(worker);
          
          // Open phone dialer - directly without canOpenURL check
          const phoneUrl = `tel:${phone}`;
          await Linking.openURL(phoneUrl);
        } catch (error) {
          console.error('Call error:', error);
          Alert.alert('Error', 'Unable to make call. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Phone number not available');
      }
    } else {
      Alert.alert('Unlock Required', 'Please unlock worker contact to call');
    }
  };

  const handleWhatsApp = async () => {
    if (worker.unlocked) {
      const phone = worker.mobile || worker.phone;
      if (phone) {
        try {
          // Remove any non-digit characters
          const cleanPhone = phone.replace(/\D/g, '');
          
          // Try WhatsApp with country code
          const whatsappUrl = `whatsapp://send?phone=91${cleanPhone}`;
          await Linking.openURL(whatsappUrl);
        } catch (error) {
          console.error('WhatsApp error:', error);
          // If WhatsApp fails, try opening in browser
          try {
            const cleanPhone = phone.replace(/\D/g, '');
            const webUrl = `https://wa.me/91${cleanPhone}`;
            await Linking.openURL(webUrl);
          } catch (webError) {
            Alert.alert('Error', 'Unable to open WhatsApp. Please install WhatsApp or try again.');
          }
        }
      } else {
        Alert.alert('Error', 'Phone number not available');
      }
    } else {
      Alert.alert('Unlock Required', 'Please unlock worker contact to message');
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Curved Navbar Background with Profile Photo */}
      <View style={styles.curvedNavbarBackground}>
        <Navbar
          navigation={navigation}
          title="Worker Details"
          showBack={true}
          showLocationAndNotification={false}
          showSearchBar={false}
          rightIcon={
            <TouchableOpacity onPress={toggleFavorite}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
          }
        />
        
        {/* Profile Photo Overlapping */}
        <Animated.View 
          style={[
            styles.profilePhotoContainer,
            {
              transform: [{scale: scaleAnim}],
              opacity: fadeAnim,
            },
          ]}>
          <View style={styles.profilePhotoWrapper}>
            <View style={[styles.profilePhoto, !worker.profilePhoto && {backgroundColor: getAvatarColor(worker.name)}]}>
              {worker.profilePhoto ? (
                <Image 
                  source={{uri: worker.profilePhoto}} 
                  style={styles.profilePhotoImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.profilePhotoInitials}>{getInitials(worker.name)}</Text>
              )}
            </View>
            {/* Link/Edit Badge */}
            <View style={styles.editBadge}>
              <Icon name="link" size={18} color={colors.primary} />
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Worker Info Section */}
        <View style={styles.contentSection}>
          <View style={styles.workerInfoSection}>
            {worker.online && (
              <Animated.View 
                style={[
                  styles.onlineIndicator,
                  {
                    transform: [{scale: pulseAnim}],
                  },
                ]}>
                <View style={styles.onlineDotLarge} />
                <Text style={styles.onlineText}>Available Now</Text>
              </Animated.View>
            )}
            
            <View style={styles.workerInfoContent}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.workerCategory}>
                {Array.isArray(worker.category) ? worker.category.join(', ') : worker.category}
              </Text>

              {/* Rating with Stars */}
              <View style={styles.ratingSection}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= Math.floor(worker.rating || 0) ? 'star' : star - 0.5 <= (worker.rating || 0) ? 'star-half' : 'star-outline'}
                      size={18}
                      color={colors.rating}
                    />
                  ))}
                </View>
                <Text style={styles.ratingNumber}>{worker.rating || 0}</Text>
                <Text style={styles.reviewCount}>({worker.totalReviews || 0} reviews)</Text>
              </View>

              {/* Status Badges */}
              <View style={styles.statusBadges}>
                {worker.verified && (
                  <View style={[styles.statusBadge, styles.verifiedBadge]}>
                    <Icon name="shield-checkmark" size={14} color="#10B981" />
                    <Text style={[styles.statusBadgeText, {color: '#10B981'}]}>Verified Pro</Text>
                  </View>
                )}
                {worker.featured && (
                  <View style={[styles.statusBadge, styles.featuredBadge]}>
                    <Icon name="star" size={14} color="#F59E0B" />
                    <Text style={[styles.statusBadgeText, {color: '#F59E0B'}]}>Top Rated</Text>
                  </View>
                )}
                {worker.trusted && (
                  <View style={[styles.statusBadge, styles.trustedBadge]}>
                    <Icon name="trophy" size={14} color="#8B5CF6" />
                    <Text style={[styles.statusBadgeText, {color: '#8B5CF6'}]}>Trusted</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Cards */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{translateY: statsSlideAnim}],
            },
          ]}>
          {/* Jobs Done and Status in one row */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <MaterialCommunityIcons name="briefcase-check" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{worker.reviews}+</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Icon name="time" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>
              {worker.availability || 'Offline'}
            </Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </Animated.View>

        {/* Location Card - Separate Row */}
        <Animated.View 
          style={[
            styles.locationCard,
            {
              opacity: fadeAnim,
              transform: [{translateY: statsSlideAnim}],
            },
          ]}>
          <View style={styles.locationIconContainer}>
            <Icon name="location" size={24} color="#F59E0B" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Location</Text>
            <Text style={styles.locationValue}>{worker.city || 'N/A'}</Text>
          </View>
        </Animated.View>

        {/* Worker Type Info */}
        <Animated.View 
          style={[
            styles.infoCard,
            {
              opacity: fadeAnim,
            },
          ]}>
          <View style={styles.infoHeader}>
            <Icon name="briefcase-outline" size={22} color={colors.primary} />
            <Text style={styles.infoTitle}>Worker Type</Text>
          </View>
          <View style={styles.workerTypeTag}>
            <Icon 
              name="person" 
              size={18} 
              color={colors.primary} 
            />
            <Text style={styles.workerTypeText}>
              {worker.workerType || 'Worker'}
            </Text>
          </View>
        </Animated.View>

        {/* Skills & Expertise */}
        {worker.skills && worker.skills.length > 0 && (
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
              },
            ]}>
            <View style={styles.sectionHeader}>
              <Icon name="bulb" size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
            </View>
            <View style={styles.skillsGrid}>
              {worker.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Icon name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Contact Information */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
            },
          ]}>
          <View style={styles.sectionHeader}>
            <Icon name="call-outline" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Contact Information</Text>
          </View>
          
          {!worker.unlocked ? (
            <View style={styles.lockedCard}>
              <Text style={styles.lockedTitle}>Contact Details Locked</Text>
              <Text style={styles.lockedSubtitle}>
                Unlock to view phone number and WhatsApp
              </Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceLabel}>Unlock Price</Text>
                <Text style={styles.priceValue}>₹{unlockPrice}</Text>
              </View>
              <View style={styles.unlockFeatures}>
                <View style={styles.unlockFeature}>
                  <Icon name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.unlockFeatureText}>Direct Phone Number</Text>
                </View>
                <View style={styles.unlockFeature}>
                  <Icon name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.unlockFeatureText}>WhatsApp Contact</Text>
                </View>
                <View style={styles.unlockFeature}>
                  <Icon name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.unlockFeatureText}>Instant Connection</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.contactCards}>
              <TouchableOpacity 
                style={styles.contactCard}
                onPress={handleCall}
                activeOpacity={0.7}>
                <View style={styles.contactIconContainer}>
                  <Icon name="call" size={24} color="#10B981" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Phone Number</Text>
                  <Text style={styles.contactValue}>{worker.mobile || worker.phone || 'N/A'}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactCard}
                onPress={handleWhatsApp}
                activeOpacity={0.7}>
                <View style={[styles.contactIconContainer, {backgroundColor: '#25D36615'}]}>
                  <Icon name="logo-whatsapp" size={24} color="#25D366" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>WhatsApp</Text>
                  <Text style={styles.contactValue}>{worker.mobile || worker.phone || 'N/A'}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Professional Stats */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
            },
          ]}>
          <View style={styles.sectionHeader}>
            <Icon name="stats-chart" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Professional Stats</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statsColumn}>
              <View style={styles.statItem}>
                <View style={styles.statItemIconWrapper}>
                  <Icon name="calendar-outline" size={22} color={colors.primary} />
                </View>
                <Text style={styles.statItemValue}>2026</Text>
                <Text style={styles.statItemLabel}>Member Since</Text>
               
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemIconWrapper}>
                  <Icon name="checkmark-done-outline" size={22} color="#10B981" />
                </View>
                <Text style={styles.statItemValue}>{worker.reviews}</Text>
                <Text style={styles.statItemLabel}>Jobs Completed</Text>
                
              </View>
            </View>
            <View style={styles.statsColumn}>
              <View style={styles.statItem}>
                <View style={styles.statItemIconWrapper}>
                  <Icon name="people-outline" size={22} color="#F59E0B" />
                </View>
                <Text style={styles.statItemValue}>{Math.floor(worker.reviews * 0.8)}</Text>
                <Text style={styles.statItemLabel}>Happy Clients</Text>
             
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemIconWrapper}>
                  <Icon name="repeat-outline" size={22} color="#8B5CF6" />
                </View>
                <Text style={styles.statItemValue}>85%</Text>
                <Text style={styles.statItemLabel}>Repeat Rate</Text>
               
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        {!worker.unlocked ? (
          <TouchableOpacity
            style={styles.unlockButton}
            onPress={unlockWorker}>
            <Icon name="lock-open" size={20} color="#FFFFFF" />
            <Text style={styles.unlockButtonText}>
              Unlock Contact - ₹{unlockPrice}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.contactActions}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}>
              <Icon name="call" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={handleWhatsApp}>
              <Icon name="logo-whatsapp" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  curvedNavbarBackground: {
    backgroundColor: '#2a2d6c',
    paddingBottom: 80, // Reduced for tighter spacing
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    position: 'relative',
    zIndex: 0,
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -55, // Tighter overlap
    alignSelf: 'center',
    zIndex: 100,
  },
  profilePhotoWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  profilePhotoImage: {
    width: '100%',
    height: '100%',
  },
  profilePhotoInitials: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
    marginTop: 60, // Reduced gap
  },
  contentSection: {
    backgroundColor: colors.lightBg,
  },
  workerInfoSection: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  onlineDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  workerInfoContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  backButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  // Hero Section
  heroSection: {
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  heroGradient: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarRing: {
    padding: 0,
  },
  avatar: {
    width: 0,
    height: 0,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 0,
  },
  verifiedBadgeTop: {
    display: 'none',
  },
  availableDot: {
    display: 'none',
  },
  availablePulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  workerName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  workerCategory: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  statusBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.xl,
    gap: 6,
    borderWidth: 1.5,
  },
  verifiedBadge: {
    backgroundColor: '#10B98110',
    borderColor: '#10B98130',
  },
  featuredBadge: {
    backgroundColor: '#F59E0B10',
    borderColor: '#F59E0B30',
  },
  trustedBadge: {
    backgroundColor: '#8B5CF610',
    borderColor: '#8B5CF630',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  // Stats Section
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    maxHeight: 120,
    marginHorizontal: spacing.xs,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3ba6cf15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Location Card - Separate
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    minHeight: 72,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  // Info Card
  infoCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  workerTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#3ba6cf15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: '#3ba6cf30',
  },
  workerTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  // Section
  section: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  // Skills
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: '#3ba6cf30',
  },
  skillText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  // Locked Contact
  lockedCard: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lockedSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  priceTag: {
    backgroundColor: '#3ba6cf15',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#3ba6cf30',
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  unlockFeatures: {
    gap: spacing.sm,
    width: '100%',
  },
  unlockFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  unlockFeatureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  // Contact Cards
  contactCards: {
    gap: spacing.md,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 72,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B98115',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  // Professional Stats
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statsColumn: {
    flex: 1,
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.lightBg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
    minHeight: 130,
    maxHeight: 130,
  },
  statItemIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  statItemValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  statItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  // Bottom Actions
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  unlockButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
