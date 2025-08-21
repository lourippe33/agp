import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface NotificationBellProps {
  style?: any;
  onPress?: () => void;
}

export default function NotificationBell({ style, onPress }: NotificationBellProps) {
  const notificationCount = 0; // Placeholder - sera connecté au service plus tard

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.bellContainer}>
        <Bell size={24} color={Colors.textLight} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
});