import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Platform, TextInput, Text } from 'react-native';
import { Sun, ArrowLeft, Search, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Recipe } from '@/types/Recipe';
import { Colors } from '@/constants/Colors';
import recipesData from '@/data/recettes_agp.json';

export default function MatinScreen() {
  const params = useLocalSearchParams();

  // Liste MATIN stable entre les rendus
  const matinRecipes = useMemo(
    () => recipesData.recettes.filter((recipe) => recipe.moment === 'matin'),
    []
  );

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(matinRecipes);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Ouvrir la modal si params fournis (dépend seulement des params)
  useEffect(() => {
    if (params.recipeId && params.openModal === 'true') {
      const recipeId = parseInt(params.recipeId as string, 10);
      const recipe = matinRecipes.find((r) => r.id === recipeId);
      if (recipe) {
        setSelectedRecipe(recipe);
        setModalVisible(true);
      }
    }
  }, [params.recipeId, params.openModal]); // matinRecipes est mémoïsé

  // Filtrer les recettes (ne dépend que de la recherche et de la liste stable)
  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const filtered = matinRecipes.filter(
        (r) =>
          r.titre.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some((ing) => ing.nom.toLowerCase().includes(q))
      );
      setFilteredRecipes(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredRecipes(matinRecipes);
      setShowSearchResults(false);
    }
  }, [searchQuery, matinRecipes]);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const goBack = () => router.back();

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Petit-déjeuner</Text>
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
        <Text style={styles.placeholder}>
          Liste des recettes du matin sera affichée ici
        </Text>
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
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    height: '100%',
  },
  clearButton: { padding: 4 },

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
  resultsText: { fontSize: 14, fontFamily: 'Inter-Medium', color: Colors.textSecondary },
  clearAllButton: { backgroundColor: Colors.agpLightBlue, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  clearAllText: { fontSize: 12, fontFamily: 'Poppins-Medium', color: Colors.agpBlue },
});
