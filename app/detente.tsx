import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, TextInput, Text } from 'react-native';
import { Heart, ArrowLeft, Search, X } from 'lucide-react-native';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercisesData.exercices);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Effet pour filtrer les exercices de détente
  useEffect(() => {
    let filtered = [...exercisesData.exercices];
    let showResults = false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(exercise =>
        exercise.titre.toLowerCase().includes(query) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(query)) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.type.toLowerCase().includes(query)
      );
      showResults = true;
    } else {
      showResults = false;
    }

    setFilteredExercises(filtered);
    setShowSearchResults(showResults);
  }, [searchQuery]);

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

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
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
      
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un exercice de détente..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Résultats - seulement si recherche active */}
      {showSearchResults && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredExercises.length} exercice{filteredExercises.length > 1 ? 's' : ''} trouvé{filteredExercises.length > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={clearSearch} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Effacer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <ScrollView 
          style={[
            styles.scrollContainer,
            Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
          ]}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <ExerciseMenuGrid 
            onExerciseSelect={handleExerciseSelect}
            filteredExercises={showSearchResults ? filteredExercises : undefined}
          />
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
  searchContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  resultsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  clearAllButton: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
});