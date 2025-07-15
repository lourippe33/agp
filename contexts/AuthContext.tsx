import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types/User';
import { AuthService } from '@/services/AuthService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  updateProfile: (userId: string, updates: any) => Promise<{ success: boolean; error?: string }>;
  addFavoriteRecipe: (userId: string, recipeId: number) => Promise<{ success: boolean; error?: string }>;
  removeFavoriteRecipe: (userId: string, recipeId: number) => Promise<{ success: boolean; error?: string }>;
  getFavoriteRecipes: (userId: string) => Promise<{ success: boolean; data?: number[]; error?: string }>;
  addCompletedExercise: (userId: string, exerciseId: number, exerciseType: string, duration: number) => Promise<{ success: boolean; error?: string }>;
  getCompletedExercises: (userId: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        const user = await AuthService.getCurrentUser();
        console.log('🔍 Utilisateur récupéré dans AuthContext:', {
          username: user?.username,
          onboardingCompleted: user?.onboardingCompleted
        });
        
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('❌ Erreur checkAuthStatus:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const result = await AuthService.login(credentials);
      
      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const result = await AuthService.register(credentials);
      
      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Erreur de création de compte' };
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Déconnexion en cours dans AuthContext...');
      
      // Vérifier si l'utilisateur est connecté
      if (!authState.isAuthenticated || !authState.user) {
        console.log('⚠️ Aucun utilisateur connecté à déconnecter');
        return;
      }
      
      // Déconnexion via le service
      const result = await AuthService.logout();
      
      if (result) {
        // Mise à jour de l'état d'authentification
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
        console.log('✅ Déconnexion réussie dans AuthContext');
      } else {
        console.error('❌ Échec de la déconnexion dans AuthService');
        throw new Error('Échec de la déconnexion');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion dans AuthContext:', error);
      throw error;
    }
  };

  const updateProfile = async (userId: string, updates: any) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      const result = await AuthService.updateProfile(userId, updates);
      
      if (result.success) {
        // Mettre à jour l'état local
        const updatedUser = await AuthService.getCurrentUser();
        console.log('🔄 Profil mis à jour dans AuthContext:', {
          username: updatedUser?.username,
          onboardingCompleted: updatedUser?.onboardingCompleted
        });
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }

      return result;
    } catch (error) {
      return { success: false, error: 'Erreur de mise à jour' };
    }
  };

  const addFavoriteRecipe = async (userId: string, recipeId: number) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    return await AuthService.addFavoriteRecipe(userId, recipeId);
  };

  const removeFavoriteRecipe = async (userId: string, recipeId: number) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    return await AuthService.removeFavoriteRecipe(userId, recipeId);
  };

  const getFavoriteRecipes = async (userId: string) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    return await AuthService.getFavoriteRecipes(userId);
  };

  const addCompletedExercise = async (userId: string, exerciseId: number, exerciseType: string, duration: number) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    return await AuthService.addCompletedExercise(userId, exerciseId, exerciseType, duration);
  };

  const getCompletedExercises = async (userId: string) => {
    if (!authState.user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    return await AuthService.getCompletedExercises(userId);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkAuthStatus,
    updateProfile,
    addFavoriteRecipe,
    removeFavoriteRecipe,
    getFavoriteRecipes,
    addCompletedExercise,
    getCompletedExercises,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}