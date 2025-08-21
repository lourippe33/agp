import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthService } from '@/services/AuthService';
import { User } from '@/types/User';

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

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erreur vérification auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const register = async (email: string, password: string, username: string, firstName: string, lastName: string) => {
    try {
      const result = await AuthService.register({ email, password, username, firstName, lastName });
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: 'Erreur d\'inscription' };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};