import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials } from '@/types/User';

const STORAGE_KEYS = {
  USERS: '@agp_users',
  CURRENT_USER: '@agp_current_user',
  FAVORITE_RECIPES: '@agp_favorite_recipes',
  COMPLETED_EXERCISES: '@agp_completed_exercises',
};

export class LocalStorageService {
  // Méthodes génériques pour le stockage
  static async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Erreur récupération ${key}:`, error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      console.log(`📝 Sauvegarde dans le stockage local: ${key.split('_')[0]}`);
      
      // Vérifier si la clé et la valeur sont valides
      if (!key) {
        throw new Error('Clé de stockage manquante');
      }
      
      // Effectuer la sauvegarde
      await AsyncStorage.setItem(key, value);
      
      // Vérifier que la sauvegarde a fonctionné
      const savedValue = await AsyncStorage.getItem(key);
      if (savedValue === value) {
        console.log(`✅ Sauvegarde réussie pour: ${key.split('_')[0]}`);
      } else {
        console.error(`❌ Vérification de sauvegarde échouée pour: ${key.split('_')[0]}`);
        throw new Error('Échec de vérification de sauvegarde');
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde ${key}:`, error);
      throw error; // Propager l'erreur pour la gérer dans les services
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur suppression ${key}:`, error);
    }
  }

  // Gestion des utilisateurs
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const existingIndex = users.findIndex(u => u.id === user.id);
      
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      console.log('💾 Utilisateur sauvegardé:', user.username);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateur:', error);
      return null;
    }
  }

  static async findUserByUsername(username: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.username === username) || null;
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateur:', error);
      return null;
    }
  }

  // Session utilisateur
  static async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      console.log('🔐 Utilisateur courant défini:', user.username);
    } catch (error) {
      console.error('Erreur lors de la définition de l\'utilisateur courant:', error);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const user = userJson ? JSON.parse(userJson) : null;
      if (user) {
        console.log('👤 Utilisateur courant récupéré:', user.username);
      }
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur courant:', error);
      return null;
    }
  }

  static async clearCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      console.log('🚪 Utilisateur courant supprimé (déconnexion)');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur courant:', error);
    }
  }

  // Recettes favorites
  static async getFavoriteRecipes(userId: string): Promise<number[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(`${STORAGE_KEYS.FAVORITE_RECIPES}_${userId}`);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      return [];
    }
  }

  static async addFavoriteRecipe(userId: string, recipeId: number): Promise<void> {
    try {
      const favorites = await this.getFavoriteRecipes(userId);
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        await AsyncStorage.setItem(`${STORAGE_KEYS.FAVORITE_RECIPES}_${userId}`, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  }

  static async removeFavoriteRecipe(userId: string, recipeId: number): Promise<void> {
    try {
      const favorites = await this.getFavoriteRecipes(userId);
      const updatedFavorites = favorites.filter(id => id !== recipeId);
      await AsyncStorage.setItem(`${STORAGE_KEYS.FAVORITE_RECIPES}_${userId}`, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
    }
  }

  // Exercices complétés
  static async getCompletedExercises(userId: string): Promise<any[]> {
    try {
      const exercisesJson = await AsyncStorage.getItem(`${STORAGE_KEYS.COMPLETED_EXERCISES}_${userId}`);
      return exercisesJson ? JSON.parse(exercisesJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      return [];
    }
  }

  static async addCompletedExercise(userId: string, exerciseId: number, exerciseType: string, duration: number): Promise<void> {
    try {
      const exercises = await this.getCompletedExercises(userId);
      const newExercise = {
        id: Date.now().toString(),
        exerciseId,
        exerciseType,
        duration,
        completedAt: new Date().toISOString(),
      };
      
      exercises.unshift(newExercise); // Ajouter au début pour avoir les plus récents en premier
      await AsyncStorage.setItem(`${STORAGE_KEYS.COMPLETED_EXERCISES}_${userId}`, JSON.stringify(exercises));
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'exercice:', error);
    }
  }

  // Utilitaires
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.CURRENT_USER,
        STORAGE_KEYS.FAVORITE_RECIPES,
        STORAGE_KEYS.COMPLETED_EXERCISES,
      ]);
      console.log('🗑️ Toutes les données supprimées');
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  }

  static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}