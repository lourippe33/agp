import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Scale, Ruler, Target, TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

interface MeasurementData {
  date: string;
  weight: number;
  waist: number;
  hips: number;
  arms: number;
}

interface MeasurementChartsProps {
  period?: '7d' | '30d' | '90d';
}

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

// Données simulées réalistes pour 30 jours
const generateMockData = (): MeasurementData[] => {
  const data: MeasurementData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 29); // 30 jours en arrière
  
  // Valeurs de départ
  let currentWeight = 75.0;
  let currentWaist = 85.0;
  let currentHips = 95.0;
  let currentArms = 30.0;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Simulation d'une perte de poids progressive avec fluctuations
    const weekProgress = Math.floor(i / 7);
    
    // Poids : perte progressive avec fluctuations quotidiennes
    const weightTrend = -0.05 * i; // Perte de 1.5kg sur 30 jours
    const dailyFluctuation = (Math.random() - 0.5) * 0.4; // ±0.2kg
    currentWeight = Math.max(70, 75 + weightTrend + dailyFluctuation);
    
    // Tour de taille : suit le poids avec un délai
    const waistTrend = -0.03 * i; // Perte de 0.9cm sur 30 jours
    const waistFluctuation = (Math.random() - 0.5) * 0.2;
    currentWaist = Math.max(82, 85 + waistTrend + waistFluctuation);
    
    // Tour de hanche : évolution plus lente
    const hipsTrend = -0.02 * i; // Perte de 0.6cm sur 30 jours
    const hipsFluctuation = (Math.random() - 0.5) * 0.15;
    currentHips = Math.max(93, 95 + hipsTrend + hipsFluctuation);
    
    // Tour de bras : peut augmenter (muscle) ou diminuer (graisse)
    const armsTrend = 0.01 * i; // Légère augmentation (muscle)
    const armsFluctuation = (Math.random() - 0.5) * 0.1;
    currentArms = Math.min(32, 30 + armsTrend + armsFluctuation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round(currentWeight * 10) / 10,
      waist: Math.round(currentWaist * 10) / 10,
      hips: Math.round(currentHips * 10) / 10,
      arms: Math.round(currentArms * 10) / 10,
    });
  }
  
  return data;
};

