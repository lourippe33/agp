import { useState } from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const steps = [
  {
    sens: 'Vue',
    nombre: 5,
    color: 'blue',
    instruction: 'Identifiez 5 choses que vous pouvez VOIR autour de vous',
    exemples: ['Le cadre sur le mur', 'La couleur de votre tasse', 'La forme d\'un nuage', 'Un objet sur la table', 'La texture du sol'],
  },
  {
    sens: 'Toucher',
    nombre: 4,
    color: 'green',
    instruction: 'Identifiez 4 choses que vous pouvez TOUCHER',
    exemples: ['La texture de vos vêtements', 'Vos pieds sur le sol', 'La température de l\'air', 'L\'accoudoir de votre chaise'],
  },
  {
    sens: 'Ouïe',
    nombre: 3,
    color: 'orange',
    instruction: 'Identifiez 3 sons que vous pouvez ENTENDRE',
    exemples: ['Le bruit de fond de la pièce', 'Votre respiration', 'Un son lointain', 'Le tic-tac d\'une horloge'],
  },
  {
    sens: 'Odorat',
    nombre: 2,
    color: 'purple',
    instruction: 'Identifiez 2 choses que vous pouvez SENTIR',
    exemples: ['L\'odeur de l\'air', 'Votre parfum', 'L\'odeur de votre environnement', 'Une odeur de nourriture'],
  },
  {
    sens: 'Goût',
    nombre: 1,
    color: 'pink',
    instruction: 'Identifiez 1 chose que vous pouvez GOÛTER',
    exemples: ['Le goût dans votre bouche', 'Votre salive', 'Un reste de repas', 'Une gorgée d\'eau'],
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; button: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-500',
      button: 'bg-green-500 hover:bg-green-600',
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-500',
      button: 'bg-purple-500 hover:bg-purple-600',
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      border: 'border-pink-500',
      button: 'bg-pink-500 hover:bg-pink-600',
    },
  };
  return colors[color];
};

export function Ancrage54321({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const step = steps[currentStep];
  const colors = getColorClasses(step.color);

  const handleCheckItem = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter(i => i !== index));
    } else {
      setCheckedItems([...checkedItems, index]);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCheckedItems([]);
    } else {
      setIsComplete(true);
    }
  };

  const canProceed = checkedItems.length >= step.nombre;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Excellent travail !
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Vous avez complété l'exercice d'ancrage 5-4-3-2-1.
              Vous devriez vous sentir plus présent et ancré dans l'instant.
            </p>
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6">
              <p className="text-gray-700">
                <span className="font-semibold">Astuce :</span> Cette technique peut être utilisée
                discrètement n'importe où, n'importe quand. Gardez-la dans votre boîte à outils
                émotionnelle pour les moments de stress ou d'anxiété.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold text-lg"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Ancrage 5-4-3-2-1</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? `${getColorClasses(s.color).button} text-white`
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : s.nombre}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-1 bg-gray-200 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`${colors.bg} border-l-4 ${colors.border} rounded-xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-2xl font-bold ${colors.text}`}>
              {step.sens}
            </h3>
            <div className="text-3xl font-bold text-gray-400">
              {step.nombre}
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-6">{step.instruction}</p>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Cochez au fur et à mesure que vous identifiez chaque élément :
            </p>
            {step.exemples.map((exemple, index) => (
              <button
                key={index}
                onClick={() => handleCheckItem(index)}
                className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-all ${
                  checkedItems.includes(index)
                    ? `${colors.bg} border-2 ${colors.border}`
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    checkedItems.includes(index)
                      ? `${colors.border} ${colors.bg}`
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {checkedItems.includes(index) && (
                    <Check className={`w-4 h-4 ${colors.text}`} />
                  )}
                </div>
                <span className={`text-left ${checkedItems.includes(index) ? 'font-semibold' : ''}`}>
                  {exemple}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg">
            <p className="font-semibold mb-2">💡 Ce ne sont que des exemples</p>
            <p>
              Identifiez ce qui vous entoure VOUS, dans VOTRE environnement actuel.
              Prenez le temps de vraiment observer, toucher, écouter, sentir et goûter.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            Étape {currentStep + 1} sur {steps.length}
          </div>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors font-semibold ${
              canProceed
                ? `${colors.button} text-white`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
