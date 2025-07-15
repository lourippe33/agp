import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Utensils, Heart, Clock, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/Recipe';
import { Exercise } from '@/types/Exercise';
import RecipeCard from './RecipeCard';
import ExerciseCard from './ExerciseCard';

interface SearchResultsProps {
  recipes: Recipe[];
  exercises: Exercise[];
  totalResults: number;
  searchQuery: string;
  onRecipePress: (recipe: Recipe) => void;
  onExercisePress: (exercise: Exercise) => void;
  showType?: 'all' | 'recipes' | 'exercises';
}

const { width } = Dimensions.get('window');

export default function SearchResults({
  recipes,
  exercises,
  totalResults,
  searchQuery,
  onRecipePress,
  onExercisePress,
  showType = 'all',
}: SearchResultsProps) {
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={() => onRecipePress(item)} />
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard exercise={item} onPress={() => onExercisePress(item)} />
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Target size={48} color={Colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aucun résultat trouvé' : 'Commencez votre recherche'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? `Aucun contenu ne correspond à "${searchQuery}"`
          : 'Tapez quelques mots pour découvrir nos recettes et exercices'
        }
      </Text>
      {searchQuery && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>💡 Suggestions :</Text>
          <Text style={styles.suggestionText}>• Essayez des mots plus généraux</Text>
          <Text style={styles.suggestionText}>• Vérifiez l'orthographe</Text>
          <Text style={styles.suggestionText}>• Utilisez les filtres pour affiner</Text>
        </View>
      )}
    </View>
  );

  const ResultsHeader = () => (
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsCount}>
        {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
      </Text>
      {searchQuery && (
        <Text style={styles.searchQuery}>pour "{searchQuery}"</Text>
      )}
    </View>
  );

  const SectionHeader = ({ title, count, icon: IconComponent }: {
    title: string;
    count: number;
    icon: any;
  }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <IconComponent size={20} color={Colors.agpBlue} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
    </View>
  );

  if (totalResults === 0) {
    return <EmptyState />;
  }

  return (
    <View style={styles.container}>
      <ResultsHeader />
      
      {/* Recettes */}
      {(showType === 'all' || showType === 'recipes') && recipes.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Recettes" count={recipes.length} icon={Utensils} />
          <FlatList
            data={recipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => `recipe-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* Exercices */}
      {(showType === 'all' || showType === 'exercises') && exercises.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Exercices" count={exercises.length} icon={Heart} />
          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => `exercise-${item.id}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsCount: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  searchQuery: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 40,
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  suggestions: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});