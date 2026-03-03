import React from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigation/AppNavigator';
import {BookingProvider} from './src/context/BookingContext';
import {LanguageProvider} from './src/context/LanguageContext';
import {UserProvider} from './src/context/UserContext';

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <BookingProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AppNavigator />
        </BookingProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;
