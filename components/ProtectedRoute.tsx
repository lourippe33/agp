import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Pages publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register', 
  '/auth/reset',
  '/',
];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Attendre que l'état d'auth soit déterminé

    const currentPath = `/${segments.join('/')}`;
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath) || currentPath.startsWith('/auth/');

    if (!user && !isPublicRoute) {
      // Utilisateur non connecté essayant d'accéder à une page protégée
      console.log('🔒 Redirection vers login - utilisateur non connecté');
      router.replace('/auth/login');
    } else if (user && (currentPath === '/' || currentPath.startsWith('/auth/'))) {
      // Utilisateur connecté sur une page d'auth
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