import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/Recipe';
import { Exercise } from '@/types/Exercise';
import { useSearch } from '@/hooks/useSearch';
import SearchBar from '@/components/SearchBar';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import SearchResults from '@/components/SearchResults';
import RecipeModal from '@/components/RecipeModal';
import ExerciseModal from '@/components/ExerciseModal';
import PersistentTabBar from '@/components/PersistentTabBar';

// Import des données
import recipesData from '@/data/recettes_agp.json';
import exercisesData from '@/data/exercices_detente.json';
import sportsData from '@/data/exercices_sport.json';

export default function SearchScreen() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  // Combiner tous les exercices avec des IDs uniques
  const allExercises = [
    ...exercisesData.exercices.map(exercise => ({
      ...exercise,
      id: `detente-${exercise.id}`,
      originalId: exercise.id
    })),
    ...sportsData.exercices.map(exercise => ({
      ...exercise,
      id: `sport-${exercise.id}`,
      originalId: exercise.id
    })),
  ];

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    searchResults,
    getActiveFiltersCount,
    clearAll,
  } = useSearch({
    recipes: recipesData.recettes,
    exercises: allExercises,
  });

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseModalVisible(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header avec recherche */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <SearchBar
            onSearch={setSearchQuery}
            onFilterPress={() => setFilterModalVisible(true)}
            placeholder="Rechercher recettes et exercices..."
            activeFiltersCount={getActiveFiltersCount()}
          />
        </View>
      </View>

      {/* Résultats */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
      >
        <SearchResults
          recipes={searchResults.recipes}
          exercises={searchResults.exercises}
          totalResults={searchResults.totalResults}
          searchQuery={searchQuery}
          onRecipePress={handleRecipePress}
          onExercisePress={handleExercisePress}
        />
      </ScrollView>

      {/* Modal de filtres */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        contentType="all"
      />

      {/* Modal de recette */}
      <RecipeModal
        recipe={selectedRecipe}
        visible={recipeModalVisible}
        onClose={() => {
          setRecipeModalVisible(false);
          setSelectedRecipe(null);
        }}
      />

      {/* Modal d'exercice */}
      <ExerciseModal
        exercise={selectedExercise}
        visible={exerciseModalVisible}
        onClose={() => {
          setExerciseModalVisible(false);
          setSelectedExercise(null);
        }}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espace pour la tab bar
  },
});