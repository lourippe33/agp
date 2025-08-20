import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Platform, TextInput, Text } from 'react-native';
import { Sun, ArrowLeft, Search, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Recipe } from '@/types/Recipe';
import { Colors } from '@/constants/Colors';
import MomentHeader from '@/components/MomentHeader';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import recipesData from '@/data/recettes_agp.json';

export default function MatinScreen() {
  const params = useLocalSearchParams();
  const matinRecipes = recipesData.recettes.filter(recipe => recipe.moment === 'matin');
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(matinRecipes);
  const [showSearchResults, setShowSearchResults] = useState(false);


  // Effet pour ouvrir automatiquement la modal si des paramètres sont fournis
  useEffect(() => {
    if (params.recipeId && params.openModal === 'true') {
      const recipeId = parseInt(params.recipeId as string);
      const recipe = matinRecipes.find(r => r.id === recipeId);
      
      console.log(`🎯 Recherche recette matin ID: ${recipeId}`);
      console.log(`📋 Recette trouvée:`, recipe?.titre);
      
      if (recipe) {
        setSelectedRecipe(recipe);
        setModalVisible(true);
      }
    }
  }, [params.recipeId, params.openModal]);

  // Effet pour filtrer les recettes
  useEffect(() => {
    let filtered = [...matinRecipes];
    let showResults = false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(recipe =>
        recipe.titre.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
        recipe.ingredients.some(ing => ing.nom.toLowerCase().includes(query))
      );
      showResults = true;
    } else {
      showResults = false;
    }

    setFilteredRecipes(filtered);
    setShowSearchResults(showResults);
  }, [searchQuery, matinRecipes]);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const goBack = () => {
    router.back();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.textLight} />
        </TouchableOpacity>
        <MomentHeader
          moment="matin"
          title="Petit-déjeuner"
          subtitle="Commencez votre journée avec énergie"
          icon={<Sun size={32} color={Colors.textLight} />}
        />
      </View>
      
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un petit-déjeuner..."
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
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} trouvée{filteredRecipes.length > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={clearSearch} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Effacer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <FlatList
          data={showSearchResults ? filteredRecipes : matinRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          style={Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined}
        />
      </View>

      <RecipeModal
        recipe={selectedRecipe}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
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
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 170,
  },
  row: {
    justifyContent: 'space-between',
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