import { useState } from 'react';
import { Brain, ChevronRight, Clock } from 'lucide-react';
import neuroData from '../../data/neurotransmitters.json';

interface NeuroBalanceWidgetProps {
  onNavigate?: (view: string) => void;
}

export function NeuroBalanceWidget({ onNavigate }: NeuroBalanceWidgetProps = {}) {
  const [expanded, setExpanded] = useState(false);

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const timeOfDay = getCurrentTimeOfDay();
  const dailyTip = neuroData.dailyTips.find(tip => tip.time === timeOfDay) || neuroData.dailyTips[0];

  const getPrimaryNeuro = () => {
    if (timeOfDay === 'morning') return neuroData.neurotransmitters[0];
    if (timeOfDay === 'afternoon') return neuroData.neurotransmitters[1];
    return neuroData.neurotransmitters[2];
  };

  const primaryNeuro = getPrimaryNeuro();

  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800">Équilibre Neuro</h3>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-center space-x-3 mb-3">
          <span className="text-4xl">{dailyTip.emoji}</span>
          <div>
            <p className="font-semibold text-gray-800">{dailyTip.title}</p>
            <p className="text-sm text-gray-600">{dailyTip.message}</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onNavigate) {
              onNavigate('chronobiology');
            } else {
              setExpanded(true);
            }
          }}
          className="mt-4 flex items-center space-x-2 text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          <Clock className="w-4 h-4" />
          <span>En savoir plus sur votre chronobiologie</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Équilibre Neuro</h3>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Réduire
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-3xl">{dailyTip.emoji}</span>
          <div>
            <p className="font-bold text-gray-800">{dailyTip.title}</p>
            <p className="text-sm text-gray-600">{dailyTip.message}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
          <span className="text-2xl">{primaryNeuro.emoji}</span>
          <span>Focus : {primaryNeuro.name}</span>
        </h4>

        <div className="bg-white rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{primaryNeuro.tagline}</span>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: primaryNeuro.color }}
            >
              {primaryNeuro.peakTime}
            </span>
          </div>

          <p className="text-sm text-gray-600">{primaryNeuro.description}</p>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Aliments à privilégier :</p>
            <div className="flex flex-wrap gap-2">
              {primaryNeuro.foods.map((food, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span>{food.icon}</span>
                  <span className="text-gray-700">{food.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-1">💡 Astuce</p>
            <p className="text-sm text-blue-700">{primaryNeuro.tips[0]}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {neuroData.neurotransmitters.filter(n => n.id !== primaryNeuro.id).slice(0, 2).map((neuro) => (
          <div
            key={neuro.id}
            className="bg-white rounded-xl p-3 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{neuro.emoji}</span>
              <span className="text-sm font-bold text-gray-800">{neuro.name}</span>
            </div>
            <p className="text-xs text-gray-600">{neuro.tagline}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {neuro.benefits.slice(0, 2).map((benefit, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
