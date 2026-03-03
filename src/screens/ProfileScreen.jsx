import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius} from '../theme';
import {useLanguage} from '../context/LanguageContext';

export const ProfileScreen = ({navigation}) => {
  const {t} = useLanguage();
  const userName = 'Rahul Kumar';
  const userEmail = 'rahul.kumar@example.com';

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleLanguage = () => {
    navigation.navigate('Language');
  };

  const handleFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleCallHistory = () => {
    navigation.navigate('MyBookings');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleHelpSupport = () => {
    navigation.navigate('HelpSupport');
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      'Are you sure you want to logout?',
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Home');
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  };

  const handleEditImage = () => {
    Alert.alert(
      t('profile.changeProfilePicture'),
      'Choose an option:',
      [
        {text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera feature coming soon!')},
        {text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Gallery feature coming soon!')},
        {text: t('common.cancel'), style: 'cancel'},
      ]
    );
  };

  const SquareButton = ({icon, title, onPress, bgColor}) => {
    return (
      <TouchableOpacity
        style={[styles.squareButton, {backgroundColor: bgColor}]}
        onPress={onPress}
        activeOpacity={0.85}>
        <Icon name={icon} size={36} color="#FFFFFF" />
        <Text style={styles.squareButtonText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#28588f" barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={handleEditImage}>
            <View style={styles.profileImage}>
              <Icon name="person" size={50} color="#28588f" />
            </View>
            <View style={styles.editBadge}>
              <Icon name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}>
            <Icon name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editProfileText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Square Buttons Grid */}
        <View style={styles.buttonsSection}>
          <View style={styles.buttonRow}>
            <SquareButton
              icon="call"
              title="Call History"
              onPress={handleCallHistory}
              bgColor="#42A5F5"
            />
            <SquareButton
              icon="notifications"
              title={t('profile.notifications')}
              onPress={handleNotifications}
              bgColor="#FFA726"
            />
          </View>

          <View style={styles.buttonRow}>
            <SquareButton
              icon="globe"
              title={t('profile.language')}
              onPress={handleLanguage}
              bgColor="#AB47BC"
            />
            <SquareButton
              icon="heart"
              title={t('profile.favorites')}
              onPress={handleFavorites}
              bgColor="#EC407A"
            />
          </View>

          <View style={styles.buttonRow}>
            <SquareButton
              icon="settings"
              title={t('profile.settings')}
              onPress={handleSettings}
              bgColor="#26C6DA"
            />
            <SquareButton
              icon="help-circle"
              title={t('profile.helpSupport')}
              onPress={handleHelpSupport}
              bgColor="#66BB6A"
            />
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}>
            <Icon name="log-out" size={22} color="#FFFFFF" />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.xl + 8,
    backgroundColor: '#28588f',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: spacing.md,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    gap: spacing.xs,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonsSection: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  squareButton: {
    flex: 1,
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    padding: spacing.sm,
  },
  emptySpace: {
    flex: 1,
  },
  squareButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28588f',
    paddingVertical: spacing.md,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#EF5350',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: spacing.xs,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
  },
});
