import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Chrome as Home } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function PersistentTabBar() {
  const pathname = usePathname();

  const navigateToHome = () => {
    router.replace('/(tabs)/home');
  };

  // Ne pas afficher la tab bar sur la page d'accueil elle-même
  if (pathname === '/(tabs)/home' || pathname === '/') {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={navigateToHome}
        activeOpacity={0.8}
      >
        <Home size={24} color={Colors.primary} strokeWidth={2} />
        <Text style={styles.homeButtonText}>Accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  homeButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
});