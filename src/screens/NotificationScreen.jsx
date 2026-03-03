import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from '../components';
import {colors, spacing} from '../theme';
import {notifications} from '../data/mockData';

export const NotificationScreen = ({navigation}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const getIconComponent = (iconFamily) => {
    switch (iconFamily) {
      case 'MaterialIcons':
        return MaterialIcons;
      case 'MaterialCommunityIcons':
        return MaterialCommunityIcons;
      default:
        return Icon;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'info':
        return colors.primary;
      case 'promo':
        return '#FF9800';
      case 'reminder':
        return '#2196F3';
      default:
        return colors.primary;
    }
  };

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedNotification(null), 300);
  };

  const getAccentColor = (title) => {
    const accentColors = [
      '#8B5CF6', // Vibrant Purple
      '#EC4899', // Hot Pink
      '#3B82F6', // Bright Blue
      '#10B981', // Emerald Green
      '#F59E0B', // Amber Orange
      '#06B6D4', // Cyan
      '#6366F1', // Indigo
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#F97316', // Orange
    ];
    const colorIndex = title ? title.charCodeAt(0) % accentColors.length : 0;
    return accentColors[colorIndex];
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2c3e7d" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        contentContainerStyle={styles.list}
        renderItem={({item}) => {
          const IconComponent = getIconComponent(item.iconFamily);
          const typeColor = getTypeColor(item.type);
          const accentColor = getAccentColor(item.title);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNotificationPress(item)}>
              <View style={[
                styles.notificationCard,
                !item.read && styles.unreadCard,
              ]}>
                {/* Left Accent Bar */}
                <View style={[styles.accentBar, {backgroundColor: accentColor}]} />
                
                <View style={styles.row}>
                  <View style={[
                    styles.iconContainer,
                    {backgroundColor: typeColor + '20'},
                  ]}>
                    <IconComponent name={item.icon} size={28} color={typeColor} />
                  </View>
                  <View style={styles.content}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{item.title}</Text>
                      {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.message} numberOfLines={2}>
                      {item.message}
                    </Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <Icon name="chevron-forward" size={22} color={colors.textLight} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="notifications-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />

      {/* Notification Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedNotification && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}>
                    <Icon name="close" size={28} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={false}>
                  <View style={[
                    styles.modalIconContainer,
                    {backgroundColor: getTypeColor(selectedNotification.type) + '20'},
                  ]}>
                    {(() => {
                      const IconComponent = getIconComponent(selectedNotification.iconFamily);
                      return (
                        <IconComponent
                          name={selectedNotification.icon}
                          size={48}
                          color={getTypeColor(selectedNotification.type)}
                        />
                      );
                    })()}
                  </View>

                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                  <Text style={styles.modalDate}>{selectedNotification.date}</Text>

                  <View style={styles.divider} />

                  <Text style={styles.modalMessage}>{selectedNotification.message}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedNotification.description}
                  </Text>

                  <Button
                    title="Close"
                    onPress={closeModal}
                    style={styles.closeModalButton}
                  />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2c3e7d',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: '#F8F9FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  message: {
    fontSize: 13,
    color: '#666666',
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: '#999999',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalContent: {
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalDate: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: spacing.lg,
  },
  modalMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: spacing.md,
  },
  modalDescription: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  closeModalButton: {
    marginTop: spacing.md,
  },
});
