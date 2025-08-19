import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Image,
  Platform,
} from 'react-native';
import { 
  Dumbbell, 
  Activity,
  Heart,
  Target,
  Flame,
  Wind,
  Star,
  Users,
  TrendingUp,
  Play,
  X,
  Clock,
  Trophy
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import SportExerciseTimer from './SportExerciseTimer';
import CardioTimer from './CardioTimer';
import HIITTimer from './HIITTimer';
import PilatesTimer from './PilatesTimer';
import sportsData from '@/data/exercices_sport.json';

interface SportMenuGridProps {
  onExerciseSelect: (exerciseId: number) => void;
}

const { width } = Dimensions.get('window');
const cardSize = (width - 64) / 2;

// Fonction pour obtenir l'icône selon le type d'exercice
const getExerciseIcon = (exercise: any) => {
  // Mapping basé sur les tags
  if (exercise.tags?.includes('cardio')) return Activity;
  if (exercise.tags?.includes('renforcement')) return Dumbbell;
  if (exercise.tags?.includes('danse')) return Heart;
  if (exercise.tags?.includes('yoga')) return Target;
  if (exercise.tags?.includes('hiit')) return Flame;
  if (exercise.tags?.includes('stretching')) return Wind;
  if (exercise.tags?.includes('gainage')) return Star;
  if (exercise.tags?.includes('pilates')) return Target;
  if (exercise.tags?.includes('marche')) return Users;
  if (exercise.tags?.includes('escaliers')) return TrendingUp;
  
  // Par défaut selon le niveau
  switch (exercise.niveau) {
    case 'debutant': return Users;
    case 'intermediaire': return Dumbbell;
    case 'avance': return Flame;
    default: return Activity;
  }
};

// Fonction pour obtenir la couleur selon le niveau
const getExerciseColor = (exercise: any) => {
  switch (exercise.niveau) {
    case 'debutant': return '#4CAF50';
    case 'intermediaire': return '#FF9800';
    case 'avance': return '#F44336';
    default: return '#4CAF50';
  }
};

export default function SportMenuGrid({ onExerciseSelect }: SportMenuGridProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [exerciseDetailsModalVisible, setExerciseDetailsModalVisible] = useState(false);
  const [cardioTimerVisible, setCardioTimerVisible] = useState(false);
  const [hiitTimerVisible, setHiitTimerVisible] = useState(false);
  const [pilatesTimerVisible, setPilatesTimerVisible] = useState(false);
  const [yogaTimerVisible, setYogaTimerVisible] = useState(false);

  console.log('🔍 Données exercices sport chargées:', sportsData.exercices.length, 'exercices');
  console.log('🎯 Exercice ID 14:', sportsData.exercices.find(ex => ex.id === 14));

  const handleExercisePress = (exerciseId: number) => {
    // Trouver l'exercice dans les données JSON
    const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
    console.log(`🎯 Exercice sélectionné ID ${exerciseId}:`, exercise);
    
    if (exercise) {
      setSelectedExercise(exercise);
      setExerciseDetailsModalVisible(true);
    } else {
      console.error(`❌ Exercice ID ${exerciseId} non trouvé dans le JSON`);
      // Fallback vers la sélection normale
      onExerciseSelect(exerciseId);
    }
  };

  const handleStartExercise = () => {
    if (selectedExercise) {
      setExerciseDetailsModalVisible(false);
      
      // Utiliser les timers spécialisés selon l'exercice
      if (selectedExercise.id === 2) { // Cardio Brûle-Graisse
        setCardioTimerVisible(true);
      } else if (selectedExercise.id === 4) { // HIIT Intensif
        setHiitTimerVisible(true);
      } else if (selectedExercise.id === 8) { // Pilates Minceur
        setPilatesTimerVisible(true);
      } else if (selectedExercise.id === 5) { // Yoga Dynamique
        setYogaTimerVisible(true);
      } else {
        // Timer générique pour les autres exercices
        setTimerModalVisible(true);
      }
    }
  };

  const handleTimerComplete = () => {
    setTimerModalVisible(false);
    setCardioTimerVisible(false);
    setHiitTimerVisible(false);
    setPilatesTimerVisible(false);
    setSelectedExercise(null);
  };

  const handleTimerClose = () => {
    setTimerModalVisible(false);
    setCardioTimerVisible(false);
    setHiitTimerVisible(false);
    setPilatesTimerVisible(false);
    setSelectedExercise(null);
  };

  const handleDetailsClose = () => {
    setExerciseDetailsModalVisible(false);
    setSelectedExercise(null);
  };

  const renderMenuItem = (exercise: any) => {
    const IconComponent = getExerciseIcon(exercise);
    const color = getExerciseColor(exercise);
    
    return (
      <TouchableOpacity
        key={exercise.id}
        style={styles.menuCard}
        onPress={() => handleExercisePress(exercise.id)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.image }} 
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {exercise.titre}
          </Text>
          
          <Text style={[styles.cardSubtitle, { color: color }]}>
            {exercise.duree} min • {exercise.calories || 'N/A'} cal
          </Text>
        </View>

        {/* Bouton de démarrage rapide */}
        <TouchableOpacity 
          style={[styles.quickStartButton, { backgroundColor: color }]}
          onPress={(e) => {
            e.stopPropagation();
            handleExercisePress(exercise.id);
          }}
          activeOpacity={0.8}
        >
          <Play size={18} color={Colors.textLight} fill={Colors.textLight} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView 
        style={[
          styles.container,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🏃‍♀️ Activités Sportives</Text>
          <Text style={styles.headerSubtitle}>
            Cliquez sur ▶️ pour démarrer directement !
          </Text>
        </View>

        {/* Message d'adaptation au niveau */}
        <View style={styles.adaptationMessage}>
          <Target size={24} color={Colors.agpGreen} />
          <View style={styles.adaptationContent}>
            <Text style={styles.adaptationTitle}>Adaptez à votre niveau</Text>
            <Text style={styles.adaptationText}>
              Tous les exercices peuvent être adaptés à votre niveau. Commencez doucement et progressez à votre rythme.
            </Text>
          </View>
        </View>
        
        <View style={styles.grid}>
          {sportsData.exercices.map(renderMenuItem)}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.tipCard}>
            <Flame size={20} color={Colors.agpBlue} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>🎯 Démarrage Rapide</Text>
              <Text style={styles.tipText}>
                Cliquez sur le bouton ▶️ pour lancer directement l'exercice avec timer et suivi automatique !
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>🎯 Progression Intelligente</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>🟢 <Text style={styles.benefitBold}>Débutant</Text> : Réduisez la durée ou l'intensité</Text>
              <Text style={styles.benefitItem}>🟡 <Text style={styles.benefitBold}>Intermédiaire</Text> : Suivez les instructions standards</Text>
              <Text style={styles.benefitItem}>🔴 <Text style={styles.benefitBold}>Avancé</Text> : Augmentez la durée ou l'intensité</Text>
            </View>
          </View>

          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>💪 Restez Motivé(e) !</Text>
            <Text style={styles.motivationText}>
              "Le sport devient un plaisir quand on trouve l'activité qui nous correspond. 
              Testez, amusez-vous, et les résultats suivront naturellement !"
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal d'informations détaillées sur l'exercice */}
      <Modal
        visible={exerciseDetailsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleDetailsClose}
      >
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleDetailsClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.detailsModalTitle}>
              {selectedExercise?.titre || 'Exercice'}
            </Text>
          </View>
          
          {selectedExercise && (
            <ScrollView 
              style={[
                styles.detailsContent,
                Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
              ]}
              showsVerticalScrollIndicator={true}
            >
              {/* Debug info */}
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                  Debug: ID {selectedExercise.id} - {selectedExercise.etapes?.length || 0} étapes
                </Text>
              </View>
              
              {/* Image de l'exercice */}
              <Image 
                source={{ uri: selectedExercise.image }} 
                style={styles.detailsImage}
                resizeMode="cover"
              />
              
              {/* Informations de base */}
              <View style={styles.detailsInfoSection}>
                <View style={styles.detailsInfoRow}>
                  <View style={styles.detailsInfoItem}>
                    <Clock size={20} color={Colors.agpBlue} />
                    <Text style={styles.detailsInfoLabel}>Durée</Text>
                    <Text style={styles.detailsInfoValue}>{selectedExercise.duree} min</Text>
                  </View>
                  
                  <View style={styles.detailsInfoItem}>
                    <Flame size={20} color={Colors.relaxation} />
                    <Text style={styles.detailsInfoLabel}>Calories</Text>
                    <Text style={styles.detailsInfoValue}>{selectedExercise.calories || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailsInfoItem}>
                    <Target size={20} color={Colors.agpGreen} />
                    <Text style={styles.detailsInfoLabel}>Difficulté</Text>
                    <Text style={styles.detailsInfoValue}>{selectedExercise.difficulte}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsTags}>
                  {selectedExercise.tags?.map((tag, index) => (
                    <View key={index} style={styles.detailsTag}>
                      <Text style={styles.detailsTagText}>{tag}</Text>
                    </View>
                  )) || null}
                </View>
              </View>
              
              {/* Description */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Description</Text>
                <Text style={styles.detailsDescription}>
                  {selectedExercise.description || 'Description non disponible'}
                </Text>
              </View>
              
              {/* Étapes */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Comment faire</Text>
                {(selectedExercise.etapes || []).map((etape, index) => (
                  <View key={index} style={styles.detailsStep}>
                    <View style={styles.detailsStepNumber}>
                      <Text style={styles.detailsStepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.detailsStepText}>{etape}</Text>
                  </View>
                ))}
              </View>
              
              {/* Bénéfices */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Bénéfices</Text>
                {(selectedExercise.benefices || []).map((benefice, index) => (
                  <View key={index} style={styles.detailsBenefit}>
                    <View style={styles.detailsBenefitBullet} />
                    <Text style={styles.detailsBenefitText}>{benefice}</Text>
                  </View>
                ))}
              </View>
              
              {/* Moments idéaux et fréquence */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Quand pratiquer</Text>
                <View style={styles.detailsInfoBox}>
                  <View style={styles.detailsInfoBoxRow}>
                    <Clock size={18} color={Colors.agpBlue} />
                    <Text style={styles.detailsInfoBoxLabel}>Moments idéaux :</Text>
                    <Text style={styles.detailsInfoBoxValue}>
                      {selectedExercise.momentIdeal?.join(', ') || 'Non spécifié'}
                    </Text>
                  </View>
                  <View style={styles.detailsInfoBoxRow}>
                    <Trophy size={18} color={Colors.agpGreen} />
                    <Text style={styles.detailsInfoBoxLabel}>Fréquence :</Text>
                    <Text style={styles.detailsInfoBoxValue}>
                      {selectedExercise.frequence || 'Non spécifiée'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Bouton de démarrage */}
              <TouchableOpacity
                style={styles.startExerciseButton}
                onPress={handleStartExercise}
                activeOpacity={0.8}
              >
                <Play size={24} color={Colors.textLight} />
                <Text style={styles.startExerciseButtonText}>
                  Démarrer l'exercice ({selectedExercise.duree} min)
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Modal Timer pour les exercices sportifs */}
      <Modal
        visible={timerModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerClose}
      >
        <View style={styles.timerModalContainer}>
          <View style={styles.timerModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleTimerClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.timerModalTitle}>
              {selectedExercise?.titre || 'Exercice'}
            </Text>
          </View>
          
          {selectedExercise && (
            <SportExerciseTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Cardio spécialisé */}
      <Modal
        visible={cardioTimerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerClose}
      >
        <View style={styles.timerModalContainer}>
          <View style={styles.timerModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleTimerClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.timerModalTitle}>
              {selectedExercise?.titre || 'Cardio Brûle-Graisse'}
            </Text>
          </View>
          
          {selectedExercise && (
            <CardioTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer HIIT spécialisé */}
      <Modal
        visible={hiitTimerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerClose}
      >
        <View style={styles.timerModalContainer}>
          <View style={styles.timerModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleTimerClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.timerModalTitle}>
              {selectedExercise?.titre || 'HIIT Intensif'}
            </Text>
          </View>
          
          {selectedExercise && (
            <HIITTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Pilates spécialisé */}
      <Modal
        visible={pilatesTimerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerClose}
      >
        <View style={styles.timerModalContainer}>
          <View style={styles.timerModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleTimerClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.timerModalTitle}>
              {selectedExercise?.titre || 'Pilates Minceur'}
            </Text>
          </View>
          
          {selectedExercise && (
            <PilatesTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Yoga spécialisé */}
      <Modal
        visible={yogaTimerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerClose}
      >
        <View style={styles.timerModalContainer}>
          <View style={styles.timerModalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={handleTimerClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.timerModalTitle}>
              {selectedExercise?.titre || 'Yoga Dynamique'}
            </Text>
          </View>
          
          {selectedExercise && (
            <YogaTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  adaptationMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  adaptationContent: {
    flex: 1,
    marginLeft: 12,
  },
  adaptationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  adaptationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  menuCard: {
    width: cardSize,
    height: cardSize + 30,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    height: cardSize * 0.65,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 4,
    minHeight: 32,
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    fontWeight: '600',
  },
  quickStartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  footer: {
    padding: 16,
    gap: 16,
    marginTop: 8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  benefitBold: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  motivationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.relaxation,
  },
  motivationTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  // Styles pour la modal de détails
  detailsModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  detailsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  detailsModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  detailsContent: {
    flex: 1,
    padding: 16,
  },
  debugInfo: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.agpBlue,
  },
  detailsImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailsInfoSection: {
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
  detailsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailsInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailsInfoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  detailsInfoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  detailsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailsTag: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  detailsTagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  detailsStep: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailsStepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.agpBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  detailsStepNumberText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  detailsStepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  detailsBenefit: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  detailsBenefitBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.agpGreen,
    marginRight: 12,
  },
  detailsBenefitText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  detailsInfoBox: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailsInfoBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsInfoBoxLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  detailsInfoBoxValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  startExerciseButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
    marginBottom: 40,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  startExerciseButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  timerModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  timerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timerModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
});