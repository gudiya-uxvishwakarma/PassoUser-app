import React from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigation/AppNavigator';
import {BookingProvider} from './src/context/BookingContext';
import {LanguageProvider} from './src/context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BookingProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </BookingProvider>
    </LanguageProvider>
  );
}

export default App;
