import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RefreshCw, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { usePWA } from '@/hooks/usePWA';

export default function PWAUpdateBanner() {
  const { updateAvailable, updatePWA } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  const handleUpdate = () => {
    updatePWA();
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <RefreshCw size={20} color={Colors.agpGreen} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Mise à jour disponible</Text>
          <Text style={styles.subtitle}>
            Une nouvelle version de l'application est prête
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Text style={styles.updateButtonText}>Mettre à jour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  updateButton: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  updateButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});