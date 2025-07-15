import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';
import MomentHeader from '@/components/MomentHeader';
import ExerciseMenuGrid from '@/components/ExerciseMenuGrid';
import ExerciseModal from '@/components/ExerciseModal';
import PersistentTabBar from '@/components/PersistentTabBar';
import exercisesData from '@/data/exercices_detente.json';

export default function DetenteScreen() {
  const params = useLocalSearchParams();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Effet pour ouvrir automatiquement la modal si des paramètres sont fournis
  useEffect(() => {
    if (params.exerciseId && params.openModal === 'true') {
      const exerciseId = parseInt(params.exerciseId as string);
      const exercise = exercisesData.exercices.find(ex => ex.id === exerciseId);
      
      console.log(`🎯 Recherche exercice détente ID: ${exerciseId}`);
      console.log(`🧘 Exercice trouvé:`, exercise?.titre);
      
      if (exercise) {
        setSelectedExercise(exercise);
        setModalVisible(true);
      }
    }
  }, [params.exerciseId, params.openModal]);

  const handleExerciseSelect = (exerciseId: number) => {
    const exercise = exercisesData.exercices.find(ex => ex.id === exerciseId);
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
          moment="detente"
          title="Détente"
          subtitle="Gérez votre stress pour une meilleure digestion"
          icon={<Heart size={32} color={Colors.textLight} />}
        />
      </View>
      
      <View style={styles.content}>
        <ExerciseMenuGrid onExerciseSelect={handleExerciseSelect} />
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
});