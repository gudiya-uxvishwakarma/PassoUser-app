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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Navbar} from '../components';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {callHistoryService} from '../services';
import {useLanguage} from '../context/LanguageContext';

export const CallHistoryScreen = ({navigation}) => {
  const {t} = useLanguage();
  const [callHistory, setCallHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCallHistory();
    
    // Listen for navigation focus to reload
    const unsubscribe = navigation.addListener('focus', () => {
      loadCallHistory();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      const history = await callHistoryService.getCallHistory();
      console.log('✅ Loaded call history:', history.length);
      setCallHistory(history);
    } catch (error) {
      console.error('❌ Load call history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCallHistory();
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
    const colorsList = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const index = name.charCodeAt(0) % colorsList.length;
    return colorsList[index];
  };

  const formatCallTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const deleteCallHistory = async (callId, workerName) => {
    Alert.alert(
      'Delete Call History',
      `Remove ${workerName} from call history?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await callHistoryService.deleteCallHistory(callId);
            if (result.success) {
              setCallHistory(result.data);
            }
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all call history?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const result = await callHistoryService.clearCallHistory();
            if (result.success) {
              setCallHistory([]);
              Alert.alert('Success', 'All call history cleared');
            }
          },
        },
      ]
    );
  };

  const navigateToWorkerDetail = (workerId) => {
    navigation.navigate('WorkerDetail', {workerId});
  };

  const renderCallItem = ({item}) => (
    <TouchableOpacity
      style={styles.callCard}
      onPress={() => navigateToWorkerDetail(item.workerId)}
      activeOpacity={0.7}>
      <View style={styles.callContent}>
        {/* Profile Photo */}
        <View style={[styles.avatar, !item.workerPhoto && {backgroundColor: getAvatarColor(item.workerName)}]}>
          {item.workerPhoto ? (
            <Image 
              source={{uri: item.workerPhoto}} 
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarInitials}>{getInitials(item.workerName)}</Text>
          )}
        </View>

        {/* Worker Info */}
        <View style={styles.callInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.workerName} numberOfLines={1}>
              {item.workerName}
            </Text>
            {item.verified && (
              <Icon name="checkmark-circle" size={16} color="#10B981" />
            )}
          </View>
          <Text style={styles.workerCategory} numberOfLines={1}>
            {item.workerCategory}
          </Text>
          <View style={styles.callDetails}>
            <Icon name="call" size={14} color={colors.primary} />
            <Text style={styles.callTime}>{formatCallTime(item.calledAt)}</Text>
            {item.workerCity && (
              <>
                <Text style={styles.dot}>•</Text>
                <Icon name="location" size={14} color={colors.textLight} />
                <Text style={styles.cityText}>{item.workerCity}</Text>
              </>
            )}
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            deleteCallHistory(item.id, item.workerName);
          }}
          activeOpacity={0.7}>
          <Icon name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Navbar
        navigation={navigation}
        title="Call History"
        showBack={false}
        showLocationAndNotification={false}
        showSearchBar={false}
      />

      {/* Header with Clear All */}
      {callHistory.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {callHistory.length} {callHistory.length === 1 ? 'Call' : 'Calls'}
          </Text>
          <TouchableOpacity onPress={clearAllHistory}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {callHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Icon name="call-outline" size={80} color={colors.border} />
          </View>
          <Text style={styles.emptyText}>No Call History</Text>
          <Text style={styles.emptySubtext}>
            Your call history will appear here{'\n'}
            Call workers to see history
          </Text>
        </View>
      ) : (
        <FlatList
          data={callHistory}
          renderItem={renderCallItem}
          keyExtractor={item => item.id}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  list: {
    padding: spacing.md,
  },
  callCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  callContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  callInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  workerCategory: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTime: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: colors.textLight,
  },
  cityText: {
    fontSize: 12,
    color: colors.textLight,
  },
  deleteButton: {
    padding: spacing.xs,
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
