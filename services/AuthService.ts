import { LocalStorageService } from './LocalStorageService';
import { User, LoginCredentials, RegisterCredentials } from '@/types/User';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = await LocalStorageService.findUserByEmail(credentials.email);
      
      if (!user) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        };
      }

      // Vérification simple du mot de passe (en production, utiliser un hash)
      if (user.password !== credentials.password) {
        return {
          success: false,
          error: 'Email ou mot de passe incorrect'
        };
      }

      // Connexion réussie - Plus de vérification d'onboarding
      await LocalStorageService.setCurrentUser(user);
      
      console.log('✅ Connexion réussie pour:', user.username);
      
      return {
        success: true,
        user: {
          ...user,
          password: undefined, // Ne pas retourner le mot de passe
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de connexion. Veuillez réessayer.'
      };
    }
  }

  static async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await LocalStorageService.findUserByEmail(credentials.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Un compte existe déjà avec cet email'
        };
      }

      // Vérifier si le nom d'utilisateur existe déjà
      const existingUsername = await LocalStorageService.findUserByUsername(credentials.username);
      if (existingUsername) {
        return {
          success: false,
          error: 'Ce nom d\'utilisateur est déjà pris'
        };
      }

      // Créer le nouvel utilisateur - Plus d'onboarding requis
      const newUser: User = {
        id: LocalStorageService.generateUserId(),
        email: credentials.email,
        password: credentials.password, // En production, hasher le mot de passe
        username: credentials.username,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        createdAt: new Date().toISOString(),
        // Plus de champ onboardingCompleted
      };

      // Sauvegarder l'utilisateur
      await LocalStorageService.saveUser(newUser);
      await LocalStorageService.setCurrentUser(newUser);

      console.log('✅ Nouvel utilisateur créé:', newUser.username);

      return {
        success: true,
        user: {
          ...newUser,
          password: undefined, // Ne pas retourner le mot de passe
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur de création de compte. Veuillez réessayer.'
      };
    }
  }

  static async logout(): Promise<boolean> {
    try {
      console.log('🔄 Déconnexion en cours...');
      
      // Ajouter un délai artificiel pour s'assurer que le processus de déconnexion est complet
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await LocalStorageService.clearCurrentUser();
      console.log('✅ Déconnexion réussie');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      return false;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await LocalStorageService.getCurrentUser();
      if (user) {
        return {
          ...user,
          password: undefined, // Ne pas retourner le mot de passe
        };
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await LocalStorageService.getCurrentUser();
      console.log('🔍 Vérification d\'authentification:', !!user);
      return !!user;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification d\'authentification:', error);
      return false;
    }
  }

  static async updateProfile(userId: string, updates: Partial<{
    username: string;
    firstName: string;
    lastName: string;
    niveauSport: string;
    preferencesAlimentaires: string[];
    objectifs: string[];
    personalizedRecommendations: any[];
  }>) {
    try {
      const users = await LocalStorageService.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      // Mettre à jour l'utilisateur
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      users[userIndex] = updatedUser;
      await LocalStorageService.saveUser(updatedUser);

      // Mettre à jour l'utilisateur courant si c'est le même
      const currentUser = await LocalStorageService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await LocalStorageService.setCurrentUser(updatedUser);
      }

      console.log('✅ Profil mis à jour avec succès:', updatedUser.username);
      
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { success: false, error: 'Erreur de mise à jour' };
    }
  }

  static async addFavoriteRecipe(userId: string, recipeId: number) {
    try {
      await LocalStorageService.addFavoriteRecipe(userId, recipeId);
      return { success: true };
    } catch (error) {
      console.error('Erreur ajout favori:', error);
      return { success: false, error: 'Erreur d\'ajout aux favoris' };
    }
  }

  static async removeFavoriteRecipe(userId: string, recipeId: number) {
    try {
      await LocalStorageService.removeFavoriteRecipe(userId, recipeId);
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      return { success: false, error: 'Erreur de suppression des favoris' };
    }
  }

  static async getFavoriteRecipes(userId: string) {
    try {
      const favorites = await LocalStorageService.getFavoriteRecipes(userId);
      return { success: true, data: favorites };
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
      return { success: false, error: 'Erreur de récupération des favoris' };
    }
  }

  static async addCompletedExercise(userId: string, exerciseId: number, exerciseType: string, duration: number) {
    try {
      await LocalStorageService.addCompletedExercise(userId, exerciseId, exerciseType, duration);
      return { success: true };
    } catch (error) {
      console.error('Erreur ajout exercice:', error);
      return { success: false, error: 'Erreur d\'enregistrement de l\'exercice' };
    }
  }

  static async getCompletedExercises(userId: string) {
    try {
      const exercises = await LocalStorageService.getCompletedExercises(userId);
      return { success: true, data: exercises };
    } catch (error) {
      console.error('Erreur récupération exercices:', error);
      return { success: false, error: 'Erreur de récupération des exercices' };
    }
  }
}