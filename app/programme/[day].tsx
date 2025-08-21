import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, RefreshCw, Play, Clock, Utensils, Dumbbell, Heart, Chrome as Home } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import recettesData from '@/data/recettes_agp.json';
import exercicesSportData from '@/data/exercices_sport.json';
import exercicesDetenteData from '@/data/exercices_detente.json';

interface DayProgram {
  day: number;
  recetteMatin: any;
  recetteMidi: any;
  recetteGouter: any;
  recetteSoir: any;
  exerciceSport: any;
  exerciceDetente: any;
}

export default function DayProgramScreen() {
  const { day } = useLocalSearchParams();
  const dayNumber = parseInt(day as string);
  
  const [program, setProgram] = useState<DayProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour obtenir une recette aléatoire par moment
  const getRandomRecipe = (moment: string) => {
    const recipes = recettesData.recettes.filter(r => r.moment === moment);
    return recipes[Math.floor(Math.random() * recipes.length)];
  };

  // Fonction pour obtenir un exercice sport aléatoire
  const getRandomSportExercise = () => {
    const exercises = exercicesSportData.exercices;
    return exercises[Math.floor(Math.random() * exercises.length)];
  };

  // Fonction pour obtenir un exercice détente aléatoire
  const getRandomDetenteExercise = () => {
    const exercises = exercicesDetenteData.exercices;
    return exercises[Math.floor(Math.random() * exercises.length)];
  };

  // Générer le programme du jour
  const generateDayProgram = () => {
    const newProgram: DayProgram = {
      day: dayNumber,
      recetteMatin: getRandomRecipe('matin'),
      recetteMidi: getRandomRecipe('midi'),
      recetteGouter: getRandomRecipe('gouter'),
      recetteSoir: getRandomRecipe('soir'),
      exerciceSport: getRandomSportExercise(),
      exerciceDetente: getRandomDetenteExercise()
    };
    setProgram(newProgram);
    setIsLoading(false);
  };

  // Changer une recette spécifique
  const changeRecipe = (moment: string) => {
    // Rediriger vers la page des recettes avec le moment sélectionné
    router.push(`/recettes?moment=${moment}&returnTo=/programme/${dayNumber}` as any);
  };

  // Changer l'exercice sport
  const changeSportExercise = () => {
    // Rediriger vers la page des exercices sport
    router.push(`/sport?returnTo=/programme/${dayNumber}` as any);
  };

  // Changer l'exercice détente
  const changeDetenteExercise = () => {
    // Rediriger vers la page des exercices détente
    router.push(`/detente?returnTo=/programme/${dayNumber}` as any);
  };

  // Générer le programme au chargement
  useEffect(() => {
    generateDayProgram();
  }, [dayNumber]);

  const getDayName = (day: number) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[(day - 1) % 7];
  };

  if (isLoading || !program) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Génération de votre programme...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.textLight} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Jour {dayNumber}</Text>
            <Text style={styles.headerSubtitle}>{getDayName(dayNumber)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text style={styles.homeButtonText}>Accueil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bouton régénérer tout */}
        <TouchableOpacity style={styles.regenerateAllButton} onPress={generateDayProgram}>
          <RefreshCw size={20} color={Colors.textLight} />
          <Text style={styles.regenerateAllText}>Nouveau programme complet</Text>
        </TouchableOpacity>

        {/* Section Recettes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ Vos recettes du jour</Text>
          
          {/* Matin */}
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>🌅 Petit-déjeuner</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => changeRecipe('matin')}
              >
                <RefreshCw size={16} color={Colors.morning} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.recipeItem}
              onPress={() => router.push(`/recettes/${program.recetteMatin.id}`)}
            >
              <Image source={{ uri: program.recetteMatin.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{program.recetteMatin.titre}</Text>
                <Text style={styles.recipeTime}>{program.recetteMatin.tempsPreparation} min</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Midi */}
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>☀️ Déjeuner</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => changeRecipe('midi')}
              >
                <RefreshCw size={16} color={Colors.agpGreen} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.recipeItem}
              onPress={() => router.push(`/recettes/${program.recetteMidi.id}`)}
            >
              <Image source={{ uri: program.recetteMidi.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{program.recetteMidi.titre}</Text>
                <Text style={styles.recipeTime}>{program.recetteMidi.tempsPreparation} min</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Goûter */}
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>🍪 Goûter</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => changeRecipe('gouter')}
              >
                <RefreshCw size={16} color={Colors.snack} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.recipeItem}
              onPress={() => router.push(`/recettes/${program.recetteGouter.id}`)}
            >
              <Image source={{ uri: program.recetteGouter.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{program.recetteGouter.titre}</Text>
                <Text style={styles.recipeTime}>{program.recetteGouter.tempsPreparation} min</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Soir */}
          <View style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealTitle}>🌙 Dîner</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => changeRecipe('soir')}
              >
                <RefreshCw size={16} color={Colors.agpBlue} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.recipeItem}
              onPress={() => router.push(`/recettes/${program.recetteSoir.id}`)}
            >
              <Image source={{ uri: program.recetteSoir.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{program.recetteSoir.titre}</Text>
                <Text style={styles.recipeTime}>{program.recetteSoir.tempsPreparation} min</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Exercices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Vos exercices du jour</Text>
          
          {/* Sport */}
          <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>🏃 Activité sportive</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={changeSportExercise}
              >
                <RefreshCw size={16} color={Colors.sport} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.exerciseItem}
              onPress={() => router.push(`/sport/${program.exerciceSport.id}`)}
            >
              <Image source={{ uri: program.exerciceSport.image }} style={styles.exerciseImage} />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{program.exerciceSport.titre}</Text>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseTime}>{program.exerciceSport.duree} min</Text>
                  <Text style={styles.exerciseCalories}>{program.exerciceSport.calories} kcal</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Détente */}
          <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseTitle}>🧘 Exercice de détente</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={changeDetenteExercise}
              >
                <RefreshCw size={16} color={Colors.relaxation} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.exerciseItem}
              onPress={() => router.push(`/detente/${program.exerciceDetente.id}`)}
            >
              <Image source={{ uri: program.exerciceDetente.image }} style={styles.exerciseImage} />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{program.exerciceDetente.titre}</Text>
                <Text style={styles.exerciseTime}>{program.exerciceDetente.duree} min</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton de validation */}
        <TouchableOpacity style={styles.validateButton}>
          <Play size={24} color={Colors.textLight} />
          <Text style={styles.validateButtonText}>Commencer ma journée</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  backButton: {
    padding: 8,
    minWidth: 40,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 60,
  },
  homeButtonText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  regenerateAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.agpBlue,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 8,
  },
  regenerateAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  changeButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  recipeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  exerciseCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  validateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.agpGreen,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  validateButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});