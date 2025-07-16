import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, ChefHat, Star } from 'lucide-react-native';
import { Recipe } from '@/types/Recipe';
import { Colors, getMomentColor, getMomentGradient } from '@/constants/Colors';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

// Hauteur standard pour les cartes
const CARD_HEIGHT = 240;

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const momentColor = getMomentColor(recipe.moment);
  const momentGradient = getMomentGradient(recipe.moment);
  
  const [showNutrition, setShowNutrition] = useState(false);
  
  const toggleNutrition = (e: any) => {
    e.stopPropagation();
    setShowNutrition(!showNutrition);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <View style={styles.imageContent}>
            <View style={[styles.difficultyBadge, { backgroundColor: momentColor }]}>
              <Text style={styles.difficultyText}>{recipe.difficulte}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.nutritionButton}
              onPress={toggleNutrition}
            >
              <Text style={styles.nutritionButtonText}>📊</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.titre}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                {recipe.tempsPreparation + recipe.tempsCuisson}min
              </Text>
            </View>
            <View style={styles.infoItem}>
              <ChefHat size={14} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                {recipe.nutritionPour100g.calories} cal
              </Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={[styles.tag, { borderColor: momentColor }]}>
                <Text style={[styles.tagText, { color: momentColor }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Valeurs nutritionnelles */}
        {showNutrition && (
          <View style={styles.nutritionOverlay}>
            <View style={styles.nutritionContent}>
              <Text style={styles.nutritionTitle}>Valeurs nutritionnelles (100g)</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutritionPour100g.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutritionPour100g.proteines}g</Text>
                  <Text style={styles.nutritionLabel}>Protéines</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutritionPour100g.glucides}g</Text>
                  <Text style={styles.nutritionLabel}>Glucides</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{recipe.nutritionPour100g.lipides}g</Text>
                  <Text style={styles.nutritionLabel}>Lipides</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeNutritionButton}
                onPress={toggleNutrition}
              >
                <Text style={styles.closeNutritionText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: CARD_HEIGHT,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  imageContent: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: Colors.textLight,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  nutritionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutritionButtonText: {
    fontSize: 12,
  },
  content: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
    height: 40,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
  },
  nutritionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  nutritionContent: {
    width: '100%',
    alignItems: 'center',
  },
  nutritionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  nutritionItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  nutritionLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  closeNutritionButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeNutritionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
});