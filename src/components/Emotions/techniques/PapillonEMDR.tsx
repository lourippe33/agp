import { useState, useEffect } from 'react';
import { X, Heart, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type Step = 'intro' | 'selectEmotion' | 'setup' | 'practice' | 'evaluate' | 'complete';
type Emotion = 'anxiété' | 'stress' | 'tristesse' | 'peur' | 'panique';

export function PapillonEMDR({ onClose }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [emotion, setEmotion] = useState<Emotion>('anxiété');
  const [initialIntensity, setInitialIntensity] = useState<number>(7);
  const [currentIntensity, setCurrentIntensity] = useState<number>(7);
  const [isActive, setIsActive] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right' | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  const emotionEmojis: Record<Emotion, string> = {
    'anxiété': '😰',
    'stress': '😫',
    'tristesse': '😢',
    'peur': '😨',
    'panique': '😱'
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setActiveSide(prev => {
        const newSide = prev === 'left' ? 'right' : 'left';
        setTapCount(count => count + 1);
        return newSide;
      });
    }, 1000);

    const timer = setInterval(() => {
      setSessionTime(time => time + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setTapCount(0);
    setSessionTime(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setStep('evaluate');
  };

  const handleRestart = () => {
    setStep('intro');
    setIsActive(false);
    setTapCount(0);
    setSessionTime(0);
    setInitialIntensity(7);
    setCurrentIntensity(7);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Le Papillon (Butterfly Hug)</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'intro' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🦋</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Technique EMDR d'Auto-Apaisement
              </h3>
              <p className="text-gray-700 mb-4">
                Le Papillon est une technique d'auto-apaisement issue de l'EMDR
                (Eye Movement Desensitization and Reprocessing).
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#333333] mb-2">Origine de la technique</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Développée par <strong>Lucina Artigas</strong>, psychologue mexicaine,
                    après l'ouragan Pauline en 1997. Elle cherchait une méthode simple
                    pour aider les enfants traumatisés à se calmer eux-mêmes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-3">
              <h4 className="font-bold text-[#333333]">Comment ça fonctionne :</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">1.</span>
                  <p>
                    <strong>Croisez vos bras</strong> sur votre poitrine, comme un X,
                    mains posées sur les épaules opposées
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">2.</span>
                  <p>
                    <strong>Tapotez alternativement</strong> chaque épaule,
                    lentement et doucement (environ 1 fois par seconde)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">3.</span>
                  <p>
                    La <strong>stimulation bilatérale alternée</strong> (gauche-droite)
                    active les deux hémisphères cérébraux et favorise l'apaisement
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">4.</span>
                  <p>
                    <strong>Respirez calmement</strong> pendant le tapotement
                    jusqu'à ressentir un apaisement
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#333333] mb-2 text-sm">Quand l'utiliser :</h4>
              <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
                <li>Crise d'anxiété ou de panique</li>
                <li>Après un événement stressant</li>
                <li>Pensées intrusives ou ruminations</li>
                <li>Difficultés d'endormissement</li>
                <li>Moments de tristesse intense</li>
              </ul>
            </div>

            <button
              onClick={() => setStep('selectEmotion')}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold text-lg"
            >
              Commencer
            </button>
          </div>
        )}

        {step === 'selectEmotion' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Quelle émotion souhaitez-vous apaiser ?
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(emotionEmojis) as Emotion[]).map((em) => (
                <button
                  key={em}
                  onClick={() => setEmotion(em)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    emotion === em
                      ? 'border-[#2B7BBE] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{emotionEmojis[em]}</div>
                  <div className="font-semibold capitalize">{em}</div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Intensité actuelle : {initialIntensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={initialIntensity}
                onChange={(e) => setInitialIntensity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2B7BBE]"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Faible</span>
                <span>Intense</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentIntensity(initialIntensity);
                setStep('setup');
              }}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 'setup' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Position du Papillon
            </h3>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center">
              <div className="text-8xl mb-6">🦋</div>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-lg">Préparez-vous :</p>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🤗</span>
                    <p className="text-sm pt-1">
                      Croisez vos bras sur votre poitrine en formant un X
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">👐</span>
                    <p className="text-sm pt-1">
                      Posez chaque main sur l'épaule opposée
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">😌</span>
                    <p className="text-sm pt-1">
                      Installez-vous confortablement et respirez calmement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                💡 L'application va vous guider avec un rythme visuel.
                Tapotez chaque épaule en suivant les indications.
              </p>
            </div>

            <button
              onClick={() => setStep('practice')}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Je suis prêt(e)
            </button>
          </div>
        )}

        {step === 'practice' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                Tapotement du Papillon
              </h3>
              <p className="text-gray-600 text-sm">
                Tapotez l'épaule indiquée à chaque pulsation
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-12">
              <div className="flex items-center justify-center space-x-8">
                <div
                  className={`relative transition-all duration-300 ${
                    activeSide === 'left'
                      ? 'scale-110 opacity-100'
                      : 'scale-90 opacity-40'
                  }`}
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    activeSide === 'left' ? 'bg-rose-400' : 'bg-gray-300'
                  } transition-colors duration-300`}>
                    <span className="text-white font-bold text-lg">Gauche</span>
                  </div>
                  {activeSide === 'left' && (
                    <div className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping"></div>
                  )}
                </div>

                <Heart className="w-12 h-12 text-pink-500" />

                <div
                  className={`relative transition-all duration-300 ${
                    activeSide === 'right'
                      ? 'scale-110 opacity-100'
                      : 'scale-90 opacity-40'
                  }`}
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    activeSide === 'right' ? 'bg-purple-400' : 'bg-gray-300'
                  } transition-colors duration-300`}>
                    <span className="text-white font-bold text-lg">Droite</span>
                  </div>
                  {activeSide === 'right' && (
                    <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#333333]">{tapCount}</div>
                <div className="text-xs text-gray-600">Tapotements</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-[#333333]">{formatTime(sessionTime)}</div>
                <div className="text-xs text-gray-600">Temps écoulé</div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                💡 Continuez jusqu'à ressentir un apaisement (généralement 30 secondes à 2 minutes)
              </p>
            </div>

            {!isActive ? (
              <button
                onClick={handleStart}
                className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Démarrer le tapotement
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-full py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg"
              >
                Arrêter et évaluer
              </button>
            )}
          </div>
        )}

        {step === 'evaluate' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Comment vous sentez-vous maintenant ?
            </h3>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Intensité actuelle : {currentIntensity}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentIntensity}
                  onChange={(e) => setCurrentIntensity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2B7BBE]"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Disparu</span>
                  <span>Encore intense</span>
                </div>
              </div>

              {initialIntensity > currentIntensity && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="font-semibold text-green-700">
                    Amélioration de {initialIntensity - currentIntensity} points
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setStep('practice');
                  setTapCount(0);
                  setSessionTime(0);
                }}
                className="py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                Continuer
              </button>
              <button
                onClick={() => setStep('complete')}
                className="py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Terminer</span>
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🦋✨</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Félicitations !
              </h3>
              <p className="text-gray-700 mb-6">
                Vous avez effectué {tapCount} tapotements pendant {formatTime(sessionTime)}.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-[#333333] mb-3">Résumé de la session :</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex justify-between">
                  <span>Émotion travaillée :</span>
                  <span className="font-semibold capitalize">{emotion} {emotionEmojis[emotion]}</span>
                </p>
                <p className="flex justify-between">
                  <span>Intensité initiale :</span>
                  <span className="font-semibold">{initialIntensity}/10</span>
                </p>
                <p className="flex justify-between">
                  <span>Intensité finale :</span>
                  <span className="font-semibold">{currentIntensity}/10</span>
                </p>
                <p className="flex justify-between">
                  <span>Durée totale :</span>
                  <span className="font-semibold">{formatTime(sessionTime)}</span>
                </p>
                {initialIntensity > currentIntensity && (
                  <div className="pt-3 border-t border-blue-300 mt-3">
                    <p className="flex justify-between text-green-700 font-bold">
                      <span>Amélioration :</span>
                      <span>-{initialIntensity - currentIntensity} points</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <p className="text-xs text-gray-700 text-center leading-relaxed">
                <strong>Référence :</strong> Technique développée par Lucina Artigas
                dans le cadre de la thérapie EMDR (Eye Movement Desensitization and Reprocessing).
              </p>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                💡 Plus vous pratiquez le Papillon, plus il devient efficace.
                N'hésitez pas à l'utiliser dès que vous en ressentez le besoin.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRestart}
                className="py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Recommencer</span>
              </button>
              <button
                onClick={onClose}
                className="py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
