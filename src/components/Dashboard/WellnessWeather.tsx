import { Cloud, CloudRain, Sun, CloudDrizzle, CloudSnow, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface WellnessWeatherProps {
  userId: string;
  refreshTrigger?: number;
  onNavigate?: (view: string) => void;
}

interface WeatherMood {
  icon: JSX.Element;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

const WEATHER_MOODS: Record<string, WeatherMood> = {
  excellent: {
    icon: <Sun className="w-12 h-12" />,
    label: 'Ensoleillé',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    description: 'Votre bien-être est au beau fixe !'
  },
  good: {
    icon: <Cloud className="w-12 h-12" />,
    label: 'Éclaircies',
    color: 'text-blue-400',
    bgColor: 'bg-blue-50',
    description: 'Belle progression, continuez ainsi !'
  },
  moderate: {
    icon: <CloudDrizzle className="w-12 h-12" />,
    label: 'Variable',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    description: 'Des hauts et des bas, restez motivé'
  },
  low: {
    icon: <CloudRain className="w-12 h-12" />,
    label: 'Couvert',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Prenez soin de vous aujourd\'hui'
  },
  none: {
    icon: <CloudSnow className="w-12 h-12" />,
    label: 'À compléter',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    description: 'Commencez votre suivi quotidien'
  }
};

export function WellnessWeather({ userId, refreshTrigger, onNavigate }: WellnessWeatherProps) {
  const [weather, setWeather] = useState<WeatherMood>(WEATHER_MOODS.none);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyMood();
  }, [userId, refreshTrigger]);

  const fetchWeeklyMood = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const today = new Date().toISOString().split('T')[0];

      const [wellnessResult, foodResult] = await Promise.all([
        supabase
          .from('wellness_tracking')
          .select('tracking_date, energy_level, sleep_quality, stress_level, mood')
          .eq('user_id', userId)
          .gte('tracking_date', sevenDaysAgo.toISOString().split('T')[0])
          .order('tracking_date', { ascending: false }),
        supabase
          .from('food_tracking')
          .select('tracking_date, chrono_points')
          .eq('user_id', userId)
          .gte('tracking_date', sevenDaysAgo.toISOString().split('T')[0])
          .order('tracking_date', { ascending: false })
      ]);

      if (wellnessResult.error) throw wellnessResult.error;
      if (foodResult.error) throw foodResult.error;

      const wellnessData = wellnessResult.data || [];
      const foodData = foodResult.data || [];

      if (wellnessData.length === 0 && foodData.length === 0) {
        setWeather(WEATHER_MOODS.none);
        setLoading(false);
        return;
      }

      let totalScore = 0;
      let scoreCount = 0;

      wellnessData.forEach((entry: any) => {
        if (entry.energy_level) {
          totalScore += entry.energy_level;
          scoreCount++;
        }
        if (entry.sleep_quality) {
          totalScore += entry.sleep_quality;
          scoreCount++;
        }
        if (entry.stress_level) {
          totalScore += (6 - entry.stress_level);
          scoreCount++;
        }
        if (entry.mood) {
          totalScore += entry.mood;
          scoreCount++;
        }
      });

      foodData.forEach((entry: any) => {
        if (entry.chrono_points) {
          totalScore += entry.chrono_points;
          scoreCount++;
        }
      });

      if (scoreCount === 0) {
        setWeather(WEATHER_MOODS.none);
        setLoading(false);
        return;
      }

      const average = totalScore / scoreCount;
      setAverageScore(Math.round(average * 10) / 10);

      if (average >= 4) {
        setWeather(WEATHER_MOODS.excellent);
      } else if (average >= 3.5) {
        setWeather(WEATHER_MOODS.good);
      } else if (average >= 2.5) {
        setWeather(WEATHER_MOODS.moderate);
      } else {
        setWeather(WEATHER_MOODS.low);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching wellness weather:', error);
      setWeather(WEATHER_MOODS.none);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="animate-pulse flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${weather.bgColor} rounded-2xl shadow-md p-6 mb-6 border-2 border-opacity-20 ${weather.color.replace('text-', 'border-')}`}>
      <div className="flex items-center space-x-4">
        <div className={`${weather.color} flex-shrink-0`}>
          {weather.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-bold text-gray-800">
              Météo du bien-être
            </h3>
            {averageScore !== null && (
              <span className={`text-sm font-semibold ${weather.color}`}>
                {averageScore}/5
              </span>
            )}
          </div>
          <p className={`text-xl font-bold ${weather.color} mb-1`}>
            {weather.label}
          </p>
          <p className="text-sm text-gray-600">
            {weather.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onNavigate?.('tracking')}
          className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 bg-blue-50 hover:bg-blue-100 rounded-lg p-3 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-[#7AC943] flex-shrink-0" />
          <p className="text-center">
            <span className="font-semibold text-gray-800">Astuce :</span> Maintenez votre suivi quotidien à jour pour voir votre météo évoluer !
          </p>
        </button>
      </div>
    </div>
  );
}
