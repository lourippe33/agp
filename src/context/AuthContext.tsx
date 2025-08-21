import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange, User, AuthError } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return false;
      }
      
      if (user) {
        setUser(user);
        setLoading(false);
        return true;
      }
      
      setError('Erreur de connexion inconnue');
      setLoading(false);
      return false;
    } catch (err) {
      setError('Erreur de connexion');
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return false;
      }
      
      if (user) {
        setUser(user);
        setLoading(false);
        return true;
      }
      
      setError('Erreur d\'inscription inconnue');
      setLoading(false);
      return false;
    } catch (err) {
      setError('Erreur d\'inscription');
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
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