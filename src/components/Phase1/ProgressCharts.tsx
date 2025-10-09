import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { DailyJournal, UserProgress } from '../../types/journal';

export function ProgressCharts() {
  const { user } = useAuth();
  const [journals, setJournals] = useState<DailyJournal[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    const { data: journalData } = await supabase
      .from('daily_journals')
      .select('*')
      .eq('user_id', user.id)
      .order('journal_date', { ascending: false })
      .limit(7);

    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (journalData) setJournals(journalData);
    if (progressData) setProgress(progressData);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const averageEnergy = journals.length > 0
    ? journals.reduce((acc, j) => acc + (j.energy_level || 0), 0) / journals.filter(j => j.energy_level).length
    : 0;

  const averageSleep = journals.length > 0
    ? journals.reduce((acc, j) => acc + (j.sleep_quality || 0), 0) / journals.filter(j => j.sleep_quality).length
    : 0;

  const journalsThisWeek = journals.length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#2B7BBE] to-[#5FA84D] rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Votre Progression</h2>
        </div>
        <p className="text-white text-opacity-90">
          Visualisez vos progrès sur les 7 derniers jours
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Award}
          label="Série en cours"
          value={`${progress?.completion_streak || 0} jours`}
          color="bg-[#2B7BBE]"
        />
        <StatCard
          icon={Calendar}
          label="Journals complétés"
          value={`${journalsThisWeek}/7`}
          color="bg-[#5FA84D]"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-4">Moyennes hebdomadaires</h3>

        <div className="space-y-4">
          <ProgressBar
            label="Énergie moyenne"
            value={averageEnergy}
            max={5}
            color="bg-[#2B7BBE]"
            emoji="⚡"
          />
          <ProgressBar
            label="Qualité du sommeil"
            value={averageSleep}
            max={5}
            color="bg-[#5FA84D]"
            emoji="😴"
          />
          <ProgressBar
            label="Régularité des repas"
            value={progress?.meals_regularity_score || 0}
            max={100}
            color="bg-[#4A9CD9]"
            emoji="🍽️"
            unit="%"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#333333] mb-4">Dernières entrées</h3>

        {journals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune entrée pour le moment</p>
            <p className="text-sm mt-2">Commencez votre journal aujourd'hui !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {journals.slice(0, 5).map((journal) => (
              <JournalEntry key={journal.id} journal={journal} />
            ))}
          </div>
        )}
      </div>

      {progress && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-6 h-6 text-[#2B7BBE]" />
            <h3 className="text-lg font-bold text-[#333333]">Votre objectif</h3>
          </div>
          <p className="text-gray-700 mb-2">
            Vous êtes au <strong>jour {progress.current_day}</strong> du programme AGP
          </p>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#5FA84D] to-[#2B7BBE] h-full transition-all duration-500"
              style={{ width: `${(progress.current_day / 28) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {28 - progress.current_day} jours restants
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className={`${color} text-white rounded-xl p-4`}>
      <Icon className="w-6 h-6 mb-2 opacity-90" />
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}

function ProgressBar({ label, value, max, color, emoji, unit = '' }: any) {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </span>
        <span className="text-sm font-bold text-[#333333]">
          {value.toFixed(1)}{unit} / {max}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function JournalEntry({ journal }: { journal: DailyJournal }) {
  const date = new Date(journal.journal_date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{date}</p>
        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
          {journal.energy_level && (
            <span>⚡ {journal.energy_level}/5</span>
          )}
          {journal.sleep_quality && (
            <span>😴 {journal.sleep_quality}/5</span>
          )}
        </div>
      </div>
      {journal.general_feeling && (
        <div className="text-2xl">
          {journal.general_feeling >= 4 ? '😊' : journal.general_feeling >= 3 ? '😐' : '😕'}
        </div>
      )}
    </div>
  );
}
