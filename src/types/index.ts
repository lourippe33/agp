export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  initialWeight: number;
  targetWeight: number;
  height: number;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other';
  createdAt: Date;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  measurementDate: Date;
  weight?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  arm?: number;
  chest?: number;
  notes?: string;
}

export interface DailyWellness {
  id: string;
  userId: string;
  trackingDate: Date;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  mood: number;
  chronoRespect: boolean;
  activityType?: string;
  activityDuration?: number;
  notes?: string;
}

export interface DailyFoodTracking {
  id: string;
  userId: string;
  trackingDate: Date;
  breakfast: boolean;
  fullMeal: boolean;
  balancedSnack: boolean;
  lightDinner: boolean;
  hydration: boolean;
  chronoPoints: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  calories?: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isFavorite?: boolean;
}

export interface SportsActivity {
  id: string;
  name: string;
  description: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  caloriesBurned?: number;
  category: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  equipmentNeeded: string[];
  isFavorite?: boolean;
}

export interface RelaxationExercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string;
  benefits: string[];
  isFavorite?: boolean;
}

export interface AGPProgramDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  contentType: 'audio' | 'video' | 'text';
  contentUrl?: string;
  contentText?: string;
  phase: 1 | 2 | 3 | 4;
  completed?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

export interface WeeklySummary {
  id: string;
  userId: string;
  weekStartDate: Date;
  weekEndDate: Date;
  weightChange: number;
  avgEnergyLevel: number;
  avgSleepQuality: number;
  chronoPointsEarned: number;
  activitiesCompleted: number;
}
