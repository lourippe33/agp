import { LocalStorageService } from './LocalStorageService';
import { 
  UserProfile, 
  DailyTracking, 
  WeeklyGoal, 
  WeeklyPhoto, 
  WeeklySummary,
  DayStatus 
} from '@/types/Tracking';

const TRACKING_KEYS = {
  USER_PROFILE: '@agp_user_profile',
  DAILY_TRACKING: '@agp_daily_tracking',
  WEEKLY_GOALS: '@agp_weekly_goals',
  WEEKLY_PHOTOS: '@agp_weekly_photos',
};

export class TrackingService {
  // Profil utilisateur
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profileJson = await LocalStorageService.getItem(`${TRACKING_KEYS.USER_PROFILE}_${userId}`);
      return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return null;
    }
  }

  static async saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
    try {
      await LocalStorageService.setItem(`${TRACKING_KEYS.USER_PROFILE}_${userId}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
    }
  }

  // Suivi quotidien
  static async getDailyTracking(userId: string, date: string): Promise<DailyTracking | null> {
    try {
      const trackingJson = await LocalStorageService.getItem(`${TRACKING_KEYS.DAILY_TRACKING}_${userId}_${date}`);
      return trackingJson ? JSON.parse(trackingJson) : null;
    } catch (error) {
      console.error('Erreur récupération suivi quotidien:', error);
      return null;
    }
  }

  static async saveDailyTracking(userId: string, tracking: DailyTracking): Promise<void> {
    try {
      await LocalStorageService.setItem(
        `${TRACKING_KEYS.DAILY_TRACKING}_${userId}_${tracking.date}`, 
        JSON.stringify(tracking)
      );
    } catch (error) {
      console.error('Erreur sauvegarde suivi quotidien:', error);
    }
  }

  static async getWeeklyTracking(userId: string, startDate: string, endDate: string): Promise<DailyTracking[]> {
    try {
      const trackings: DailyTracking[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const tracking = await this.getDailyTracking(userId, dateStr);
        if (tracking) {
          trackings.push(tracking);
        }
      }
      
      return trackings;
    } catch (error) {
      console.error('Erreur récupération suivi hebdomadaire:', error);
      return [];
    }
  }

  // Objectifs hebdomadaires
  static async getWeeklyGoals(userId: string): Promise<WeeklyGoal[]> {
    try {
      const goalsJson = await LocalStorageService.getItem(`${TRACKING_KEYS.WEEKLY_GOALS}_${userId}`);
      return goalsJson ? JSON.parse(goalsJson) : [];
    } catch (error) {
      console.error('Erreur récupération objectifs:', error);
      return [];
    }
  }

  static async saveWeeklyGoal(userId: string, goal: WeeklyGoal): Promise<void> {
    try {
      const goals = await this.getWeeklyGoals(userId);
      const existingIndex = goals.findIndex(g => g.id === goal.id);
      
      if (existingIndex >= 0) {
        goals[existingIndex] = goal;
      } else {
        goals.push(goal);
      }
      
      await LocalStorageService.setItem(`${TRACKING_KEYS.WEEKLY_GOALS}_${userId}`, JSON.stringify(goals));
    } catch (error) {
      console.error('Erreur sauvegarde objectif:', error);
    }
  }

  // Photos hebdomadaires
  static async getWeeklyPhotos(userId: string): Promise<WeeklyPhoto[]> {
    try {
      const photosJson = await LocalStorageService.getItem(`${TRACKING_KEYS.WEEKLY_PHOTOS}_${userId}`);
      return photosJson ? JSON.parse(photosJson) : [];
    } catch (error) {
      console.error('Erreur récupération photos:', error);
      return [];
    }
  }

  static async saveWeeklyPhoto(userId: string, photo: WeeklyPhoto): Promise<void> {
    try {
      const photos = await this.getWeeklyPhotos(userId);
      const existingIndex = photos.findIndex(p => p.week === photo.week);
      
      if (existingIndex >= 0) {
        photos[existingIndex] = photo;
      } else {
        photos.push(photo);
      }
      
      await LocalStorageService.setItem(`${TRACKING_KEYS.WEEKLY_PHOTOS}_${userId}`, JSON.stringify(photos));
    } catch (error) {
      console.error('Erreur sauvegarde photo:', error);
    }
  }

  // Calculs et statistiques
  static calculateBMI(weight: number, height: number): number {
    return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
  }

  static calculateDayStatus(tracking: DailyTracking): DayStatus {
    let completedItems = 0;
    let totalItems = 0;

    // Vérifier les repas (4 items)
    tracking.meals.forEach(meal => {
      totalItems++;
      if (meal.respected) completedItems++;
    });

    // Vérifier les autres éléments (4 items: eau, stress, énergie, émotion)
    totalItems += 4;
    
    // Vérifier l'hydratation (objectif atteint à 75% minimum)
    const waterTarget = tracking.waterIntakeObjective || 8; // Valeur par défaut: 8 verres
    if (tracking.waterIntake >= waterTarget * 0.75) {
      completedItems++;
    }
    
    if (tracking.stressLevel > 0) completedItems++;
    if (tracking.energyLevel > 0) completedItems++;
    if (tracking.emotion) completedItems++;

    const percentage = (completedItems / totalItems) * 100;
    
    let status: 'green' | 'orange' | 'red';
    if (percentage >= 80) status = 'green';
    else if (percentage >= 50) status = 'orange';
    else status = 'red';

    return {
      date: tracking.date,
      status,
      completionPercentage: Math.round(percentage)
    };
  }

  static generateWeeklySummary(trackings: DailyTracking[]): WeeklySummary {
    if (trackings.length === 0) {
      return {
        week: '',
        mealsRespectedPercentage: 0,
        weightChange: 0,
        averageStress: 0,
        averageEnergy: 0,
        totalExerciseMinutes: 0,
        dominantEmotion: ''
      };
    }

    const totalMeals = trackings.reduce((sum, t) => sum + t.meals.length, 0);
    const respectedMeals = trackings.reduce((sum, t) => 
      sum + t.meals.filter(m => m.respected).length, 0
    );
    
    // Calcul de l'hydratation moyenne
    const totalWaterIntake = trackings.reduce((sum, t) => sum + t.waterIntake, 0);
    const totalWaterObjective = trackings.reduce((sum, t) => sum + (t.waterIntakeObjective || 8), 0);
    const waterCompletionRate = totalWaterObjective > 0 ? (totalWaterIntake / totalWaterObjective) * 100 : 0;

    const weights = trackings.filter(t => t.weight).map(t => t.weight!);
    const weightChange = weights.length >= 2 ? weights[weights.length - 1] - weights[0] : 0;

    const avgStress = trackings.reduce((sum, t) => sum + t.stressLevel, 0) / trackings.length;
    const avgEnergy = trackings.reduce((sum, t) => sum + t.energyLevel, 0) / trackings.length;

    const totalExercise = trackings.reduce((sum, t) => 
      sum + (t.physicalActivity?.duration || 0), 0
    );

    const emotions = trackings.map(t => t.emotion).filter(Boolean);
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b, ''
    );

    return {
      week: trackings[0]?.date.substring(0, 7) || '',
      mealsRespectedPercentage: Math.round((respectedMeals / totalMeals) * 100),
      weightChange: Math.round(weightChange * 10) / 10,
      averageStress: Math.round(avgStress * 10) / 10,
      averageEnergy: Math.round(avgEnergy * 10) / 10, 
      waterCompletionRate: Math.round(waterCompletionRate),
      totalExerciseMinutes: totalExercise,
      dominantEmotion
    };
  }

  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}