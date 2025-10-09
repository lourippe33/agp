import { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const steps = [
  {
    title: 'Préparation',
    icon: '🧘',
    instruction: 'Installez-vous confortablement dans un endroit calme. Fermez les yeux si vous le souhaitez.',
    duration: 'Prenez 3 respirations profondes',
  },
  {
    title: 'Choix du lieu',
    icon: '🌍',
    instruction: 'Pensez à un lieu où vous vous sentez parfaitement bien et en sécurité. Il peut être réel ou imaginaire.',
    examples: ['Une plage au coucher du soleil', 'Une forêt paisible', 'Un jardin secret', 'Une montagne majestueuse', 'Un endroit de votre enfance'],
    duration: '30 secondes',
  },
  {
    title: 'Construction visuelle',
    icon: '👁️',
    instruction: 'Visualisez ce lieu en détail. Quelles sont les couleurs ? Les formes ? La lumière est-elle douce ou vive ?',
    prompts: [
      'Regardez autour de vous dans ce lieu',
      'Observez les détails : textures, nuances de couleurs',
      'Notez ce qui attire votre regard',
    ],
    duration: '1 minute',
  },
  {
    title: 'Sons',
    icon: '👂',
    instruction: 'Quels sons entendez-vous dans ce lieu ?',
    examples: ['Le bruit des vagues', 'Le chant des oiseaux', 'Le vent dans les arbres', 'Un silence apaisant', 'Une musique douce'],
    duration: '30 secondes',
  },
  {
    title: 'Sensations tactiles',
    icon: '✋',
    instruction: 'Que ressentez-vous sur votre peau et dans votre corps ?',
    prompts: [
      'La chaleur du soleil ou la fraîcheur de l\'air',
      'La texture du sol sous vos pieds',
      'Une brise légère sur votre visage',
      'La douceur de l\'environnement',
    ],
    duration: '30 secondes',
  },
  {
    title: 'Odeurs',
    icon: '👃',
    instruction: 'Quelles odeurs percevez-vous dans ce lieu ?',
    examples: ['L\'air marin', 'Le parfum des pins', 'L\'odeur de fleurs', 'L\'air pur de la montagne', 'Une odeur réconfortante'],
    duration: '30 secondes',
  },
  {
    title: 'Émotions',
    icon: '💖',
    instruction: 'Ressentez les émotions que ce lieu vous procure : paix, sécurité, joie, sérénité...',
    prompts: [
      'Laissez ces émotions positives vous envahir',
      'Sentez votre corps se détendre profondément',
      'Ancrez ce sentiment de bien-être',
    ],
    duration: '1 minute',
  },
  {
    title: 'Mot-clé d\'ancrage',
    icon: '🔑',
    instruction: 'Choisissez un mot simple qui représente ce lieu et ces sensations. Ce sera votre clé d\'accès rapide.',
    examples: ['Paix', 'Sérénité', 'Refuge', 'Calme', 'Lumière', 'Ocean', 'Forêt'],
    duration: '30 secondes',
  },
];

export function VisualisationLieu({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [keyword, setKeyword] = useState('');

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-3xl font-bold text-[#333333] mb-2">
                Votre lieu ressource est créé !
              </h3>
              <p className="text-gray-600">
                Vous avez maintenant un refuge mental accessible à tout moment
              </p>
            </div>

            {keyword && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-500 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2 text-center">Votre mot-clé d'ancrage :</p>
                <p className="text-4xl font-bold text-purple-700 text-center">
                  "{keyword}"
                </p>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <p className="font-semibold text-blue-800 mb-2">Comment utiliser votre lieu ressource</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Visitez régulièrement ce lieu pour le renforcer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>En cas de stress, fermez les yeux et prononcez votre mot-clé</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Plus vous pratiquez, plus l'accès sera rapide et efficace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Vous pouvez créer plusieurs lieux ressources différents</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6">
              <p className="text-center text-green-800">
                Ce lieu est maintenant votre refuge mental personnel, disponible 24h/24.
                Il vous accompagnera dans tous vos moments difficiles.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors font-semibold text-lg"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Visualisation du Lieu Ressource</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-purple-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Étape {currentStep + 1} / {steps.length}</span>
            <span>{step.duration}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="text-7xl mb-4">{step.icon}</div>
            <h3 className="text-3xl font-bold text-[#333333] mb-4">{step.title}</h3>
            <p className="text-lg text-gray-700 leading-relaxed">{step.instruction}</p>
          </div>

          {step.examples && (
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
              <p className="font-semibold text-purple-800 mb-2">Exemples :</p>
              <ul className="space-y-1">
                {step.examples.map((example, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="text-purple-600">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.prompts && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Laissez-vous guider :</p>
              <ul className="space-y-2">
                {step.prompts.map((prompt, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentStep === steps.length - 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Entrez votre mot-clé d'ancrage :
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: Paix, Sérénité, Refuge..."
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Conseil :</span> Prenez tout votre temps.
              Plus votre visualisation est riche et détaillée, plus elle sera efficace.
              Il n'y a pas de bonne ou mauvaise réponse, écoutez simplement votre intuition.
            </p>
          </div>

          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Précédent
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 && !keyword.trim()}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl transition-colors font-semibold ${
                currentStep === steps.length - 1 && !keyword.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
