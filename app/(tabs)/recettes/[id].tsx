import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, Users, ChefHat } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Données d'exemple pour la recette
const recetteData = {
  id: 1,
  titre: "Porridge aux fruits rouges",
  moment: "matin",
  tempsPreparation: 10,
  tempsCuisson: 5,
  difficulte: "Très facile",
  tags: ["avoine", "fruits", "petit-déjeuner"],
  image: "https://images.pexels.com/photos/1172019/pexels-photo-1172019.jpeg?w=800&q=80",
  ingredients: [
    { nom: "Flocons d'avoine", quantite: "50g" },
    { nom: "Lait végétal", quantite: "200ml" },
    { nom: "Fruits rouges", quantite: "100g" },
    { nom: "Miel", quantite: "1 c.à.s" }
  ],
  etapes: [
    "Faire chauffer le lait végétal dans une casserole",
    "Ajouter les flocons d'avoine et cuire 5 minutes",
    "Incorporer les fruits rouges et le miel",
    "Servir chaud"
  ],
  nutritionPour100g: {
    calories: 180,
    proteines: 6,
    glucides: 28,
    lipides: 4
  }
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const recette = recetteData; // Pour l'exemple

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image et header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recette.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{recette.titre}</Text>
            <View style={styles.momentBadge}>
              <Text style={styles.momentText}>{recette.moment}</Text>
            </View>
          </View>
        </View>

        {/* Infos rapides */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color={Colors.agpBlue} />
            <Text style={styles.infoText}>{recette.tempsPreparation} min</Text>
          </View>
          <View style={styles.infoItem}>
            <ChefHat size={20} color={Colors.agpBlue} />
            <Text style={styles.infoText}>{recette.difficulte}</Text>
          </View>
          <View style={styles.infoItem}>
            <Users size={20} color={Colors.agpBlue} />
            <Text style={styles.infoText}>1 pers.</Text>
          </View>
        </View>

        {/* Ingrédients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          {recette.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientQuantity}>{ingredient.quantite}</Text>
              <Text style={styles.ingredientName}>{ingredient.nom}</Text>
            </View>
          ))}
        </View>

        {/* Étapes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préparation</Text>
          {recette.etapes.map((etape, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{etape}</Text>
            </View>
          ))}
        </View>

        {/* Nutrition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valeurs nutritionnelles (100g)</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{recette.nutritionPour100g.calories}</Text>
              <Text style={styles.nutritionLabel}>kcal</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{recette.nutritionPour100g.proteines}g</Text>
              <Text style={styles.nutritionLabel}>Protéines</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{recette.nutritionPour100g.glucides}g</Text>
              <Text style={styles.nutritionLabel}>Glucides</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{recette.nutritionPour100g.lipides}g</Text>
              <Text style={styles.nutritionLabel}>Lipides</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  momentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.morning,
  },
  momentText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
    textTransform: 'capitalize',
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ingredientQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
    width: 80,
  },
  ingredientName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.agpBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.textLight,
  },
  stepText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  nutritionValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});