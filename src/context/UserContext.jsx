import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    phone: '+91 00000 00000',
    address: 'Not provided',
    profileImage: null,
  });

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = {...user, ...userData};
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loginUser = async (userData) => {
    try {
      const newUser = {
        name: userData.name || 'User',
        email: userData.email || 'user@example.com',
        phone: userData.phone || '+91 00000 00000',
        address: userData.address || 'Not provided',
        profileImage: userData.profileImage || null,
      };
      setUser(newUser);
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in user:', error);
    }
  };

  const logoutUser = async () => {
    try {
      const guestUser = {
        name: 'Guest User',
        email: 'guest@example.com',
        phone: '+91 00000 00000',
        address: 'Not provided',
        profileImage: null,
      };
      setUser(guestUser);
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{user, updateUser, loginUser, logoutUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
