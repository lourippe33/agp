import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (authUser: any) => {
    setUser({
      id: authUser.id,
      email: authUser.email || '',
      fullName: authUser.user_metadata?.full_name || '',
      initialWeight: 0,
      targetWeight: 0,
      height: 0,
      createdAt: new Date(authUser.created_at),
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Loading profile for:', session.user.email);
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await loadUserProfile(data.user);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: undefined,
      },
    });

    if (error) throw error;

    if (data.user && data.session) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadUserProfile(data.user);
    } else if (data.user && !data.session) {
      throw new Error('Compte créé, mais confirmation d\'email requise. Veuillez vérifier votre boîte mail.');
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setLoading(true);

      await supabase.auth.signOut();

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      window.location.href = '/';
    }
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...profileUpdate };
    setUser(updatedUser);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, resetPassword, updatePassword }}>
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
