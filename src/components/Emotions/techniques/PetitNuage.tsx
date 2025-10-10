import { useState } from 'react';
import { X, Wind, RotateCcw, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type Emotion = 'colère' | 'anxiété' | 'tristesse' | 'frustration';
type CloudSize = 'petit' | 'moyen' | 'gros' | 'énorme';
type CloudColor = 'gris clair' | 'gris foncé' | 'noir' | 'orageux';
type Step = 'intro' | 'selectEmotion' | 'characterizeCloud' | 'breathe' | 'evaluate' | 'complete';

export function PetitNuage({ onClose }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [emotion, setEmotion] = useState<Emotion>('colère');
  const [initialIntensity, setInitialIntensity] = useState<number>(7);
  const [currentIntensity, setCurrentIntensity] = useState<number>(7);
  const [cloudSize, setCloudSize] = useState<CloudSize>('gros');
  const [cloudColor, setCloudColor] = useState<CloudColor>('gris foncé');
  const [breathCycle, setBreathCycle] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'idle'>('idle');

  const emotionEmojis: Record<Emotion, string> = {
    'colère': '😠',
    'anxiété': '😰',
    'tristesse': '😢',
    'frustration': '😤'
  };

  const cloudColorClasses: Record<CloudColor, string> = {
    'gris clair': 'bg-gray-300',
    'gris foncé': 'bg-gray-500',
    'noir': 'bg-gray-800',
    'orageux': 'bg-gradient-to-br from-gray-700 via-gray-600 to-yellow-600'
  };

  const cloudSizeClasses: Record<CloudSize, string> = {
    'petit': 'w-32 h-20',
    'moyen': 'w-48 h-28',
    'gros': 'w-64 h-36',
    'énorme': 'w-80 h-44'
  };

  const handleBreathCycle = () => {
    setIsBreathing(true);
    setBreathPhase('inhale');

    setTimeout(() => {
      setBreathPhase('exhale');
    }, 3000);

    setTimeout(() => {
      setBreathPhase('idle');
      setIsBreathing(false);
      setBreathCycle(prev => prev + 1);
      setStep('evaluate');
    }, 6000);
  };

  const handleRestart = () => {
    setStep('intro');
    setBreathCycle(0);
    setInitialIntensity(7);
    setCurrentIntensity(7);
    setCloudSize('gros');
    setCloudColor('gris foncé');
  };

  const getCloudOpacity = () => {
    if (breathPhase === 'exhale') return 'opacity-30 scale-75';
    if (breathPhase === 'inhale') return 'opacity-100 scale-100';
    return 'opacity-70 scale-90';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Le Petit Nuage</h2>
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
              <div className="text-6xl mb-4">☁️</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Visualisation du Petit Nuage
              </h3>
              <p className="text-gray-700 mb-6">
                Cette technique de visualisation vous permet d'atténuer une émotion intense
                en la transformant en nuage que vous allez progressivement éloigner par la respiration.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-3">
              <h4 className="font-bold text-[#333333]">Comment ça fonctionne :</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-start space-x-2">
                  <span className="font-semibold text-[#2B7BBE]">1.</span>
                  <span>Identifiez l'émotion que vous souhaitez atténuer</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="font-semibold text-[#2B7BBE]">2.</span>
                  <span>Visualisez cette émotion sous forme de nuage</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="font-semibold text-[#2B7BBE]">3.</span>
                  <span>Soufflez pour éloigner le nuage à chaque expiration</span>
                </p>
                <p className="flex items-start space-x-2">
                  <span className="font-semibold text-[#2B7BBE]">4.</span>
                  <span>Répétez jusqu'à vous sentir mieux</span>
                </p>
              </div>
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
              Quelle émotion souhaitez-vous atténuer ?
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
                Intensité actuelle de l'émotion : {initialIntensity}/10
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
                setStep('characterizeCloud');
              }}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 'characterizeCloud' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Visualisez votre nuage
            </h3>
            <p className="text-center text-gray-600">
              Comment voyez-vous le nuage qui représente votre {emotion} ?
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Taille du nuage :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['petit', 'moyen', 'gros', 'énorme'] as CloudSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setCloudSize(size)}
                      className={`p-3 rounded-lg border-2 transition-all capitalize ${
                        cloudSize === size
                          ? 'border-[#2B7BBE] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Couleur du nuage :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['gris clair', 'gris foncé', 'noir', 'orageux'] as CloudColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setCloudColor(color)}
                      className={`p-3 rounded-lg border-2 transition-all capitalize ${
                        cloudColor === color
                          ? 'border-[#2B7BBE] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-8">
              <div
                className={`${cloudSizeClasses[cloudSize]} ${cloudColorClasses[cloudColor]} rounded-full transition-all duration-500 relative`}
              >
                {cloudColor === 'orageux' && (
                  <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-2xl">
                    ⚡
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep('breathe')}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Commencer la respiration
            </button>
          </div>
        )}

        {step === 'breathe' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                Cycle {breathCycle + 1}
              </h3>
              <p className="text-gray-600">
                {breathPhase === 'idle' && 'Prêt à souffler sur le nuage'}
                {breathPhase === 'inhale' && 'Inspirez profondément...'}
                {breathPhase === 'exhale' && 'Soufflez pour éloigner le nuage...'}
              </p>
            </div>

            <div className="flex items-center justify-center py-12 relative">
              <div
                className={`${cloudSizeClasses[cloudSize]} ${cloudColorClasses[cloudColor]} rounded-full transition-all duration-1000 ${getCloudOpacity()}`}
              >
                {cloudColor === 'orageux' && breathPhase !== 'exhale' && (
                  <div className="absolute inset-0 flex items-center justify-center text-yellow-300 text-2xl">
                    ⚡
                  </div>
                )}
              </div>
              {breathPhase === 'exhale' && (
                <div className="absolute right-0 text-4xl animate-pulse">
                  <Wind className="w-12 h-12 text-blue-400" />
                </div>
              )}
            </div>

            {!isBreathing && (
              <button
                onClick={handleBreathCycle}
                className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Wind className="w-5 h-5" />
                <span>Souffler sur le nuage</span>
              </button>
            )}

            {isBreathing && (
              <div className="text-center text-gray-500 italic">
                Suivez les instructions...
              </div>
            )}
          </div>
        )}

        {step === 'evaluate' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Comment vous sentez-vous maintenant ?
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Le nuage a-t-il changé ?
                </label>
                <p className="text-sm text-gray-600 mb-4">
                  Est-il plus éloigné ? Plus petit ? Plus clair ?
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Intensité actuelle de l'émotion : {currentIntensity}/10
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
                onClick={() => setStep('breathe')}
                className="py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                Refaire un cycle
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
              <div className="text-6xl mb-4">🌤️</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Félicitations !
              </h3>
              <p className="text-gray-700 mb-6">
                Vous avez terminé {breathCycle} cycle{breathCycle > 1 ? 's' : ''} de respiration.
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
                  <span>Cycles effectués :</span>
                  <span className="font-semibold">{breathCycle}</span>
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

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                💡 N'hésitez pas à utiliser cette technique dès que vous ressentez une émotion intense.
                Plus vous pratiquez, plus elle devient efficace.
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
