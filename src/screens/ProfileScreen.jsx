import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {colors, spacing, borderRadius} from '../theme';
import {useLanguage} from '../context/LanguageContext';
import {useUser} from '../context/UserContext';

export const ProfileScreen = ({navigation}) => {
  const {t} = useLanguage();
  const {user, updateUser, logoutUser} = useUser();
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [profileImage, setProfileImage] = useState(user.profileImage);

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
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    await updateUser({
      name,
      email,
      phone,
      address,
      profileImage,
    });
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{text: 'OK', onPress: () => setEditModalVisible(false)}]
    );
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to open camera');
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
        Alert.alert('Success', 'Photo captured successfully!');
      }
    });
  };

  const handleChooseFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to open gallery');
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
        Alert.alert('Success', 'Photo selected successfully!');
      }
    });
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        {text: 'Take Photo', onPress: handleTakePhoto},
        {text: 'Choose from Gallery', onPress: handleChooseFromGallery},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
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
          onPress: async () => {
            await logoutUser();
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
              {profileImage ? (
                <Image source={{uri: profileImage}} style={styles.profileImageFull} />
              ) : (
                <Icon name="person" size={50} color="#28588f" />
              )}
            </View>
            <View style={styles.editBadge}>
              <Icon name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}>
            <View style={styles.editProfileContent}>
              <Icon name="create" size={20} color="#FFFFFF" />
              <Text style={styles.editProfileText}>{t('profile.editProfile')}</Text>
            </View>
            <View style={styles.editProfileShine} />
          </TouchableOpacity>
        </View>

        {/* Square Buttons Grid */}
        <View style={styles.buttonsSection}>
          <View style={styles.buttonRow}>
            <SquareButton
              icon="call"
              title="Call"
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
              icon="help-buoy"
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

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Photo */}
              <View style={styles.modalPhotoSection}>
                <View style={styles.modalPhotoContainer}>
                  {profileImage ? (
                    <Image source={{uri: profileImage}} style={styles.modalPhotoFull} />
                  ) : (
                    <Icon name="person" size={50} color={colors.primary} />
                  )}
                </View>
                <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                  <Icon name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={styles.modalForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={20} color={colors.textLight} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your name"
                      placeholderTextColor={colors.textLight}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color={colors.textLight} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      placeholderTextColor={colors.textLight}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="call-outline" size={20} color={colors.textLight} />
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter your phone"
                      keyboardType="phone-pad"
                      placeholderTextColor={colors.textLight}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="location-outline" size={20} color={colors.textLight} />
                    <TextInput
                      style={styles.input}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Enter your address"
                      multiline
                      placeholderTextColor={colors.textLight}
                    />
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Icon name="checkmark-circle" size={22} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 50,
    backgroundColor: colors.accent,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  editProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    zIndex: 1,
  },
  editProfileShine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{skewX: '-20deg'}],
  },
  editProfileText: {
    fontSize: 15,
    fontWeight: '700',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalPhotoSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  modalPhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 50,
    gap: spacing.xs,
    elevation: 3,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalForm: {
    paddingHorizontal: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    gap: spacing.xs,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  profileImageFull: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  modalPhotoFull: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});
