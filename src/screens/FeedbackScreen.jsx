import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, shadows} from '../theme';

export const FeedbackScreen = ({navigation}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this amazing Home Services app! Download now and get instant access to trusted professionals. 🏠✨',
        title: 'Home Services App',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert('Success', 'Thank you for sharing!');
        } else {
          Alert.alert('Success', 'Thank you for sharing!');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share at this moment');
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating');
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully. We appreciate your time!',
      [{text: 'OK', onPress: () => navigation.goBack()}]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate & Share</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rating Section */}
        <View style={styles.section}>
          <View style={styles.iconCircle}>
            <Icon name="star" size={40} color="#FFC107" />
          </View>
          <Text style={styles.sectionTitle}>How would you rate our app?</Text>
          <Text style={styles.sectionSubtitle}>Your feedback helps us improve</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}>
                <Icon
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={48}
                  color={star <= rating ? '#FFC107' : '#E0E0E0'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 5 && '🎉 Excellent!'}
              {rating === 4 && '😊 Great!'}
              {rating === 3 && '👍 Good!'}
              {rating === 2 && '😐 Fair'}
              {rating === 1 && '😞 Poor'}
            </Text>
          )}
        </View>

        {/* Feedback Section */}
        <View style={styles.section}>
          <Text style={styles.feedbackLabel}>Share your thoughts (Optional)</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Tell us what you think..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="checkmark-circle" size={22} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* Share Section */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.shareSection}>
          <Icon name="share-social" size={40} color={colors.primary} />
          <Text style={styles.shareSectionTitle}>Share with Friends</Text>
          <Text style={styles.shareSectionSubtitle}>
            Help others discover our services
          </Text>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share-outline" size={22} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Share App</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 40}} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    ...shadows.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.background,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFC107' + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  starButton: {
    padding: spacing.xs,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  feedbackInput: {
    width: '100%',
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadows.medium,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginHorizontal: spacing.md,
  },
  shareSection: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.medium,
  },
  shareSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  shareSectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadows.medium,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
