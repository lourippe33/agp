export interface DailyJournal {
  id: string;
  user_id: string;
  journal_date: string;
  energy_level?: number;
  satiety_level?: number;
  general_feeling?: number;
  breakfast_time?: string;
  lunch_time?: string;
  dinner_time?: string;
  sleep_quality?: number;
  sleep_hours?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EducationalCapsule {
  id: string;
  day_number: number;
  phase: number;
  title: string;
  content_type: 'video' | 'audio' | 'text';
  content_url?: string;
  video_url?: string;
  description: string;
  duration_minutes: number;
  key_takeaway?: string;
  created_at: string;
}

export interface BreakfastRecipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time_minutes: number;
  difficulty: 'facile' | 'moyen' | 'avancé';
  image_url?: string;
  healthy_fats: string[];
  calories?: number;
  protein_grams?: number;
  phase_recommended: number[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  current_day: number;
  current_phase: number;
  start_date: string;
  completion_streak: number;
  meals_regularity_score: number;
  sleep_regularity_score: number;
  last_journal_date?: string;
  total_journals_completed: number;
  created_at: string;
  updated_at: string;
}
