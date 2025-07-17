import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import { Animated, Platform } from 'react-native';
import { Chrome as Home, ChartBar as BarChart3, Users, Calendar, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
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

  const animatedTabBarStyle = {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: tabBarHeight,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 25 : 8, // Ajout de padding pour iOS
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: animatedTabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          marginTop: 4
        },
        headerStyle: {
          backgroundColor: Colors.surface,
          elevation: 0,
          shadowOpacity: 0
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="programme"
        options={{
          title: 'Programme',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suivi"
        options={{
          title: 'Suivi',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="communaute"
        options={{
          title: 'Communauté',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}