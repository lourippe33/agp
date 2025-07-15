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

export default function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const momentColor = getMomentColor(recipe.moment);
  const momentGradient = getMomentGradient(recipe.moment);

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
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
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
    right: 8,
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
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 18,
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
});