import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Text, TextInput } from 'react-native';
import { Dumbbell, ArrowLeft, Search, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Exercise } from '@/types/Exercise';
import { Colors } from '@/constants/Colors';
import sportsData from '@/data/exercices_sport.json';

export default function SportScreen() {
  const params = useLocalSearchParams();
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(sportsData.exercices);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

  // Effet pour filtrer les exercices
  useEffect(() => {
    let filtered = [...sportsData.exercices];
    let showResults = false;

    // Filtrage par recherche textuelle
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

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activités Sportives</Text>
      </View>
      
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un exercice..."
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
          <Text style={styles.placeholder}>
            Liste des exercices sportifs sera affichée ici
          </Text>
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    padding: 20,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
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