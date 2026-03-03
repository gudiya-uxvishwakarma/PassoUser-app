import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card, Button} from '../components';
import {colors, spacing} from '../theme';

export const ServiceDetailScreen = ({route, navigation}) => {
  const {service} = route.params;
  const [showCallModal, setShowCallModal] = useState(false);

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

  const IconComponent = getIconComponent(service.imageFamily);

  const handleCallNow = () => {
    setShowCallModal(true);
  };

  const handleBookNow = () => {
    navigation.navigate('BookingForm', {service});
  };

  const makePhoneCall = () => {
    const phoneNumber = '9876543210';
    Linking.openURL(`tel:${phoneNumber}`);
    setShowCallModal(false);
  };

  const handleSelectPayment = () => {
    setShowCallModal(false);
    navigation.navigate('PaymentMethod', {service});
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#26296c" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Service Header with Icon */}
        <View style={styles.headerSection}>
          <View style={styles.headerGradient} />
          
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Service Icon */}
          <View style={styles.serviceIconContainer}>
            <View style={styles.iconCircle}>
              <IconComponent name={service.image} size={60} color="#FFFFFF" />
            </View>
          </View>

          {/* Rating Badge */}
          <View style={styles.floatingRatingBadge}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.floatingRatingText}>{service.rating}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Service Title Card */}
          <View style={styles.titleSection}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.categoryRow}>
              <View style={styles.categoryBadge}>
                <Icon name="pricetag" size={14} color={colors.primary} />
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
            </View>
          </View>

          {/* Info Cards with Gradient Colors */}
          <View style={styles.infoCardsRow}>
            <View style={[styles.infoCard, styles.priceCard]}>
              <View style={styles.infoIconWrapper}>
                <Icon name="cash" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>₹{service.price}</Text>
            </View>

            <View style={[styles.infoCard, styles.durationCard]}>
              <View style={styles.infoIconWrapper}>
                <Icon name="time" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{service.duration}</Text>
            </View>

            <View style={[styles.infoCard, styles.ratingCard]}>
              <View style={styles.infoIconWrapper}>
                <Icon name="star" size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>{service.rating}</Text>
            </View>
          </View>

          {/* Description Card */}
          <Card style={styles.descriptionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerIconCircle}>
                <Icon name="document-text" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Service Details</Text>
            </View>
            <Text style={styles.description}>
              {service.description || `Professional ${service.name.toLowerCase()} service with experienced workers. We ensure quality work and customer satisfaction. All tools and materials included. Our team is trained and certified to provide the best service experience.`}
            </Text>
            
            <View style={styles.serviceMetaInfo}>
              <View style={styles.metaItem}>
                <Icon name="briefcase" size={18} color={colors.primary} />
                <Text style={styles.metaText}>Category: {service.category}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="people" size={18} color={colors.primary} />
                <Text style={styles.metaText}>Reviews: {service.reviews} customers</Text>
              </View>
            </View>
          </Card>

          {/* Features Card */}
          <Card style={styles.featuresCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerIconCircle}>
                <Icon name="checkmark-done" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>What's Included</Text>
            </View>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Professional Service</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>All Tools Included</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>Quality Guarantee</Text>
              </View>
              <View style={styles.featureItem}>
                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>On-Time Service</Text>
              </View>
            </View>
          </Card>

          {/* Reviews Card */}
          <Card style={styles.reviewsCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerIconCircle}>
                <Icon name="chatbubbles" size={20} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
            </View>

            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>RS</Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>Rahul Sharma</Text>
                    <Text style={styles.reviewDate}>2 days ago</Text>
                  </View>
                </View>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Icon key={i} name="star" size={14} color="#FFD700" />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>
                Excellent service! Very professional and completed the work on time. Highly recommended.
              </Text>
            </View>

            <View style={styles.reviewDivider} />

            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={[styles.avatarCircle, styles.avatarCircle2]}>
                    <Text style={styles.avatarText}>PS</Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>Priya Singh</Text>
                    <Text style={styles.reviewDate}>5 days ago</Text>
                  </View>
                </View>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4].map(i => (
                    <Icon key={i} name="star" size={14} color="#FFD700" />
                  ))}
                  <Icon name="star-outline" size={14} color="#FFD700" />
                </View>
              </View>
              <Text style={styles.reviewText}>
                Good work and punctual. The service quality was satisfactory.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewAllReviewsButton}
              onPress={() => navigation.navigate('Reviews', {service})}>
              <Text style={styles.viewAllReviewsText}>View All Reviews</Text>
              <Icon name="chevron-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          </Card>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.priceSection}>
            <Text style={styles.footerPriceLabel}>Total Price</Text>
            <Text style={styles.footerPrice}>₹{service.price}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookNowButton}
            onPress={handleBookNow}>
            <Icon name="calendar" size={22} color="#FFFFFF" />
            <Text style={styles.bookNowText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Call Now Modal */}
      <Modal
        visible={showCallModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <View style={styles.callIconCircle}>
                <Icon name="call" size={40} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.modalTitle}>Contact Us</Text>
            <Text style={styles.modalSubtitle}>Choose an option to proceed</Text>

            {/* Call Button */}
            <TouchableOpacity
              style={styles.callButton}
              onPress={makePhoneCall}>
              <View style={styles.callButtonIcon}>
                <Icon name="call" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.callButtonInfo}>
                <Text style={styles.callButtonTitle}>Call Now</Text>
                <Text style={styles.callButtonNumber}>+91 98765 43210</Text>
              </View>
              <Icon name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* Payment Method Button */}
            <TouchableOpacity
              style={styles.paymentMethodButton}
              onPress={handleSelectPayment}>
              <View style={styles.paymentButtonIcon}>
                <Icon name="card" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.paymentButtonInfo}>
                <Text style={styles.paymentButtonTitle}>Select Payment Method</Text>
                <Text style={styles.paymentButtonDesc}>Choose how you want to pay</Text>
              </View>
              <Icon name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCallModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  headerSection: {
    height: 180,
    backgroundColor: '#26296c',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: spacing.xl + 10,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.accent,
  },
  floatingRatingBadge: {
    position: 'absolute',
    top: spacing.xl + 10,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    gap: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingRatingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  contentSection: {
    padding: spacing.lg,
    marginTop: -40,
  },
  titleSection: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.xs + 2,
  },
  infoCard: {
    flex: 1,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 105,
  },
  priceCard: {
    backgroundColor: '#4CAF50',
  },
  durationCard: {
    backgroundColor: '#2196F3',
  },
  ratingCard: {
    backgroundColor: colors.accent,
  },
  infoIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  descriptionCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
  },
  featuresCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
  },
  reviewsCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary + '20',
    gap: spacing.sm,
  },
  headerIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
  },
  serviceMetaInfo: {
    marginTop: spacing.md,
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  reviewItem: {
    marginBottom: spacing.lg,
    backgroundColor: colors.lightBg,
    padding: spacing.md + 2,
    borderRadius: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarCircle2: {
    backgroundColor: '#FF6B9D',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewerDetails: {
    gap: 2,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  viewAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
    gap: spacing.xs,
    backgroundColor: colors.primary + '10',
    borderRadius: 14,
  },
  viewAllReviewsText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  priceSection: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },
  footerPrice: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bookNowButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.md + 2,
    borderRadius: 14,
    gap: spacing.sm,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  bookNowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  callIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  callButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  callButtonInfo: {
    flex: 1,
  },
  callButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  callButtonNumber: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '15',
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accent + '30',
  },
  paymentButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentButtonInfo: {
    flex: 1,
  },
  paymentButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  paymentButtonDesc: {
    fontSize: 13,
    color: colors.textLight,
  },
  cancelButton: {
    backgroundColor: colors.lightBg,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
