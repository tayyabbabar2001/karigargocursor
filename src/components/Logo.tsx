import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'full';
  style?: any;
}

export function Logo({ size = 'medium', variant = 'full', style }: LogoProps) {
  const sizes = {
    small: { width: 80, height: 40 },
    medium: { width: 160, height: 80 },
    large: { width: 240, height: 120 },
  };

  const currentSize = sizes[size];

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('../../assets/logo.png')}
        style={{ width: currentSize.width, height: currentSize.height, resizeMode: 'contain' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
