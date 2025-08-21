import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { TrendingUp, Scale, Target } from 'lucide-react-native';

interface MeasurementData {
  date: string;
  weight: number;
  waist: number;
  hips: number;
  arms: number;
}

interface CurrentMeasurements {
  weight: number;
  waist: number;
  hips: number;
  arms: number;
  targetWeight: number;
}

interface MeasurementChartsProps {
  currentMeasurements: CurrentMeasurements;
  measurementData: MeasurementData[];
}

export default function MeasurementCharts({ 
  currentMeasurements, 
  measurementData 
}: MeasurementChartsProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  const renderProgressCard = (
    title: string,
    current: number,
    unit: string,
    icon: any,
    color: string
  ) => (
    <View style={[styles.progressCard, { borderLeftColor: color }]}>
      <View style={styles.progressHeader}>
        {React.createElement(icon, { size: 20, color })}
        <Text style={styles.progressTitle}>{title}</Text>
      </View>
      <Text style={[styles.progressValue, { color }]}>
        {current} {unit}
      </Text>
      <Text style={styles.progressSubtext}>
        Valeur actuelle
      </Text>
    </View>
  );

  const renderSimpleChart = (title: string, value: number, color: string) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartPlaceholder}>
        <View style={[styles.chartBar, { backgroundColor: color, width: '60%' }]} />
        <Text style={styles.chartValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Message d'information */}
      <View style={styles.infoCard}>
        <TrendingUp size={24} color={Colors.agpBlue} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Suivi de vos progrès</Text>
          <Text style={styles.infoText}>
            Vos courbes d'évolution s'enrichiront au fur et à mesure de vos saisies quotidiennes.
          </Text>
        </View>
      </View>

      {/* Cartes de progression actuelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Valeurs actuelles</Text>
        
        <View style={styles.progressGrid}>
          {renderProgressCard(
            'Poids',
            currentMeasurements.weight,
            'kg',
            Scale,
            Colors.agpBlue
          )}
          {renderProgressCard(
            'Tour de taille',
            currentMeasurements.waist,
            'cm',
            Target,
            Colors.morning
          )}
          {renderProgressCard(
            'Tour de hanche',
            currentMeasurements.hips,
            'cm',
            Target,
            Colors.agpGreen
          )}
          {renderProgressCard(
            'Tour de bras',
            currentMeasurements.arms,
            'cm',
            Target,
            Colors.relaxation
          )}
        </View>
      </View>

      {/* Objectif de poids */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Objectif</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Target size={24} color={Colors.agpGreen} />
            <Text style={styles.goalTitle}>Poids objectif</Text>
          </View>
          <Text style={styles.goalValue}>
            {currentMeasurements.targetWeight} kg
          </Text>
          <Text style={styles.goalProgress}>
            {currentMeasurements.weight > currentMeasurements.targetWeight 
              ? `${(currentMeasurements.weight - currentMeasurements.targetWeight).toFixed(1)} kg à perdre`
              : currentMeasurements.weight < currentMeasurements.targetWeight
              ? `${(currentMeasurements.targetWeight - currentMeasurements.weight).toFixed(1)} kg à prendre`
              : 'Objectif atteint ! 🎉'
            }
          </Text>
        </View>
      </View>

      {/* Graphiques simplifiés */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Évolution (simulation)</Text>
        <Text style={styles.sectionSubtitle}>
          Les graphiques détaillés apparaîtront avec vos données réelles
        </Text>
        
        {renderSimpleChart('Poids', currentMeasurements.weight, Colors.agpBlue)}
        {renderSimpleChart('Tour de taille', currentMeasurements.waist, Colors.morning)}
        {renderSimpleChart('Tour de hanche', currentMeasurements.hips, Colors.agpGreen)}
      </View>

      {/* Message de motivation */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationTitle}>🌟 Conseil</Text>
        <Text style={styles.motivationText}>
          Prenez vos mesures une fois par semaine, toujours dans les mêmes conditions (même heure, même tenue) pour un suivi précis de votre évolution.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  infoText: {
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  progressGrid: {
    gap: 12,
  },
  progressCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  progressValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  progressSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  goalCard: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  goalValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpGreen,
    marginBottom: 8,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 60,
    backgroundColor: Colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  chartBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  motivationCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
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
  },
});