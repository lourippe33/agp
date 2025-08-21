import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LineChart } from 'react-native-chart-kit';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface ChartModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: Array<{ date: string; value: number }>;
  unit: string;
  color: string;
}

const screenWidth = Dimensions.get('window').width;

export default function ChartModal({ visible, onClose, title, data, unit, color }: ChartModalProps) {
  if (data.length < 2) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Pas assez de données pour afficher une courbe.
                {'\n'}Ajoutez au moins 2 mesures pour voir l'évolution.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const chartData = {
    labels: data.slice(-6).map(item => {
      const date = new Date(item.date.split('/').reverse().join('-'));
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: data.slice(-6).map(item => item.value),
        color: () => color,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: color,
    },
  };

  if (data.length < 2) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Pas assez de données pour afficher une courbe.
                {'\n'}Ajoutez au moins 2 mesures pour voir l'évolution.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  const chartData = {
    labels: data.slice(-6).map(item => {
      const date = new Date(item.date.split('/').reverse().join('-'));
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: data.slice(-6).map(item => item.value),
        color: () => color,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: color,
    },
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Première mesure</Text>
              <Text style={styles.statValue}>{data[0].value} {unit}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dernière mesure</Text>
              <Text style={styles.statValue}>{data[data.length - 1].value} {unit}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Évolution</Text>
              <Text style={[
                styles.statValue,
                { color: data[data.length - 1].value < data[0].value ? Colors.success : Colors.error }
              ]}>
                {(data[data.length - 1].value - data[0].value).toFixed(1)} {unit}
              </Text>
            </View>
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Première mesure</Text>
              <Text style={styles.statValue}>{data[0].value} {unit}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dernière mesure</Text>
              <Text style={styles.statValue}>{data[data.length - 1].value} {unit}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Évolution</Text>
              <Text style={[
                styles.statValue,
                { color: data[data.length - 1].value < data[0].value ? Colors.success : Colors.error }
              ]}>
                {(data[data.length - 1].value - data[0].value).toFixed(1)} {unit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: screenWidth - 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  noDataContainer: {
    alignItems: 'center',
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
});