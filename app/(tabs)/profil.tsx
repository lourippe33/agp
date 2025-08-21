import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Scale, Ruler, Target, TrendingUp, Save } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import AGPLogo from '@/components/AGPLogo';
import { TrackingService } from '@/services/TrackingService';
import { UserProfile } from '@/types/Tracking';
import NotificationSettings from '@/components/NotificationSettings';
import MeasurementCharts from '@/components/MeasurementCharts';

interface ChoiceButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChoiceButton = ({ label, selected, onPress }: ChoiceButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.choiceButton,
      selected && styles.choiceButtonSelected,
    ]}
  >
    <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function SuiviScreen() {
  const [selectedTab, setSelectedTab] = useState<'measurements' | 'charts'>('measurements');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [waist, setWaist] = useState(85);
  const [hips, setHips] = useState(95);
  const [arms, setArms] = useState(30);
  const [thighs, setThighs] = useState(55);
  const [targetWeight, setTargetWeight] = useState(65);
  const [progress, setProgress] = useState('');
  const [shape, setShape] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [measurementData, setMeasurementData] = useState<any[]>([]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadUserProfile();
    loadMeasurementHistory();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await TrackingService.getUserProfile('demo-user');
      if (profile) {
        setHeight(profile.height || 170);
        setWeight(profile.currentWeight || 70);
        setTargetWeight(profile.targetWeight || 65);
        setWaist(profile.waistMeasurement || 85);
        // Charger d'autres mensurations si disponibles
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const loadMeasurementHistory = async () => {
    try {
      // Charger l'historique des 30 derniers jours
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 29);
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const trackings = await TrackingService.getWeeklyTracking('demo-user', startDateStr, endDate);
      
      // Convertir en format pour les graphiques
      const chartData = trackings.map(tracking => ({
        date: tracking.date,
        weight: tracking.weight || weight,
        waist: waist, // À implémenter dans le tracking
        hips: hips,
        arms: arms,
      }));
      
      setMeasurementData(chartData);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const saveMeasurements = async () => {
    try {
      // Sauvegarder le profil utilisateur
      const profile: UserProfile = {
        id: 'demo-user',
        currentWeight: weight,
        targetWeight: targetWeight,
        height: height,
        waistMeasurement: waist,
        startDate: new Date().toISOString().split('T')[0],
      };
      
      await TrackingService.saveUserProfile('demo-user', profile);
      
      // Sauvegarder l'entrée du jour
      const today = new Date().toISOString().split('T')[0];
      const existingTracking = await TrackingService.getDailyTracking('demo-user', today);
      
      const dailyTracking = existingTracking || {
        id: TrackingService.generateId(),
        date: today,
        meals: [
          { id: '1', moment: 'matin', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
          { id: '2', moment: 'midi', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
          { id: '3', moment: 'gouter', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
          { id: '4', moment: 'soir', respected: false, hungerBefore: 3, hungerAfter: 3, satiety: 3 },
        ],
        waterIntake: 0,
        waterIntakeObjective: 8,
        stressLevel: 3,
        energyLevel: 3,
        sleepQuality: 3,
        snackingTemptation: false,
        emotion: '',
      };
      
      // Mettre à jour le poids du jour
      dailyTracking.weight = weight;
      
      await TrackingService.saveDailyTracking('demo-user', dailyTracking);
      
      // Recharger les données
      await loadMeasurementHistory();
      
      setHasUnsavedChanges(false);
      Alert.alert('✅ Sauvegardé', 'Vos mensurations ont été enregistrées !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      Alert.alert('❌ Erreur', 'Impossible de sauvegarder vos données');
    }
  };

  // Marquer les changements non sauvegardés
  const handleMeasurementChange = (setter: (value: number) => void, value: number) => {
    setter(value);
    setHasUnsavedChanges(true);
  };

  // Calcul de l'IMC
  const calculateBMI = () => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Insuffisance pondérale', color: Colors.agpBlue };
    if (bmi < 25) return { text: 'Corpulence normale', color: Colors.agpGreen };
    if (bmi < 30) return { text: 'Surpoids', color: Colors.morning };
    return { text: 'Obésité', color: Colors.relaxation };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmi);

  const TabButton = ({ 
    id, 
    label, 
    icon: IconComponent, 
    isActive 
  }: {
    id: 'measurements' | 'charts';
    label: string;
    icon: any;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={() => setSelectedTab(id)}
      activeOpacity={0.8}
    >
      <IconComponent size={16} color={isActive ? Colors.textLight : Colors.textSecondary} />
      <Text style={[
        styles.tabButtonText,
        isActive && styles.tabButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <AGPLogo size={50} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mon Suivi</Text>
            <Text style={styles.headerSubtitle}>
              Bonjour Utilisateur ! 👋
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Scale size={32} color={Colors.textLight} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={true}
        style={[
          styles.content,
          Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
        ]}
      >
        {/* Onglets */}
        <View style={styles.tabsContainer}>
          <TabButton
            id="measurements"
            label="Mensurations"
            icon={Ruler}
            isActive={selectedTab === 'measurements'}
          />
          <TabButton
            id="charts"
            label="Courbes d'évolution"
            icon={TrendingUp}
            isActive={selectedTab === 'charts'}
          />
        </View>

        {selectedTab === 'measurements' ? (
          <>
            {/* Message de bienvenue */}
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeTitle}>
                Bonjour {user?.firstName || 'Utilisateur'} ! 👋
              </Text>
              <Text style={styles.welcomeText}>
                Renseignez vos mensurations actuelles, puis consultez l'onglet "Courbes d'évolution" pour voir vos progrès !
              </Text>
            </View>

            {/* Section Point de départ */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Mon point de départ</Text>

              {/* Taille */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Ruler size={20} color={Colors.agpBlue} />
                  <Text style={styles.label}>Taille</Text>
                </View>
                <Slider
                  value={height}
                  onValueChange={v => handleMeasurementChange(setHeight, Math.round(v))}
                  minimumValue={140}
                  maximumValue={200}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.agpBlue}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{height} cm</Text>
              </View>

              {/* Poids */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Scale size={20} color={Colors.agpGreen} />
                  <Text style={styles.label}>Poids</Text>
                </View>
                <Slider
                  value={weight}
                  onValueChange={v => handleMeasurementChange(setWeight, Math.round(v))}
                  minimumValue={40}
                  maximumValue={150}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.agpGreen}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{weight} kg</Text>
              </View>

              {/* Tour de taille */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Target size={20} color={Colors.morning} />
                  <Text style={styles.label}>Tour de taille</Text>
                </View>
                <Slider
                  value={waist}
                  onValueChange={v => handleMeasurementChange(setWaist, Math.round(v))}
                  minimumValue={60}
                  maximumValue={140}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.morning}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{waist} cm</Text>
              </View>

              {/* Tour de hanche */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Target size={20} color={Colors.agpGreen} />
                  <Text style={styles.label}>Tour de hanche</Text>
                </View>
                <Slider
                  value={hips}
                  onValueChange={v => handleMeasurementChange(setHips, Math.round(v))}
                  minimumValue={70}
                  maximumValue={150}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.agpGreen}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{hips} cm</Text>
              </View>

              {/* Tour de bras */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Target size={20} color={Colors.relaxation} />
                  <Text style={styles.label}>Tour de bras</Text>
                </View>
                <Slider
                  value={arms}
                  onValueChange={v => handleMeasurementChange(setArms, Math.round(v))}
                  minimumValue={20}
                  maximumValue={50}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.relaxation}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{arms} cm</Text>
              </View>

              {/* Tour de cuisse */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Target size={20} color={Colors.sport} />
                  <Text style={styles.label}>Tour de cuisse</Text>
                </View>
                <Slider
                  value={thighs}
                  onValueChange={v => handleMeasurementChange(setThighs, Math.round(v))}
                  minimumValue={40}
                  maximumValue={80}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.sport}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{thighs} cm</Text>
              </View>

              {/* Poids objectif */}
              <View style={styles.measurementContainer}>
                <View style={styles.measurementHeader}>
                  <Target size={20} color={Colors.agpBlue} />
                  <Text style={styles.label}>Poids objectif</Text>
                </View>
                <Slider
                  value={targetWeight}
                  onValueChange={v => handleMeasurementChange(setTargetWeight, Math.round(v))}
                  minimumValue={40}
                  maximumValue={120}
                  step={1}
                  style={styles.slider}
                  minimumTrackTintColor={Colors.agpBlue}
                  maximumTrackTintColor={Colors.border}
                  thumbStyle={styles.sliderThumb}
                />
                <Text style={styles.valueText}>{targetWeight} kg</Text>
              </View>

              {/* Bouton de sauvegarde */}
              {hasUnsavedChanges && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveMeasurements}
                  activeOpacity={0.8}
                >
                  <Save size={20} color={Colors.textLight} />
                  <Text style={styles.saveButtonText}>
                    Sauvegarder les modifications
                  </Text>
                </TouchableOpacity>
              )}

              {/* Calcul IMC */}
              <View style={styles.bmiContainer}>
                <Text style={styles.bmiTitle}>📊 Votre IMC</Text>
                <View style={styles.bmiCard}>
                  <Text style={styles.bmiValue}>{calculateBMI()}</Text>
                  <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>
                    {bmiCategory.text}
                  </Text>
                </View>
              </View>
            </View>

            {/* Section Évolution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📆 Évolution à 1 mois</Text>

              <View style={styles.evolutionContainer}>
                <Text style={styles.label}>Évolution du poids</Text>
                <View style={styles.choicesRow}>
                  <ChoiceButton 
                    label="📉 J'ai perdu" 
                    selected={progress === 'perdu'} 
                    onPress={() => setProgress('perdu')} 
                  />
                  <ChoiceButton 
                    label="➖ Stable" 
                    selected={progress === 'stable'} 
                    onPress={() => setProgress('stable')} 
                  />
                  <ChoiceButton 
                    label="📈 J'ai repris" 
                    selected={progress === 'repris'} 
                    onPress={() => setProgress('repris')} 
                  />
                </View>

                <Text style={styles.label}>Silhouette</Text>
                <View style={styles.choicesRow}>
                  <ChoiceButton 
                    label="👖 Plus ample" 
                    selected={shape === 'ample'} 
                    onPress={() => setShape('ample')} 
                  />
                  <ChoiceButton 
                    label="🎯 Inchangée" 
                    selected={shape === 'identique'} 
                    onPress={() => setShape('identique')} 
                  />
                  <ChoiceButton 
                    label="📏 Plus serrée" 
                    selected={shape === 'serrée'} 
                    onPress={() => setShape('serrée')} 
                  />
                </View>
              </View>
            </View>

            {/* Conseils personnalisés */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Conseils personnalisés</Text>
              
              {bmi < 18.5 && (
                <View style={styles.tipCard}>
                  <Text style={styles.tipText}>
                    💪 Votre IMC indique une corpulence légère. Concentrez-vous sur une alimentation équilibrée et riche en nutriments.
                  </Text>
                </View>
              )}
              
              {bmi >= 18.5 && bmi < 25 && (
                <View style={styles.tipCard}>
                  <Text style={styles.tipText}>
                    ✅ Excellent ! Votre IMC est dans la norme. Maintenez vos bonnes habitudes alimentaires et votre activité physique.
                  </Text>
                </View>
              )}
              
              {bmi >= 25 && bmi < 30 && (
                <View style={styles.tipCard}>
                  <Text style={styles.tipText}>
                    🎯 Votre IMC indique un léger surpoids. Le programme AGP peut vous aider à retrouver un poids de forme naturellement.
                  </Text>
                </View>
              )}
              
              {bmi >= 30 && (
                <View style={styles.tipCard}>
                  <Text style={styles.tipText}>
                    🌱 Le programme AGP est parfait pour vous ! Suivez les recommandations chronobiologiques pour une perte de poids durable.
                  </Text>
                </View>
              )}

              <View style={styles.motivationCard}>
                <Text style={styles.motivationTitle}>🌟 Restez motivé(e) !</Text>
                <Text style={styles.motivationText}>
                  "Les changements durables prennent du temps. Soyez patient(e) avec vous-même et célébrez chaque petit progrès !"
                </Text>
              </View>
            </View>
          </>
        ) : (
          /* Onglet Courbes d'évolution */
          <MeasurementCharts 
            currentMeasurements={{
              weight,
              waist,
              hips,
              arms,
              targetWeight
            }}
            measurementData={measurementData}
          />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 8,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  headerIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 20,
  },
  measurementContainer: {
    marginBottom: 24,
  },
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
  sliderThumb: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.agpBlue,
  },
  valueText: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  bmiContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bmiTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  bmiCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    marginBottom: 4,
  },
  bmiCategory: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  evolutionContainer: {
    gap: 16,
  },
  choicesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
    gap: 8,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  choiceButtonSelected: {
    backgroundColor: Colors.agpLightBlue,
    borderColor: Colors.agpBlue,
  },
  choiceText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: Colors.text,
    fontSize: 12,
    lineHeight: 16,
  },
  choiceTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
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
  saveButton: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 8,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.agpBlue,
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: Colors.textLight,
  },
});