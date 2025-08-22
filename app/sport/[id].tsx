import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Zap, Play, Users } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import exercicesData from '@/data/exercices.json';


export default function SportDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showTimer, setShowTimer] = useState(false);

  const exercice = exercicesData.exercices.find(e => e.id === parseInt(id as string));
  
  if (!exercice) {
    return (
      <View style={styles.container}>
        <Text>Exercice non trouvé</Text>
      </View>
    );
  }

  const getDifficultyColor = (difficulte: string) => {
    switch (difficulte.toLowerCase()) {
      case 'très facile':
        return '#4CAF50';
      case 'facile':
        return '#8BC34A';
      case 'moyen':
        return '#FF9800';
      case 'difficile':
        return '#F44336';
      default:
        return Colors.agpBlue;
    }
  };

  const handleStartExercise = () => {
    setShowTimer(true);
  };

  if (showTimer) {
    return <TimerView exercice={exercice} onBack={() => setShowTimer(false)} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image et header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: exercice.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{exercice.titre}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercice.difficulte) }]}>
              <Text style={styles.difficultyText}>{exercice.difficulte}</Text>
            </View>
          </View>
        </View>

        {/* Infos rapides */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.duree} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Zap size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.calories} kcal</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color={Colors.sport} />
            <Text style={styles.infoText}>{exercice.niveau}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{exercice.description}</Text>
        </View>

        {/* Étapes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Étapes de l'exercice</Text>
          {exercice.etapes.map((etape, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{etape}</Text>
            </View>
          ))}
        </View>

        {/* Bénéfices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bénéfices</Text>
          {exercice.benefices.map((benefice, index) => (
            <View key={index} style={styles.benefitItem}>
              <Text style={styles.benefitBullet}>✓</Text>
              <Text style={styles.benefitText}>{benefice}</Text>
            </View>
          ))}
        </View>

        {/* Bouton d'action */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartExercise}>
          <Play size={24} color={Colors.textLight} />
          <Text style={styles.startButtonText}>Commencer l'exercice</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Composant Timer simple
function TimerView({ exercice, onBack }: { exercice: any, onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes pour l'échauffement
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (currentStep < exercice.etapes.length - 1) {
              setCurrentStep(prev => prev + 1);
              return getStepDuration(currentStep + 1);
            } else {
              setIsRunning(false);
              Alert.alert('Félicitations !', 'Exercice terminé !');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentStep]);

  const getStepDuration = (stepIndex: number) => {
    // Durées par étape (en secondes)
    const durations = [180, 120, 120, 120, 120, 120, 300, 120];
    return durations[stepIndex] || 120;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.timerTitle}>Chrono Exercice</Text>
      </View>

      <View style={styles.timerContent}>
        <Text style={styles.currentStepTitle}>
          Étape {currentStep + 1}/{exercice.etapes.length}
        </Text>
        
        <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
        
        <Text style={styles.stepInstruction}>
          {exercice.etapes[currentStep]}
        </Text>

        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Play size={32} color={Colors.textLight} />
          <Text style={styles.playButtonText}>
            {isRunning ? 'Pause' : 'Démarrer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.sport,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  benefitBullet: {
    fontSize: 16,
    color: Colors.success,
    fontFamily: 'Inter-Bold',
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sport,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  // Styles pour le timer
  timerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginLeft: 16,
  },
  timerContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStepTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 64,
    fontFamily: 'Poppins-Bold',
    color: Colors.sport,
    marginBottom: 30,
  },
  stepInstruction: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.sport,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});