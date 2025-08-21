import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';

// Pages publiques accessibles sans authentification
const PUBLIC_ROUTES = [
  '',
  'auth',
  'auth/login',
  'auth/register',
  'auth/reset',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Attendre que l'état d'auth soit déterminé

    const currentPath = segments.join('/');
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      currentPath === route || currentPath.startsWith(`${route}/`)
    );

    console.log('🔍 AuthGuard - Path:', currentPath, 'Public:', isPublicRoute, 'User:', !!user);

    if (!user && !isPublicRoute) {
      // Utilisateur non connecté essayant d'accéder à une page protégée
      console.log('🔒 Redirection vers login - utilisateur non connecté');
      router.replace('/auth/login');
    } else if (user && (currentPath === '' || currentPath.startsWith('auth'))) {
      // Utilisateur connecté sur une page d'auth ou page d'accueil
      console.log('✅ Redirection vers home - utilisateur connecté');
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  // Afficher un loader pendant la vérification d'auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.agpBlue} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});