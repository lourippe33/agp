import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { playBellSound, initAudioContext } from '../../../utils/soundEffects';

interface Props {
  onClose: () => void;
}

export function RespirationCarree({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const totalCycles = 5;

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
            setPhase('hold1');
            return 4;
          } else if (phase === 'hold1') {
            setPhase('exhale');
            return 4;
          } else if (phase === 'exhale') {
            setPhase('hold2');
            return 4;
          } else {
            setPhase('inhale');
            setCurrentCycle((c) => c + 1);
            return 4;
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
    setSeconds(4);
  };

  const progress = (currentCycle / totalCycles) * 100;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inspirez';
      case 'hold1':
        return 'Retenez';
      case 'exhale':
        return 'Expirez';
      case 'hold2':
        return 'Retenez';
    }
  };

  const getPhasePosition = () => {
    const size = 200;
    const center = size / 2;
    const offset = size / 2 - 20;

    switch (phase) {
      case 'inhale':
        return { top: center + offset, left: center - offset };
      case 'hold1':
        return { top: center - offset, left: center - offset };
      case 'exhale':
        return { top: center - offset, left: center + offset };
      case 'hold2':
        return { top: center + offset, left: center + offset };
    }
  };

  const position = getPhasePosition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-100 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Respiration Carrée</h2>
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
              <div className="text-6xl font-bold text-teal-600 mb-2">
                {currentCycle} / {totalCycles}
              </div>
              <div className="text-gray-600">cycles respiratoires</div>
            </div>

            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <svg width="300" height="300" className="absolute">
                <rect
                  x="50"
                  y="50"
                  width="200"
                  height="200"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="4"
                  strokeDasharray="800"
                  strokeDashoffset={phase === 'inhale' ? 600 : phase === 'hold1' ? 400 : phase === 'exhale' ? 200 : 0}
                  className="transition-all duration-[4000ms] ease-linear"
                />

                <circle cx="50" cy="250" r="8" fill="#14b8a6" opacity={phase === 'inhale' ? 1 : 0.3} />
                <circle cx="50" cy="50" r="8" fill="#14b8a6" opacity={phase === 'hold1' ? 1 : 0.3} />
                <circle cx="250" cy="50" r="8" fill="#14b8a6" opacity={phase === 'exhale' ? 1 : 0.3} />
                <circle cx="250" cy="250" r="8" fill="#14b8a6" opacity={phase === 'hold2' ? 1 : 0.3} />
              </svg>

              <div
                className="absolute w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold transition-all duration-[4000ms] ease-linear"
                style={{
                  top: `${position.top}px`,
                  left: `${position.left}px`,
                }}
              >
                {seconds}
              </div>

              <div className="absolute text-center">
                <div className="text-2xl font-bold text-teal-700">
                  {getPhaseText()}
                </div>
              </div>

              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-600">
                Haut
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-600">
                Bas
              </div>
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600">
                Gauche
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600">
                Droite
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isRunning && currentCycle === 0 && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Commencer</span>
                </button>
              )}

              {!isRunning && currentCycle > 0 && currentCycle < totalCycles && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-lg"
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
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-xl font-bold text-green-700 mb-2">
                  Mission accomplie !
                </div>
                <p className="text-gray-700">
                  Vous maîtrisez maintenant la technique des Navy SEALs.
                  Vous êtes prêt à affronter n'importe quelle situation stressante.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg text-[#333333]">Technique des Navy SEALs</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-teal-600">•</span>
              <span>4 temps égaux : inspirez (4s), retenez (4s), expirez (4s), retenez (4s)</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-teal-600">•</span>
              <span>Suivez le point qui se déplace le long du carré</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-teal-600">•</span>
              <span>Visualisez un carré qui se dessine devant vous</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-teal-600">•</span>
              <span>Utilisée par les forces spéciales pour rester calme en situation de stress intense</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
