import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, RotateCcw, CircleCheck as CheckCircle, Timer, Zap, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import { useAuth } from '@/contexts/AuthContext';

interface TabataTimerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
}

// Phases Tabata basées sur les étapes du JSON
const getTabataPhases = (exerciseId: number) => {
  if (exerciseId === 21) {
    // Mini Tabata Doux
    return [
      { name: 'Marche dynamique', duration: 20, description: 'Lève bien les genoux, balance les bras', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats partiels', duration: 20, description: 'Descends légèrement comme pour t\'asseoir sur une chaise', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes murales', duration: 20, description: 'Mains contre un mur, plie doucement les coudes', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Gainage assis', duration: 20, description: 'Assis sur une chaise, contracte les abdos', color: Colors.agpGreen, isWork: true },
      { name: 'Pause longue', duration: 30, description: 'Bois un peu d\'eau, respire calmement', color: Colors.morning, isRest: true },
      // Répéter 2 fois de plus
      { name: 'Marche dynamique', duration: 20, description: 'Lève bien les genoux, balance les bras', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats partiels', duration: 20, description: 'Descends légèrement comme pour t\'asseoir sur une chaise', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes murales', duration: 20, description: 'Mains contre un mur, plie doucement les coudes', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Gainage assis', duration: 20, description: 'Assis sur une chaise, contracte les abdos', color: Colors.agpGreen, isWork: true },
      { name: 'Pause longue', duration: 30, description: 'Bois un peu d\'eau, respire calmement', color: Colors.morning, isRest: true },
      // Troisième série
      { name: 'Marche dynamique', duration: 20, description: 'Lève bien les genoux, balance les bras', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats partiels', duration: 20, description: 'Descends légèrement comme pour t\'asseoir sur une chaise', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes murales', duration: 20, description: 'Mains contre un mur, plie doucement les coudes', color: Colors.agpGreen, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Gainage assis', duration: 20, description: 'Assis sur une chaise, contracte les abdos', color: Colors.agpGreen, isWork: true },
    ];
  } else {
    // Mini Tabata (ID 22)
    return [
      { name: 'Jumping jacks', duration: 20, description: 'Debout, saute en ouvrant bras et jambes, rythme rapide', color: Colors.relaxation, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats', duration: 20, description: 'Plie les genoux comme pour t\'asseoir, dos droit', color: Colors.relaxation, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes genoux', duration: 20, description: 'Au sol, mains sous les épaules, genoux posés', color: Colors.relaxation, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Planche', duration: 20, description: 'Position gainage, avant-bras au sol, corps droit', color: Colors.relaxation, isWork: true },
      { name: 'Pause longue', duration: 30, description: 'Bois une gorgée d\'eau, marche sur place', color: Colors.morning, isRest: true },
      // Répéter 2 fois de plus
      { name: 'Jumping jacks', duration: 20, description: 'Debout, saute en ouvrant bras et jambes, rythme rapide', color: Colors.relaxation, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats', duration: 20, description: 'Plie les genoux comme pour t\'asseoir, dos droit', color: Colors.relaxation, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes genoux', duration: 20, description: 'Au sol, mains sous les épaules, genoux posés', color: Colors.relaxation, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Planche', duration: 20, description: 'Position gainage, avant-bras au sol, corps droit', color: Colors.relaxation, isWork: true },
      { name: 'Pause longue', duration: 30, description: 'Bois une gorgée d\'eau, marche sur place', color: Colors.morning, isRest: true },
      // Troisième série
      { name: 'Jumping jacks', duration: 20, description: 'Debout, saute en ouvrant bras et jambes, rythme rapide', color: Colors.relaxation, isWork: true },
      { name: 'Repos 1', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Squats', duration: 20, description: 'Plie les genoux comme pour t\'asseoir, dos droit', color: Colors.relaxation, isWork: true },
      { name: 'Repos 2', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Pompes genoux', duration: 20, description: 'Au sol, mains sous les épaules, genoux posés', color: Colors.relaxation, isWork: true },
      { name: 'Repos 3', duration: 10, description: 'Récupération', color: Colors.agpBlue, isRest: true },
      { name: 'Planche', duration: 20, description: 'Position gainage, avant-bras au sol, corps droit', color: Colors.relaxation, isWork: true },
    ];
  }
};

const { width, height } = Dimensions.get('window');

export default function TabataTimer({ exercise, onComplete, onClose }: TabataTimerProps) {
  const { addCompletedExercise, user } = useAuth();
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phases] = useState(getTabataPhases(exercise.id));
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const currentPhase = phases[currentPhaseIndex];
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
        setTotalTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as number);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    setIsRunning(false);

    if (currentPhaseIndex < phases.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(phases[nextPhaseIndex].duration);
      
      const nextPhase = phases[nextPhaseIndex];
      
      Alert.alert(
        nextPhase.isWork ? '💪 C\'est parti !' : '😌 Récupération',
        `${nextPhase.name}\n\n${nextPhase.description}`,
        [
          {
            text: 'Continuer',
            onPress: () => setIsRunning(true)
          }
        ]
      );
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = async () => {
    setIsCompleted(true);

    if (!user) return;

    try {
      const result = await addCompletedExercise(
        user.id,
        exercise.id,
        exercise.type,
        exercise.duree
      );

      if (result.success) {
        Alert.alert(
          '🏆 Tabata terminé !',
          `Excellent ! Vous avez complété "${exercise.titre}". Votre métabolisme va continuer à brûler des calories !`,
          [
            {
              text: 'Continuer',
              onPress: () => {
                onComplete();
                onClose();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('💥 Erreur enregistrement Tabata:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOverallProgress = () => {
    return ((totalTimeElapsed / totalDuration) * 100);
  };

  const getPhaseProgress = () => {
    const phaseDuration = currentPhase.duration;
    return ((phaseDuration - timeLeft) / phaseDuration) * 100;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0].duration);
    setTotalTimeElapsed(0);
    setIsCompleted(false);
  };

  const skipPhase = () => {
    if (currentPhaseIndex < phases.length - 1) {
      const nextPhaseIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndex(nextPhaseIndex);
      setTimeLeft(phases[nextPhaseIndex].duration);
    } else {
      completeWorkout();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Progress Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.progressCircle}>
            <View style={[
              styles.progressFill, 
              { 
                backgroundColor: currentPhase.color,
                transform: [{ rotate: `${(getPhaseProgress() * 3.6)}deg` }] 
              }
            ]} />
            <View style={styles.innerCircle}>
              <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              <Text style={[styles.phaseLabel, { color: currentPhase.color }]}>
                {currentPhase.name}
              </Text>
              <Text style={styles.phaseCounter}>
                {currentPhaseIndex + 1}/{phases.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Phase actuelle */}
        <View style={styles.currentPhaseContainer}>
          <View style={[
            styles.phaseCard, 
            { 
              borderLeftColor: currentPhase.color,
              backgroundColor: currentPhase.isWork ? '#E8F5E8' : currentPhase.isRest ? '#E3F2FD' : Colors.surface
            }
          ]}>
            <View style={styles.phaseHeader}>
              {currentPhase.isWork ? (
                <Zap size={24} color={currentPhase.color} />
              ) : (
                <Timer size={24} color={currentPhase.color} />
              )}
              <Text style={[styles.phaseTitle, { color: currentPhase.color }]}>
                {currentPhase.name}
              </Text>
            </View>
            <Text style={styles.phaseDescription}>
              {currentPhase.description}
            </Text>
            
            {currentPhase.isWork && (
              <View style={styles.workoutTip}>
                <Text style={styles.workoutTipText}>
                  💪 {exercise.id === 21 ? 'En douceur ! Adaptez à votre rythme' : 'Donnez le maximum ! 20 secondes d\'effort intense !'}
                </Text>
              </View>
            )}
            
            {currentPhase.isRest && (
              <View style={styles.restTip}>
                <Text style={styles.restTipText}>
                  😌 Récupérez bien ! Respirez profondément.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Progression générale */}
        <View style={styles.overallProgressContainer}>
          <Text style={styles.overallProgressTitle}>Progression Tabata</Text>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${getOverallProgress()}%` }
              ]} 
            />
          </View>
          <Text style={styles.overallProgressText}>
            {Math.round(getOverallProgress())}% • {formatTime(totalTimeElapsed)} / {formatTime(totalDuration)}
          </Text>
        </View>

        {/* Liste des phases */}
        <View style={styles.phasesListContainer}>
          <Text style={styles.phasesListTitle}>Programme Tabata complet :</Text>
          <ScrollView style={styles.phasesList} showsVerticalScrollIndicator={false}>
            {phases.map((phase, index) => (
              <View key={index} style={[
                styles.phaseListItem,
                index === currentPhaseIndex && styles.currentPhaseListItem,
                index < currentPhaseIndex && styles.completedPhaseListItem,
                phase.isWork && styles.workPhaseListItem,
                phase.isRest && styles.restPhaseListItem
              ]}>
                <View style={[
                  styles.phaseListNumber,
                  index === currentPhaseIndex && { backgroundColor: phase.color },
                  index < currentPhaseIndex && { backgroundColor: Colors.agpGreen }
                ]}>
                  {index < currentPhaseIndex ? (
                    <CheckCircle size={12} color={Colors.textLight} />
                  ) : (
                    <Text style={[
                      styles.phaseListNumberText,
                      index === currentPhaseIndex && { color: Colors.textLight }
                    ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <View style={styles.phaseListContent}>
                  <Text style={[
                    styles.phaseListName,
                    index === currentPhaseIndex && { color: phase.color, fontFamily: 'Poppins-SemiBold' },
                    phase.isWork && { fontWeight: 'bold' }
                  ]}>
                    {phase.name}
                    {phase.isWork && ' 💪'}
                    {phase.isRest && ' 😌'}
                  </Text>
                  <Text style={styles.phaseListDuration}>
                    {formatTime(phase.duration)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Controls - Fixés en bas */}
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          {!isCompleted ? (
            <>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleTimer}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isRunning ? [Colors.relaxation, '#FFB3BA'] : [currentPhase.color, currentPhase.color + '80']}
                  style={styles.controlButtonGradient}
                >
                  {isRunning ? (
                    <Pause size={24} color={Colors.textLight} />
                  ) : (
                    <Play size={24} color={Colors.textLight} />
                  )}
                  <Text style={styles.controlButtonText}>
                    {isRunning ? 'Pause' : 'Démarrer'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.secondaryControls}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={resetTimer}
                  activeOpacity={0.8}
                >
                  <RotateCcw size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={skipPhase}
                  activeOpacity={0.8}
                >
                  <Square size={20} color={Colors.textSecondary} />
                  <Text style={styles.secondaryButtonText}>Passer</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                onComplete();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.agpGreen, '#A5D6A7']}
                style={styles.controlButtonGradient}
              >
                <CheckCircle size={24} color={Colors.textLight} />
                <Text style={styles.controlButtonText}>Terminer</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.border,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    transformOrigin: 'center',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  phaseLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 4,
    textAlign: 'center',
  },
  phaseCounter: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  currentPhaseContainer: {
    width: '100%',
    marginBottom: 20,
  },
  phaseCard: {
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  workoutTip: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpGreen,
  },
  workoutTipText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpGreen,
    textAlign: 'center',
  },
  restTip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpBlue,
  },
  restTipText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
    textAlign: 'center',
  },
  overallProgressContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overallProgressTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.agpBlue,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phasesListContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  phasesListTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  phasesList: {
    maxHeight: 200,
  },
  phaseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  currentPhaseListItem: {
    backgroundColor: Colors.agpLightBlue,
  },
  completedPhaseListItem: {
    backgroundColor: Colors.agpLightGreen,
  },
  workPhaseListItem: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpGreen,
  },
  restPhaseListItem: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpBlue,
  },
  phaseListNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseListNumberText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.textSecondary,
  },
  phaseListContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseListName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  phaseListDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  controls: {
    gap: 12,
  },
  controlButton: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  controlButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
});