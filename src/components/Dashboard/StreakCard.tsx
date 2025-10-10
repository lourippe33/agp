import { useState, useEffect } from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserStreak } from '../../utils/streakCalculator';

export function StreakCard() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStreak();
    }
  }, [user]);

  const loadStreak = async () => {
    if (!user) return;

    try {
      await updateUserStreak(user.id);

      const { data, error } = await supabase
        .from('user_progress')
        .select('completion_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setStreak(data.completion_streak || 0);
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMotivationMessage = () => {
    if (streak === 0) return "Commence ta série aujourd'hui !";
    if (streak === 1) return "Premier jour ! Continue !";
    if (streak < 7) return "Tu es lancé ! Continue !";
    if (streak === 7) return "1 semaine complète ! 🎉";
    if (streak < 14) return "Incroyable régularité !";
    if (streak === 14) return "2 semaines ! Tu assures ! 💪";
    if (streak < 21) return "Champion de la constance !";
    if (streak === 21) return "3 semaines ! Quel exploit ! 🏆";
    if (streak < 28) return "Bientôt la fin du programme !";
    return "Programme terminé ! Légende ! 👑";
  };

  const getNextMilestone = () => {
    if (streak < 7) return 7;
    if (streak < 14) return 14;
    if (streak < 21) return 21;
    if (streak < 28) return 28;
    return 28;
  };

  const milestone = getNextMilestone();
  const progress = milestone === 28 && streak >= 28 ? 100 : (streak / milestone) * 100;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 border-2 border-orange-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
            <h3 className="text-lg font-bold text-gray-800">Série en cours</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {streak}
            </span>
            <span className="text-xl font-semibold text-gray-600">
              {streak === 0 || streak === 1 ? 'jour' : 'jours'}
            </span>
          </div>
        </div>

        {streak >= 7 && (
          <div className="bg-white rounded-full p-3 shadow-md">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-gray-700 mb-4">
        {getMotivationMessage()}
      </p>

      {streak < 28 && (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Prochain objectif</span>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span className="font-bold">{milestone} jours</span>
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {streak >= 28 && (
        <div className="mt-4 p-3 bg-white rounded-lg border-2 border-yellow-400">
          <p className="text-center text-sm font-bold text-yellow-700">
            🎉 Programme 28 jours terminé ! 🎉
          </p>
        </div>
      )}
    </div>
  );
}
