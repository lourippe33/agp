import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, RefreshCw, ArrowRight, Utensils, Dumbbell } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import recettesData from '@/data/recettes.json';
import exercicesData from '@/data/exercices.json';
import detenteData from '@/data/detente.json';

export default function DayProgramScreen() {
  const { day } = useLocalSearchParams();
  const readOnly = useLocalSearchParams().readOnly === 'true';
  const dayNumber = parseInt(day as string);
  const [dailyRecommendations, setDailyRecommendations] = useState<any>({});

  useEffect(() => {
    generateDayRecommendations();
  }, []);

  const generateDayRecommendations = () => {
    // Logique de perte de poids : équilibrer les moments de la journée
    const matinRecettes = recettesData.recettes.filter(r => r.moment === 'matin');
    const midiRecettes = recettesData.recettes.filter(r => r.moment === 'midi');
    const gouterRecettes = recettesData.recettes.filter(r => r.moment === 'gouter');
    const soirRecettes = recettesData.recettes.filter(r => r.moment === 'soir');
    
    // Activités : alterner cardio et détente pour optimiser la perte de poids
    const cardioExercices = exercicesData.exercices.filter(e => 
      e.type === 'cardio' || e.tags.includes('cardio') || e.tags.includes('brule-graisse')
    );
    const detenteExercices = detenteData.exercices.filter(e => 
      e.type === 'respiration' || e.type === 'meditation' || e.type === 'relaxation'
    );
    
    setDailyRecommendations({
      matin: matinRecettes[Math.floor(Math.random() * matinRecettes.length)],
      midi: midiRecettes[Math.floor(Math.random() * midiRecettes.length)],
      gouter: gouterRecettes[Math.floor(Math.random() * gouterRecettes.length)],
      soir: soirRecettes[Math.floor(Math.random() * soirRecettes.length)],
      sport: cardioExercices[Math.floor(Math.random() * cardioExercices.length)],
      detente: detenteExercices[Math.floor(Math.random() * detenteExercices.length)]
    });
  };

  const regenerateRecommendation = (type: string) => {
    if (readOnly) return; // Empêcher les modifications pour les jours passés
    
    const newRecommendations = { ...dailyRecommendations };
    
    if (type === 'sport') {
      const cardioExercices = exercicesData.exercices.filter(e => 
        e.type === 'cardio' || e.tags.includes('cardio') || e.tags.includes('brule-graisse')
      );
      newRecommendations.sport = cardioExercices[Math.floor(Math.random() * cardioExercices.length)];
    } else if (type === 'detente') {
      const detenteExercices = detenteData.exercices.filter(e => 
        e.type === 'respiration' || e.type === 'meditation' || e.type === 'relaxation'
      );
      newRecommendations.detente = detenteExercices[Math.floor(Math.random() * detenteExercices.length)];
    } else {
      // Recettes par moment
      const recettesByMoment = recettesData.recettes.filter(r => r.moment === type);
      newRecommendations[type] = recettesByMoment[Math.floor(Math.random() * recettesByMoment.length)];
    }
    
    setDailyRecommendations(newRecommendations);
  };

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
          <Text style={styles.headerTitle}>Programme Jour {dayNumber}</Text>
          <View style={styles.placeholder} />
        </View>
        <Text style={styles.headerSubtitle}>
          Votre programme personnalisé du jour
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {dailyRecommendations.matin && (
          <View style={styles.dayContent}>
            {/* Recettes du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Vos repas du jour</Text>
              
              {/* Petit-déjeuner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Petit-déjeuner</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('matin')}
                   >
                     <RefreshCw size={16} color={Colors.agpBlue} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations.matin.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.matin.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations.matin.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations.matin.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Déjeuner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Déjeuner</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('midi')}
                   >
                     <RefreshCw size={16} color={Colors.agpBlue} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations.midi.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.midi.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations.midi.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations.midi.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Goûter */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Goûter</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('gouter')}
                   >
                     <RefreshCw size={16} color={Colors.agpBlue} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations.gouter.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.gouter.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations.gouter.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations.gouter.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Dîner */}
              <View style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTime}>Dîner</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('soir')}
                   >
                     <RefreshCw size={16} color={Colors.agpBlue} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.recipeItem}
                  onPress={() => router.push(`/recettes/${dailyRecommendations.soir.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.soir.image }} style={styles.recipeImage} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{dailyRecommendations.soir.titre}</Text>
                    <Text style={styles.recipeTime}>{dailyRecommendations.soir.tempsPreparation} min</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Activités du jour */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💪 Vos activités du jour</Text>
              
              {/* Sport */}
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Dumbbell size={20} color={Colors.sport} />
                  <Text style={styles.activityType}>Activité Sportive</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('sport')}
                   >
                     <RefreshCw size={16} color={Colors.sport} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPress={() => router.push(`/sport/${dailyRecommendations.sport.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.sport.image }} style={styles.activityImage} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{dailyRecommendations.sport.titre}</Text>
                    <Text style={styles.activityDetails}>{dailyRecommendations.sport.duree} min • {dailyRecommendations.sport.calories} kcal</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Détente */}
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={styles.detenteIcon}>
                    <Text style={styles.detenteIconText}>🧘</Text>
                  </View>
                  <Text style={styles.activityType}>Exercice de Détente</Text>
                 {!readOnly && (
                   <TouchableOpacity 
                     style={styles.changeButton}
                     onPress={() => regenerateRecommendation('detente')}
                   >
                     <RefreshCw size={16} color={Colors.relaxation} />
                   </TouchableOpacity>
                 )}
                </View>
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPress={() => router.push(`/detente/${dailyRecommendations.detente.id}` as any)}
                >
                  <Image source={{ uri: dailyRecommendations.detente.image }} style={styles.activityImage} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{dailyRecommendations.detente.titre}</Text>
                    <Text style={styles.activityDetails}>{dailyRecommendations.detente.duree} min • {dailyRecommendations.detente.type}</Text>
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Boutons d'accès rapide */}
           {!readOnly && (
             <View style={styles.quickAccessSection}>
               <Text style={styles.sectionTitle}>🔄 Envie de changer ?</Text>
               <View style={styles.quickAccessButtons}>
                 <TouchableOpacity 
                   style={[styles.quickAccessButton, { backgroundColor: Colors.agpGreen }]}
                   onPress={() => router.push('/recettes')}
                 >
                   <Utensils size={24} color={Colors.textLight} />
                   <Text style={styles.quickAccessText}>Autres recettes</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={[styles.quickAccessButton, { backgroundColor: Colors.sport }]}
                   onPress={() => router.push('/sport')}
                 >
                   <Dumbbell size={24} color={Colors.textLight} />
                   <Text style={styles.quickAccessText}>Autres activités</Text>
                 </TouchableOpacity>
               </View>
             </View>
           )}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  placeholder: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dayContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  mealTime: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  changeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
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
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  activityType: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  detenteIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detenteIconText: {
    fontSize: 16,
  },
  quickAccessSection: {
    marginTop: 20,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});