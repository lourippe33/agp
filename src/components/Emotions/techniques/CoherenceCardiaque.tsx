import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { playBellSound, initAudioContext } from '../../../utils/soundEffects';

interface Props {
  onClose: () => void;
}

export function CoherenceCardiaque({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(5);
  const totalCycles = 30;

  const handleStart = () => {
    initAudioContext();
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          playBellSound();
          if (phase === 'inhale') {
            setPhase('exhale');
            return 5;
          } else {
            setPhase('inhale');
            setCurrentCycle((c) => c + 1);
            return 5;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  useEffect(() => {
    if (currentCycle >= totalCycles) {
      setIsRunning(false);
    }
  }, [currentCycle]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentCycle(0);
    setPhase('inhale');
    setSeconds(5);
  };

  const progress = (currentCycle / totalCycles) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Cohérence Cardiaque 365</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-[#2B7BBE] mb-2">
                {currentCycle} / {totalCycles}
              </div>
              <div className="text-gray-600">cycles respiratoires</div>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className={`absolute w-full h-full rounded-full transition-all duration-[5000ms] ease-in-out ${
                  phase === 'inhale'
                    ? 'bg-blue-400 scale-100'
                    : 'bg-cyan-300 scale-50'
                }`}
                style={{
                  opacity: 0.3,
                }}
              />
              <div
                className={`absolute w-3/4 h-3/4 rounded-full transition-all duration-[5000ms] ease-in-out ${
                  phase === 'inhale'
                    ? 'bg-blue-500 scale-100'
                    : 'bg-cyan-400 scale-50'
                }`}
                style={{
                  opacity: 0.5,
                }}
              />
              <div
                className={`absolute w-1/2 h-1/2 rounded-full transition-all duration-[5000ms] ease-in-out flex items-center justify-center ${
                  phase === 'inhale'
                    ? 'bg-blue-600 scale-100'
                    : 'bg-cyan-500 scale-50'
                }`}
              >
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{seconds}</div>
                  <div className="text-sm uppercase tracking-wider">
                    {phase === 'inhale' ? 'Inspirez' : 'Expirez'}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#2B7BBE] to-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isRunning && currentCycle === 0 && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Commencer</span>
                </button>
              )}

              {!isRunning && currentCycle > 0 && currentCycle < totalCycles && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-[#2B7BBE] text-white rounded-xl hover:bg-[#2364A5] transition-colors font-semibold text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Reprendre</span>
                </button>
              )}

              {isRunning && (
                <button
                  onClick={() => setIsRunning(false)}
                  className="flex items-center space-x-2 px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg"
                >
                  <Pause className="w-6 h-6" />
                  <span>Pause</span>
                </button>
              )}

              {currentCycle > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Recommencer</span>
                </button>
              )}
            </div>

            {currentCycle >= totalCycles && (
              <div className="text-center bg-green-50 border-2 border-green-500 rounded-xl p-6 w-full">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-xl font-bold text-green-700 mb-2">
                  Bravo ! Session terminée
                </div>
                <p className="text-gray-700">
                  Vous avez complété vos 5 minutes de cohérence cardiaque.
                  Vous devriez ressentir un état de calme et de sérénité.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg text-[#333333]">Instructions</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-[#2B7BBE]">•</span>
              <span>Installez-vous confortablement, dos droit, pieds au sol</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-[#2B7BBE]">•</span>
              <span>Suivez le guide visuel : le cercle grandit = inspirez, le cercle rétrécit = expirez</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-[#2B7BBE]">•</span>
              <span>Respirez avec le ventre, pas la poitrine</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-[#2B7BBE]">•</span>
              <span>5 secondes d'inspiration, 5 secondes d'expiration</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-[#2B7BBE]">•</span>
              <span>Pratiquez idéalement 3 fois par jour : matin, avant déjeuner, fin d'après-midi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
