import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, Ruler, TrendingUp, Calendar, Plus, Edit3, Target, Activity } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function SuiviScreen() {
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');

  const handleSaveMeasurements = () => {
    Alert.alert('Succès', 'Vos mensurations ont été sauvegardées !');
  };

  const mockWeightData = [
    { date: '01/01', weight: 75 },
    { date: '08/01', weight: 74.5 },
    { date: '15/01', weight: 74 },
    { date: '22/01', weight: 73.8 },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mon Suivi</Text>
        <Text style={styles.headerSubtitle}>
          Suivez vos progrès et mensurations
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistiques rapides */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Scale size={24} color={Colors.agpBlue} />
            <Text style={styles.statValue}>-1.2 kg</Text>
            <Text style={styles.statLabel}>Perte totale</Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={24} color={Colors.success} />
            <Text style={styles.statValue}>-0.3 kg</Text>
            <Text style={styles.statLabel}>Cette semaine</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={24} color={Colors.warning} />
            <Text style={styles.statValue}>3.8 kg</Text>
            <Text style={styles.statLabel}>Objectif restant</Text>
          </View>
        </View>

        {/* Poids actuel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Poids</Text>
          <View style={styles.weightCard}>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>Poids actuel (kg)</Text>
              <TextInput
                style={styles.input}
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholder="73.8"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>Objectif (kg)</Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholder="70.0"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Évolution du poids */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution du poids</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Dernières pesées</Text>
              <TouchableOpacity style={styles.addButton}>
                <Plus size={16} color={Colors.agpBlue} />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.weightHistory}>
              {mockWeightData.map((entry, index) => (
                <View key={index} style={styles.weightEntry}>
                  <Text style={styles.weightDate}>{entry.date}</Text>
                  <Text style={styles.weightValue}>{entry.weight} kg</Text>
                  <View style={[
                    styles.weightTrend,
                    { backgroundColor: index > 0 && entry.weight < mockWeightData[index-1]?.weight ? Colors.success : Colors.border }
                  ]} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Mensurations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensurations</Text>
          <View style={styles.measurementsCard}>
            <View style={styles.measurementRow}>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de taille (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={waist}
                  onChangeText={setWaist}
                  placeholder="85"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de hanches (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={hips}
                  onChangeText={setHips}
                  placeholder="95"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.measurementRow}>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de bras (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={arms}
                  onChangeText={setArms}
                  placeholder="28"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de cuisse (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={thighs}
                  onChangeText={setThighs}
                  placeholder="55"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Historique des mensurations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des mensurations</Text>
          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>15 Janvier 2024</Text>
              <TouchableOpacity>
                <Edit3 size={16} color={Colors.agpBlue} />
              </TouchableOpacity>
            </View>
            <View style={styles.historyMeasurements}>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Taille</Text>
                <Text style={styles.historyValue}>85 cm</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Hanches</Text>
                <Text style={styles.historyValue}>95 cm</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Bras</Text>
                <Text style={styles.historyValue}>28 cm</Text>
              </View>
              <View style={styles.historyItem}>
                <Text style={styles.historyLabel}>Cuisse</Text>
                <Text style={styles.historyValue}>55 cm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Objectifs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes objectifs</Text>
          <View style={styles.objectivesCard}>
            <View style={styles.objective}>
              <Activity size={20} color={Colors.success} />
              <Text style={styles.objectiveText}>Perdre 5 kg en 3 mois</Text>
              <Text style={styles.objectiveProgress}>60%</Text>
            </View>
            <View style={styles.objective}>
              <Ruler size={20} color={Colors.warning} />
              <Text style={styles.objectiveText}>-5 cm de tour de taille</Text>
              <Text style={styles.objectiveProgress}>40%</Text>
            </View>
          </View>
        </View>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeasurements}>
          <Text style={styles.saveButtonText}>Sauvegarder mes mesures</Text>
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
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
  weightCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weightInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  weightHistory: {
    gap: 12,
  },
  weightEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  weightDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    flex: 1,
  },
  weightValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
  },
  weightTrend: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  measurementsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  measurementRow: {
    flexDirection: 'row',
    gap: 16,
  },
  measurementInput: {
    flex: 1,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyDate: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  historyMeasurements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  historyItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
  },
  historyLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  historyValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  objectivesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  objective: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  objectiveText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    flex: 1,
  },
  objectiveProgress: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.agpBlue,
  },
  saveButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
});