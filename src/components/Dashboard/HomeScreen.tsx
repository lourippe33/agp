import { Trophy, Dumbbell, UtensilsCrossed, Heart, Sparkles, Pencil, Brain } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { WellnessWeather } from './WellnessWeather';
import { NeuroBalanceWidget } from '../Neurotransmitters/NeuroBalanceWidget';
import { NotificationBell } from '../Notifications/NotificationBell';
import { NotificationsList } from '../Notifications/NotificationsList';

interface HomeScreenProps {
  onNavigate: (view: string) => void;
  weatherRefreshTrigger?: number;
}

const DAILY_MOTIVATIONS = [
  "Chaque petit effort compte dans tes 28 jours",
  "Un voyage de mille lieues commence par un premier pas",
  "La constance est la clé de ta transformation",
  "Ton corps te remercie pour chaque bon choix",
  "Chaque jour est une nouvelle opportunité",
  "Ta détermination forge ton succès",
  "Les petites victoires mènent aux grands changements",
  "Crois en ton potentiel de transformation",
  "Aujourd'hui, tu es plus fort qu'hier",
  "La patience et la persévérance sont tes alliées",
  "Chaque effort te rapproche de ton objectif",
  "Tu es capable de plus que tu ne le penses",
  "La régularité crée des miracles",
  "Ton engagement d'aujourd'hui façonne ton demain",
  "Célèbre chaque progrès, même le plus petit",
  "Tu es à mi-chemin de ta transformation",
  "Continue, tu es sur la bonne voie",
  "Ton corps s'adapte et se renforce chaque jour",
  "La persévérance est ta plus grande force",
  "Chaque jour compte dans ton parcours",
  "Tu as déjà accompli tant de choses",
  "Garde le cap, la ligne d'arrivée approche",
  "Ton engagement inspire ton entourage",
  "Les derniers efforts sont souvent les plus puissants",
  "Tu es presque au bout de ce magnifique voyage",
  "Ta transformation est remarquable",
  "Dernière ligne droite, tu y es presque",
  "Félicitations, tu as transformé tes habitudes !"
];

export function HomeScreen({ onNavigate, weatherRefreshTrigger }: HomeScreenProps) {
  const { user } = useAuth();
  const [currentDay, setCurrentDay] = useState(1);
  const [motivation, setMotivation] = useState(DAILY_MOTIVATIONS[0]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.createdAt) {
      const startDate = new Date(user.createdAt);
      startDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const programDay = Math.min(Math.max(diffDays + 1, 1), 28);
      setCurrentDay(programDay);
      setMotivation(DAILY_MOTIVATIONS[programDay - 1]);
      setProgressPercentage(Math.round((programDay / 28) * 100));
    }
  }, [user]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-8 pb-12 px-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              Bonjour, {user?.fullName?.split(' ')[0] || 'eric'}
            </h1>
            <p className="text-white text-opacity-90">
              Votre parcours chronobiologique vous attend
            </p>
          </div>
          <NotificationBell onOpenNotifications={() => setShowNotifications(true)} />
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6 pb-24 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">👋</span>
            <h2 className="text-xl font-bold text-[#333333]">
              Bienvenue sur AGP
            </h2>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Jour {currentDay} / 28
              </span>
              <span className="text-sm font-bold text-[#2B7BBE]">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2B7BBE] to-[#5FA84D] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#2B7BBE] p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 text-[#2B7BBE]">
              <Sparkles className="w-5 h-5" />
              <p className="font-medium">
                {motivation}
              </p>
              <Pencil className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={() => onNavigate('agp')}
            className="w-full bg-[#2B7BBE] hover:bg-[#2364A5] text-white rounded-xl p-4 flex items-center space-x-3 transition-colors shadow-md"
          >
            <Trophy className="w-8 h-8" />
            <div className="flex-1 text-left">
              <p className="font-bold text-lg">Bienvenue dans votre jour {currentDay}</p>
              <p className="text-sm text-blue-100 opacity-90">du programme AGP</p>
            </div>
          </button>
        </div>

        <WellnessWeather userId={user?.id || ''} refreshTrigger={weatherRefreshTrigger} onNavigate={onNavigate} />

        <div className="mb-6">
          <NeuroBalanceWidget onNavigate={onNavigate} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('sports')}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 transition-all hover:scale-105 shadow-md"
          >
            <Dumbbell className="w-10 h-10" />
            <div className="text-center">
              <p className="font-bold text-lg">Sport</p>
              <p className="text-sm text-orange-100">activités</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('recipes')}
            className="bg-[#5FA84D] hover:bg-[#4E8A3E] text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 transition-all hover:scale-105 shadow-md"
          >
            <UtensilsCrossed className="w-10 h-10" />
            <div className="text-center">
              <p className="font-bold text-lg">Recettes</p>
              <p className="text-sm text-green-100">adaptées</p>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('relaxation')}
            className="bg-pink-400 hover:bg-pink-500 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 transition-all hover:scale-105 shadow-md"
          >
            <Heart className="w-10 h-10" />
            <div className="text-center">
              <p className="font-bold text-lg">Détente</p>
              <p className="text-sm text-pink-100">relaxation</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('emotions')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 transition-all hover:scale-105 shadow-md"
          >
            <Brain className="w-10 h-10" />
            <div className="text-center">
              <p className="font-bold text-lg">Émotions</p>
              <p className="text-sm text-cyan-100">gestion</p>
            </div>
          </button>
        </div>
      </div>

      {showNotifications && (
        <NotificationsList onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
