export interface User {
  id: string;
  email: string;
  password?: string; // Optionnel pour ne pas l'exposer côté client
  username?: string;
  firstName?: string;
  lastName?: string;
  niveauSport?: 'debutant' | 'intermediaire' | 'avance';
  preferencesAlimentaires?: string[];
  objectifs?: string[];
  onboardingCompleted?: boolean;
  personalizedRecommendations?: PersonalizedRecommendation[]; // Nouvelles recommandations
  onboardingAnswers?: any; // Réponses du questionnaire pour usage futur
  createdAt: string;
  updatedAt?: string;
}

export interface PersonalizedRecommendation {
  icon: string;
  title: string;
  description: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}