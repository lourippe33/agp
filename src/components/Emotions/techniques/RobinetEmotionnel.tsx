import { useState } from 'react';
import { X, Droplets, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type Emotion = 'colère' | 'anxiété' | 'tristesse' | 'peur' | 'stress';
type Step = 'intro' | 'selectEmotion' | 'visualize' | 'control' | 'complete';

export function RobinetEmotionnel({ onClose }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [emotion, setEmotion] = useState<Emotion>('anxiété');
  const [initialIntensity, setInitialIntensity] = useState<number>(8);
  const [currentIntensity, setCurrentIntensity] = useState<number>(8);
  const [waterColor, setWaterColor] = useState<string>('#3B82F6');
  const [isDragging, setIsDragging] = useState(false);

  const emotionEmojis: Record<Emotion, string> = {
    'colère': '😠',
    'anxiété': '😰',
    'tristesse': '😢',
    'peur': '😨',
    'stress': '😫'
  };

  const emotionColors: Record<Emotion, { water: string; name: string }> = {
    'colère': { water: '#EF4444', name: 'rouge vif' },
    'anxiété': { water: '#1F2937', name: 'gris sombre' },
    'tristesse': { water: '#6B7280', name: 'gris bleuté' },
    'peur': { water: '#7C3AED', name: 'violet foncé' },
    'stress': { water: '#F59E0B', name: 'orange intense' }
  };

  const handleEmotionSelect = (em: Emotion) => {
    setEmotion(em);
    setWaterColor(emotionColors[em].water);
  };

  const handleIntensityChange = (value: number) => {
    setCurrentIntensity(value);
  };

  const handleRestart = () => {
    setStep('intro');
    setInitialIntensity(8);
    setCurrentIntensity(8);
    setEmotion('anxiété');
    setWaterColor(emotionColors['anxiété'].water);
  };

  const getWaterHeight = () => {
    return `${currentIntensity * 10}%`;
  };

  const getFlowSpeed = () => {
    if (currentIntensity >= 8) return 'animate-pulse';
    if (currentIntensity >= 5) return 'animate-bounce';
    return '';
  };

  const getTapRotation = () => {
    const rotation = 90 - (currentIntensity * 9);
    return rotation;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Le Robinet Émotionnel</h2>
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
              <div className="text-6xl mb-4">🚰</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Technique du Robinet Émotionnel
              </h3>
              <p className="text-gray-700 mb-4">
                Visualisez vos émotions comme l'eau d'un robinet que vous pouvez contrôler.
                Vous avez le pouvoir de régler l'intensité émotionnelle.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#333333] mb-2">Origine de la technique</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Technique de régulation émotionnelle basée sur la <strong>métaphore du contrôle</strong>.
                    Utilisée en thérapie cognitive et comportementale (TCC) pour transformer
                    le sentiment d'impuissance ("je subis") en sentiment de maîtrise ("je contrôle").
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6 space-y-3">
              <h4 className="font-bold text-[#333333]">Comment ça fonctionne :</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">1.</span>
                  <p>
                    <strong>Identifiez l'émotion</strong> et visualisez-la comme de l'eau
                    qui s'écoule d'un robinet
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">2.</span>
                  <p>
                    <strong>Observez le débit</strong> : plus l'émotion est intense,
                    plus le robinet est ouvert (torrent vs filet d'eau)
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">3.</span>
                  <p>
                    <strong>Prenez le contrôle</strong> : imaginez votre main sur le robinet
                    et fermez-le progressivement
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="font-semibold text-[#2B7BBE] mt-0.5">4.</span>
                  <p>
                    <strong>Réglez l'intensité</strong> à un niveau confortable
                    (vous n'êtes pas obligé de tout fermer)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#333333] mb-2 text-sm">Pourquoi ça marche :</h4>
              <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
                <li>Transforme "je subis mes émotions" en "je contrôle mes émotions"</li>
                <li>Métaphore concrète plus facile que "calme-toi"</li>
                <li>Permet une régulation progressive et mesurable</li>
                <li>Redonne le sentiment de maîtrise de soi</li>
                <li>Ne supprime pas l'émotion, la régule à un niveau gérable</li>
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
              Quelle émotion souhaitez-vous réguler ?
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(emotionEmojis) as Emotion[]).map((em) => (
                <button
                  key={em}
                  onClick={() => handleEmotionSelect(em)}
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

            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center">
                💧 Votre {emotion} sera représentée par de l'eau <strong>{emotionColors[emotion].name}</strong>
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentIntensity(initialIntensity);
                setStep('visualize');
              }}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Continuer
            </button>
          </div>
        )}

        {step === 'visualize' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Visualisez votre robinet émotionnel
            </h3>
            <p className="text-center text-gray-600">
              Observez l'eau de votre {emotion} qui s'écoule...
            </p>

            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="relative">
                <div className="w-32 h-8 bg-gray-400 rounded-t-lg relative">
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-600 rounded-full border-4 border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
                    style={{ transform: `translate(-50%, -50%) rotate(${getTapRotation()}deg)` }}
                  >
                    <div className="w-8 h-1 bg-gray-300"></div>
                  </div>
                </div>

                <div className="w-4 mx-auto bg-gray-400 h-12"></div>

                <div className="relative">
                  <div className={`w-4 mx-auto ${getFlowSpeed()}`}>
                    {currentIntensity > 0 && (
                      <div
                        className="transition-all duration-500"
                        style={{
                          width: `${8 + currentIntensity * 2}px`,
                          height: `${currentIntensity * 20}px`,
                          background: `linear-gradient(to bottom, ${waterColor}, ${waterColor}dd)`,
                          margin: '0 auto',
                          opacity: currentIntensity / 10,
                          filter: 'blur(1px)'
                        }}
                      >
                        <Droplets
                          className="w-6 h-6 mx-auto animate-bounce"
                          style={{ color: waterColor }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-48 h-32 mx-auto mt-2 bg-white border-4 border-gray-400 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
                      style={{
                        height: getWaterHeight(),
                        backgroundColor: waterColor,
                        opacity: 0.7
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className="text-2xl font-bold text-white drop-shadow-lg z-10">
                        {currentIntensity}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 text-gray-600">
                {currentIntensity >= 8 && "Le robinet est grand ouvert... torrent d'émotions"}
                {currentIntensity >= 5 && currentIntensity < 8 && "Le débit est fort... émotions intenses"}
                {currentIntensity >= 3 && currentIntensity < 5 && "Le débit ralentit... émotions présentes mais contrôlables"}
                {currentIntensity < 3 && "Simple filet d'eau... émotions apaisées"}
              </div>
            </div>

            <button
              onClick={() => setStep('control')}
              className="w-full py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold"
            >
              Prendre le contrôle du robinet
            </button>
          </div>
        )}

        {step === 'control' && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-bold text-[#333333] text-center">
              Fermez progressivement le robinet
            </h3>
            <p className="text-center text-gray-600">
              Imaginez votre main sur le robinet et réglez l'intensité
            </p>

            <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
              <div className="relative">
                <div className="w-32 h-8 bg-gray-400 rounded-t-lg relative">
                  <div
                    className="absolute top-1/2 left-1/2 w-12 h-12 bg-gray-600 rounded-full border-4 border-gray-700 flex items-center justify-center cursor-move hover:bg-gray-500 transition-all shadow-lg"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${getTapRotation()}deg)`,
                      boxShadow: isDragging ? '0 0 20px rgba(43, 123, 190, 0.5)' : ''
                    }}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                  >
                    <div className="w-8 h-1 bg-gray-300"></div>
                  </div>
                </div>

                <div className="w-4 mx-auto bg-gray-400 h-12"></div>

                <div className="relative">
                  <div className={`w-4 mx-auto ${getFlowSpeed()}`}>
                    {currentIntensity > 0 && (
                      <div
                        className="transition-all duration-500"
                        style={{
                          width: `${8 + currentIntensity * 2}px`,
                          height: `${currentIntensity * 20}px`,
                          background: `linear-gradient(to bottom, ${waterColor}, ${waterColor}dd)`,
                          margin: '0 auto',
                          opacity: currentIntensity / 10,
                          filter: 'blur(1px)'
                        }}
                      >
                        {currentIntensity > 3 && (
                          <Droplets
                            className="w-6 h-6 mx-auto animate-bounce"
                            style={{ color: waterColor }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-48 h-32 mx-auto mt-2 bg-white border-4 border-gray-400 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
                      style={{
                        height: getWaterHeight(),
                        backgroundColor: waterColor,
                        opacity: 0.7
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className="text-2xl font-bold text-white drop-shadow-lg z-10">
                        {currentIntensity}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 text-center">
                  Intensité de votre {emotion} : {currentIntensity}/10
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={currentIntensity}
                  onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2B7BBE]"
                  style={{
                    background: `linear-gradient(to right, ${waterColor} 0%, ${waterColor} ${currentIntensity * 10}%, #e5e7eb ${currentIntensity * 10}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Fermé (0)</span>
                  <span>Confortable</span>
                  <span>Grand ouvert (10)</span>
                </div>
              </div>

              {initialIntensity > currentIntensity && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="font-semibold text-green-700">
                    Vous avez réduit l'intensité de {initialIntensity - currentIntensity} points !
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Vous ressentez maintenant plus de contrôle
                  </p>
                </div>
              )}

              {currentIntensity === 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700">
                    💡 Conseil : Garder un petit filet (2-3/10) peut être utile.
                    Les émotions nous donnent des informations importantes.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStep('visualize')}
                className="py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
              >
                Revoir la visualisation
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
              <div className="text-6xl mb-4">✨💧</div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Félicitations !
              </h3>
              <p className="text-gray-700 mb-6">
                Vous avez repris le contrôle de votre robinet émotionnel.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-[#333333] mb-3">Résumé de la session :</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex justify-between">
                  <span>Émotion régulée :</span>
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
                  <span>Couleur de l'eau :</span>
                  <span className="font-semibold capitalize">{emotionColors[emotion].name}</span>
                </p>
                {initialIntensity > currentIntensity && (
                  <div className="pt-3 border-t border-blue-300 mt-3">
                    <p className="flex justify-between text-green-700 font-bold">
                      <span>Réduction :</span>
                      <span>-{initialIntensity - currentIntensity} points</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-4">
              <h4 className="font-semibold text-[#333333] mb-2 text-sm">💡 Points clés à retenir :</h4>
              <ul className="text-xs text-gray-700 space-y-2 ml-4 list-disc">
                <li>Vous avez le pouvoir de réguler vos émotions</li>
                <li>Les émotions ne sont pas vos ennemies, elles donnent des informations</li>
                <li>Vous pouvez "rouvrir le robinet" si vous en avez besoin</li>
                <li>Cette technique peut être utilisée mentalement, partout</li>
                <li>Plus vous pratiquez, plus elle devient naturelle</li>
              </ul>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 text-center leading-relaxed">
                <strong>Astuce :</strong> En situation réelle, fermez les yeux 30 secondes et visualisez
                votre main tournant le robinet. L'effet est immédiat.
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
