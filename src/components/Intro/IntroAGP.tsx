import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAGPProps {
  onComplete: () => void;
}

export function IntroAGP({ onComplete }: IntroAGPProps) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 1500);
    const timer2 = setTimeout(() => setStep(3), 3000);
    const timer3 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #2C6E49 0%, #81C784 50%, #2C6E49 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 3s ease-in-out',
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4); }
        }

        @keyframes particle {
          0% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0; }
        }
      `}</style>

      <div className="relative">
        {/* Particles */}
        <AnimatePresence>
          {step >= 1 && (
            <>
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const distance = 200;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      '--tx': `${tx}px`,
                      '--ty': `${ty}px`,
                    } as React.CSSProperties}
                    initial={{ x: tx, y: ty, scale: 0, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1, opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Logo AGP */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)',
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 60px rgba(255,255,255,0.6)',
                  '0 0 20px rgba(255,255,255,0.3)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#2C6E49] to-[#81C784]"
            >
              AGP
            </motion.div>
          </motion.div>

          {/* Glow rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl border-2 border-white"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>

        {/* Text Messages */}
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.p
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white text-xl font-semibold text-center whitespace-nowrap"
              >
                Bienvenue dans votre parcours AGP
              </motion.p>
            )}
            {step === 2 && (
              <motion.p
                key="transformation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white text-xl font-semibold text-center whitespace-nowrap"
              >
                Votre transformation commence maintenant
              </motion.p>
            )}
            {step === 3 && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
