import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface TimerPhase {
  name: string;
  duration: number; // en secondes
  type: 'work' | 'rest' | 'preparation';
}

interface AdaptiveTimerProps {
  exerciseTitle: string;
  exerciseSteps: string[];
  totalDuration: number; // en minutes
  exerciseType: 'sport' | 'detente';
  onComplete?: () => void;
}

export default function AdaptiveTimer({ 
  exerciseTitle, 
  exerciseSteps, 
  totalDuration, 
  exerciseType,
  onComplete 
}: AdaptiveTimerProps) {
  const [phases, setPhases] = useState<TimerPhase[]>([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Analyser l'exercice et créer les phases adaptées
  useEffect(() => {
    const analyzedPhases = analyzeExercise(exerciseSteps, totalDuration, exerciseType);
    setPhases(analyzedPhases);
    if (analyzedPhases.length > 0) {
      setTimeRemaining(analyzedPhases[0].duration);
      setIsInitialized(true);
    }
  }, [exerciseSteps, totalDuration, exerciseType]);

  const analyzeExercise = (steps: string[], duration: number, type: string): TimerPhase[] => {
    const totalSeconds = duration * 60;
    const phases: TimerPhase[] = [];
    
    // Filtrer les étapes qui sont des instructions intégrées
    const filteredSteps = steps.filter(step => {
      const stepLower = step.toLowerCase();
      // Exclure les étapes qui sont des instructions pour d'autres étapes
      return !(
        stepLower.includes('ralentissez progressivement') ||
        stepLower.includes('accélérez progressivement') ||
        stepLower.includes('les dernières minutes') ||
        stepLower.includes('les 3 dernières') ||
        stepLower.includes('pendant les') && stepLower.includes('dernières')
      );
    });
    
    // Détection de patterns spécifiques
    const hasCircuit = filteredSteps.some(step => 
      step.toLowerCase().includes('circuit') || 
      step.toLowerCase().includes('répète') ||
      step.toLowerCase().includes('fois')
    );

    const hasTabata = filteredSteps.some(step => 
      step.toLowerCase().includes('tabata') || 
      step.toLowerCase().includes('20 sec') && step.toLowerCase().includes('10 sec')
    );

    const hasRounds = filteredSteps.some(step => 
      step.toLowerCase().includes('round') || 
      step.toLowerCase().includes('série') ||
      step.toLowerCase().includes('x ')
    );

    const hasIntervals = filteredSteps.some(step => 
      step.toLowerCase().includes(' sec') ||
      step.toLowerCase().includes('repos')
    );

    const hasSimpleSteps = filteredSteps.some(step => 
      step.toLowerCase().includes('échauffement') ||
      step.toLowerCase().includes('étirement') ||
      step.toLowerCase().includes('retour au calme')
    );

    const hasSpecificDurations = filteredSteps.some(step => 
      /\d+\s*(min|sec)/.test(step.toLowerCase())
    );

    console.log('Analyse exercice:', { hasTabata, hasCircuit, hasRounds, hasIntervals, hasSimpleSteps, hasSpecificDurations, filteredSteps });

    if (type === 'sport') {
      if (hasIntervals) {
        // HIIT ou Tabata détecté
        phases.push({ name: 'Échauffement', duration: 60, type: 'preparation' });
        
        // Extraire les intervalles
        const workTime = extractTimeFromSteps(filteredSteps, 'work') || 30;
        const restTime = extractTimeFromSteps(filteredSteps, 'rest') || 15;
        const rounds = extractRoundsFromSteps(filteredSteps) || 8;
        
        for (let i = 0; i < Math.min(rounds, 12); i++) {
          phases.push({ 
            name: `Effort ${i + 1}/${rounds}`, 
            duration: workTime, 
            type: 'work' 
          });
          if (i < rounds - 1) {
            phases.push({ 
              name: `Repos ${i + 1}`, 
              duration: restTime, 
              type: 'rest' 
            });
          }
        }
        
        phases.push({ name: 'Récupération', duration: 120, type: 'rest' });
      } else if (hasTabata) {
        // Tabata spécifique (20s effort, 10s repos)
        phases.push({ name: 'Échauffement', duration: 60, type: 'preparation' });
        
        const rounds = 8; // Tabata classique
        for (let i = 0; i < rounds; i++) {
          phases.push({ 
            name: `Tabata ${i + 1}/8`, 
            duration: 20, 
            type: 'work' 
          });
          if (i < rounds - 1) {
            phases.push({ 
              name: `Repos`, 
              duration: 10, 
              type: 'rest' 
            });
          }
        }
        phases.push({ name: 'Récupération', duration: 60, type: 'rest' });
      } else if (hasCircuit || hasRounds) {
        // Circuit training détecté
        phases.push({ name: 'Échauffement', duration: 180, type: 'preparation' });
        
        const rounds = extractRoundsFromSteps(filteredSteps) || 3;
        const workDuration = Math.floor((totalSeconds - 300) / rounds); // -5min pour échauffement/récup
        
        for (let i = 0; i < rounds; i++) {
          phases.push({ 
            name: `Circuit ${i + 1}/${rounds}`, 
            duration: workDuration, 
            type: 'work' 
          });
          if (i < rounds - 1) {
            phases.push({ 
              name: `Pause circuit`, 
              duration: 60, 
              type: 'rest' 
            });
          }
        }
        
        phases.push({ name: 'Retour au calme', duration: 120, type: 'rest' });
      } else {
        // Exercice standard - analyser chaque étape
        let remainingTime = totalSeconds - 120; // Réserver du temps pour échauffement et récupération
        
        filteredSteps.forEach((step, index) => {
          // Extraire la durée spécifique de l'étape si mentionnée
          const specificDuration = extractSpecificDuration(step);
          let stepDuration;
          
          if (specificDuration > 0) {
            stepDuration = specificDuration;
          } else if (step.toLowerCase().includes('échauffement')) {
            stepDuration = 60; // Échauffement fixe
          } else if (step.toLowerCase().includes('retour au calme') || step.toLowerCase().includes('récupération')) {
            stepDuration = 60; // Récupération fixe
          } else {
            // Répartir le temps restant sur les étapes restantes
            const remainingSteps = filteredSteps.length - index;
            stepDuration = Math.max(30, Math.floor(remainingTime / remainingSteps)); // Minimum 30 secondes
          }
          
          remainingTime -= stepDuration;
          
          const stepType = step.toLowerCase().includes('échauffement') ? 'preparation' :
                          step.toLowerCase().includes('retour au calme') || step.toLowerCase().includes('récupération') ? 'rest' :
                          'work';
          
          phases.push({
            name: step.length > 40 ? `${step.substring(0, 37)}...` : step,
            duration: stepDuration,
            type: stepType
          });
        });
        
        // Ajouter récupération finale si pas déjà présente
        if (!filteredSteps.some(step => step.toLowerCase().includes('retour au calme'))) {
          phases.push({ name: 'Retour au calme', duration: 60, type: 'rest' });
        }
      }
    } else {
      // Exercices de détente
      if (steps.length <= 3) {
        // Exercice simple
        const stepDuration = Math.floor(totalSeconds / steps.length);
        steps.forEach((step, index) => {
          phases.push({
            name: step.length > 40 ? `${step.substring(0, 37)}...` : step,
            duration: stepDuration,
            type: 'work'
          });
        });
      } else {
        // Exercice avec plusieurs phases
        phases.push({ name: 'Préparation', duration: 60, type: 'preparation' });
        
        const mainDuration = totalSeconds - 120; // -2min pour préparation et fin
        const stepDuration = Math.floor(mainDuration / (steps.length - 2));
        
        steps.slice(1, -1).forEach((step, index) => {
          phases.push({
            name: step.length > 40 ? `${step.substring(0, 37)}...` : step,
            duration: stepDuration,
            type: 'work'
          });
        });
        
        phases.push({ name: 'Relaxation finale', duration: 60, type: 'rest' });
      }
    }
    
    // S'assurer qu'aucune phase n'a une durée négative ou nulle
    return phases.filter(phase => phase.duration > 0);

    return phases;
  };

  const extractSpecificDuration = (step: string): number => {
    // Chercher des patterns comme "3 min", "30 sec", "2 minutes"
    const minMatch = step.match(/(\d+)\s*(min|minute)/i);
    if (minMatch) return parseInt(minMatch[1]) * 60;
    
    const secMatch = step.match(/(\d+)\s*(sec|seconde)/i);
    if (secMatch) return parseInt(secMatch[1]);
    
    return 0;
  };

  const extractTimeFromSteps = (steps: string[], type: 'work' | 'rest'): number => {
    const pattern = type === 'work' 
      ? /(\d+)\s*sec.*effort|effort.*(\d+)\s*sec/i
      : /(\d+)\s*sec.*repos|repos.*(\d+)\s*sec/i;
    
    for (const step of steps) {
      const match = step.match(pattern);
      if (match) {
        return parseInt(match[1] || match[2]);
      }
    }
    return type === 'work' ? 30 : 15;
  };

  const extractRoundsFromSteps = (steps: string[]): number => {
    // Chercher dans le titre et les étapes
    const allText = [exerciseTitle, ...steps].join(' ');
    
    // Patterns plus spécifiques
    const roundMatch = allText.match(/(\d+)\s*(rounds?|séries?|fois|circuits?)/i);
    if (roundMatch) return parseInt(roundMatch[1]);
    
    // Fallback sur l'ancienne méthode
    for (const step of steps) {
      const match = step.match(/(\d+)\s*(fois|rounds?|séries?|x|circuits?)/i);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 3;
  };

  // Gestion du timer
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Phase terminée
            if (currentPhaseIndex < phases.length - 1) {
              // Passer à la phase suivante
              const nextPhase = phases[currentPhaseIndex + 1];
              setCurrentPhaseIndex(prev => prev + 1);
              return nextPhase.duration;
            } else {
              // Exercice terminé
              setIsRunning(false);
              onComplete?.();
              Alert.alert('Félicitations !', 'Exercice terminé !');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, currentPhaseIndex, phases, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    if (phases.length > 0) {
      setTimeRemaining(phases[0].duration);
    }
  };

  const skipPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextPhase = phases[currentPhaseIndex + 1];
      setCurrentPhaseIndex(prev => prev + 1);
      setTimeRemaining(nextPhase.duration);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = (type: string): string => {
    switch (type) {
      case 'work': return exerciseType === 'sport' ? Colors.sport : Colors.relaxation;
      case 'rest': return Colors.success;
      case 'preparation': return Colors.warning;
      default: return Colors.agpBlue;
    }
  };

  if (!isInitialized || phases.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Préparation du chrono...</Text>
      </View>
    );
  }

  const currentPhase = phases[currentPhaseIndex];

  return (
    <View style={styles.container}>
      {/* Titre de l'exercice */}
      <Text style={styles.exerciseTitle}>{exerciseTitle}</Text>
      
      {/* Phase actuelle */}
      <View style={[styles.phaseContainer, { backgroundColor: getPhaseColor(currentPhase.type) }]}>
        <Text style={styles.phaseText}>{currentPhase.name}</Text>
        <Text style={styles.phaseType}>
          {currentPhase.type === 'work' ? '💪 Effort' : 
           currentPhase.type === 'rest' ? '😌 Repos' : '🔥 Préparation'}
        </Text>
      </View>

      {/* Chrono principal */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getPhaseColor(currentPhase.type) }]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>

      {/* Progression */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Phase {currentPhaseIndex + 1} sur {phases.length}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentPhaseIndex + 1) / phases.length) * 100}%`,
                backgroundColor: getPhaseColor(currentPhase.type)
              }
            ]} 
          />
        </View>
      </View>

      {/* Contrôles */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
          <RotateCcw size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: getPhaseColor(currentPhase.type) }]} 
          onPress={toggleTimer}
        >
          {isRunning ? (
            <Pause size={32} color={Colors.textLight} />
          ) : (
            <Play size={32} color={Colors.textLight} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={skipPhase}>
          <SkipForward size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Prochaines phases */}
      <View style={styles.nextPhasesContainer}>
        <Text style={styles.nextPhasesTitle}>Prochaines phases :</Text>
        {phases.slice(currentPhaseIndex + 1, currentPhaseIndex + 4).map((phase, index) => (
          <View key={index} style={styles.nextPhaseItem}>
            <View style={[styles.nextPhaseIndicator, { backgroundColor: getPhaseColor(phase.type) }]} />
            <Text style={styles.nextPhaseText}>{phase.name}</Text>
            <Text style={styles.nextPhaseTime}>{formatTime(phase.duration)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  phaseContainer: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
  phaseType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextPhasesContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  nextPhasesTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  nextPhaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  nextPhaseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextPhaseText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  nextPhaseTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
});