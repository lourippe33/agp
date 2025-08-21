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
  Heart, 
  Zap, 
  Brain, 
  Smile,
  Clock,
  Target,
  Calendar,
  Users,
  Wind,
  Sparkles,
  Coffee,
  Moon,
  Play,
  X
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import ExerciseTimer from './ExerciseTimer';
import BreathingTimer from './BreathingTimer';
import exercisesData from '@/data/exercices_detente.json';

// Composant séparé pour chaque élément du menu
interface ExerciseMenuItemProps {
  item: typeof menuItems[0];
  onPress: (exerciseId: number) => void;
}

function ExerciseMenuItem({ item, onPress }: ExerciseMenuItemProps) {
  const IconComponent = item.icon;
  const [cardAnimation] = useState(new Animated.Value(0));
  
  // Effet de clic avec animation
  const animateCardClick = () => {
    // Animation : 0 → 1 → 0 en 500ms
    Animated.sequence([
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(cardAnimation, {
        toValue: 0,
        duration: 450,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handlePress = () => {
    animateCardClick();
    onPress(item.id);
  };

  // Interpolation de couleur pour l'effet de clic
  const animatedBackgroundColor = cardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.surface, '#F5F5F5'] // Blanc → Gris clair
  });
  
  return (
    <Animated.View
      style={[
        styles.menuCard,
        { backgroundColor: animatedBackgroundColor }
      ]}
    >
      <TouchableOpacity
        style={styles.cardTouchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.cardSubtitle, { color: item.color }]}>
          {item.subtitle}
        </Text>
      </View>

      {/* Bouton de démarrage rapide */}
      <TouchableOpacity 
        style={[styles.quickStartButton, { backgroundColor: item.color }]}
        onPress={(e) => {
          e.stopPropagation();
          onPress(item.id);
        }}
        activeOpacity={0.8}
      >
        <Play size={16} color={Colors.textLight} fill={Colors.textLight} />
      </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ExerciseMenuGridProps {
  onExerciseSelect: (exerciseId: number) => void;
  filteredExercises?: any[];
}

const { width } = Dimensions.get('window');
const cardSize = (width - 64) / 3; // 3 colonnes avec marges

const menuItems = [
  {
    id: 1,
    title: "Cohérence Cardiaque",
    subtitle: "5 min",
    icon: Heart,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E8E'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: "Respiration Sourire",
    subtitle: "2 min",
    icon: Smile,
    color: '#4A90E2',
    gradient: ['#4A90E2', '#6BA3E8'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    title: "Massage Mains",
    subtitle: "3 min",
    icon: Target,
    color: '#9C27B0',
    gradient: ['#9C27B0', '#B852C7'],
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 9,
    title: "Gratitude Express",
    subtitle: "2 min",
    icon: Sparkles,
    color: '#7CB342',
    gradient: ['#7CB342', '#9BC86A'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: "Étirements Assis",
    subtitle: "5 min",
    icon: Users,
    color: '#FF9800',
    gradient: ['#FF9800', '#FFB74D'],
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    title: "Respiration Ventre",
    subtitle: "4 min",
    icon: Wind,
    color: '#00BCD4',
    gradient: ['#00BCD4', '#4DD0E1'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 10,
    title: "Relaxation Express",
    subtitle: "3 min",
    icon: Clock,
    color: '#E91E63',
    gradient: ['#E91E63', '#F06292'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 12,
    title: "Méditation Thé",
    subtitle: "5 min",
    icon: Coffee,
    color: '#795548',
    gradient: ['#795548', '#A1887F'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: "5 Sens",
    subtitle: "5 min",
    icon: Brain,
    color: '#607D8B',
    gradient: ['#607D8B', '#90A4AE'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 7,
    title: "Lieu Paisible",
    subtitle: "6 min",
    icon: Calendar,
    color: '#8BC34A',
    gradient: ['#8BC34A', '#AED581'],
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 11,
    title: "Respiration 2-4",
    subtitle: "3 min",
    icon: Moon,
    color: '#3F51B5',
    gradient: ['#3F51B5', '#7986CB'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 8,
    title: "Marche Consciente",
    subtitle: "4 min",
    icon: Zap,
    color: '#FF5722',
    gradient: ['#FF5722', '#FF8A65'],
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function ExerciseMenuGrid({ onExerciseSelect, filteredExercises }: ExerciseMenuGridProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [breathingTimerVisible, setBreathingTimerVisible] = useState(false);

  // Utiliser les exercices filtrés ou tous les exercices par défaut
  const exercisesToShow = filteredExercises || exercisesData.exercices;

  const handleExercisePress = (exerciseId: number) => {
    // Trouver l'exercice dans les données
    const exercise = exercisesData.exercices.find(ex => ex.id === exerciseId);
    if (exercise && exercise.id) {
      setSelectedExercise(exercise);
      
      // Utiliser le timer spécialisé pour les exercices de respiration
      if (exercise.type === 'respiration') {
        setBreathingTimerVisible(true);
      } else {
        setTimerModalVisible(true);
      }
    } else {
      // Fallback vers la sélection normale
      onExerciseSelect(exerciseId);
    }
  };

  const handleTimerComplete = () => {
    setTimerModalVisible(false);
    setBreathingTimerVisible(false);
    setSelectedExercise(null);
  };

  const handleTimerClose = () => {
    setTimerModalVisible(false);
    setBreathingTimerVisible(false);
    setSelectedExercise(null);
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
          <Text style={styles.headerTitle}>Exercices de Détente</Text>
          <Text style={styles.headerSubtitle}>
            Cliquez sur ▶️ pour démarrer directement !
          </Text>
        </View>
        
        {filteredExercises ? (
          // Mode recherche : afficher les résultats filtrés
          <View style={styles.searchResultsGrid}>
            {exercisesToShow.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.searchResultCard}
                onPress={() => handleExercisePress(exercise.id)}
                activeOpacity={0.9}
              >
                <Text style={styles.searchResultTitle}>{exercise.titre}</Text>
                <Text style={styles.searchResultDuration}>{exercise.duree} min</Text>
                <Text style={styles.searchResultType}>{exercise.type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Mode normal : afficher le menu par défaut
          <View style={styles.grid}>
            {menuItems.map((item) => (
              <ExerciseMenuItem
                key={item.id}
                item={item}
                onPress={handleExercisePress}
              />
            ))}
          </View>
        )}
        
        {filteredExercises && exercisesToShow.length === 0 && (
          <View style={styles.emptySearchState}>
            <Text style={styles.emptySearchTitle}>Aucun exercice trouvé</Text>
            <Text style={styles.emptySearchText}>
              Essayez avec d'autres mots-clés
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.tipCard}>
            <Heart size={20} color={Colors.relaxation} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>🎯 Démarrage Rapide</Text>
              <Text style={styles.tipText}>
                Cliquez sur le bouton ▶️ pour lancer directement l'exercice avec timer automatique !
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>🌟 Bénéfices immédiats</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>• Réduction du stress</Text>
              <Text style={styles.benefitItem}>• Amélioration de la digestion</Text>
              <Text style={styles.benefitItem}>• Meilleur sommeil</Text>
              <Text style={styles.benefitItem}>• Humeur positive</Text>
            </View>
          </View>

          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>🧘‍♀️ Restez Zen !</Text>
            <Text style={styles.motivationText}>
              "La détente n'est pas un luxe, c'est une nécessité. Prenez quelques minutes pour vous reconnecter à votre bien-être intérieur."
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal Timer pour les exercices de détente */}
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
              {selectedExercise?.titre || 'Exercice de détente'}
            </Text>
          </View>
          
          {selectedExercise && (
            <ExerciseTimer
              exercise={selectedExercise}
              onComplete={handleTimerComplete}
              onClose={handleTimerClose}
            />
          )}
        </View>
      </Modal>

      {/* Modal Timer Respiration spécialisé */}
      <Modal
        visible={breathingTimerVisible}
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
              {selectedExercise?.titre || 'Exercice de respiration'}
            </Text>
          </View>
          
          {selectedExercise && (
            <BreathingTimer
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  menuCard: {
    width: cardSize,
    height: cardSize + 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 12,
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
  iconOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    borderLeftColor: Colors.relaxation,
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
    gap: 6,
  },
  benefitItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
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
  searchResultsGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  searchResultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  searchResultTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  searchResultDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.agpBlue,
    marginBottom: 2,
  },
  searchResultType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  emptySearchState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptySearchTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySearchText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
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
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  timerModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
});