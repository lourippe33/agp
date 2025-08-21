import GoTrue from 'gotrue-js';
import { isBrowser, getOrigin } from '@/utils/env';

// Configuration sécurisée du client GoTrue
const DEFAULT_IDENTITY_URL = 'https://agp-app.netlify.app/.netlify/identity';
const IDENTITY_URL = isBrowser ? `${getOrigin()}/.netlify/identity` : DEFAULT_IDENTITY_URL;

// Initialisation paresseuse pour éviter les erreurs SSR/natif
let authClient: GoTrue | null = null;

function getAuthClient(): GoTrue {
  if (!authClient && isBrowser) {
    authClient = new GoTrue({
      APIUrl: IDENTITY_URL,
      setCookie: true,
    });
  }
  return authClient!;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

// Inscription
export const signUp = async (email: string, password: string): Promise<{ user?: User; error?: AuthError }> => {
  if (!isBrowser) {
    return { error: { message: 'Authentification non disponible en mode natif' } };
  }
  
  try {
    const user = await getAuthClient().signup(email, password);
    return { user: user as User };
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erreur lors de l\'inscription',
        status: error.status 
      } 
    };
  }
};

// Connexion
export const signIn = async (email: string, password: string): Promise<{ user?: User; error?: AuthError }> => {
  if (!isBrowser) {
    return { error: { message: 'Authentification non disponible en mode natif' } };
  }
  
  try {
    const user = await getAuthClient().login(email, password);
    return { user: user as User };
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erreur lors de la connexion',
        status: error.status 
      } 
    };
  }
};

// Déconnexion
export const signOut = async (): Promise<{ error?: AuthError }> => {
  if (!isBrowser) {
    return { error: { message: 'Authentification non disponible en mode natif' } };
  }
  
  try {
    const user = getAuthClient().currentUser();
    if (user) {
      await user.logout();
    }
    return {};
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erreur lors de la déconnexion',
        status: error.status 
      } 
    };
  }
};

// Récupérer l'utilisateur actuel
export const getCurrentUser = (): User | null => {
  if (!isBrowser) {
    return null;
  }
  
  try {
    const user = getAuthClient().currentUser();
    return user as User | null;
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return null;
  }
};

// Réinitialisation mot de passe
export const resetPassword = async (email: string): Promise<{ error?: AuthError }> => {
  if (!isBrowser) {
    return { error: { message: 'Réinitialisation non disponible en mode natif' } };
  }
  
  try {
    await getAuthClient().requestPasswordRecovery(email);
    return {};
  } catch (error: any) {
    return { 
      error: { 
        message: error.message || 'Erreur lors de la réinitialisation',
        status: error.status 
      } 
    };
  }
};

// Écouter les changements d'état d'authentification
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!isBrowser) {
    callback(null);
    return () => {};
  }
  
  // Vérifier l'état initial
  callback(getCurrentUser());
  
  const auth = getAuthClient();
  
  // Écouter les changements
  auth.on('login', (user) => callback(user as User));
  auth.on('logout', () => callback(null));
  auth.on('signup', (user) => callback(user as User));
  
  // Retourner une fonction de nettoyage
  return () => {
    auth.off('login');
    auth.off('logout');
    auth.off('signup');
  };
};

export default isBrowser ? getAuthClient : () => null;