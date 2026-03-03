import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SplashScreen,
  LoginScreen,
  HomeScreen,
  SearchScreen,
  LocationSelectionScreen,
  AllCategoriesScreen,
  ServiceListScreen,
  ServiceDetailScreen,
  PaymentMethodScreen,
  BookingFormScreen,
  BookingConfirmationScreen,
  MyBookingsScreen,
  CallHistoryScreen,
  NotificationScreen,
  ProfileScreen,
  ReviewsScreen,
  PaymentSuccessScreen,
  PaymentFailedScreen,
  WorkerDiscoveryScreen,
  WorkerDetailScreen,
  FavoritesScreen,
  ReportIssueScreen,
  WorkerPaymentScreen,
  WorkerRatingScreen,
  LanguageScreen,
  WalletScreen,
  SettingsScreen,
  EditProfileScreen,
  HelpSupportScreen,
} from '../screens';
import {colors} from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 15,
          right: 15,
          height: 65,
          backgroundColor: colors.accent,
          borderRadius: 32.5,
          paddingHorizontal: 10,
          paddingVertical: 0,
          borderWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 10},
          shadowOpacity: 0.2,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 65,
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'MyBookings') {
            iconName = 'call';
          } else if (route.name === 'Notifications') {
            iconName = 'notifications';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: focused ? 55 : 48,
                height: focused ? 55 : 48,
                borderRadius: 27.5,
                backgroundColor: focused ? colors.primary : 'transparent',
              }}>
              <Icon 
                name={iconName} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          );
        },
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="MyBookings"
        component={CallHistoryScreen}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LocationSelection"
          component={LocationSelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AllCategories"
          component={AllCategoriesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceList"
          component={ServiceListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ServiceDetail"
          component={ServiceDetailScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethodScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingForm"
          component={BookingFormScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="Reviews"
          component={ReviewsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="PaymentFailed"
          component={PaymentFailedScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="WorkerDiscovery"
          component={WorkerDiscoveryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WorkerDetail"
          component={WorkerDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WorkerPayment"
          component={WorkerPaymentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WorkerRating"
          component={WorkerRatingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReportIssue"
          component={ReportIssueScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Wallet"
          component={WalletScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HelpSupport"
          component={HelpSupportScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
