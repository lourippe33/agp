import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { playBellSound, initAudioContext } from '../../../utils/soundEffects';

interface Props {
  onClose: () => void;
}

export function Respiration478({ onClose }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const totalCycles = 4;

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
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
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

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-500 to-blue-600';
      case 'hold':
        return 'from-yellow-400 to-orange-500';
      case 'exhale':
        return 'from-cyan-400 to-teal-500';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inspirez par le nez';
      case 'hold':
        return 'Retenez votre souffle';
      case 'exhale':
        return 'Expirez par la bouche';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-100 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">Respiration 4-7-8</h2>
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
              <div className="text-6xl font-bold text-cyan-600 mb-2">
                {currentCycle} / {totalCycles}
              </div>
              <div className="text-gray-600">cycles respiratoires</div>
            </div>

            <div className="relative w-80 h-80 flex items-center justify-center">
              <div
                className={`w-full h-full rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 flex items-center justify-center shadow-2xl`}
              >
                <div className="text-center text-white">
                  <div className="text-7xl font-bold mb-4">{seconds}</div>
                  <div className="text-xl uppercase tracking-wider font-semibold px-4">
                    {getPhaseText()}
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
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!isRunning && currentCycle === 0 && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-semibold text-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Commencer</span>
                </button>
              )}

              {!isRunning && currentCycle > 0 && currentCycle < totalCycles && (
                <button
                  onClick={handleStart}
                  className="flex items-center space-x-2 px-8 py-4 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-semibold text-lg"
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
                  Excellent ! Session terminée
                </div>
                <p className="text-gray-700">
                  Vous avez complété 4 cycles de respiration 4-7-8.
                  Vous devriez ressentir un calme profond.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-lg text-[#333333]">Technique du Dr Andrew Weil</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-cyan-600">•</span>
              <span>Placez le bout de votre langue contre le palais, derrière les dents du haut</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-cyan-600">•</span>
              <span>Inspirez silencieusement par le nez pendant 4 secondes</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-cyan-600">•</span>
              <span>Retenez votre souffle pendant 7 secondes</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-cyan-600">•</span>
              <span>Expirez complètement par la bouche pendant 8 secondes (son "whoosh")</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="font-semibold text-cyan-600">•</span>
              <span>Appelée aussi "tranquillisant naturel" pour son effet calmant immédiat</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
