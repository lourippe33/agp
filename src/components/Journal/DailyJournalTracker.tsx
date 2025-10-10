import { useState, useEffect } from 'react';
import { Smile, Frown, Meh, BatteryFull, BatteryMedium, BatteryLow, Moon, Clock, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { DailyJournal } from '../../types/journal';
import { updateUserStreak } from '../../utils/streakCalculator';

const emojiRatings = [
  { value: 1, emoji: '😫', label: 'Très faible' },
  { value: 2, emoji: '😕', label: 'Faible' },
  { value: 3, emoji: '😐', label: 'Moyen' },
  { value: 4, emoji: '🙂', label: 'Bien' },
  { value: 5, emoji: '😊', label: 'Excellent' },
];

export function DailyJournalTracker() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [journal, setJournal] = useState<Partial<DailyJournal>>({
    journal_date: new Date().toISOString().split('T')[0],
    energy_level: undefined,
    satiety_level: undefined,
    general_feeling: undefined,
    breakfast_time: '',
    lunch_time: '',
    dinner_time: '',
    sleep_quality: undefined,
    sleep_hours: undefined,
    notes: '',
  });

  useEffect(() => {
    loadTodayJournal();
  }, [user]);

  const loadTodayJournal = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `journal_${user.id}_${today}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        setJournal(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading journal:', e);
      }
    }

    try {
      const { data, error } = await supabase
        .from('daily_journals')
        .select('*')
        .eq('user_id', user.id)
        .eq('journal_date', today)
        .maybeSingle();

      if (data) {
        setJournal(data);
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Error syncing with database:', e);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setSaved(false);

    const journalData = {
      user_id: user.id,
      journal_date: journal.journal_date,
      energy_level: journal.energy_level,
      satiety_level: journal.satiety_level,
      general_feeling: journal.general_feeling,
      breakfast_time: journal.breakfast_time || null,
      lunch_time: journal.lunch_time || null,
      dinner_time: journal.dinner_time || null,
      sleep_quality: journal.sleep_quality,
      sleep_hours: journal.sleep_hours,
      notes: journal.notes,
      updated_at: new Date().toISOString(),
    };

    const storageKey = `journal_${user.id}_${journal.journal_date}`;
    localStorage.setItem(storageKey, JSON.stringify(journalData));

    try {
      const { error: dbError } = await supabase
        .from('daily_journals')
        .upsert(journalData, { onConflict: 'user_id,journal_date' });

      if (dbError) {
        console.error('Database sync error:', dbError);
        const errorMsg = dbError?.message || 'Erreur inconnue';
        const errorDetails = dbError?.details || dbError?.hint || '';
        setError(`Erreur: ${errorMsg}${errorDetails ? ' - ' + errorDetails : ''}`);
      } else {
        await updateUserStreak(user.id);
        setSaved(true);
        setError('');
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e: any) {
      console.error('Error syncing with database:', e);
      setError(e?.message || 'Erreur lors de l\'enregistrement');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-[#333333] mb-4">Mon Journal du Jour</h2>
        <p className="text-gray-600 mb-6">Prenez quelques minutes pour noter votre ressenti quotidien</p>

        <div className="space-y-6">
          <RatingSection
            icon={BatteryFull}
            label="Niveau d'énergie"
            value={journal.energy_level}
            onChange={(value) => setJournal({ ...journal, energy_level: value })}
          />

          <RatingSection
            icon={Smile}
            label="Satiété (faim/rassasiement)"
            value={journal.satiety_level}
            onChange={(value) => setJournal({ ...journal, satiety_level: value })}
          />

          <RatingSection
            icon={Meh}
            label="Ressenti général"
            value={journal.general_feeling}
            onChange={(value) => setJournal({ ...journal, general_feeling: value })}
          />

          <RatingSection
            icon={Moon}
            label="Qualité du sommeil"
            value={journal.sleep_quality}
            onChange={(value) => setJournal({ ...journal, sleep_quality: value })}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-[#2B7BBE]" />
          <h3 className="text-lg font-bold text-[#333333]">Horaires des repas</h3>
        </div>

        <div className="space-y-4">
          <TimeInput
            label="Petit-déjeuner"
            value={journal.breakfast_time || ''}
            onChange={(value) => setJournal({ ...journal, breakfast_time: value })}
            placeholder="Ex: 08:00"
          />
          <TimeInput
            label="Déjeuner"
            value={journal.lunch_time || ''}
            onChange={(value) => setJournal({ ...journal, lunch_time: value })}
            placeholder="Ex: 12:30"
          />
          <TimeInput
            label="Dîner"
            value={journal.dinner_time || ''}
            onChange={(value) => setJournal({ ...journal, dinner_time: value })}
            placeholder="Ex: 19:30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Moon className="w-5 h-5 text-[#2B7BBE]" />
          <h3 className="text-lg font-bold text-[#333333]">Sommeil</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'heures de sommeil
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="12"
              value={journal.sleep_hours || ''}
              onChange={(e) => setJournal({ ...journal, sleep_hours: parseFloat(e.target.value) || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7BBE] focus:border-transparent"
              placeholder="Ex: 7.5"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-4">Notes personnelles</h3>
        <textarea
          value={journal.notes || ''}
          onChange={(e) => setJournal({ ...journal, notes: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7BBE] focus:border-transparent resize-none"
          rows={4}
          placeholder="Comment vous êtes-vous senti aujourd'hui ? Qu'avez-vous remarqué ?"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#2B7BBE] hover:bg-[#2364A5] text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors shadow-md disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        <span>{loading ? 'Enregistrement...' : 'Enregistrer mon journal'}</span>
      </button>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-700 font-medium">✓ Journal enregistré avec succès !</p>
        </div>
      )}
    </div>
  );
}

function RatingSection({ icon: Icon, label, value, onChange }: any) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="w-5 h-5 text-[#2B7BBE]" />
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="flex justify-between space-x-2">
        {emojiRatings.map((rating) => (
          <button
            key={rating.value}
            onClick={() => onChange(rating.value)}
            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              value === rating.value
                ? 'border-[#2B7BBE] bg-blue-50 scale-105'
                : 'border-gray-200 hover:border-[#5FA84D] hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{rating.emoji}</span>
            <span className="text-xs text-gray-600">{rating.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeInput({ label, value, onChange, placeholder }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7BBE] focus:border-transparent"
        placeholder={placeholder}
      />
    </div>
  );
}
