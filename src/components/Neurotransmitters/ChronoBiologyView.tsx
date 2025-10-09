import { Clock, Brain, Sparkles } from 'lucide-react';
import neuroData from '../../data/neurotransmitters.json';

export function ChronoBiologyView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">{neuroData.chronoBiology.title}</h2>
          <p className="text-gray-600">{neuroData.chronoBiology.intro}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>Votre journée idéale</span>
        </h3>

        <div className="space-y-4">
          {neuroData.chronoBiology.timeline.map((phase, idx) => {
            const neuro = neuroData.neurotransmitters.find(n => n.id === phase.neurotransmitter);
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border-l-4 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderColor: neuro?.color || '#ccc' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="text-2xl font-bold text-white px-3 py-1 rounded-lg"
                      style={{ backgroundColor: neuro?.color || '#ccc' }}
                    >
                      {phase.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{phase.phase}</h4>
                      <p className="text-sm text-gray-600">{phase.action}</p>
                    </div>
                  </div>
                  <span className="text-3xl">{neuro?.emoji}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Pourquoi ? </span>
                    {phase.why}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {neuroData.neurotransmitters.map((neuro) => (
          <div
            key={neuro.id}
            className="bg-white rounded-2xl shadow-lg p-6 border-t-4 hover:shadow-xl transition-shadow"
            style={{ borderColor: neuro.color }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">{neuro.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{neuro.name}</h3>
                <p className="text-sm font-semibold" style={{ color: neuro.color }}>
                  {neuro.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">{neuro.description}</p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Pic d'activité</span>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: neuro.color }}
                >
                  {neuro.peakTime}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {neuro.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Aliments à privilégier :</p>
              <div className="grid grid-cols-3 gap-2">
                {neuro.foods.map((food, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-2xl mb-1">{food.icon}</div>
                    <div className="text-xs text-gray-700 font-medium">{food.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start space-x-2">
                <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-800 mb-1">Astuce du jour</p>
                  <p className="text-xs text-blue-700">{neuro.tips[0]}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span>Le secret de la chronobiologie</span>
        </h3>
        <p className="text-gray-700 mb-4">
          Votre corps ne fonctionne pas de la même manière à 8h du matin qu'à 20h le soir. En
          respectant votre horloge biologique et en mangeant les bons aliments au bon moment,
          vous optimisez naturellement votre production de neurotransmetteurs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-2xl mb-2">🌅</div>
            <p className="text-sm font-semibold text-gray-800">Le matin</p>
            <p className="text-xs text-gray-600">Protéines et bons gras pour la dopamine et l'énergie</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-2xl mb-2">☀️</div>
            <p className="text-sm font-semibold text-gray-800">Le midi</p>
            <p className="text-xs text-gray-600">Repas complet pour la sérotonine et le bien-être</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="text-2xl mb-2">🌙</div>
            <p className="text-sm font-semibold text-gray-800">Le soir</p>
            <p className="text-xs text-gray-600">Léger pour le GABA et un sommeil réparateur</p>
          </div>
        </div>
      </div>
    </div>
  );
}
