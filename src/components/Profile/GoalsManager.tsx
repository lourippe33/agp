import { useState, useEffect } from 'react';
import { Target, X, Sparkles, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface GoalsManagerProps {
  onClose: () => void;
}

interface Goal {
  goalType: string;
  goalDescription: string;
  aiRecommendations: string[];
}

export function GoalsManager({ onClose }: GoalsManagerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [goal, setGoal] = useState<Goal>({
    goalType: '',
    goalDescription: '',
    aiRecommendations: [],
  });

  useEffect(() => {
    if (user) {
      loadGoal();
    }
  }, [user]);

  const loadGoal = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('main_goal')
        .eq('id', user.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      const mainGoal = profileData?.main_goal || data?.goal_type || '';

      if (data) {
        setGoal({
          goalType: mainGoal,
          goalDescription: data.goal_description || '',
          aiRecommendations: Array.isArray(data.ai_recommendations) ? data.ai_recommendations : [],
        });
      } else if (mainGoal) {
        setGoal(prev => ({ ...prev, goalType: mainGoal }));
      }
    } catch (error) {
      console.error('Error loading goal:', error);
    }
  };

  const generateAIRecommendations = async () => {
    if (!goal.goalType || !goal.goalDescription) {
      alert('Veuillez remplir le type d\'objectif et la description');
      return;
    }

    setGenerating(true);

    try {
      const recommendations = generateRecommendations(goal.goalType, goal.goalDescription);
      setGoal({ ...goal, aiRecommendations: recommendations });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Erreur lors de la génération des recommandations');
    } finally {
      setGenerating(false);
    }
  };

  const generateRecommendations = (type: string, description: string): string[] => {
    const baseRecommendations: Record<string, string[]> = {
      weight_loss: [
        'Suivez les 4 repas de chronobiologie : petit-déjeuner gras et protéiné, déjeuner complet, goûter sucré, dîner léger',
        'Hydratez-vous avec 1.5 à 2L d\'eau par jour, de préférence en dehors des repas',
        'Pratiquez 30 minutes d\'activité physique modérée 3 à 5 fois par semaine',
        'Dormez 7 à 8 heures par nuit pour optimiser votre métabolisme',
        'Prenez vos mesures hebdomadaires pour suivre vos progrès (poids, tour de taille)',
        'Évitez les grignotages entre les repas, respectez les horaires chrono',
      ],
      weight_gain: [
        'Augmentez progressivement vos portions à chaque repas',
        'Privilégiez les aliments riches en nutriments et calories saines',
        'Ajoutez des collations nutritives entre les repas principaux',
        'Pratiquez une musculation régulière pour développer votre masse musculaire',
        'Assurez-vous de consommer suffisamment de protéines (1.6-2g/kg)',
        'Suivez votre poids hebdomadairement pour ajuster votre alimentation',
      ],
      maintain: [
        'Maintenez un équilibre entre les 4 repas de la chronobiologie',
        'Continuez une activité physique régulière pour votre santé',
        'Écoutez vos sensations de faim et de satiété',
        'Variez votre alimentation pour tous les nutriments essentiels',
        'Surveillez votre poids mensuellement pour détecter les variations',
        'Gardez de bonnes habitudes de sommeil et de gestion du stress',
      ],
      health: [
        'Adoptez les principes de la chronobiologie pour optimiser votre santé',
        'Privilégiez une alimentation variée et équilibrée',
        'Pratiquez une activité physique adaptée à votre condition',
        'Accordez de l\'importance à la qualité de votre sommeil',
        'Gérez votre stress avec des techniques de relaxation',
        'Suivez régulièrement vos indicateurs de bien-être (énergie, sommeil, humeur)',
      ],
      energy: [
        'Respectez les 4 repas chronobiologiques pour une énergie stable toute la journée',
        'Privilégiez un petit-déjeuner riche en protéines et bonnes graisses',
        'Évitez les sucres rapides qui provoquent des pics et des baisses d\'énergie',
        'Pratiquez une activité physique régulière pour augmenter votre vitalité',
        'Assurez-vous de bien dormir : 7-8h par nuit',
        'Gérez votre stress avec des techniques de respiration et relaxation',
      ],
      sleep: [
        'Établissez une routine de coucher régulière (même heure chaque soir)',
        'Dînez léger au moins 2h avant le coucher',
        'Évitez les écrans 1h avant de dormir',
        'Créez un environnement propice au sommeil (sombre, calme, frais)',
        'Pratiquez des techniques de relaxation avant le coucher',
        'Limitez la caféine après 15h et évitez l\'alcool le soir',
      ],
    };

    const specific = baseRecommendations[type] || baseRecommendations.health;

    const personalizedIntro = `Basé sur votre objectif "${description}", voici vos recommandations personnalisées :`;

    return [personalizedIntro, ...specific];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from('user_goals')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      await supabase
        .from('user_profiles')
        .update({ main_goal: goal.goalType })
        .eq('id', user.id);

      const goalData = {
        user_id: user.id,
        goal_type: goal.goalType,
        goal_description: goal.goalDescription,
        ai_recommendations: goal.aiRecommendations,
      };

      if (existing) {
        const { error } = await supabase
          .from('user_goals')
          .update(goalData)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_goals')
          .insert([goalData]);

        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Erreur lors de l\'enregistrement de l\'objectif');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-[#4A7729]" />
            <h2 className="text-xl font-bold text-[#333333]">Mes objectifs</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'objectif
            </label>
            <select
              value={goal.goalType}
              onChange={(e) => setGoal({ ...goal, goalType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              required
            >
              <option value="">Sélectionner un objectif</option>
              <option value="weight_loss">Perdre du poids</option>
              <option value="weight_gain">Prendre du poids</option>
              <option value="maintain">Maintenir mon poids</option>
              <option value="health">Améliorer ma santé</option>
              <option value="energy">Avoir plus d'énergie</option>
              <option value="sleep">Mieux dormir</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre objectif
            </label>
            <textarea
              value={goal.goalDescription}
              onChange={(e) => setGoal({ ...goal, goalDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              placeholder="Exemple : Je souhaite perdre 5 kg en 3 mois tout en améliorant mon niveau d'énergie..."
              required
            />
          </div>

          <button
            type="button"
            onClick={generateAIRecommendations}
            disabled={generating || !goal.goalType || !goal.goalDescription}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#7AC943] to-[#4A7729] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Génération des recommandations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Obtenir des recommandations IA</span>
              </>
            )}
          </button>

          {goal.aiRecommendations.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-[#7AC943] rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#4A7729]" />
                <h3 className="font-bold text-[#333333]">Recommandations personnalisées</h3>
              </div>
              <div className="space-y-3">
                {goal.aiRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`${
                      index === 0
                        ? 'text-base font-semibold text-[#4A7729] mb-2'
                        : 'flex items-start space-x-2 text-gray-700'
                    }`}
                  >
                    {index === 0 ? (
                      <p>{rec}</p>
                    ) : (
                      <>
                        <span className="text-[#7AC943] font-bold mt-1">•</span>
                        <span>{rec}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !goal.goalType || !goal.goalDescription}
              className="flex-1 px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer l\'objectif'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
