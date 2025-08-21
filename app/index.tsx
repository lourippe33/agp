import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import AGPLogo from '@/components/AGPLogo';

export default function Index() {
  useEffect(() => {
    // Rediriger automatiquement vers les onglets après 1 seconde
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AGPLogo size={80} />
      </View>
      <Text style={styles.title}>AGP Chronobiologie</Text>
      <Text style={styles.subtitle}>Votre compagnon bien-être</Text>
      
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.agpBlue} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 24,
    backgroundColor: Colors.surface,
    borderRadius: 50,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
});