import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Trophy, Lock, CheckCircle, Calendar, Play, ArrowRight } from 'lucide-react';
import { DailyProgramView } from '../Phase1/DailyProgramView';
import { PersonalizedTips } from '../Recommendations/PersonalizedTips';

export function AGPProgram() {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [showDayContent, setShowDayContent] = useState(false);
  const currentPhase = Math.ceil(currentDay / 7);

  useEffect(() => {
    if (user?.createdAt) {
      const startDate = new Date(user.createdAt);
      startDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const calculatedDay = Math.min(diffDays + 1, 28);
      setCurrentDay(calculatedDay);
    }
  }, [user]);

  const phases = [
    {
      phase: 1,
      title: 'Phase 1 - Réveil',
      description: 'Jours 1 à 7 - Éveillez votre potentiel',
      days: Array.from({ length: 7 }, (_, i) => i + 1),
    },
    {
      phase: 2,
      title: 'Phase 2 - Élan',
      description: 'Jours 8 à 14 - Prenez votre envol',
      days: Array.from({ length: 7 }, (_, i) => i + 8),
    },
    {
      phase: 3,
      title: 'Phase 3 - Harmonie',
      description: 'Jours 15 à 21 - Trouvez votre rythme',
      days: Array.from({ length: 7 }, (_, i) => i + 15),
    },
    {
      phase: 4,
      title: 'Phase 4 - Rayonnement',
      description: 'Jours 22 à 28 - Brillez de mille feux',
      days: Array.from({ length: 7 }, (_, i) => i + 22),
    },
  ];

  if (showDayContent) {
    return <DailyProgramView currentDay={currentDay} onBack={() => setShowDayContent(false)} />;
  }

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-8 pb-12 px-6 rounded-b-3xl mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Trophy className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Programme AGP</h1>
        </div>
        <p className="text-white text-opacity-90">
          28 jours pour transformer votre bien-être
        </p>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-[#2B7BBE] text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <div>
                <p className="text-sm text-blue-100">Vous êtes au</p>
                <p className="text-2xl font-bold">Jour {currentDay}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDayContent(true)}
              className="bg-white text-[#2B7BBE] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>Commencer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full bg-[#4A9CD9] rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all"
              style={{ width: `${(currentDay / 28) * 100}%` }}
            />
          </div>
          <p className="text-sm text-blue-100 mt-2">{currentDay} / 28 jours complétés</p>
        </div>

        <PersonalizedTips context="agp" maxTips={4} />

        {phases.map((phase) => (
          <div key={phase.phase} className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#333333] mb-2">{phase.title}</h2>
            <p className="text-gray-600 mb-4">{phase.description}</p>

            <div className="grid grid-cols-7 gap-2">
              {phase.days.map((day) => {
                const isCompleted = day < currentDay;
                const isCurrent = day === currentDay;
                const isLocked = day > currentDay;

                return (
                  <button
                    key={day}
                    disabled={isLocked}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-md'
                        : isCurrent
                        ? 'bg-[#2B7BBE] text-white shadow-lg scale-110'
                        : 'bg-gray-100 text-gray-400'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5" />
                    ) : null}
                    <span className="text-xs font-bold mt-1">{day}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-[#5FA84D] to-[#2B7BBE] rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-xl font-bold mb-2">Votre progression</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Jours complétés</span>
              <span className="font-bold">{currentDay - 1} / 28</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taux de réussite</span>
              <span className="font-bold">
                {Math.round(((currentDay - 1) / 28) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Jours restants</span>
              <span className="font-bold">{28 - currentDay + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
