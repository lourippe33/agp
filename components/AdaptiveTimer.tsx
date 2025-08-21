import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface TimerPhase {
  name: string;
  duration: number; // en secondes
  type: 'work' | 'rest' | 'preparation';
  instruction?: string;
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

  // Analyser l'exercice selon ses spécifications exactes
  useEffect(() => {
    const analyzedPhases = analyzeExerciseSpecs(exerciseSteps, totalDuration, exerciseTitle);
    setPhases(analyzedPhases);
    if (analyzedPhases.length > 0) {
      setTimeRemaining(analyzedPhases[0].duration);
      setIsInitialized(true);
    }
  }, [exerciseSteps, totalDuration, exerciseTitle]);

  const analyzeExerciseSpecs = (steps: string[], duration: number, title: string): TimerPhase[] => {
    const phases: TimerPhase[] = [];
    const totalSeconds = duration * 60;
    
    console.log(`Analyse de "${title}" - Durée totale: ${duration} min`);
    
    // Analyser chaque étape pour extraire les durées exactes
    steps.forEach((step, index) => {
      console.log(`Étape ${index + 1}: ${step}`);
      
      // Nettoyer l'étape (enlever les numéros de début)
      const cleanStep = step.replace(/^\d+\)\s*/, '').trim();
      
      // Extraire les durées spécifiées
      const durations = extractAllDurations(cleanStep);
      
      if (durations.length > 0) {
        // Si des durées sont spécifiées, les utiliser
        durations.forEach((dur, durIndex) => {
          const phaseName = durations.length > 1 
            ? `${cleanStep.substring(0, 30)}... (${durIndex + 1})`
            : cleanStep.length > 40 
              ? `${cleanStep.substring(0, 37)}...`
              : cleanStep;
              
          phases.push({
            name: phaseName,
            duration: dur,
            type: getPhaseType(cleanStep),
            instruction: cleanStep
          });
        });
      } else {
        // Pas de durée spécifiée, analyser le contenu
        const estimatedDuration = estimateStepDuration(cleanStep, totalSeconds, steps.length, index);
        
        phases.push({
          name: cleanStep.length > 40 ? `${cleanStep.substring(0, 37)}...` : cleanStep,
          duration: estimatedDuration,
          type: getPhaseType(cleanStep),
          instruction: cleanStep
        });
      }
    });
    
    // Vérifier que la durée totale correspond
    const totalPhasesTime = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const targetTime = totalSeconds;
    
    console.log(`Durée calculée: ${totalPhasesTime}s, Durée cible: ${targetTime}s`);
    
    // Ajuster si nécessaire
    if (Math.abs(totalPhasesTime - targetTime) > 60) {
      return adjustPhasesTotalDuration(phases, targetTime);
    }
    
    return phases.filter(phase => phase.duration > 0);
  };

  const extractAllDurations = (step: string): number[] => {
    const durations: number[] = [];
    
    // Patterns pour extraire les durées
    const patterns = [
      // Minutes
      /(\d+)\s*min(?:utes?)?/gi,
      // Secondes
      /(\d+)\s*sec(?:ondes?)?/gi,
      // Format "X fois Y minutes"
      /(\d+)\s*fois.*?(\d+)\s*min/gi,
      // Format "X x Y min"
      /(\d+)\s*x.*?(\d+)\s*min/gi,
      // Format "X rounds de Y min"
      /(\d+)\s*rounds?.*?(\d+)\s*min/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(step)) !== null) {
        if (pattern.source.includes('fois') || pattern.source.includes('x') || pattern.source.includes('rounds')) {
          // Format avec répétitions
          const repetitions = parseInt(match[1]);
          const timePerRep = parseInt(match[2]) * 60; // Convertir en secondes
          for (let i = 0; i < repetitions; i++) {
            durations.push(timePerRep);
          }
        } else {
          // Durée simple
          const time = parseInt(match[1]);
          const isMinutes = match[0].toLowerCase().includes('min');
          durations.push(isMinutes ? time * 60 : time);
        }
      }
    });
    
    // Cas spéciaux pour certains exercices
    if (step.toLowerCase().includes('tabata') || (step.includes('20 sec') && step.includes('10 sec'))) {
      // Tabata : 8 rounds de 20s effort + 10s repos
      for (let i = 0; i < 8; i++) {
        durations.push(20); // Effort
        if (i < 7) durations.push(10); // Repos (sauf dernier round)
      }
    }
    
    if (step.toLowerCase().includes('circuit') && step.includes('30 sec')) {
      // Circuit avec exercices de 30 sec
      const exerciseCount = (step.match(/\w+\s*:/g) || []).length;
      for (let i = 0; i < exerciseCount; i++) {
        durations.push(30); // Chaque exercice
        if (i < exerciseCount - 1) durations.push(15); // Repos entre exercices
      }
    }
    
    return durations;
  };

  const getPhaseType = (step: string): 'work' | 'rest' | 'preparation' => {
    const stepLower = step.toLowerCase();
    
    if (stepLower.includes('échauffement') || stepLower.includes('préparation')) {
      return 'preparation';
    }
    
    if (stepLower.includes('repos') || 
        stepLower.includes('récupération') || 
        stepLower.includes('retour au calme') ||
        stepLower.includes('étirement') ||
        stepLower.includes('relaxation')) {
      return 'rest';
    }
    
    return 'work';
  };

  const estimateStepDuration = (step: string, totalSeconds: number, totalSteps: number, stepIndex: number): number => {
    const stepLower = step.toLowerCase();
    
    // Durées fixes pour certains types d'étapes
    if (stepLower.includes('échauffement')) {
      return Math.min(180, Math.floor(totalSeconds * 0.15)); // 15% du temps total, max 3 min
    }
    
    if (stepLower.includes('retour au calme') || stepLower.includes('récupération')) {
      return Math.min(120, Math.floor(totalSeconds * 0.10)); // 10% du temps total, max 2 min
    }
    
    if (stepLower.includes('étirement')) {
      return Math.min(180, Math.floor(totalSeconds * 0.15)); // 15% du temps total, max 3 min
    }
    
    // Pour les autres étapes, répartir le temps restant
    const reservedTime = Math.floor(totalSeconds * 0.25); // 25% pour échauffement/récupération
    const availableTime = totalSeconds - reservedTime;
    const workSteps = totalSteps - 2; // Exclure échauffement et récupération
    
    return Math.max(30, Math.floor(availableTime / Math.max(1, workSteps))); // Minimum 30 secondes
  };

  const adjustPhasesTotalDuration = (phases: TimerPhase[], targetSeconds: number): TimerPhase[] => {
    const currentTotal = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const ratio = targetSeconds / currentTotal;
    
    return phases.map(phase => ({
      ...phase,
      duration: Math.max(15, Math.floor(phase.duration * ratio)) // Minimum 15 secondes
    }));
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
        <Text style={styles.loadingText}>Analyse de l'exercice...</Text>
      </View>
    );
  }

  const currentPhase = phases[currentPhaseIndex];

  return (
    <View style={styles.container}>
      {/* Titre de l'exercice */}
      <Text style={styles.exerciseTitle}>Chrono Adaptatif</Text>
      
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

      {/* Instruction actuelle */}
      {currentPhase.instruction && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Instruction :</Text>
          <Text style={styles.instructionText}>{currentPhase.instruction}</Text>
        </View>
      )}

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
  instructionContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
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