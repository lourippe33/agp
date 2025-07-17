import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Chrome as Home } from 'lucide-react-native'; 
import { Colors } from '@/constants/Colors';

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
    return null;
  }

  return null;
}

// Styles supprimés car ils ne sont plus utilisés