import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, Ruler, TrendingUp, Calendar, Plus, CreditCard as Edit3, Target, Activity, BarChart3 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import ChartModal from '@/components/ChartModal';

interface WeightEntry {
  date: string;
  weight: number;
  id: string;
}

interface MeasurementEntry {
  date: string;
  waist: number;
  hips: number;
  arms: number;
  thighs: number;
  id: string;
}

interface UserData {
  currentWeight: string;
  targetWeight: string;
  weightHistory: WeightEntry[];
  measurementHistory: MeasurementEntry[];
}

export default function SuiviScreen() {
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState<{
    title: string;
    data: Array<{ date: string; value: number }>;
    unit: string;
    color: string;
  } | null>(null);

  // Charger les données au démarrage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        const userData: UserData = JSON.parse(savedData);
        setCurrentWeight(userData.currentWeight || '');
        setTargetWeight(userData.targetWeight || '');
        setWeightHistory(userData.weightHistory || []);
        setMeasurementHistory(userData.measurementHistory || []);
        
        // Charger les dernières mensurations
        if (userData.measurementHistory && userData.measurementHistory.length > 0) {
          const lastMeasurement = userData.measurementHistory[userData.measurementHistory.length - 1];
          setWaist(lastMeasurement.waist.toString());
          setHips(lastMeasurement.hips.toString());
          setArms(lastMeasurement.arms.toString());
          setThighs(lastMeasurement.thighs.toString());
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (data: UserData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les données');
    }
  };

  const addWeightEntry = async () => {
    if (!currentWeight || isNaN(parseFloat(currentWeight))) {
      Alert.alert('Erreur', 'Veuillez entrer un poids valide');
      return;
    }

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      weight: parseFloat(currentWeight)
    };

    const updatedHistory = [...weightHistory, newEntry];
    setWeightHistory(updatedHistory);

    const userData: UserData = {
      currentWeight,
      targetWeight,
      weightHistory: updatedHistory,
      measurementHistory
    };

    await saveUserData(userData);
    Alert.alert('Succès', 'Poids ajouté à l\'historique !');
  };

  const handleSaveMeasurements = async () => {
    if (!waist || !hips || !arms || !thighs) {
      Alert.alert('Erreur', 'Veuillez remplir toutes les mensurations');
      return;
    }

    const newMeasurement: MeasurementEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      waist: parseFloat(waist),
      hips: parseFloat(hips),
      arms: parseFloat(arms),
      thighs: parseFloat(thighs)
    };

    const updatedMeasurements = [...measurementHistory, newMeasurement];
    setMeasurementHistory(updatedMeasurements);

    const userData: UserData = {
      currentWeight,
      targetWeight,
      weightHistory,
      measurementHistory: updatedMeasurements
    };

    await saveUserData(userData);
    Alert.alert('Succès', 'Vos mensurations ont été sauvegardées !');
  };

  const saveWeightAndTarget = async () => {
    const userData: UserData = {
      currentWeight,
      targetWeight,
      weightHistory,
      measurementHistory
    };
    await saveUserData(userData);
    Alert.alert('Succès', 'Poids et objectif sauvegardés !');
  };

  const calculateStats = () => {
    if (weightHistory.length === 0) {
      return { totalLoss: 0, weeklyChange: 0, remaining: 0 };
    }

    const firstWeight = weightHistory[0].weight;
    const currentWeightNum = parseFloat(currentWeight) || firstWeight;
    const targetWeightNum = parseFloat(targetWeight) || currentWeightNum;
    
    const totalLoss = firstWeight - currentWeightNum;
    const weeklyChange = weightHistory.length > 1 ? 
      weightHistory[weightHistory.length - 2].weight - currentWeightNum : 0;
    const remaining = currentWeightNum - targetWeightNum;

    return { totalLoss, weeklyChange, remaining };
  };

  const showChart = (type: 'weight' | 'waist' | 'hips' | 'arms' | 'thighs') => {
    let data: Array<{ date: string; value: number }> = [];
    let title = '';
    let unit = '';
    let color = Colors.agpBlue;

    switch (type) {
      case 'weight':
        data = weightHistory.map(entry => ({ date: entry.date, value: entry.weight }));
        title = 'Évolution du poids';
        unit = 'kg';
        color = Colors.agpBlue;
        break;
      case 'waist':
        data = measurementHistory.map(entry => ({ date: entry.date, value: entry.waist }));
        title = 'Évolution tour de taille';
        unit = 'cm';
        color = Colors.warning;
        break;
      case 'hips':
        data = measurementHistory.map(entry => ({ date: entry.date, value: entry.hips }));
        title = 'Évolution tour de hanches';
        unit = 'cm';
        color = Colors.success;
        break;
      case 'arms':
        data = measurementHistory.map(entry => ({ date: entry.date, value: entry.arms }));
        title = 'Évolution tour de bras';
        unit = 'cm';
        color = Colors.error;
        break;
      case 'thighs':
        data = measurementHistory.map(entry => ({ date: entry.date, value: entry.thighs }));
        title = 'Évolution tour de cuisse';
        unit = 'cm';
        color = Colors.info;
        break;
    }

    setSelectedChart({ title, data, unit, color });
    setChartModalVisible(true);
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

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
            <Text style={styles.statValue}>
              {stats.totalLoss > 0 ? `-${stats.totalLoss.toFixed(1)}` : stats.totalLoss.toFixed(1)} kg
            </Text>
            <Text style={styles.statLabel}>Perte totale</Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={24} color={Colors.success} />
            <Text style={styles.statValue}>
              {stats.weeklyChange > 0 ? `-${stats.weeklyChange.toFixed(1)}` : stats.weeklyChange.toFixed(1)} kg
            </Text>
            <Text style={styles.statLabel}>Cette semaine</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={24} color={Colors.warning} />
            <Text style={styles.statValue}>{stats.remaining.toFixed(1)} kg</Text>
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
                placeholder="Entrez votre poids"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.weightInput}>
              <Text style={styles.inputLabel}>Objectif (kg)</Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholder="Votre objectif"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.saveWeightButton} onPress={saveWeightAndTarget}>
            <Text style={styles.saveWeightButtonText}>Sauvegarder poids/objectif</Text>
          </TouchableOpacity>
        </View>

        {/* Évolution du poids */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Évolution du poids</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Dernières pesées</Text>
              <View style={styles.chartActions}>
                <TouchableOpacity style={styles.chartButton} onPress={() => showChart('weight')}>
                  <BarChart3 size={16} color={Colors.agpBlue} />
                  <Text style={styles.chartButtonText}>Courbe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={addWeightEntry}>
                  <Plus size={16} color={Colors.agpBlue} />
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.weightHistory}>
              {weightHistory.length === 0 ? (
                <Text style={styles.noDataText}>Aucune pesée enregistrée</Text>
              ) : (
                weightHistory.slice(-5).map((entry, index) => (
                <View key={index} style={styles.weightEntry}>
                  <Text style={styles.weightDate}>{entry.date}</Text>
                  <Text style={styles.weightValue}>{entry.weight} kg</Text>
                  <View style={[
                    styles.weightTrend,
                    { backgroundColor: index > 0 && entry.weight < weightHistory[index-1]?.weight ? Colors.success : Colors.border }
                  ]} />
                </View>
                ))
              )}
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
                  placeholder="Tour de taille"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de hanches (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={hips}
                  onChangeText={setHips}
                  placeholder="Tour de hanches"
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
                  placeholder="Tour de bras"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.measurementInput}>
                <Text style={styles.inputLabel}>Tour de cuisse (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={thighs}
                  onChangeText={setThighs}
                  placeholder="Tour de cuisse"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Historique des mensurations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des mensurations</Text>
            <View style={styles.chartButtonsContainer}>
              <TouchableOpacity 
                style={[styles.miniChartButton, { backgroundColor: Colors.warning + '20' }]} 
                onPress={() => showChart('waist')}
              >
                <BarChart3 size={14} color={Colors.warning} />
                <Text style={[styles.miniChartText, { color: Colors.warning }]}>Taille</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.miniChartButton, { backgroundColor: Colors.success + '20' }]} 
                onPress={() => showChart('hips')}
              >
                <BarChart3 size={14} color={Colors.success} />
                <Text style={[styles.miniChartText, { color: Colors.success }]}>Hanches</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.miniChartButton, { backgroundColor: Colors.error + '20' }]} 
                onPress={() => showChart('arms')}
              >
                <BarChart3 size={14} color={Colors.error} />
                <Text style={[styles.miniChartText, { color: Colors.error }]}>Bras</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.miniChartButton, { backgroundColor: Colors.info + '20' }]} 
                onPress={() => showChart('thighs')}
              >
                <BarChart3 size={14} color={Colors.info} />
                <Text style={[styles.miniChartText, { color: Colors.info }]}>Cuisses</Text>
              </TouchableOpacity>
            </View>
          </View>
          {measurementHistory.length === 0 ? (
            <View style={styles.historyCard}>
              <Text style={styles.noDataText}>Aucune mensuration enregistrée</Text>
            </View>
          ) : (
            measurementHistory.slice(-3).map((measurement, index) => (
              <View key={measurement.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{measurement.date}</Text>
                  <TouchableOpacity>
                    <Edit3 size={16} color={Colors.agpBlue} />
                  </TouchableOpacity>
                </View>
                <View style={styles.historyMeasurements}>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Taille</Text>
                    <Text style={styles.historyValue}>{measurement.waist} cm</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Hanches</Text>
                    <Text style={styles.historyValue}>{measurement.hips} cm</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Bras</Text>
                    <Text style={styles.historyValue}>{measurement.arms} cm</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>Cuisse</Text>
                    <Text style={styles.historyValue}>{measurement.thighs} cm</Text>
                  </View>
                </View>
              </View>
            ))
          )}
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

      {/* Modal des courbes */}
      {selectedChart && (
        <ChartModal
          visible={chartModalVisible}
          onClose={() => setChartModalVisible(false)}
          title={selectedChart.title}
          data={selectedChart.data}
          unit={selectedChart.unit}
          color={selectedChart.color}
        />
      )}
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
  saveWeightButton: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveWeightButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
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
  chartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
  },
  chartButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
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
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: 180,
  },
  miniChartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniChartText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
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