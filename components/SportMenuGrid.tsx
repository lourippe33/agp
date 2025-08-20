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
  Animated,
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
import YogaTimer from './YogaTimer';
import TabataTimer from './TabataTimer';
import YogaDouxTimer from './YogaDouxTimer';
import CircuitTrainingTimer from './CircuitTrainingTimer';
import StretchingTimer from './StretchingTimer';
import AbdosCardioTimer from './AbdosCardioTimer';
import CardioFunTimer from './CardioFunTimer';
import YogaBruleCalmTimer from './YogaBruleCalmTimer';
import ChaiseTimer from './ChaiseTimer';
import MarcheBrasTimer from './MarcheBrasTimer';
import sportsData from '@/data/exercices_sport.json';

interface SportMenuGridProps {
  onExerciseSelect: (exerciseId: number) => void;
  filteredExercises?: any[];
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
  const [cardAnimations, setCardAnimations] = useState<{[key: number]: Animated.Value}>({});
  const [cardioTimerVisible, setCardioTimerVisible] = useState(false);
  const [hiitTimerVisible, setHiitTimerVisible] = useState(false);
  const [pilatesTimerVisible, setPilatesTimerVisible] = useState(false);
  const [yogaTimerVisible, setYogaTimerVisible] = useState(false);
  const [tabataTimerVisible, setTabataTimerVisible] = useState(false);
  const [yogaDouxTimerVisible, setYogaDouxTimerVisible] = useState(false);
  const [circuitTrainingTimerVisible, setCircuitTrainingTimerVisible] = useState(false);
  const [stretchingTimerVisible, setStretchingTimerVisible] = useState(false);
  const [abdosCardioTimerVisible, setAbdosCardioTimerVisible] = useState(false);
  const [cardioFunTimerVisible, setCardioFunTimerVisible] = useState(false);
  const [yogaBruleCalmTimerVisible, setYogaBruleCalmTimerVisible] = useState(false);
  const [chaiseTimerVisible, setChaiseTimerVisible] = useState(false);
  const [marcheBrasTimerVisible, setMarcheBrasTimerVisible] = useState(false);

  // Utiliser les exercices filtrés ou tous les exercices par défaut
  const exercisesToShow = filteredExercises || sportsData.exercices;

  console.log('🔍 Données exercices sport chargées:', exercisesToShow.length, 'exercices');

  // Initialiser les animations pour chaque exercice
  const getCardAnimation = (exerciseId: number) => {
    if (!cardAnimations[exerciseId]) {
      setCardAnimations(prev => ({
        ...prev,
        [exerciseId]: new Animated.Value(0)
      }));
      return new Animated.Value(0);
    }
    return cardAnimations[exerciseId];
  };

