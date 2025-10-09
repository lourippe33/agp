import { useState, useEffect } from 'react';
import { Coffee, UtensilsCrossed, Cookie, Moon, Droplets, Award, Lightbulb } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { BadgesDisplay } from '../Badges/BadgesDisplay';
import neuroData from '../../data/neurotransmitters.json';

interface FoodTrackerProps {
  onDataSaved?: () => void;
}

interface FoodTracking {
  date: string;
  breakfast: boolean;
  fullMeal: boolean;
  balancedSnack: boolean;
  lightDinner: boolean;
  hydration: boolean;
  chronoPoints: number;
}

export function FoodTracker({ onDataSaved }: FoodTrackerProps = {}) {
  const { user } = useAuth();
  const [tracking, setTracking] = useState<FoodTracking>({
    date: new Date().toISOString().split('T')[0],
    breakfast: false,
    fullMeal: false,
    balancedSnack: false,
    lightDinner: false,
    hydration: false,
    chronoPoints: 0,
  });

  const [history, setHistory] = useState<FoodTracking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      setTracking(prev => {
        if (prev.date !== today) {
          return { ...prev, date: today };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      loadTodayOrLatest();
    }
  }, [tracking.date, user, history]);

  const loadTodayOrLatest = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('food_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('tracking_date', today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTracking({
          date: today,
          breakfast: data.breakfast,
          fullMeal: data.full_meal,
          balancedSnack: data.balanced_snack,
          lightDinner: data.light_dinner,
          hydration: data.hydration,
          chronoPoints: data.chrono_points || 0,
        });
      } else {
        setTracking({
          date: today,
          breakfast: false,
          fullMeal: false,
          balancedSnack: false,
          lightDinner: false,
          hydration: false,
          chronoPoints: 0,
        });
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    }
  };


  const fetchHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('food_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('tracking_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          date: item.tracking_date,
          breakfast: item.breakfast || false,
          fullMeal: item.full_meal || false,
          balancedSnack: item.balanced_snack || false,
          lightDinner: item.light_dinner || false,
          hydration: item.hydration || false,
          chronoPoints: item.chrono_points || 0,
        }));
        setHistory(formattedData);
      }
    } catch (error) {
      console.error('Error fetching food tracking history:', error);
    }
  };

  const calculatePoints = (data: FoodTracking) => {
    let points = 0;
    if (data.breakfast) points++;
    if (data.fullMeal) points++;
    if (data.balancedSnack) points++;
    if (data.lightDinner) points++;
    if (data.hydration) points++;
    return points;
  };

  const handleToggle = (field: keyof Omit<FoodTracking, 'date' | 'chronoPoints'>) => {
    const updated = { ...tracking, [field]: !tracking[field] };
    updated.chronoPoints = calculatePoints(updated);
    setTracking(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from('food_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('tracking_date', tracking.date)
        .maybeSingle();

      const trackingData = {
        user_id: user.id,
        tracking_date: tracking.date,
        breakfast: tracking.breakfast ?? existing?.breakfast ?? false,
        full_meal: tracking.fullMeal ?? existing?.full_meal ?? false,
        balanced_snack: tracking.balancedSnack ?? existing?.balanced_snack ?? false,
        light_dinner: tracking.lightDinner ?? existing?.light_dinner ?? false,
        hydration: tracking.hydration ?? existing?.hydration ?? false,
        chrono_points: tracking.chronoPoints,
      };

      if (existing) {
        const { error } = await supabase
          .from('food_tracking')
          .update(trackingData)
          .eq('user_id', user.id)
          .eq('tracking_date', tracking.date);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('food_tracking')
          .insert([trackingData]);

        if (error) throw error;
      }

      await fetchHistory();
      if (onDataSaved) {
        onDataSaved();
      }
    } catch (error) {
      console.error('Error saving food tracking:', error);
      alert('Erreur lors de l\'enregistrement du suivi alimentaire');
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = history.reduce((sum, entry) => sum + entry.chronoPoints, 0) + tracking.chronoPoints;

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const getChronoTip = () => {
    const timeOfDay = getCurrentTimeOfDay();
    return neuroData.dailyTips.find(tip => tip.time === timeOfDay) || neuroData.dailyTips[0];
  };

  const chronoTip = getChronoTip();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#333333]">Suivi alimentaire</h2>
        <div className="flex items-center space-x-2 bg-[#7AC943] bg-opacity-20 px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-[#4A7729]" />
          <span className="font-bold text-[#4A7729]">{totalPoints} Points Chrono</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-4 border-2 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 flex items-center space-x-2">
              <span>{chronoTip.emoji}</span>
              <span>{chronoTip.title}</span>
            </h4>
            <p className="text-sm text-gray-700 mt-1">{chronoTip.message}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#333333] mb-6">Validation du jour</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={tracking.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setTracking({ ...tracking, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckItem
              icon={Coffee}
              label="Petit déjeuner complet"
              description="Bonnes graisses + protéines"
              checked={tracking.breakfast}
              onChange={() => handleToggle('breakfast')}
              color="orange"
            />

            <CheckItem
              icon={UtensilsCrossed}
              label="Repas complet"
              description="Protéines + fibres et glucides"
              checked={tracking.fullMeal}
              onChange={() => handleToggle('fullMeal')}
              color="red"
            />

            <CheckItem
              icon={Cookie}
              label="Goûter équilibré"
              description="Encas sucré encadré de fibres"
              checked={tracking.balancedSnack}
              onChange={() => handleToggle('balancedSnack')}
              color="brown"
            />

            <CheckItem
              icon={Moon}
              label="Dîner léger"
              description="Protéines légères + légumes"
              checked={tracking.lightDinner}
              onChange={() => handleToggle('lightDinner')}
              color="blue"
            />

            <CheckItem
              icon={Droplets}
              label="Hydratation"
              description="1.5L à 2L d'eau par jour"
              checked={tracking.hydration}
              onChange={() => handleToggle('hydration')}
              color="cyan"
            />
          </div>

          <div className="pt-4">
            <div className="bg-[#7AC943] bg-opacity-10 border-2 border-[#7AC943] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#333333]">Points du jour:</span>
                <span className="text-2xl font-bold text-[#4A7729]">{tracking.chronoPoints}/5</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#7AC943] h-3 rounded-full transition-all"
                  style={{ width: `${(tracking.chronoPoints / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Valider la journée'}
            </button>
          </div>
        </form>
      </div>

      <BadgesDisplay totalPoints={totalPoints} />

      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Historique des 7 derniers jours</h3>
          <div className="space-y-3">
            {history.slice(0, 7).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#333333]">
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {entry.breakfast && <Coffee className="w-4 h-4 text-orange-500" />}
                    {entry.fullMeal && <UtensilsCrossed className="w-4 h-4 text-red-500" />}
                    {entry.balancedSnack && <Cookie className="w-4 h-4 text-amber-700" />}
                    {entry.lightDinner && <Moon className="w-4 h-4 text-blue-500" />}
                    {entry.hydration && <Droplets className="w-4 h-4 text-cyan-500" />}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#4A7729]">{entry.chronoPoints}/5</p>
                  <p className="text-sm text-gray-600">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckItem({ icon: Icon, label, description, checked, onChange, color }: any) {
  const colorClasses: any = {
    orange: 'text-orange-500 border-orange-200 bg-orange-50',
    red: 'text-red-500 border-red-200 bg-red-50',
    brown: 'text-amber-700 border-amber-200 bg-amber-50',
    blue: 'text-blue-500 border-blue-200 bg-blue-50',
    cyan: 'text-cyan-500 border-cyan-200 bg-cyan-50',
  };

  const selectedColor = checked ? 'border-[#7AC943] bg-[#7AC943] bg-opacity-10' : 'border-gray-200 bg-white';

  return (
    <label
      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedColor}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-5 h-5 text-[#4A7729] rounded focus:ring-[#7AC943]"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <Icon className={`w-5 h-5 ${checked ? 'text-[#4A7729]' : colorClasses[color].split(' ')[0]}`} />
          <span className="font-semibold text-[#333333]">{label}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </label>
  );
}
