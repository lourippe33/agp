export interface MealEntry {
  id: string;
  type: 'matin' | 'midi' | 'gouter' | 'soir';
  consumed: boolean;
  time?: string;
  photo?: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  meals: MealEntry[];
  waterIntake: number;
  mood?: string;
}

export interface JournalStats {
  totalMeals: number;
  consumedMeals: number;
  averageWaterIntake: number;
  completionRate: number;
}