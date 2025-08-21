import GoTrue from 'gotrue-js';

// Configuration du client GoTrue pour Netlify Identity
const auth = new GoTrue({
  APIUrl: `${window.location.origin}/.netlify/identity`,
  setCookie: true,
});

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
  try {
    const user = await auth.signup(email, password);
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
  try {
    const user = await auth.login(email, password);
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
  try {
    const user = auth.currentUser();
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
  try {
    const user = auth.currentUser();
    return user as User | null;
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return null;
  }
};

// Réinitialisation mot de passe
export const resetPassword = async (email: string): Promise<{ error?: AuthError }> => {
  try {
    await auth.requestPasswordRecovery(email);
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
  // Vérifier l'état initial
  callback(getCurrentUser());
  
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

export default auth;