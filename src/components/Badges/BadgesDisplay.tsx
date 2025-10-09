import { Award, Lock } from 'lucide-react';
import { BADGES, Badge } from '../../types/badges';

interface BadgesDisplayProps {
  totalPoints: number;
}

export function BadgesDisplay({ totalPoints }: BadgesDisplayProps) {
  const unlockedBadges = BADGES.filter(badge => totalPoints >= badge.threshold);
  const nextBadge = BADGES.find(badge => totalPoints < badge.threshold);
  const progressToNext = nextBadge
    ? Math.min(100, (totalPoints / nextBadge.threshold) * 100)
    : 100;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#333333]">Badges & Récompenses</h3>
        <div className="flex items-center space-x-2 text-[#4A7729]">
          <Award className="w-5 h-5" />
          <span className="font-bold">{unlockedBadges.length}/{BADGES.length}</span>
        </div>
      </div>

      {nextBadge && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#7AC943] to-[#4A7729] bg-opacity-10 rounded-lg border border-[#7AC943]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{nextBadge.icon}</span>
              <div>
                <p className="font-semibold text-[#333333]">Prochain badge: {nextBadge.name}</p>
                <p className="text-sm text-gray-600">{nextBadge.description}</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#4A7729]">
              {totalPoints}/{nextBadge.threshold}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#7AC943] to-[#4A7729] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BADGES.map((badge) => {
          const isUnlocked = totalPoints >= badge.threshold;
          return (
            <BadgeCard key={badge.id} badge={badge} isUnlocked={isUnlocked} />
          );
        })}
      </div>

      {unlockedBadges.length === BADGES.length && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border-2 border-yellow-400">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">🎉</span>
            <div>
              <p className="font-bold text-amber-800">Félicitations !</p>
              <p className="text-sm text-amber-700">Vous avez débloqué tous les badges !</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
}

function BadgeCard({ badge, isUnlocked }: BadgeCardProps) {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all ${
        isUnlocked
          ? 'bg-gradient-to-br from-white to-green-50 border-[#7AC943] shadow-md hover:shadow-lg'
          : 'bg-gray-50 border-gray-200 opacity-60'
      }`}
    >
      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div className="flex flex-col items-center text-center space-y-2">
        <span className={`text-4xl ${isUnlocked ? 'animate-bounce' : 'grayscale'}`}>
          {badge.icon}
        </span>
        <div>
          <p className={`font-bold text-sm ${isUnlocked ? 'text-[#333333]' : 'text-gray-500'}`}>
            {badge.name}
          </p>
          <p className={`text-xs ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {badge.description}
          </p>
          <p className={`text-xs mt-1 font-semibold ${isUnlocked ? 'text-[#4A7729]' : 'text-gray-400'}`}>
            {badge.threshold} points
          </p>
        </div>
      </div>
    </div>
  );
}
