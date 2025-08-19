import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Clock, ChefHat, Users, Flame } from 'lucide-react-native';
import { Recipe } from '@/types/Recipe';
import { Colors, getMomentColor, getMomentGradient } from '@/constants/Colors';
import AGPLogo from './AGPLogo';

interface RecipeModalProps {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
}

const { height } = Dimensions.get('window');

export default function RecipeModal({ recipe, visible, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  const momentColor = getMomentColor(recipe.moment);
  const momentGradient = getMomentGradient(recipe.moment);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined}
        >
          {/* Header Image */}
          <View style={styles.headerContainer}>
            <Image source={{ uri: recipe.image }} style={styles.headerImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.headerOverlay}
            />
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonBackground}>
                <X size={24} color={Colors.text} />
              </View>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <AGPLogo size={40} />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{recipe.titre}</Text>
              <View style={styles.headerStats}>
                <View style={styles.statItem}>
                  <Clock size={16} color={Colors.textLight} />
                  <Text style={styles.statText}>
                    {recipe.tempsPreparation + recipe.tempsCuisson} min
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <ChefHat size={16} color={Colors.textLight} />
                  <Text style={styles.statText}>{recipe.difficulte}</Text>
                </View>
                <View style={styles.statItem}>
                  <Flame size={16} color={Colors.textLight} />
                  <Text style={styles.statText}>
                    {recipe.nutritionPour100g.calories} cal
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Tags */}
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: momentColor }]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Nutrition Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations nutritionnelles (100g)</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutritionPour100g.calories}
                  </Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutritionPour100g.proteines}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Protéines</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutritionPour100g.glucides}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Glucides</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {recipe.nutritionPour100g.lipides}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Lipides</Text>
                </View>
                {recipe.nutritionPour100g.fibres && (
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>
                      {recipe.nutritionPour100g.fibres}g
                    </Text>
                    <Text style={styles.nutritionLabel}>Fibres</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingrédients</Text>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={[styles.bullet, { backgroundColor: momentColor }]} />
                  <Text style={styles.ingredientText}>
                    {ingredient.quantite} {ingredient.nom}
                  </Text>
                </View>
              ))}
            </View>

            {/* Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Préparation</Text>
              {recipe.etapes.map((etape, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: momentColor }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{etape}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'relative',
    height: height * 0.4,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  closeButtonBackground: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  headerContent: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 34,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textLight,
  },
  content: {
    padding: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    minWidth: '20%',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
});