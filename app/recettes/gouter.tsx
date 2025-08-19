import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Coffee, ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Recipe } from '@/types/Recipe';
import { Colors } from '@/constants/Colors';
import MomentHeader from '@/components/MomentHeader';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import recipesData from '@/data/recettes_agp.json';

export default function GouterScreen() {
  const params = useLocalSearchParams();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const gouterRecipes = recipesData.recettes.filter(recipe => recipe.moment === 'gouter');

  // Effet pour ouvrir automatiquement la modal si des paramètres sont fournis
  useEffect(() => {
    if (params.recipeId && params.openModal === 'true') {
      const recipeId = parseInt(params.recipeId as string);
      const recipe = gouterRecipes.find(r => r.id === recipeId);
      
      console.log(`🎯 Recherche recette collation ID: ${recipeId}`);
      console.log(`📋 Recette trouvée:`, recipe?.titre);
      
      if (recipe) {
        setSelectedRecipe(recipe);
        setModalVisible(true);
      }
    }
  }, [params.recipeId, params.openModal]);

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
          moment="gouter"
          title="Collation"
          subtitle="Une pause plaisir et énergisante"
          icon={<Coffee size={32} color={Colors.textLight} />}
        />
      </View>
      
      <View style={styles.content}>
        <FlatList
          data={gouterRecipes}
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
});