import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Chrome as Home } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { View } from 'react-native';

export default function PersistentTabBar() {
  const pathname = usePathname();
  const [tabBarHeight] = useState(new Animated.Value(70));
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down - hide tab bar
          Animated.timing(tabBarHeight, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          // Scrolling up - show tab bar
          Animated.timing(tabBarHeight, {
            toValue: 70,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
        
        setLastScrollY(currentScrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  const navigateToHome = () => {
    router.replace('/(tabs)/home');
  };

  // Ne pas afficher la tab bar sur la page d'accueil elle-même
  // Ni sur aucune page des tabs principales qui ont déjà la navigation en bas
  if (pathname === '/(tabs)/home' || pathname === '/' || 
      pathname === '/(tabs)/programme' || 
      pathname === '/(tabs)/suivi' || 
      pathname === '/(tabs)/communaute' || 
      pathname === '/(tabs)/profil' ||
      pathname === '/(tabs)/journal') {
    return <View />;
  }

  return (
    <Animated.View style={[styles.container, { height: tabBarHeight }]}>
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={navigateToHome}
        activeOpacity={0.8}
      >
        <Home size={24} color={Colors.primary} strokeWidth={2} />
        <Text style={styles.homeButtonText}>Accueil</Text>
      </TouchableOpacity>
    </Animated.View>
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
    paddingBottom: Platform.OS === 'ios' ? 25 : 8, // Ajout de padding pour iOS
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