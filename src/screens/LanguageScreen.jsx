import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navbar} from '../components';
import {spacing} from '../theme';
import {useLanguage} from '../context/LanguageContext';

const languages = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
  },
  {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
  },
  {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
  },
  {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
  },
  {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
  },
  {
    id: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
  },
  {
    id: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
  },
  {
    id: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
  },
  {
    id: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
  },
  {
    id: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    flag: '🇮🇳',
  },
  {
    id: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    flag: '🇮🇳',
  },
];

export const LanguageScreen = ({navigation}) => {
  const {currentLanguage, changeLanguage, t} = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageSelect = async (languageId) => {
    setSelectedLanguage(languageId);
    await changeLanguage(languageId);
    setTimeout(() => {
      navigation.goBack();
    }, 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2c2d6d" barStyle="light-content" />

      {/* Navbar */}
      <Navbar
        navigation={navigation}
        title={t('common.selectLanguage')}
        showBack={true}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.subtitleContainer}>
            <Icon name="language-outline" size={20} color="#666" />
            <Text style={styles.subtitle}>
              {t('common.chooseLanguage')}
            </Text>
          </View>

          <View style={styles.languageGrid}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageCard,
                  selectedLanguage === language.id && styles.selectedCard,
                ]}
                onPress={() => handleLanguageSelect(language.id)}
                activeOpacity={0.8}>
                {selectedLanguage === language.id && (
                  <View style={styles.checkBadge}>
                    <Icon name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
                <Text style={styles.flag}>{language.flag}</Text>
                <Text style={styles.nativeName}>{language.nativeName}</Text>
                <Text style={styles.languageName}>{language.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  languageCard: {
    width: '48%',
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    marginBottom: 4,
  },
  selectedCard: {
    borderColor: '#2c2d6d',
    backgroundColor: '#e8e8f0',
    elevation: 4,
    shadowOpacity: 0.15,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2c2d6d',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  flag: {
    fontSize: 52,
    marginBottom: 12,
    lineHeight: 56,
  },
  nativeName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 24,
  },
  languageName: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});
