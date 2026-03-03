import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

export const PaasoLogo = ({size = 'large'}) => {
  const isLarge = size === 'large';
  const logoSize = isLarge ? 200 : 100;
  const fontSize = isLarge ? 48 : 24;
  const subtitleSize = isLarge ? 20 : 12;

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.jpg')} 
        style={[styles.logo, {width: logoSize, height: logoSize}]}
        resizeMode="contain"
      />
      <Text style={[styles.title, {fontSize}]}>Paaso</Text>
      <Text style={[styles.subtitle, {fontSize: subtitleSize}]}>Workers near you</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: '#4A9FD8',
    marginTop: 4,
    fontWeight: '500',
  },
});
