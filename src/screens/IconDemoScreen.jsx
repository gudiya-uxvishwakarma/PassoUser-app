import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Icon, Button, Card} from '../components';
import {colors, spacing} from '../theme';

export const IconDemoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Demo</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Ionicons (Default)</Text>
        <View style={styles.iconRow}>
          <Icon name="home" size={32} color={colors.primary} />
          <Icon name="person" size={32} color={colors.primary} />
          <Icon name="calendar" size={32} color={colors.primary} />
          <Icon name="notifications" size={32} color={colors.primary} />
          <Icon name="settings" size={32} color={colors.primary} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Material Icons</Text>
        <View style={styles.iconRow}>
          <Icon name="check-circle" family="MaterialIcons" size={32} color="green" />
          <Icon name="error" family="MaterialIcons" size={32} color="red" />
          <Icon name="star" family="MaterialIcons" size={32} color="gold" />
          <Icon name="favorite" family="MaterialIcons" size={32} color="red" />
          <Icon name="search" family="MaterialIcons" size={32} color={colors.primary} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Material Community Icons</Text>
        <View style={styles.iconRow}>
          <Icon name="phone" family="MaterialCommunityIcons" size={32} color={colors.primary} />
          <Icon name="email" family="MaterialCommunityIcons" size={32} color={colors.primary} />
          <Icon name="account-hard-hat" family="MaterialCommunityIcons" size={32} color={colors.primary} />
          <Icon name="wrench" family="MaterialCommunityIcons" size={32} color={colors.primary} />
          <Icon name="home-city" family="MaterialCommunityIcons" size={32} color={colors.primary} />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons with Icons</Text>
        <Button 
          title="Login" 
          icon="log-in" 
          iconPosition="left"
          style={styles.button}
        />
        <Button 
          title="Next" 
          icon="arrow-forward" 
          iconPosition="right"
          variant="secondary"
          style={styles.button}
        />
        <Button 
          title="Call Support" 
          icon="call" 
          iconPosition="left"
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    marginBottom: spacing.sm,
  },
});
