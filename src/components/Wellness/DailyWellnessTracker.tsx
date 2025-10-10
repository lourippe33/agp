import { useState, useEffect } from 'react';
import { Battery, Moon, Brain, Smile, Check, X, Dumbbell, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserStreak } from '../../utils/streakCalculator';

interface DailyWellnessTrackerProps {
  onDataSaved?: () => void;
}

interface WellnessData {
  date: string;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  mood: number;
  chronoRespect: boolean;
  activityCompleted: boolean;
  activityType: string;
  activityDuration: number;
}

export function DailyWellnessTracker({ onDataSaved }: DailyWellnessTrackerProps = {}) {
  const { user } = useAuth();
  const [wellnessData, setWellnessData] = useState<WellnessData>({
    date: new Date().toISOString().split('T')[0],
    energyLevel: 3,
    sleepQuality: 3,
    stressLevel: 3,
    mood: 3,
    chronoRespect: false,
    activityCompleted: false,
    activityType: '',
    activityDuration: 0,
  });

  const [history, setHistory] = useState<WellnessData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toISOString().split('T')[0];
      setWellnessData(prev => {
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
  }, [wellnessData.date, user, history]);

  const loadTodayOrLatest = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('wellness_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('tracking_date', today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setWellnessData({
          date: today,
          energyLevel: data.energy_level,
          sleepQuality: data.sleep_quality,
          stressLevel: data.stress_level,
          mood: data.mood,
          chronoRespect: data.chrono_respect,
          activityCompleted: data.activity_completed,
          activityType: data.activity_type || '',
          activityDuration: data.activity_duration || 0,
        });
      } else {
        setWellnessData({
          date: today,
          energyLevel: 3,
          sleepQuality: 3,
          stressLevel: 3,
          mood: 3,
          chronoRespect: false,
          activityCompleted: false,
          activityType: '',
          activityDuration: 0,
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
        .from('wellness_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('tracking_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          date: item.tracking_date,
          energyLevel: item.energy_level || 3,
          sleepQuality: item.sleep_quality || 3,
          stressLevel: item.stress_level || 3,
          mood: item.mood || 3,
          chronoRespect: item.chrono_respect || false,
          activityCompleted: item.activity_completed || false,
          activityType: item.activity_type || '',
          activityDuration: item.activity_duration || 0,
        }));
        setHistory(formattedData);
      }
    } catch (error) {
      console.error('Error fetching wellness history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from('wellness_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('tracking_date', wellnessData.date)
        .maybeSingle();

      const trackingData = {
        user_id: user.id,
        tracking_date: wellnessData.date,
        energy_level: wellnessData.energyLevel ?? existing?.energy_level,
        sleep_quality: wellnessData.sleepQuality ?? existing?.sleep_quality,
        stress_level: wellnessData.stressLevel ?? existing?.stress_level,
        mood: wellnessData.mood ?? existing?.mood,
        chrono_respect: wellnessData.chronoRespect ?? existing?.chrono_respect ?? false,
        activity_completed: wellnessData.activityCompleted ?? existing?.activity_completed ?? false,
        activity_type: wellnessData.activityType || existing?.activity_type || '',
        activity_duration: wellnessData.activityDuration ?? existing?.activity_duration ?? 0,
      };

      if (existing) {
        const { error } = await supabase
          .from('wellness_tracking')
          .update(trackingData)
          .eq('user_id', user.id)
          .eq('tracking_date', wellnessData.date);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wellness_tracking')
          .insert([trackingData]);

        if (error) throw error;
      }

      await fetchHistory();
      await updateUserStreak(user.id);
      setError('');
      if (onDataSaved) {
        onDataSaved();
      }
    } catch (error: any) {
      console.error('Error saving wellness tracking:', error);
      const errorMsg = error?.message || 'Erreur inconnue';
      const errorDetails = error?.details || error?.hint || '';
      setError(`Erreur: ${errorMsg}${errorDetails ? ' - ' + errorDetails : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [...history]
    .reverse()
    .slice(-30)
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      Énergie: entry.energyLevel,
      Sommeil: entry.sleepQuality,
      Stress: entry.stressLevel,
      Humeur: entry.mood,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-[#333333]">Suivi quotidien du bien-être</h2>
        {history.length > 1 && (
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 bg-[#2B7BBE] text-white rounded-lg hover:bg-[#1f5a8f] transition-colors flex items-center space-x-2"
          >
            <LineChartIcon className="w-4 h-4" />
            <span>{showCharts ? 'Masquer graphiques' : 'Voir graphiques'}</span>
          </button>
        )}
      </div>

      {showCharts && history.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-6">Évolution du bien-être</h3>

          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-700 mb-4">Énergie, Sommeil et Humeur</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Énergie" stroke="#4A7729" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Sommeil" stroke="#2B7BBE" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Humeur" stroke="#FFA500" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">Niveau de stress (plus bas = mieux)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} style={{ fontSize: '12px' }} />
                <Tooltip />
                <Line type="monotone" dataKey="Stress" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#333333] mb-6">Aujourd'hui</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={wellnessData.date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setWellnessData({ ...wellnessData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
            />
          </div>

          <SliderInput
            icon={Battery}
            label="Niveau d'énergie"
            value={wellnessData.energyLevel}
            onChange={(value) => setWellnessData({ ...wellnessData, energyLevel: value })}
            color="green"
          />

          <SliderInput
            icon={Moon}
            label="Qualité du sommeil"
            value={wellnessData.sleepQuality}
            onChange={(value) => setWellnessData({ ...wellnessData, sleepQuality: value })}
            color="blue"
          />

          <SliderInput
            icon={Brain}
            label="Niveau de stress"
            value={wellnessData.stressLevel}
            onChange={(value) => setWellnessData({ ...wellnessData, stressLevel: value })}
            color="red"
            reversed
          />

          <SliderInput
            icon={Smile}
            label="Humeur générale"
            value={wellnessData.mood}
            onChange={(value) => setWellnessData({ ...wellnessData, mood: value })}
            color="yellow"
          />

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wellnessData.chronoRespect}
                onChange={(e) => setWellnessData({ ...wellnessData, chronoRespect: e.target.checked })}
                className="w-5 h-5 text-[#4A7729] rounded focus:ring-[#7AC943]"
              />
              <span className="text-sm font-medium text-gray-700">
                Respect des horaires chrono-nutrition
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wellnessData.activityCompleted}
                onChange={(e) => setWellnessData({ ...wellnessData, activityCompleted: e.target.checked })}
                className="w-5 h-5 text-[#5FA84D] rounded focus:ring-[#5FA84D]"
              />
              <div className="flex items-center space-x-2">
                <Dumbbell className="w-4 h-4 text-[#5FA84D]" />
                <span className="text-sm font-medium text-gray-700">
                  Activité du jour effectuée
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'activité physique
              </label>
              <input
                type="text"
                value={wellnessData.activityType}
                onChange={(e) => setWellnessData({ ...wellnessData, activityType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                placeholder="Ex: Marche, Course, Yoga..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes)
              </label>
              <input
                type="number"
                value={wellnessData.activityDuration || ''}
                onChange={(e) => setWellnessData({ ...wellnessData, activityDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer le suivi du jour'}
          </button>
        </form>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Historique</h3>
          <div className="space-y-4">
            {history.slice(0, 7).map((entry, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="mb-2">
                  <p className="font-semibold text-[#333333] mb-2">
                    {new Date(entry.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.chronoRespect ? (
                      <span className="flex items-center space-x-1 text-green-600 text-sm">
                        <Check className="w-4 h-4" />
                        <span>Chrono respecté</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-gray-400 text-sm">
                        <X className="w-4 h-4" />
                        <span>Chrono non respecté</span>
                      </span>
                    )}
                    {entry.activityCompleted ? (
                      <span className="flex items-center space-x-1 text-[#5FA84D] text-sm">
                        <Dumbbell className="w-4 h-4" />
                        <span>Activité effectuée</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-gray-400 text-sm">
                        <Dumbbell className="w-4 h-4" />
                        <span>Activité non effectuée</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatBadge icon={Battery} label="Énergie" value={entry.energyLevel} />
                  <StatBadge icon={Moon} label="Sommeil" value={entry.sleepQuality} />
                  <StatBadge icon={Brain} label="Stress" value={entry.stressLevel} reversed />
                  <StatBadge icon={Smile} label="Humeur" value={entry.mood} />
                </div>
                {entry.activityType && (
                  <p className="mt-2 text-sm text-gray-600">
                    Activité: {entry.activityType} ({entry.activityDuration} min)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SliderInput({ icon: Icon, label, value, onChange, color, reversed = false }: any) {
  const emojis = reversed
    ? ['😄', '🙂', '😐', '😟', '😰']
    : ['😰', '😟', '😐', '🙂', '😄'];

  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${colorClasses[color as keyof typeof colorClasses]}`} />
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <span className="text-2xl">{emojis[value - 1]}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          accentColor: '#7AC943',
        }}
      />
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              value === num
                ? 'bg-[#7AC943] text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, reversed = false }: any) {
  const getColor = () => {
    const score = reversed ? 6 - value : value;
    if (score >= 4) return 'bg-green-100 text-green-700';
    if (score >= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getColor()}`}>
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-sm font-bold">{value}/5</p>
      </div>
    </div>
  );
}
