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
  Zap, 
  Heart, 
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
  X,
  Activity,
  TrendingUp,
  Flame,
  Trophy,
  Star,
  Timer
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Exercise } from '@/types/Exercise';
import SportExerciseTimer from './SportExerciseTimer';
import sportsData from '@/data/exercices_sport.json';

// Debug: Vérifier le chargement des données
console.log('🔍 Données exercices sport chargées:', sportsData.exercices.length, 'exercices');
console.log('🎯 Exercice ID 14:', sportsData.exercices.find(ex => ex.id === 14));

interface SportMenuGridProps {
  onExerciseSelect: (exerciseId: number) => void;
}

const { width } = Dimensions.get('window');
const cardSize = (width - 64) / 2;

// Combinaison de tous les exercices sans filtrage par niveau
const menuItems = [
  // Exercices débutants
  {
    id: 1,
    title: "Marche Active",
    subtitle: "15 min • 80 cal",
    icon: Users,
    color: '#4CAF50',
    gradient: ['#4CAF50', '#81C784'],
    image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: "Danse Fitness",
    subtitle: "25 min • 120 cal",
    icon: Heart,
    color: '#E91E63',
    gradient: ['#E91E63', '#F06292'],
    image: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 6,
    title: "Aqua Fitness",
    subtitle: "35 min • 140 cal",
    icon: Zap,
    color: '#00BCD4',
    gradient: ['#00BCD4', '#4DD0E1'],
    image: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 8,
    title: "Pilates Minceur",
    subtitle: "28 min • 90 cal",
    icon: Star,
    color: '#607D8B',
    gradient: ['#607D8B', '#90A4AE'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 10,
    title: "Stretching Actif",
    subtitle: "20 min • 60 cal",
    icon: Timer,
    color: '#8BC34A',
    gradient: ['#8BC34A', '#AED581'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Nouveaux exercices
  {
    id: 13,
    title: "Marche active sur place",
    subtitle: "10 min • 50 cal",
    icon: Activity,
    color: '#4CAF50',
    gradient: ['#4CAF50', '#81C784'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 14,
    title: "Circuit cardio débutant",
    subtitle: "12 min • 70 cal",
    icon: Target,
    color: '#FF9800',
    gradient: ['#FF9800', '#FFB74D'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 15,
    title: "Montées de genoux + talons-fesses",
    subtitle: "6 min • 40 cal",
    icon: TrendingUp,
    color: '#9C27B0',
    gradient: ['#9C27B0', '#BA68C8'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 16,
    title: "Renforcement bas du corps",
    subtitle: "15 min • 80 cal",
    icon: Dumbbell,
    color: '#FF5722',
    gradient: ['#FF5722', '#FF8A65'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 17,
    title: "Gainage facile",
    subtitle: "8 min • 45 cal",
    icon: Star,
    color: '#607D8B',
    gradient: ['#607D8B', '#90A4AE'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 18,
    title: "Danse libre",
    subtitle: "12 min • 90 cal",
    icon: Smile,
    color: '#E91E63',
    gradient: ['#E91E63', '#F06292'],
    image: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 19,
    title: "Montée de marche ou escaliers",
    subtitle: "10 min • 75 cal",
    icon: TrendingUp,
    color: '#3F51B5',
    gradient: ['#3F51B5', '#7986CB'],
    image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 20,
    title: "Stretching actif",
    subtitle: "8 min • 30 cal",
    icon: Wind,
    color: '#8BC34A',
    gradient: ['#8BC34A', '#AED581'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 21,
    title: "Mini Tabata",
    subtitle: "8 min • 85 cal",
    icon: Flame,
    color: '#FF5722',
    gradient: ['#FF5722', '#FF8A65'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 22,
    title: "Yoga doux perte de poids",
    subtitle: "20 min • 70 cal",
    icon: Heart,
    color: '#9C27B0',
    gradient: ['#9C27B0', '#BA68C8'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  // Exercices plus avancés
  {
    id: 2,
    title: "Circuit Training",
    subtitle: "20 min • 150 cal",
    icon: Dumbbell,
    color: '#FF9800',
    gradient: ['#FF9800', '#FFB74D'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    title: "Yoga Dynamique",
    subtitle: "30 min • 100 cal",
    icon: Target,
    color: '#9C27B0',
    gradient: ['#9C27B0', '#BA68C8'],
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 7,
    title: "Boxe Fitness",
    subtitle: "25 min • 180 cal",
    icon: Trophy,
    color: '#FF5722',
    gradient: ['#FF5722', '#FF8A65'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 11,
    title: "Zumba Party",
    subtitle: "35 min • 160 cal",
    icon: Heart,
    color: '#E91E63',
    gradient: ['#E91E63', '#F06292'],
    image: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: "HIIT Intensif",
    subtitle: "18 min • 200 cal",
    icon: Flame,
    color: '#F44336',
    gradient: ['#F44336', '#EF5350'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 9,
    title: "Course Fractionné",
    subtitle: "22 min • 220 cal",
    icon: TrendingUp,
    color: '#3F51B5',
    gradient: ['#3F51B5', '#7986CB'],
    image: 'https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 12,
    title: "Bootcamp",
    subtitle: "30 min • 250 cal",
    icon: Flame,
    color: '#F44336',
    gradient: ['#F44336', '#EF5350'],
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function SportMenuGrid({ onExerciseSelect }: SportMenuGridProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [exerciseDetailsModalVisible, setExerciseDetailsModalVisible] = useState(false);

  const handleExercisePress = (exerciseId: number) => {
    // Trouver l'exercice dans les données
    const exercise = sportsData.exercices.find(ex => ex.id === exerciseId);
    if (exercise && exercise.id) {
      setSelectedExercise(exercise);
      setExerciseDetailsModalVisible(true);
    } else {
      // Fallback vers la sélection normale
      onExerciseSelect(exerciseId);
    }
  };

  const handleStartExercise = () => {
    if (selectedExercise) {
      setExerciseDetailsModalVisible(false);
      setTimerModalVisible(true);
    }
  };

  const handleTimerComplete = () => {
    setTimerModalVisible(false);
    setSelectedExercise(null);
  };

  const handleTimerClose = () => {
    setTimerModalVisible(false);
    setSelectedExercise(null);
  };

  const handleDetailsClose = () => {
    setExerciseDetailsModalVisible(false);
    setSelectedExercise(null);
  };

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuCard}
        onPress={() => handleExercisePress(item.id)}
        activeOpacity={0.8}
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
            handleExercisePress(item.id);
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              Tous les exercices peuvent être adaptés à votre niveau. Commencez doucement et progressez à votre rythme. L'important est de rester régulier et de respecter vos limites.
            </Text>
          </View>
        </View>
        
        <View style={styles.grid}>
          {menuItems.map(renderMenuItem)}
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
                    <Text style={styles.detailsInfoValue}>{selectedExercise.calories}</Text>
                  </View>
                  
                  <View style={styles.detailsInfoItem}>
                    <Target size={20} color={Colors.agpGreen} />
                    <Text style={styles.detailsInfoLabel}>Difficulté</Text>
                    <Text style={styles.detailsInfoValue}>{selectedExercise.difficulte}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsTags}>
                  {selectedExercise.tags.map((tag, index) => (
                    <View key={index} style={styles.detailsTag}>
                      <Text style={styles.detailsTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Message d'adaptation */}
              <View style={styles.adaptationMessageDetails}>
                <Star size={20} color={Colors.agpGreen} />
                <Text style={styles.adaptationMessageText}>
                  Adaptez cet exercice à votre niveau en ajustant l'intensité, la durée ou les répétitions.
                </Text>
              </View>
              
              {/* Description */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Description</Text>
                <Text style={styles.detailsDescription}>{selectedExercise.description}</Text>
              </View>
              
              {/* Étapes */}
              <View style={styles.detailsSection}>
                <Text style={styles.detailsSectionTitle}>Comment faire</Text>
                {selectedExercise.etapes.map((etape, index) => (
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
                {selectedExercise.benefices.map((benefice, index) => (
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
                    <Calendar size={18} color={Colors.agpBlue} />
                    <Text style={styles.detailsInfoBoxLabel}>Moments idéaux :</Text>
                    <Text style={styles.detailsInfoBoxValue}>{selectedExercise.momentIdeal.join(', ')}</Text>
                  </View>
                  <View style={styles.detailsInfoBoxRow}>
                    <Clock size={18} color={Colors.agpGreen} />
                    <Text style={styles.detailsInfoBoxLabel}>Fréquence recommandée :</Text>
                    <Text style={styles.detailsInfoBoxValue}>{selectedExercise.frequence}</Text>
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
  iconOverlay: {
    position: 'absolute',
    bottom: 8,
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
  debugInfo: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.agpBlue,
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
  adaptationMessageDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  adaptationMessageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    lineHeight: 20,
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
});