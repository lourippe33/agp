import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface AGPLogoProps {
  size?: number;
  style?: any;
}

export default function AGPLogo({ size = 40, style }: AGPLogoProps) {
  return (
    <View style={[styles.container, style]}>
      <Image 
        source={require('@/assets/images/LOGO AGP.png')}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Le logo sera redimensionné selon la prop size
  },
});