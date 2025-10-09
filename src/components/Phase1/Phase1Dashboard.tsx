import { useState } from 'react';
import { BookOpen, Utensils, TrendingUp, Edit3 } from 'lucide-react';
import { EducationalCapsule } from './EducationalCapsule';
import { BreakfastRecipes } from './BreakfastRecipes';
import { ProgressCharts } from './ProgressCharts';
import { DailyJournalTracker } from '../Journal/DailyJournalTracker';

type Phase1Tab = 'capsule' | 'journal' | 'recipes' | 'progress';

interface Phase1DashboardProps {
  currentDay: number;
}

export function Phase1Dashboard({ currentDay }: Phase1DashboardProps) {
  const [activeTab, setActiveTab] = useState<Phase1Tab>('capsule');

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-8 pb-12 px-6 rounded-b-3xl mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Phase 1 - Réinitialisation
        </h1>
        <p className="text-white text-opacity-90">
          Reconnexion au corps et aux rythmes naturels
        </p>
        <p className="text-white text-opacity-80 text-sm mt-1">
          Jour {currentDay} sur 7
        </p>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <TabButton
              icon={BookOpen}
              label="Capsule"
              active={activeTab === 'capsule'}
              onClick={() => setActiveTab('capsule')}
            />
            <TabButton
              icon={Edit3}
              label="Journal"
              active={activeTab === 'journal'}
              onClick={() => setActiveTab('journal')}
            />
            <TabButton
              icon={Utensils}
              label="Recettes"
              active={activeTab === 'recipes'}
              onClick={() => setActiveTab('recipes')}
            />
            <TabButton
              icon={TrendingUp}
              label="Progrès"
              active={activeTab === 'progress'}
              onClick={() => setActiveTab('progress')}
            />
          </div>
        </div>

        <div>
          {activeTab === 'capsule' && <EducationalCapsule weekNumber={1} />}
          {activeTab === 'journal' && <DailyJournalTracker />}
          {activeTab === 'recipes' && <BreakfastRecipes />}
          {activeTab === 'progress' && <ProgressCharts />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-[#2B7BBE] text-white shadow-md'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
