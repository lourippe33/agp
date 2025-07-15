export interface UserProfile {
  id: string;
  currentWeight: number;
  targetWeight: number;
  height: number; // en cm
  startDate: string;
  waistMeasurement?: number;
}

export interface DailyMeal {
  id: string;
  moment: 'matin' | 'midi' | 'gouter' | 'soir';
  respected: boolean;
  time?: string;
  photo?: string;
  notes?: string;
  hungerBefore: number; // 1-5
  hungerAfter: number; // 1-5
  satiety: number; // 1-5
}

export interface DailyTracking {
  id: string;
  date: string;
  meals: DailyMeal[];
  waterIntake: number; // nombre de verres
  waterIntakeObjective: number; // objectif de verres d'eau
  stressLevel: number; // 1-5
  energyLevel: number; // 1-5
  sleepQuality: number; // 1-5
  snackingTemptation: boolean;
  emotion: string;
  physicalActivity?: PhysicalActivity;
  weight?: number;
  notes?: string;
}

export interface PhysicalActivity {
  type: string;
  duration: number; // en minutes
  intensity: 'faible' | 'moyenne' | 'forte';
  notes?: string;
}

export interface WeeklyGoal {
  id: string;
  week: string; // YYYY-WW
  title: string;
  description: string;
  completed: boolean;
  difficulty?: 'facile' | 'modéré' | 'difficile';
}

export interface WeeklyPhoto {
  id: string;
  week: string;
  photoUrl: string;
  date: string;
}

export interface WeeklySummary {
  week: string;
  mealsRespectedPercentage: number;
  weightChange: number;
  averageStress: number;
  averageEnergy: number; 
  waterCompletionRate: number;
  totalExerciseMinutes: number;
  dominantEmotion: string;
}

export interface DayStatus {
  date: string;
  status: 'green' | 'orange' | 'red';
  completionPercentage: number;
}