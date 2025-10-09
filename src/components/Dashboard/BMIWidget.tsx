import { Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface BMIWidgetProps {
  userId: string;
}

export function BMIWidget({ userId }: BMIWidgetProps) {
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBMIData();
  }, [userId]);

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: 'Insuffisance pondérale', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmiValue < 25) return { label: 'Poids normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmiValue < 30) return { label: 'Surpoids', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Obésité', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const fetchBMIData = async () => {
    try {
      const [profileResult, measurementResult] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('height')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('measurements')
          .select('weight')
          .eq('user_id', userId)
          .order('measurement_date', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      if (profileResult.error) throw profileResult.error;
      if (measurementResult.error) throw measurementResult.error;

      const profile = profileResult.data;
      const measurement = measurementResult.data;

      if (profile?.height && measurement?.weight) {
        const heightInMeters = profile.height / 100;
        const calculatedBmi = measurement.weight / (heightInMeters * heightInMeters);
        const bmiCategory = getBMICategory(calculatedBmi);

        setBmi(Math.round(calculatedBmi * 10) / 10);
        setCategory(bmiCategory.label);
        setColor(bmiCategory.color);
        setBgColor(bmiCategory.bg);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching BMI data:', error);
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

  if (!bmi) {
    return null;
  }

  return (
    <div className={`${bgColor} rounded-2xl shadow-md p-6 mb-6 border-2 border-opacity-20 ${color.replace('text-', 'border-')}`}>
      <div className="flex items-center space-x-4">
        <div className={`${color} flex-shrink-0`}>
          <Scale className="w-12 h-12" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            Indice de Masse Corporelle
          </h3>
          <p className={`text-3xl font-bold ${color} mb-1`}>
            {bmi}
          </p>
          <p className="text-sm text-gray-600">
            {category}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <p className="text-blue-600 font-semibold">&lt;18.5</p>
            <p className="text-gray-500">Insuffisant</p>
          </div>
          <div>
            <p className="text-green-600 font-semibold">18.5-24.9</p>
            <p className="text-gray-500">Normal</p>
          </div>
          <div>
            <p className="text-orange-600 font-semibold">25-29.9</p>
            <p className="text-gray-500">Surpoids</p>
          </div>
          <div>
            <p className="text-red-600 font-semibold">≥30</p>
            <p className="text-gray-500">Obésité</p>
          </div>
        </div>
      </div>
    </div>
  );
}
