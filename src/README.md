# User App - Service Booking UI

## 📱 App Structure

### Screens
- **SplashScreen** - Animated splash with logo
- **HomeScreen** - Main screen with categories, banners, services
- **ServiceListScreen** - Category-wise service listing with filters
- **ServiceDetailScreen** - Detailed service info with reviews
- **BookingFormScreen** - Booking form (no login required)
- **BookingConfirmationScreen** - Booking success screen
- **MyBookingsScreen** - View all bookings
- **NotificationScreen** - Booking notifications
- **ProfileScreen** - User profile (phone-based)

### Components
- **Card** - Reusable card with shadow
- **Button** - Primary/Secondary buttons
- **SearchBar** - Search input with icon

### Theme
- **Colors** - Purple/Blue primary theme
- **Spacing** - Consistent spacing system
- **Border Radius** - Rounded corners (10-15px)

## 🎨 Design Features
✅ Clean & Minimal white background
✅ Soft shadow cards
✅ Rounded buttons
✅ Modern icons (emoji-based)
✅ Smooth animations
✅ Bottom tab navigation

## 📦 Installation

```bash
# Install dependencies
npm install

# iOS specific
cd ios && pod install && cd ..

# Run Android
npm run android

# Run iOS
npm run ios
```

## 🔄 App Flow
Home → Category → Service List → Service Detail → Booking Form → Confirmation

## 📋 Bottom Tabs
- 🏠 Home
- 📋 My Bookings
- 🔔 Notifications
- 👤 Profile
