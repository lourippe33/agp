import { useState, useEffect } from 'react';
import { Scale, TrendingDown, TrendingUp, Minus, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface MeasurementsTrackerProps {
  onDataSaved?: () => void;
}

interface Measurement {
  date: string;
  weight?: number;
  waist?: number;
  hip?: number;
  thigh?: number;
  arm?: number;
  chest?: number;
}

export function MeasurementsTracker({ onDataSaved }: MeasurementsTrackerProps = {}) {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userHeight, setUserHeight] = useState<number | null>(null);
  const [newMeasurement, setNewMeasurement] = useState<Measurement>({
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      fetchUserHeight();
    }
  }, [user]);

  const fetchUserHeight = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('height')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.height) {
        setUserHeight(data.height);
      }
    } catch (error) {
      console.error('Error fetching user height:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeasurements();
    }
  }, [user]);

  useEffect(() => {
    loadTodayOrLatest();
  }, [measurements]);

  const loadTodayOrLatest = async () => {
    if (!user || measurements.length === 0) return;

    const todayMeasurement = measurements.find(m => m.date === newMeasurement.date);

    if (todayMeasurement) {
      setNewMeasurement(todayMeasurement);
    } else {
      const latest = measurements[0];
      setNewMeasurement({
        date: newMeasurement.date,
        weight: latest.weight,
        waist: latest.waist,
        hip: latest.hip,
        thigh: latest.thigh,
        arm: latest.arm,
        chest: latest.chest,
      });
    }
  };

  const fetchMeasurements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map(item => ({
          date: item.measurement_date,
          weight: item.weight,
          waist: item.waist,
          hip: item.hip,
          thigh: item.thigh,
          arm: item.arm,
          chest: item.chest,
        }));
        setMeasurements(formattedData);
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data: existing } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .eq('measurement_date', newMeasurement.date)
        .maybeSingle();

      const updateData: any = {};

      if (newMeasurement.weight !== undefined && newMeasurement.weight !== '') {
        updateData.weight = newMeasurement.weight;
      } else if (existing?.weight) {
        updateData.weight = existing.weight;
      }

      if (newMeasurement.waist !== undefined && newMeasurement.waist !== '') {
        updateData.waist = newMeasurement.waist;
      } else if (existing?.waist) {
        updateData.waist = existing.waist;
      }

      if (newMeasurement.hip !== undefined && newMeasurement.hip !== '') {
        updateData.hip = newMeasurement.hip;
      } else if (existing?.hip) {
        updateData.hip = existing.hip;
      }

      if (newMeasurement.thigh !== undefined && newMeasurement.thigh !== '') {
        updateData.thigh = newMeasurement.thigh;
      } else if (existing?.thigh) {
        updateData.thigh = existing.thigh;
      }

      if (newMeasurement.arm !== undefined && newMeasurement.arm !== '') {
        updateData.arm = newMeasurement.arm;
      } else if (existing?.arm) {
        updateData.arm = existing.arm;
      }

      if (newMeasurement.chest !== undefined && newMeasurement.chest !== '') {
        updateData.chest = newMeasurement.chest;
      } else if (existing?.chest) {
        updateData.chest = existing.chest;
      }

      if (existing) {
        const { error } = await supabase
          .from('measurements')
          .update(updateData)
          .eq('user_id', user.id)
          .eq('measurement_date', newMeasurement.date);

        if (error) throw error;
      } else {
        const measurementData = {
          user_id: user.id,
          measurement_date: newMeasurement.date,
          ...updateData
        };

        const { error } = await supabase
          .from('measurements')
          .insert([measurementData]);

        if (error) throw error;
      }

      await fetchMeasurements();
      setNewMeasurement({ date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setError('');
      if (onDataSaved) {
        onDataSaved();
      }
    } catch (error: any) {
      console.error('Error saving measurement:', error);
      const errorMsg = error?.message || 'Erreur inconnue';
      const errorDetails = error?.details || error?.hint || '';
      setError(`Erreur: ${errorMsg}${errorDetails ? ' - ' + errorDetails : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const getTrend = (current?: number, previous?: number) => {
    if (!current || !previous) return 'stable';
    if (current < previous) return 'down';
    if (current > previous) return 'up';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-600" />;
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  const latest = measurements[0] || {};
  const previous = measurements[1] || {};

  const calculateBMI = (weight: number) => {
    if (!userHeight) return null;
    const heightInMeters = userHeight / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const chartData = [...measurements]
    .reverse()
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      Poids: m.weight,
      IMC: m.weight && userHeight ? calculateBMI(m.weight) : null,
      Taille: m.waist,
      Hanche: m.hip,
      Cuisse: m.thigh,
      Bras: m.arm,
      Poitrine: m.chest,
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-[#333333]">Suivi des mesures</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="px-4 py-2 bg-[#2B7BBE] text-white rounded-lg hover:bg-[#1f5a8f] transition-colors flex items-center space-x-2"
          >
            <LineChartIcon className="w-4 h-4" />
            <span>{showCharts ? 'Masquer graphiques' : 'Voir graphiques'}</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors"
          >
            {showForm ? 'Annuler' : 'Nouvelle mesure'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-4">Ajouter une mesure</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newMeasurement.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poids (kg)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.weight || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, weight: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour de taille (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.waist || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, waist: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour de hanche (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.hip || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, hip: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour de cuisse (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.thigh || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, thigh: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour de bras (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.arm || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, arm: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour de poitrine (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newMeasurement.chest || ''}
                onChange={(e) => setNewMeasurement({ ...newMeasurement, chest: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>

            {error && (
              <div className="md:col-span-2 lg:col-span-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showCharts && measurements.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-[#333333] mb-6">Évolution des mesures</h3>

          {chartData.some(d => d.Poids) && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-4">Poids (kg)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Poids" stroke="#4A7729" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartData.some(d => d.IMC) && userHeight && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-4">Indice de Masse Corporelle (IMC)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis domain={[15, 35]} style={{ fontSize: '12px' }} />
                  <Tooltip formatter={(value: any) => value?.toFixed(1)} />
                  <Line type="monotone" dataKey="IMC" stroke="#9333EA" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-blue-600 font-semibold">&lt;18.5</p>
                  <p className="text-gray-500">Insuffisant</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-green-600 font-semibold">18.5-24.9</p>
                  <p className="text-gray-500">Normal</p>
                </div>
                <div className="p-2 bg-orange-50 rounded">
                  <p className="text-orange-600 font-semibold">25-29.9</p>
                  <p className="text-gray-500">Surpoids</p>
                </div>
                <div className="p-2 bg-red-50 rounded">
                  <p className="text-red-600 font-semibold">≥30</p>
                  <p className="text-gray-500">Obésité</p>
                </div>
              </div>
            </div>
          )}

          {chartData.some(d => d.Taille || d.Hanche) && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-gray-700 mb-4">Tours de taille et hanche (cm)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Taille" stroke="#2B7BBE" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Hanche" stroke="#5FA84D" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartData.some(d => d.Cuisse || d.Bras || d.Poitrine) && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Autres mesures (cm)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Cuisse" stroke="#FFA500" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Bras" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Poitrine" stroke="#9B59B6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MeasurementCard
          label="Poids"
          value={latest.weight}
          unit="kg"
          trend={getTrend(latest.weight, previous.weight)}
          icon={Scale}
        />
        <MeasurementCard
          label="Tour de taille"
          value={latest.waist}
          unit="cm"
          trend={getTrend(latest.waist, previous.waist)}
        />
        <MeasurementCard
          label="Tour de hanche"
          value={latest.hip}
          unit="cm"
          trend={getTrend(latest.hip, previous.hip)}
        />
        <MeasurementCard
          label="Tour de cuisse"
          value={latest.thigh}
          unit="cm"
          trend={getTrend(latest.thigh, previous.thigh)}
        />
        <MeasurementCard
          label="Tour de bras"
          value={latest.arm}
          unit="cm"
          trend={getTrend(latest.arm, previous.arm)}
        />
        <MeasurementCard
          label="Tour de poitrine"
          value={latest.chest}
          unit="cm"
          trend={getTrend(latest.chest, previous.chest)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#333333] mb-4">Historique des mesures</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Poids</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Taille</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hanche</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cuisse</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bras</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Poitrine</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(m.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.weight || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.waist || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.hip || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.thigh || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.arm || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{m.chest || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MeasurementCard({ label, value, unit, trend, icon: Icon }: any) {
  const trendColors = {
    down: 'bg-green-50 border-green-200',
    up: 'bg-red-50 border-red-200',
    stable: 'bg-yellow-50 border-yellow-200',
  };

  const getTrendIcon = () => {
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-600" />;
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${trendColors[trend as keyof typeof trendColors]}`}>
      <div className="flex items-center justify-between mb-3">
        {Icon && (
          <div className="bg-[#7AC943] bg-opacity-20 p-2 rounded-lg">
            <Icon className="w-5 h-5 text-[#4A7729]" />
          </div>
        )}
        {getTrendIcon()}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#333333]">
        {value ? `${value} ${unit}` : 'Non renseigné'}
      </p>
    </div>
  );
}
