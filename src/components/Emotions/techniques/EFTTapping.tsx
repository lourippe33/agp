import { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const tappingPoints = [
  {
    nom: 'Tranche de la main',
    position: 'Côté externe de la main, entre poignet et auriculaire',
    phrase: 'Même si je ressens [émotion], je m\'accepte complètement',
    image: '✋',
  },
  {
    nom: 'Sommet du crâne',
    position: 'Centre du sommet de la tête',
    phrase: '[émotion]',
    image: '👆',
  },
  {
    nom: 'Début du sourcil',
    position: 'Au-dessus du nez, début du sourcil',
    phrase: '[émotion]',
    image: '👁️',
  },
  {
    nom: 'Coin de l\'œil',
    position: 'Sur l\'os, au coin externe de l\'œil',
    phrase: 'Je libère [émotion]',
    image: '👁️',
  },
  {
    nom: 'Sous l\'œil',
    position: 'Sur l\'os sous l\'œil, aligné avec la pupille',
    phrase: 'Je me libère de [émotion]',
    image: '👁️',
  },
  {
    nom: 'Sous le nez',
    position: 'Entre le nez et la lèvre supérieure',
    phrase: 'Je choisis le calme',
    image: '👃',
  },
  {
    nom: 'Sous la bouche',
    position: 'Dans le creux entre la lèvre inférieure et le menton',
    phrase: 'Je choisis la paix',
    image: '👄',
  },
  {
    nom: 'Clavicule',
    position: 'Sous la clavicule, à 3 cm du sternum',
    phrase: 'Je me libère maintenant',
    image: '💪',
  },
  {
    nom: 'Sous le bras',
    position: 'À 10 cm sous l\'aisselle, niveau ligne soutien-gorge',
    phrase: 'Je suis en sécurité',
    image: '💪',
  },
];

export function EFTTapping({ onClose }: Props) {
  const [step, setStep] = useState<'intro' | 'emotion' | 'tapping' | 'complete'>('intro');
  const [emotion, setEmotion] = useState('');
  const [intensityBefore, setIntensityBefore] = useState(5);
  const [intensityAfter, setIntensityAfter] = useState<number | null>(null);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [round, setRound] = useState(1);
  const [tappedPoints, setTappedPoints] = useState<number[]>([]);

  const handleStartTapping = () => {
    if (emotion.trim()) {
      setStep('tapping');
    }
  };

  const handleTapPoint = () => {
    if (!tappedPoints.includes(currentPoint)) {
      setTappedPoints([...tappedPoints, currentPoint]);
    }

    setTimeout(() => {
      if (currentPoint < tappingPoints.length - 1) {
        setCurrentPoint(currentPoint + 1);
      } else {
        if (round < 2) {
          setRound(round + 1);
          setCurrentPoint(0);
          setTappedPoints([]);
        } else {
          setStep('complete');
        }
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentPoint > 0) {
      setCurrentPoint(currentPoint - 1);
    }
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333]">EFT Tapping</h2>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🤲</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                Emotional Freedom Technique
              </h3>
              <p className="text-gray-600">
                Libérez vos émotions négatives en tapotant des points d'acupression spécifiques
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <p className="font-semibold text-orange-800 mb-2">Comment ça marche ?</p>
              <p className="text-sm text-gray-700">
                L'EFT combine la psychologie cognitive avec la stimulation de points d'acupression.
                En tapotant ces points tout en vous concentrant sur une émotion, vous aidez votre
                corps à libérer cette émotion négative.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quelle émotion voulez-vous libérer ?
                </label>
                <input
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="Ex: anxiété, colère, tristesse, peur..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quelle est l'intensité de cette émotion ? (0 = aucune, 10 = maximale)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={intensityBefore}
                    onChange={(e) => setIntensityBefore(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-3xl font-bold text-orange-600 w-16 text-center">
                    {intensityBefore}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('emotion')}
              disabled={!emotion.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                emotion.trim()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'emotion') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333]">Préparation</h2>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                Votre émotion : {emotion}
              </div>
              <div className="text-2xl text-gray-600">
                Intensité : {intensityBefore}/10
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-2">Instructions</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <span>1.</span>
                  <span>Nous allons tapoter 9 points d'acupression</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>2.</span>
                  <span>Tapotez fermement mais sans douleur, 5-7 fois par point</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>3.</span>
                  <span>Répétez la phrase affichée à chaque point</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>4.</span>
                  <span>Nous ferons 2 rondes complètes</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep('intro')}
                className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Retour
              </button>
              <button
                onClick={handleStartTapping}
                className="flex-1 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                Commencer le tapping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'tapping') {
    const point = tappingPoints[currentPoint];
    const phrase = point.phrase.replace('[émotion]', emotion);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333333]">Ronde {round} / 2</h2>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center space-x-2">
              {tappingPoints.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index < currentPoint
                      ? 'bg-green-500'
                      : index === currentPoint
                      ? 'bg-orange-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <div className="text-8xl mb-4">{point.image}</div>
              <h3 className="text-3xl font-bold text-[#333333] mb-2">{point.nom}</h3>
              <p className="text-gray-600 mb-6">{point.position}</p>

              <div className="bg-orange-50 border-2 border-orange-500 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Répétez cette phrase en tapotant :</p>
                <p className="text-xl font-bold text-orange-800">"{phrase}"</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  Tapotez ce point avec 2-3 doigts, fermement mais sans douleur, environ 5-7 fois
                  tout en répétant la phrase.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              {currentPoint > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Précédent</span>
                </button>
              )}
              <button
                onClick={handleTapPoint}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg"
              >
                <Check className="w-6 h-6" />
                <span>J'ai tapot é ce point</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-3xl font-bold text-[#333333] mb-2">Session terminée !</h3>
              <p className="text-gray-600">
                Vous avez complété 2 rondes de tapping EFT
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Évaluation finale</p>
              <p className="text-sm text-gray-700 mb-4">
                Maintenant, réévaluez l'intensité de votre émotion "{emotion}"
              </p>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={intensityAfter ?? intensityBefore}
                  onChange={(e) => setIntensityAfter(parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="text-3xl font-bold text-blue-600 w-16 text-center">
                  {intensityAfter ?? intensityBefore}
                </div>
              </div>
            </div>

            {intensityAfter !== null && (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
                <div className="text-center">
                  <p className="font-semibold text-green-800 mb-2">Résultats</p>
                  <div className="flex items-center justify-center space-x-8">
                    <div>
                      <div className="text-sm text-gray-600">Avant</div>
                      <div className="text-3xl font-bold text-gray-700">{intensityBefore}</div>
                    </div>
                    <div className="text-2xl">→</div>
                    <div>
                      <div className="text-sm text-gray-600">Après</div>
                      <div className="text-3xl font-bold text-green-600">{intensityAfter}</div>
                    </div>
                  </div>
                  {intensityAfter < intensityBefore && (
                    <p className="text-green-700 mt-4">
                      Excellent ! Vous avez réduit l'intensité de {intensityBefore - intensityAfter} points.
                    </p>
                  )}
                  {intensityAfter > 3 && (
                    <p className="text-gray-700 mt-4 text-sm">
                      Si l'intensité est encore élevée, vous pouvez refaire une session de tapping.
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
