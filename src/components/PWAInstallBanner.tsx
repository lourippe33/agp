import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Download, X, Smartphone } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallBanner() {
  const { isInstallable, installPWA, isInstalled } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    try {
      await installPWA();
      Alert.alert(
        '🎉 Installation réussie !',
        'L\'application AGP Chronobiologie est maintenant installée sur votre appareil.',
        [{ text: 'Parfait !', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Erreur d\'installation',
        'Impossible d\'installer l\'application. Veuillez réessayer.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Smartphone size={24} color={Colors.agpBlue} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Installer l'application</Text>
          <Text style={styles.subtitle}>
            Accédez rapidement à AGP Chronobiologie depuis votre écran d'accueil
          </Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.installButton}
            onPress={handleInstall}
            activeOpacity={0.8}
          >
            <Download size={16} color={Colors.textLight} />
            <Text style={styles.installButtonText}>Installer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            activeOpacity={0.8}
          >
            <X size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    margin: 16,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 20,
    padding: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  installButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  dismissButton: {
    padding: 8,
  },
});