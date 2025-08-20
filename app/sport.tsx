import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Text } from 'react-native';
import { Dumbbell, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';
import MomentHeader from '@/components/MomentHeader';
import SportMenuGrid from '@/components/SportMenuGrid';
import ExerciseModal from '@/components/ExerciseModal';
import PersistentTabBar from '@/components/PersistentTabBar';
import sportsData from '@/data/exercices_sport.json';

export default function SportScreen() {
  const params = useLocalSearchParams();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Effet pour ouvrir automatiquement la modal si des paramètres sont fournis
  useEffect(() => {
    if (params.exerciseId && params.openModal === 'true') {
      const exerciseId = parseInt(params.exerciseId as string);
      const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
      
      console.log(`🎯 Recherche exercice sport ID: ${exerciseId}`);
      console.log(`💪 Exercice trouvé:`, exercise?.titre);
      
      if (exercise) {
        setSelectedExercise(exercise);
        setModalVisible(true);
      }
    }
  }, [params.exerciseId, params.openModal]);

  const handleExerciseSelect = (exerciseId: number) => {
    const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <MomentHeader
          moment="sport"
          title="Activités Sportives"
          subtitle="Bougez selon votre niveau pour perdre du poids"
          icon={<Dumbbell size={32} color={Colors.textLight} />}
        />
      </View>

      <View style={styles.startButtonContainer}>
        <TouchableOpacity
          style={styles.startExerciseButton}
          onPress={() => handleExerciseSelect(1)}
          activeOpacity={0.8}
        >
          <Text style={styles.startExerciseButtonText}>
            ▶️ Démarrer un exercice
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <ScrollView 
          style={[
            styles.scrollContainer,
            Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
          ]}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <SportMenuGrid onExerciseSelect={handleExerciseSelect} />
        </ScrollView>
      </View>

      <ExerciseModal
        exercise={selectedExercise}
        visible={modalVisible}
        onClose={handleCloseModal}
      />

      <PersistentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'relative',
  },
  startButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  startExerciseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startExerciseButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Espace pour la tab bar
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});