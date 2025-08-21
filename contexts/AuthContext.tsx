import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AuthService } from '@/services/AuthService';
import { User } from '@/types/User';
import { isBrowser } from '@/utils/env';

const AUTH_STORAGE_KEY = '@agp_auth_session';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (userId: string, updates: any) => Promise<{ success: boolean; error?: string; data?: any }>;
  addFavoriteRecipe: (userId: string, recipeId: number) => Promise<{ success: boolean; error?: string }>;
  removeFavoriteRecipe: (userId: string, recipeId: number) => Promise<{ success: boolean; error?: string }>;
  getFavoriteRecipes: (userId: string) => Promise<{ success: boolean; data?: number[]; error?: string }>;
  addCompletedExercise: (userId: string, exerciseId: number, exerciseType: string, duration: number) => Promise<{ success: boolean; error?: string }>;
  getCompletedExercises: (userId: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔄 Initialisation de l\'authentification...');
      
      // Vérifier d'abord le stockage sécurisé
      const storedSession = await getStoredSession();
      
      if (storedSession) {
        console.log('📱 Session trouvée dans le stockage');
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          console.log('✅ Utilisateur restauré:', currentUser.username);
        } else {
          // Session corrompue, la nettoyer
          await clearStoredSession();
        }
      } else {
        console.log('❌ Aucune session stockée');
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
      await clearStoredSession();
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const getStoredSession = async (): Promise<string | null> => {
    try {
      if (isBrowser) {
        return localStorage.getItem(AUTH_STORAGE_KEY);
      } else {
        return await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erreur lecture session:', error);
      return null;
    }
  };

  const storeSession = async (sessionData: string): Promise<void> => {
    try {
      if (isBrowser) {
        localStorage.setItem(AUTH_STORAGE_KEY, sessionData);
      } else {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, sessionData);
      }
    } catch (error) {
      console.error('Erreur stockage session:', error);
    }
  };

  const clearStoredSession = async (): Promise<void> => {
    try {
      if (isBrowser) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erreur suppression session:', error);
    }
  };
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await AuthService.login({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        // Stocker la session
        await storeSession(JSON.stringify({ 
          userId: result.user.id, 
          timestamp: Date.now() 
        }));
        console.log('✅ Session stockée après connexion');
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string, firstName: string, lastName: string) => {
    try {
      setLoading(true);
      const result = await AuthService.register({ email, password, username, firstName, lastName });
      if (result.success && result.user) {
        setUser(result.user);
        // Stocker la session
        await storeSession(JSON.stringify({ 
          userId: result.user.id, 
          timestamp: Date.now() 
        }));
        console.log('✅ Session stockée après inscription');
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Erreur d\'inscription' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Déconnexion en cours...');
      
      await AuthService.logout();
      await clearStoredSession();
      setUser(null);
      
      console.log('✅ Déconnexion terminée');
      
      // Rediriger vers la page de connexion
      router.replace('/auth/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userId: string, updates: any) => {
    return await AuthService.updateProfile(userId, updates);
  };

  const addFavoriteRecipe = async (userId: string, recipeId: number) => {
    return await AuthService.addFavoriteRecipe(userId, recipeId);
  };

  const removeFavoriteRecipe = async (userId: string, recipeId: number) => {
    return await AuthService.removeFavoriteRecipe(userId, recipeId);
  };

  const getFavoriteRecipes = async (userId: string) => {
    return await AuthService.getFavoriteRecipes(userId);
  };

  const addCompletedExercise = async (userId: string, exerciseId: number, exerciseType: string, duration: number) => {
    return await AuthService.addCompletedExercise(userId, exerciseId, exerciseType, duration);
  };

  const getCompletedExercises = async (userId: string) => {
    return await AuthService.getCompletedExercises(userId);
  };

  const isAuthenticated = !!user;

  // Ne pas rendre les enfants tant que l'auth n'est pas initialisée
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.agpBlue} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateProfile,
      addFavoriteRecipe,
      removeFavoriteRecipe,
      getFavoriteRecipes,
      addCompletedExercise,
      getCompletedExercises,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.background,
  },
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};