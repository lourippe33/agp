import { supabase } from '../lib/supabase';

export async function calculateUserStreak(userId: string): Promise<number> {
  try {
    const [foodData, wellnessData, journalData] = await Promise.all([
      supabase
        .from('food_tracking')
        .select('tracking_date')
        .eq('user_id', userId),
      supabase
        .from('wellness_tracking')
        .select('tracking_date')
        .eq('user_id', userId),
      supabase
        .from('daily_journals')
        .select('journal_date')
        .eq('user_id', userId)
    ]);

    const allDates = new Set<string>();

    foodData.data?.forEach(t => allDates.add(t.tracking_date));
    wellnessData.data?.forEach(t => allDates.add(t.tracking_date));
    journalData.data?.forEach(t => allDates.add(t.journal_date));

    if (allDates.size === 0) return 0;

    const sortedDates = Array.from(allDates)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestDate = new Date(sortedDates[0]);
    latestDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      return 0;
    }

    let streak = 1;
    let currentDate = new Date(latestDate);

    for (let i = 1; i < sortedDates.length; i++) {
      const checkDate = new Date(sortedDates[i]);
      checkDate.setHours(0, 0, 0, 0);

      currentDate.setDate(currentDate.getDate() - 1);

      if (checkDate.getTime() === currentDate.getTime()) {
        streak++;
      } else {
        const diff = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) {
          continue;
        }
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
