import { useState } from 'react';
import { Scale, Activity, Salad } from 'lucide-react';
import logoAgp from '../../assets/logo-agp.png';
import { MeasurementsTracker } from '../Measurements/MeasurementsTracker';
import { DailyWellnessTracker } from '../Wellness/DailyWellnessTracker';
import { FoodTracker } from '../Food/FoodTracker';

type TrackingTab = 'measurements' | 'wellness' | 'food';

interface TrackingViewProps {
  onDataSaved?: () => void;
}

export function TrackingView({ onDataSaved }: TrackingViewProps) {
  const [activeTab, setActiveTab] = useState<TrackingTab>('measurements');

  return (
    <div className="pb-24 h-full flex flex-col">
      <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-6 pb-6 px-6 rounded-b-3xl">
        <div className="mb-4">
          <img
            src={logoAgp}
            alt="AGP Logo"
            className="h-12 w-12 rounded-lg shadow-md"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Suivi personnel</h1>
        <p className="text-white text-opacity-90">
          Suivez votre progression quotidienne
        </p>
      </div>

      <div className="px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex space-x-2 overflow-x-auto">
          <TabButton
            icon={Scale}
            label="Mesures"
            active={activeTab === 'measurements'}
            onClick={() => setActiveTab('measurements')}
          />
          <TabButton
            icon={Activity}
            label="Bien-être"
            active={activeTab === 'wellness'}
            onClick={() => setActiveTab('wellness')}
          />
          <TabButton
            icon={Salad}
            label="Alimentation"
            active={activeTab === 'food'}
            onClick={() => setActiveTab('food')}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {activeTab === 'measurements' && <MeasurementsTracker onDataSaved={onDataSaved} />}
        {activeTab === 'wellness' && <DailyWellnessTracker onDataSaved={onDataSaved} />}
        {activeTab === 'food' && <FoodTracker onDataSaved={onDataSaved} />}
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-[#2B7BBE] text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
