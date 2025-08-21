import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { usePWA } from '@/hooks/usePWA';

export default function OfflineBanner() {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <WifiOff size={16} color={Colors.textLight} />
      <Text style={styles.text}>Mode hors ligne - Fonctionnalités limitées</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
});