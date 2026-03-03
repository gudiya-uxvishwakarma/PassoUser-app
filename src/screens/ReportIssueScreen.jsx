import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, shadows} from '../theme';
import {reportOptions} from '../data/workerData';

export const ReportIssueScreen = ({route, navigation}) => {
  const {worker} = route.params;
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!selectedIssue) {
      Alert.alert('Issue Required', 'Please select an issue type');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Thank you for reporting. Our team will review this.',
      [{text: 'OK', onPress: () => navigation.goBack()}]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workerCard}>
          <Text style={styles.workerName}>{worker.businessName || worker.name}</Text>
          <Text style={styles.workerCategory}>{worker.category}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Issue Type</Text>
        {reportOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedIssue === option.id && styles.optionCardActive,
            ]}
            onPress={() => setSelectedIssue(option.id)}>
            <View style={styles.optionInfo}>
              <Icon
                name={option.icon}
                size={24}
                color={selectedIssue === option.id ? colors.primary : colors.textLight}
              />
              <Text style={styles.optionLabel}>{option.label}</Text>
            </View>
            <View
              style={[
                styles.radio,
                selectedIssue === option.id && styles.radioActive,
              ]}>
              {selectedIssue === option.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.detailsLabel}>Additional Details (Optional)</Text>
        <TextInput
          style={styles.detailsInput}
          placeholder="Provide more information..."
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>
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
    padding: spacing.md,
  },
  workerCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  workerCategory: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  detailsInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: '#EF4444',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
