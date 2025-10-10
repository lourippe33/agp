import { supabase } from '../lib/supabase';

export async function calculateUserStreak(userId: string): Promise<number> {
  try {
    const { data: trackingData, error } = await supabase
      .from('food_tracking')
      .select('tracking_date')
      .eq('user_id', userId)
      .order('tracking_date', { ascending: false })
      .limit(100);

    if (error) throw error;
    if (!trackingData || trackingData.length === 0) return 0;

    const dates = trackingData.map(t => new Date(t.tracking_date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestDate = new Date(dates[0]);
    latestDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return 0;
    }

    let streak = 1;
    let currentDate = new Date(latestDate);

    for (let i = 1; i < dates.length; i++) {
      const checkDate = new Date(dates[i]);
      checkDate.setHours(0, 0, 0, 0);

      currentDate.setDate(currentDate.getDate() - 1);

      if (checkDate.getTime() === currentDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

export async function updateUserStreak(userId: string): Promise<void> {
  try {
    const streak = await calculateUserStreak(userId);

    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_progress')
        .update({ completion_streak: streak })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          current_day: 1,
          current_phase: 1,
          start_date: new Date().toISOString(),
          completion_streak: streak,
          meals_regularity_score: 0,
          sleep_regularity_score: 0,
          total_journals_completed: 0
        });
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}
