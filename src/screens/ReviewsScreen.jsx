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
import {Card} from '../components';
import {colors, spacing} from '../theme';

export const ReviewsScreen = ({route, navigation}) => {
  const {service} = route.params;

  // Mock reviews data - in real app, this would come from API
  const allReviews = [
    {
      id: '1',
      name: 'Rahul Sharma',
      initials: 'RS',
      rating: 5,
      date: '2 days ago',
      comment: 'Excellent service! Very professional and completed the work on time. Highly recommended.',
      avatarColor: colors.primary,
    },
    {
      id: '2',
      name: 'Priya Singh',
      initials: 'PS',
      rating: 4,
      date: '5 days ago',
      comment: 'Good work and punctual. The service quality was satisfactory.',
      avatarColor: '#FF6B9D',
    },
    {
      id: '3',
      name: 'Amit Kumar',
      initials: 'AK',
      rating: 5,
      date: '1 week ago',
      comment: 'Outstanding service! The technician was very skilled and friendly. Will definitely book again.',
      avatarColor: '#4CAF50',
    },
    {
      id: '4',
      name: 'Sneha Patel',
      initials: 'SP',
      rating: 5,
      date: '1 week ago',
      comment: 'Very satisfied with the service. Professional approach and quality work.',
      avatarColor: '#FF9800',
    },
    {
      id: '5',
      name: 'Rajesh Verma',
      initials: 'RV',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good service overall. The work was done properly and on time.',
      avatarColor: '#2196F3',
    },
    {
      id: '6',
      name: 'Neha Gupta',
      initials: 'NG',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent experience! Very professional and courteous staff.',
      avatarColor: '#9C27B0',
    },
    {
      id: '7',
      name: 'Vikram Singh',
      initials: 'VS',
      rating: 3,
      date: '3 weeks ago',
      comment: 'Service was okay. Could have been better in terms of timing.',
      avatarColor: '#FF5722',
    },
    {
      id: '8',
      name: 'Anjali Sharma',
      initials: 'AS',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Highly recommended! The service provider was very professional and did an excellent job.',
      avatarColor: '#00BCD4',
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.accent} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Reviews</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Service Info Card */}
      <View style={styles.serviceInfoCard}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={20} color="#FFD700" />
          <Text style={styles.ratingText}>{service.rating}</Text>
          <Text style={styles.reviewCount}>({service.reviews} reviews)</Text>
        </View>
      </View>

      {/* Reviews List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.reviewsList}>
          {allReviews.map((review, index) => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View
                    style={[
                      styles.avatarCircle,
                      {backgroundColor: review.avatarColor},
                    ]}>
                    <Text style={styles.avatarText}>{review.initials}</Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.starsRow}>{renderStars(review.rating)}</View>
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
            </Card>
          ))}
        </View>
        <View style={styles.bottomSpacing} />
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
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl + 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  serviceInfoCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  reviewsList: {
    padding: spacing.md,
  },
  reviewCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reviewerDetails: {
    gap: 2,
    flex: 1,
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
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
});