// Composant de graphique simple sans dépendances externes
const SimpleLineChart = ({ 
  data, 
  color, 
  width, 
  height, 
  target 
}: {
  data: number[];
  color: string;
  width: number;
  height: number;
  target?: number;
}) => {
  if (data.length === 0) return null;

  const minValue = Math.min(...data, target || 0);
  const maxValue = Math.max(...data, target || 0);
  const range = maxValue - minValue || 1;
  
  // Créer les points de la courbe
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - 40) + 20;
    const y = height - 40 - ((value - minValue) / range) * (height - 80);
    return `${x},${y}`;
  }).join(' ');

  // Position de la ligne d'objectif
  const targetY = target ? height - 40 - ((target - minValue) / range) * (height - 80) : null;

  return (
    <View style={[styles.chartContainer, { width, height }]}>
      <View style={styles.svgContainer}>
        {/* Grille de fond */}
        <View style={styles.gridLines}>
          {[0, 1, 2, 3, 4].map(i => (
            <View 
              key={i}
              style={[
                styles.gridLine,
                { top: 20 + (i * (height - 80) / 4) }
              ]}
            />
          ))}
        </View>

        {/* Ligne d'objectif */}
        {targetY && (
          <View style={[styles.targetLine, { top: targetY }]}>
            <View style={styles.targetLineDash} />
            <Text style={styles.targetLineLabel}>
              Objectif: {target}
            </Text>
          </View>
        )}

        {/* Points de données */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20;
          const y = height - 40 - ((value - minValue) / range) * (height - 80);
          
          return (
            <View
              key={index}
              style={[
                styles.dataPoint,
                {
                  left: x - 4,
                  top: y - 4,
                  backgroundColor: color,
                }
              ]}
            />
          );
        })}

        {/* Ligne de courbe simulée avec des segments */}
        <View style={styles.curveLine}>
          {data.slice(0, -1).map((value, index) => {
            const x1 = (index / (data.length - 1)) * (width - 40) + 20;
            const y1 = height - 40 - ((value - minValue) / range) * (height - 80);
            const x2 = ((index + 1) / (data.length - 1)) * (width - 40) + 20;
            const y2 = height - 40 - ((data[index + 1] - minValue) / range) * (height - 80);
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            return (
              <View
                key={index}
                style={[
                  styles.lineSegment,
                  {
                    left: x1,
                    top: y1,
                    width: length,
                    backgroundColor: color,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Labels des axes */}
      <View style={styles.chartLabels}>
        <Text style={styles.minLabel}>{minValue.toFixed(1)}</Text>
        <Text style={styles.maxLabel}>{maxValue.toFixed(1)}</Text>
      </View>
    </View>
  );
};

export default function MeasurementCharts({ period = '30d' }: MeasurementChartsProps) {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'waist' | 'hips' | 'arms'>('weight');
  const [measurementData, setMeasurementData] = useState<MeasurementData[]>([]);

  useEffect(() => {
    // Pour l'instant, utiliser des données simulées
    // Dans une vraie app, charger depuis le stockage local
    const mockData = generateMockData();
    setMeasurementData(mockData);
  }, [period]);

  const getMetricData = (metric: keyof MeasurementData) => {
    if (metric === 'date') return [];
    return measurementData.map(item => item[metric]);
  };

  const getMetricConfig = (metric: 'weight' | 'waist' | 'hips' | 'arms') => {
    switch (metric) {
      case 'weight':
        return {
          title: 'Évolution du Poids',
          unit: 'kg',
          color: Colors.agpBlue,
          icon: Scale,
          target: 72.0,
          gradient: [Colors.agpBlue, Colors.agpLightBlue],
        };
      case 'waist':
        return {
          title: 'Tour de Taille',
          unit: 'cm',
          color: Colors.agpGreen,
          icon: Target,
          target: 80.0,
          gradient: [Colors.agpGreen, Colors.agpLightGreen],
        };
      case 'hips':
        return {
          title: 'Tour de Hanche',
          unit: 'cm',
          color: Colors.relaxation,
          icon: Target,
          target: 90.0,
          gradient: [Colors.relaxation, '#FFE0E6'],
        };
      case 'arms':
        return {
          title: 'Tour de Bras',
          unit: 'cm',
          color: Colors.morning,
          icon: Ruler,
          target: 31.0,
          gradient: [Colors.morning, '#FFF3C4'],
        };
    }
  };

  const config = getMetricConfig(selectedMetric);
  const data = getMetricData(selectedMetric);
  const currentValue = data[data.length - 1] || 0;
  const startValue = data[0] || 0;
  const change = currentValue - startValue;
  const changePercentage = startValue > 0 ? ((change / startValue) * 100) : 0;

  const MetricButton = ({ 
    metric, 
    isActive 
  }: { 
    metric: 'weight' | 'waist' | 'hips' | 'arms'; 
    isActive: boolean;
  }) => {
    const metricConfig = getMetricConfig(metric);
    const IconComponent = metricConfig.icon;
    
    return (
      <TouchableOpacity
        style={[
          styles.metricButton,
          isActive && { backgroundColor: metricConfig.color }
        ]}
        onPress={() => setSelectedMetric(metric)}
        activeOpacity={0.8}
      >
        <IconComponent 
          size={20} 
          color={isActive ? Colors.textLight : metricConfig.color} 
        />
        <Text style={[
          styles.metricButtonText,
          isActive && { color: Colors.textLight }
        ]}>
          {metricConfig.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const getTrendIcon = () => {
    if (change < -0.1) return <TrendingDown size={20} color={Colors.agpGreen} />;
    if (change > 0.1) return <TrendingUp size={20} color={Colors.relaxation} />;
    return <Minus size={20} color={Colors.textSecondary} />;
  };

  const getTrendColor = () => {
    if (selectedMetric === 'arms') {
      // Pour les bras, une augmentation peut être positive (muscle)
      return change > 0 ? Colors.agpGreen : Colors.relaxation;
    } else {
      // Pour poids, taille, hanche : diminution = positif
      return change < 0 ? Colors.agpGreen : Colors.relaxation;
    }
  };

  const getTrendMessage = () => {
    const absChange = Math.abs(change);
    const unit = config.unit;
    
    if (selectedMetric === 'arms') {
      if (change > 0) {
        return `+${absChange.toFixed(1)} ${unit} (Muscle développé !)`;
      } else {
        return `-${absChange.toFixed(1)} ${unit}`;
      }
    } else {
      if (change < 0) {
        return `-${absChange.toFixed(1)} ${unit} (Excellent progrès !)`;
      } else if (change > 0) {
        return `+${absChange.toFixed(1)} ${unit}`;
      } else {
        return `Stable (${currentValue} ${unit})`;
      }
    }
  };

  return (
    <ScrollView 
      style={[
        styles.container,
        Platform.OS === 'web' ? { className: 'scroll-visible' } : undefined
      ]}
      showsVerticalScrollIndicator={true}
    >
      {/* Message d'introduction */}
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>📈 Vos Courbes d'Évolution</Text>
        <Text style={styles.introText}>
          Suivez vos progrès sur 30 jours avec des données simulées réalistes. 
          Cliquez sur les boutons ci-dessous pour changer de métrique.
        </Text>
      </View>

      {/* Sélecteur de métriques */}
      <View style={styles.metricsSelector}>
        <Text style={styles.selectorTitle}>Choisissez la métrique à suivre</Text>
        <View style={styles.metricsButtons}>
          <MetricButton metric="weight" isActive={selectedMetric === 'weight'} />
          <MetricButton metric="waist" isActive={selectedMetric === 'waist'} />
          <MetricButton metric="hips" isActive={selectedMetric === 'hips'} />
          <MetricButton metric="arms" isActive={selectedMetric === 'arms'} />
        </View>
      </View>

      {/* Statistiques actuelles */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <config.icon size={24} color={config.color} />
          <Text style={styles.statLabel}>Actuel</Text>
          <Text style={[styles.statValue, { color: config.color }]}>
            {currentValue} {config.unit}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Target size={24} color={Colors.textSecondary} />
          <Text style={styles.statLabel}>Objectif</Text>
          <Text style={styles.statValue}>
            {config.target} {config.unit}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          {getTrendIcon()}
          <Text style={styles.statLabel}>Évolution</Text>
          <Text style={[styles.statValue, { color: getTrendColor() }]}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)} {config.unit}
          </Text>
        </View>
      </View>

      {/* Graphique principal */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{config.title} - 30 derniers jours</Text>
        
        {data.length > 0 ? (
          <View style={styles.chartWrapper}>
            <SimpleLineChart
              data={data}
              color={config.color}
              width={chartWidth}
              height={220}
              target={config.target}
            />
            
            {/* Légendes des dates */}
            <View style={styles.dateLabels}>
              <Text style={styles.dateLabel}>
                {measurementData[0]?.date ? new Date(measurementData[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
              </Text>
              <Text style={styles.dateLabel}>Aujourd'hui</Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              Aucune donnée disponible pour cette période
            </Text>
          </View>
        )}
      </View>

      {/* Insights et conseils */}
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>📊 Analyse de vos progrès</Text>
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <config.icon size={20} color={config.color} />
            <Text style={styles.insightCardTitle}>Progression sur 30 jours</Text>
          </View>
          
          <View style={styles.insightStats}>
            <View style={styles.insightStat}>
              <Text style={styles.insightStatLabel}>Évolution totale</Text>
              <Text style={[styles.insightStatValue, { color: getTrendColor() }]}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)} {config.unit}
              </Text>
            </View>
            
            <View style={styles.insightStat}>
              <Text style={styles.insightStatLabel}>Moyenne hebdomadaire</Text>
              <Text style={styles.insightStatValue}>
                {(change / 4).toFixed(1)} {config.unit}/sem
              </Text>
            </View>
            
            <View style={styles.insightStat}>
              <Text style={styles.insightStatLabel}>Restant à l'objectif</Text>
              <Text style={styles.insightStatValue}>
                {Math.abs(currentValue - config.target).toFixed(1)} {config.unit}
              </Text>
            </View>
          </View>
        </View>

        {/* Conseils personnalisés */}
        <View style={styles.adviceCard}>
          <Text style={styles.adviceTitle}>💡 Conseils personnalisés</Text>
          
          {selectedMetric === 'weight' && change < -0.5 && (
            <Text style={styles.adviceText}>
              🎉 Excellente progression ! Vous perdez du poids de manière saine et durable. Continuez sur cette lancée !
            </Text>
          )}
          
          {selectedMetric === 'weight' && change > 0.5 && (
            <Text style={styles.adviceText}>
              🎯 Votre poids a légèrement augmenté. Vérifiez votre hydratation et la régularité de vos repas AGP.
            </Text>
          )}
          
          {selectedMetric === 'weight' && Math.abs(change) <= 0.5 && (
            <Text style={styles.adviceText}>
              ⚖️ Votre poids est stable. C'est normal ! Votre corps se rééquilibre. Regardez vos mensurations pour voir les vrais changements.
            </Text>
          )}
          
          {selectedMetric === 'waist' && change < -1 && (
            <Text style={styles.adviceText}>
              🎯 Votre taille s'affine ! C'est souvent le premier signe visible de perte de graisse abdominale.
            </Text>
          )}
          
          {selectedMetric === 'hips' && change < -0.5 && (
            <Text style={styles.adviceText}>
              👖 Vos hanches s'affinent ! Vos vêtements doivent commencer à être plus amples.
            </Text>
          )}
          
          {selectedMetric === 'arms' && change > 0.3 && (
            <Text style={styles.adviceText}>
              💪 Vos bras se tonifient ! L'augmentation peut indiquer un développement musculaire positif.
            </Text>
          )}
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🌟 Restez motivé(e) !</Text>
          <Text style={styles.motivationText}>
            "Les changements corporels prennent du temps. Chaque mesure est un pas vers votre objectif. 
            Célébrez chaque progrès, même petit !"
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  introTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  metricsSelector: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectorTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  metricsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
    justifyContent: 'center',
  },
  metricButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  chartSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  gridLines: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  targetLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetLineDash: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.textSecondary,
    opacity: 0.7,
  },
  targetLineLabel: {
    position: 'absolute',
    right: 0,
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 4,
    top: -8,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  curveLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
    transformOrigin: 'left center',
  },
  chartLabels: {
    position: 'absolute',
    left: 0,
    top: 20,
    bottom: 40,
    width: 15,
    justifyContent: 'space-between',
  },
  minLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  maxLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  dateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: chartWidth - 40,
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  insightsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  insightCardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightStat: {
    alignItems: 'center',
    flex: 1,
  },
  insightStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  insightStatValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  adviceCard: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  adviceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 16,
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
});