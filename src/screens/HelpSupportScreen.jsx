import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius} from '../theme';
import {useLanguage} from '../context/LanguageContext';

export const HelpSupportScreen = ({navigation}) => {
  const {t} = useLanguage();

  const handleCall = () => {
    Linking.openURL('tel:1800-XXX-XXXX');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@homeservices.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=919876543210');
  };

  const HelpOption = ({icon, title, subtitle, onPress, iconColor}) => (
    <TouchableOpacity style={styles.helpOption} onPress={onPress}>
      <View style={[styles.helpIcon, {backgroundColor: iconColor + '15'}]}>
        <Icon name={icon} size={28} color={iconColor} />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{title}</Text>
        <Text style={styles.helpSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const FAQItem = ({question, answer}) => {
    const [expanded, setExpanded] = React.useState(false);
    
    return (
      <TouchableOpacity 
        style={styles.faqItem} 
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <Icon 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={colors.textLight} 
          />
        </View>
        {expanded && (
          <Text style={styles.faqAnswer}>{answer}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      <Navbar
        navigation={navigation}
        title={t('profile.helpSupport')}
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <HelpOption
            icon="call"
            title="Call Us"
            subtitle="1800-XXX-XXXX (Toll Free)"
            onPress={handleCall}
            iconColor="#4CAF50"
          />
          
          <HelpOption
            icon="mail"
            title="Email Us"
            subtitle="support@homeservices.com"
            onPress={handleEmail}
            iconColor="#2196F3"
          />
          
          <HelpOption
            icon="logo-whatsapp"
            title="WhatsApp"
            subtitle="Chat with us on WhatsApp"
            onPress={handleWhatsApp}
            iconColor="#25D366"
          />
          
          <HelpOption
            icon="chatbubbles"
            title="Live Chat"
            subtitle="Chat with our support team"
            onPress={() => Alert.alert('Live Chat', 'Coming soon!')}
            iconColor="#FF9800"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <HelpOption
            icon="document-text"
            title="Report an Issue"
            subtitle="Report a problem with your booking"
            onPress={() => navigation.navigate('ReportIssue', {
              worker: {
                name: 'General Issue',
                businessName: 'General Support',
                category: 'Support Request'
              }
            })}
            iconColor="#F44336"
          />
          
          <HelpOption
            icon="star"
            title="Rate Us"
            subtitle="Share your feedback"
            onPress={() => navigation.navigate('Feedback')}
            iconColor="#FFC107"
          />
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          <FAQItem
            question="How do I book a service?"
            answer="Browse services, select your preferred service, choose a time slot, and confirm your booking. You'll receive a confirmation immediately."
          />
          
          <FAQItem
            question="How can I cancel my booking?"
            answer="Go to My Bookings, select the booking you want to cancel, and tap the Cancel button. Cancellation charges may apply based on timing."
          />
          
          <FAQItem
            question="What payment methods are accepted?"
            answer="We accept Cash, UPI, Credit/Debit Cards, and Wallet payments. You can choose your preferred method at checkout."
          />
          
          <FAQItem
            question="How do I add money to my wallet?"
            answer="Go to Wallet section, tap Add Money, enter the amount, and complete the payment using your preferred method."
          />
          
          <FAQItem
            question="Can I reschedule my booking?"
            answer="Yes, go to My Bookings, select your booking, and tap Reschedule. Choose a new date and time that works for you."
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  helpIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 13,
    color: colors.textLight,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
