import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Recipe } from '@/types/Recipe';
import RecipeModal from './RecipeModal';
import recipesData from '@/data/recettes_agp.json';

export default function RecipeSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Rechercher uniquement dans les recettes
    const filtered = recipesData.recettes.filter(recipe =>
      recipe.titre.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      recipe.ingredients.some(ing => ing.nom.toLowerCase().includes(query.toLowerCase())) ||
      recipe.moment.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
    setShowResults(false);
  };

  const renderRecipeResult = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleRecipePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.titre}</Text>
        <Text style={styles.resultMoment}>
          {item.moment.charAt(0).toUpperCase() + item.moment.slice(1)}
        </Text>
        <Text style={styles.resultTags}>
          {item.tags.slice(0, 2).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une recette..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Résultats de recherche */}
        {showResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {searchResults.length} recette{searchResults.length > 1 ? 's' : ''} trouvée{searchResults.length > 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={clearSearch}>
                <Text style={styles.closeResults}>Fermer</Text>
              </TouchableOpacity>
            </View>
            
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderRecipeResult}
                keyExtractor={(item) => item.id.toString()}
                style={[
                  styles.resultsList,
                  Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
                ]}
                showsVerticalScrollIndicator={true}
                maxHeight={300}
              />
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>
                  Aucune recette trouvée pour "{searchQuery}"
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Essayez avec d'autres mots-clés
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Modal de recette */}
      <RecipeModal
        recipe={selectedRecipe}
        visible={recipeModalVisible}
        onClose={() => {
          setRecipeModalVisible(false);
          setSelectedRecipe(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular', 
    color: Colors.text,
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 1000,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  closeResults: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  resultsList: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  resultMoment: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.agpBlue,
    marginBottom: 2,
  },
  resultTags: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});