  // Effet de clic avec animation
  const animateCardClick = (exerciseId: number) => {
    const animation = getCardAnimation(exerciseId);
    
    // Animation : 0 → 1 → 0 en 500ms
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 450,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleExercisePress = (exerciseId: number) => {
    // Déclencher l'animation de feedback
    animateCardClick(exerciseId);
    
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
      } else if (selectedExercise.id === 21 || selectedExercise.id === 22) { // Mini Tabata Doux et Mini Tabata
        setTabataTimerVisible(true);
      } else if (selectedExercise.id === 23) { // Yoga doux perte de poids
        setYogaDouxTimerVisible(true);
      } else if (selectedExercise.id === 14) { // Circuit Training Maison
        setCircuitTrainingTimerVisible(true);
      } else if (selectedExercise.id === 10) { // Stretching Actif
        setStretchingTimerVisible(true);
      } else if (selectedExercise.id === 28) { // Abdos + Cardio Express
        setAbdosCardioTimerVisible(true);
      } else if (selectedExercise.id === 26) { // Cardio Fun Sans Saut
        setCardioFunTimerVisible(true);
      } else if (selectedExercise.id === 27) { // Yoga Brûle-Calm (Flow 15')
        setYogaBruleCalmTimerVisible(true);
      } else if (selectedExercise.id === 24) { // Chaise Brûle-Graisse
        setChaiseTimerVisible(true);
      } else if (selectedExercise.id === 25) { // Marche + Bras Actifs
        setMarcheBrasTimerVisible(true);
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
    setYogaTimerVisible(false);
    setTabataTimerVisible(false);
    setYogaDouxTimerVisible(false);
    setCircuitTrainingTimerVisible(false);
    setStretchingTimerVisible(false);
    setAbdosCardioTimerVisible(false);
    setCardioFunTimerVisible(false);
    setYogaBruleCalmTimerVisible(false);
    setChaiseTimerVisible(false);
    setMarcheBrasTimerVisible(false);
    setSelectedExercise(null);
  };

  const handleTimerClose = () => {
    setTimerModalVisible(false);
    setCardioTimerVisible(false);
    setHiitTimerVisible(false);
    setPilatesTimerVisible(false);
    setYogaTimerVisible(false);
    setTabataTimerVisible(false);
    setYogaDouxTimerVisible(false);
    setCircuitTrainingTimerVisible(false);
    setStretchingTimerVisible(false);
    setAbdosCardioTimerVisible(false);
    setCardioFunTimerVisible(false);
    setYogaBruleCalmTimerVisible(false);
    setChaiseTimerVisible(false);
    setMarcheBrasTimerVisible(false);
    setSelectedExercise(null);
  };

  const handleDetailsClose = () => {
    setExerciseDetailsModalVisible(false);
    setSelectedExercise(null);
  };

  const renderMenuItem = (exercise: any) => {
    const IconComponent = getExerciseIcon(exercise);
    const color = getExerciseColor(exercise);
    const cardAnimation = getCardAnimation(exercise.id);
    
    // Interpolation de couleur pour l'effet de clic
    const animatedBackgroundColor = cardAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.surface, '#F5F5F5'] // Blanc → Gris clair
    });
    
    return (
      <Animated.View
        key={exercise.id}
        style={[
          styles.menuCard,
          { backgroundColor: animatedBackgroundColor }
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => handleExercisePress(exercise.id)}
          activeOpacity={0.9}
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
      </Animated.View>
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
          {exercisesToShow.map(renderMenuItem)}
        </View>
        
        {exercisesToShow.length === 0 && (
          <View style={styles.emptyState}>
            <Dumbbell size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>Aucun exercice trouvé</Text>
            <Text style={styles.emptyStateText}>
              Essayez de modifier vos critères de recherche ou vos filtres
            </Text>
          </View>
        )}

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

      {/* Modal Timer Tabata spécialisé */}
      <Modal
        visible={tabataTimerVisible}
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
              {selectedExercise?.titre || 'Tabata'}
            </Text>
          </View>
          
          {selectedExercise && (
            <TabataTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Yoga Doux spécialisé */}
      <Modal
        visible={yogaDouxTimerVisible}
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
              {selectedExercise?.titre || 'Yoga Doux Perte de Poids'}
            </Text>
          </View>
          
          {selectedExercise && (
            <YogaDouxTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Circuit Training spécialisé */}
      <Modal
        visible={circuitTrainingTimerVisible}
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
              {selectedExercise?.titre || 'Circuit Training Maison'}
            </Text>
          </View>
          
          {selectedExercise && (
            <CircuitTrainingTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Stretching spécialisé */}
      <Modal
        visible={stretchingTimerVisible}
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
              {selectedExercise?.titre || 'Stretching Actif'}
            </Text>
          </View>
          
          {selectedExercise && (
            <StretchingTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Abdos + Cardio spécialisé */}
      <Modal
        visible={abdosCardioTimerVisible}
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
              {selectedExercise?.titre || 'Abdos + Cardio Express'}
            </Text>
          </View>
          
          {selectedExercise && (
            <AbdosCardioTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Cardio Fun spécialisé */}
      <Modal
        visible={cardioFunTimerVisible}
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
              {selectedExercise?.titre || 'Cardio Fun Sans Saut'}
            </Text>
          </View>
          
          {selectedExercise && (
            <CardioFunTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Yoga Brûle-Calm spécialisé */}
      <Modal
        visible={yogaBruleCalmTimerVisible}
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
              {selectedExercise?.titre || 'Yoga Brûle-Calm'}
            </Text>
          </View>
          
          {selectedExercise && (
            <YogaBruleCalmTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Chaise spécialisé */}
      <Modal
        visible={chaiseTimerVisible}
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
              {selectedExercise?.titre || 'Chaise Brûle-Graisse'}
            </Text>
          </View>
          
          {selectedExercise && (
            <ChaiseTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Marche + Bras spécialisé */}
      <Modal
        visible={marcheBrasTimerVisible}
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
              {selectedExercise?.titre || 'Marche + Bras Actifs'}
            </Text>
          </View>
          
          {selectedExercise && (
            <MarcheBrasTimer
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
    gap: 20,
  },
  menuCard: {
    width: cardSize,
    height: cardSize + 50,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageContainer: {
    height: cardSize * 0.6,
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
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
    minHeight: 40,
  },
  cardSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});