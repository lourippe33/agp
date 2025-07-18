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

  // Afficher la tab bar seulement sur les pages qui ne sont PAS dans les tabs principaux
  const isTabPage = pathname.startsWith('/(tabs)/');
  
  // Ne pas afficher sur les pages qui ont déjà leur propre navigation
  if (isTabPage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={navigateToHome}
        activeOpacity={0.8}
      >
        <Home size={24} color={Colors.textLight} />
        <Text style={styles.homeButtonText}>Retour Accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  homeButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  homeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});