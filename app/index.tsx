import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/src/context/AuthContext';
import AGPLogo from '@/components/AGPLogo';

// Styles CSS globaux pour les barres de défilement sur PC
const globalScrollStyles = `
  * {
    scrollbar-width: thin;
    scrollbar-color: #4A90E2 #f1f1f1;
  }
  
  *::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  *::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }
  
  *::-webkit-scrollbar-thumb {
    background: #4A90E2;
    border-radius: 6px;
    border: 2px solid #f1f1f1;
  }
  
  *::-webkit-scrollbar-thumb:hover {
    background: #357ABD;
  }
  
  *::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }
  
  /* Améliorer la navigation au clavier */
  button, [role="button"], input, textarea, select {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  button:focus, [role="button"]:focus, input:focus, textarea:focus, select:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
  }
  
  /* Forcer l'affichage des barres de défilement */
  .scroll-visible {
    overflow-y: scroll !important;
    scrollbar-width: auto !important;
  }
  
  .scroll-visible::-webkit-scrollbar {
    width: 12px !important;
    display: block !important;
  }
`;

// Injecter les styles CSS globaux pour le web
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('agp-scroll-styles');
  if (!existingStyle) {
    const styleElement = document.createElement('style');
    styleElement.id = 'agp-scroll-styles';
    styleElement.textContent = globalScrollStyles;
    document.head.appendChild(styleElement);
  }
}

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          console.log('✅ Utilisateur connecté - Redirection vers home');
          router.navigate('/(tabs)/home');
        } else {
          console.log('❌ Utilisateur non connecté - Redirection vers login');
          router.navigate('/auth/login');
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

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