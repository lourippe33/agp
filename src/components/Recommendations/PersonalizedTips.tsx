import { useEffect, useState } from 'react';
import { Lightbulb, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PersonalizedTipsProps {
  context?: 'home' | 'agp' | 'profile';
  maxTips?: number;
}

export function PersonalizedTips({ context = 'home', maxTips = 3 }: PersonalizedTipsProps) {
  const { user } = useAuth();
  const [tips, setTips] = useState<string[]>([]);
  const [goalLabel, setGoalLabel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalizedTips();
  }, [user]);

  const loadPersonalizedTips = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('main_goal')
        .eq('id', user.id)
        .maybeSingle();

      const { data: goals } = await supabase
        .from('user_goals')
        .select('ai_recommendations')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const mainGoal = profile?.main_goal || '';
      const recommendations = goals?.ai_recommendations || [];

      const goalLabels: Record<string, string> = {
        weight_loss: 'Perdre du poids',
        weight_gain: 'Prendre du poids',
        maintain: 'Maintenir mon poids',
        health: 'Améliorer ma santé',
        energy: 'Avoir plus d\'énergie',
        sleep: 'Mieux dormir',
      };

      setGoalLabel(goalLabels[mainGoal] || 'Bien-être général');

      if (recommendations.length > 1) {
        const relevantTips = recommendations.slice(1, maxTips + 1);
        setTips(relevantTips);
      } else {
        setTips(getDefaultTips(mainGoal, maxTips));
      }
    } catch (error) {
      console.error('Error loading tips:', error);
      setTips(getDefaultTips('', maxTips));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTips = (goal: string, count: number): string[] => {
    const allTips: Record<string, string[]> = {
      weight_loss: [
        'Commencez votre journée avec un petit-déjeuner gras et protéiné',
        'Hydratez-vous avec 1.5 à 2L d\'eau par jour',
        'Privilégiez un dîner léger avant 20h',
      ],
      weight_gain: [
        'Augmentez vos portions progressivement à chaque repas',
        'Ajoutez des collations riches en nutriments',
        'Consommez suffisamment de protéines (1.6-2g/kg)',
      ],
      maintain: [
        'Maintenez les 4 repas de chronobiologie',
        'Continuez votre activité physique régulière',
        'Écoutez vos sensations de faim et satiété',
      ],
      health: [
        'Adoptez les principes de chronobiologie',
        'Pratiquez une activité physique adaptée',
        'Accordez de l\'importance à votre sommeil',
      ],
      energy: [
        'Respectez les 4 repas chronobiologiques',
        'Évitez les sucres rapides',
        'Dormez 7-8h par nuit pour plus d\'énergie',
      ],
      sleep: [
        'Établissez une routine de coucher régulière',
        'Dînez léger 2h avant le coucher',
        'Évitez les écrans 1h avant de dormir',
      ],
    };

    const tips = allTips[goal] || allTips.health;
    return tips.slice(0, count);
  };

  if (loading) {
    return null;
  }

  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-[#7AC943] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Target className="w-5 h-5 text-[#4A7729]" />
        <h3 className="font-bold text-[#333333]">
          Conseils pour : {goalLabel}
        </h3>
      </div>

      <div className="space-y-2">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-[#7AC943] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
