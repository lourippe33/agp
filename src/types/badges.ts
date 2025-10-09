export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  color: string;
  unlockedAt?: string;
}

export const BADGES: Badge[] = [
  {
    id: 'starter',
    name: 'Débutant',
    description: 'Premiers pas en chronobiologie',
    icon: '🌱',
    threshold: 10,
    color: 'text-green-500',
  },
  {
    id: 'committed',
    name: 'Engagé',
    description: 'Une semaine de suivi régulier',
    icon: '💚',
    threshold: 35,
    color: 'text-emerald-500',
  },
  {
    id: 'motivated',
    name: 'Motivé',
    description: '50 points chrono atteints',
    icon: '⭐',
    threshold: 50,
    color: 'text-yellow-500',
  },
  {
    id: 'disciplined',
    name: 'Discipliné',
    description: 'Un mois de suivi',
    icon: '🏆',
    threshold: 100,
    color: 'text-amber-500',
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Maîtrise de la chronobiologie',
    icon: '👑',
    threshold: 200,
    color: 'text-orange-500',
  },
  {
    id: 'master',
    name: 'Maître Chrono',
    description: 'Excellence absolue',
    icon: '💎',
    threshold: 365,
    color: 'text-blue-500',
  },
];
