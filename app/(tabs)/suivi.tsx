import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChartBar as BarChart3, TrendingUp, Calendar, Target, Award, Clock, Heart, Utensils, Dumbbell, Star, Plus, BookOpen } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import AGPLogo from '@/components/AGPLogo';
import DailyTrackingModal from '@/components/DailyTrackingModal';
import { DailyTracking } from '@/types/Tracking';
import { TrackingService } from '@/services/TrackingService';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Stats {
  totalExercises: number;
  totalDuration: number;
  favoriteRecipes: number;
  streakDays: number;
  weeklyActivity: number[];
  lastActivity: string | null;
}

export default function SuiviScreen() {
  const { user, getCompletedExercises, getFavoriteRecipes } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalExercises: 0,
    totalDuration: 0,
    favoriteRecipes: 0,
    streakDays: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    lastActivity: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyTrackings, setDailyTrackings] = useState<DailyTracking[]>([]);

  useEffect(() => {
    loadUserStats();
    loadTrackingData();
  }, [user]);

  const navigateToJournal = () => {
    router.push('/journal');
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Récupérer les exercices complétés
      const exercisesResult = await getCompletedExercises(user.id);
      const favoritesResult = await getFavoriteRecipes(user.id);

      if (exercisesResult.success && favoritesResult.success) {
        const exercises = exercisesResult.data || [];
        const favorites = favoritesResult.data || [];

        // Calculer les statistiques
        const totalDuration = exercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
        const weeklyActivity = calculateWeeklyActivity(exercises);
        const streakDays = calculateStreak(exercises);
        const lastActivity = exercises.length > 0 ? exercises[0].completedAt : null;

        setStats({
          totalExercises: exercises.length,
          totalDuration,
          favoriteRecipes: favorites.length,
          streakDays,
          weeklyActivity,
          lastActivity,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const loadTrackingData = async () => {
    if (!user) return;

    try {
      // Calculer les dates pour la semaine en cours
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDateStr = startOfWeek.toISOString().split('T')[0];
      const endDateStr = endOfWeek.toISOString().split('T')[0];

      // Récupérer les données de suivi pour la semaine
      const trackings = await TrackingService.getWeeklyTracking(
        user.id,
        startDateStr,
        endDateStr
      );

      setDailyTrackings(trackings);
    } catch (error) {
      console.error('Erreur lors du chargement des données de suivi:', error);
    }
  };

  const calculateWeeklyActivity = (exercises: any[]) => {
    const today = new Date();
    const weekActivity = [0, 0, 0, 0, 0, 0, 0]; // Lun à Dim

    exercises.forEach(exercise => {
      const exerciseDate = new Date(exercise.completedAt);
      const daysDiff = Math.floor((today.getTime() - exerciseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        const dayOfWeek = (exerciseDate.getDay() + 6) % 7; // Convertir Dim=0 vers Lun=0
        weekActivity[dayOfWeek]++;
      }
    });

    return weekActivity;
  };

  const calculateStreak = (exercises: any[]) => {
    if (exercises.length === 0) return 0;

    const today = new Date();
    const sortedExercises = exercises.sort((a: any, b: any) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    let streak = 0;
    let currentDate = new Date(today);
    
    // Vérifier les jours consécutifs d'activité
    for (let i = 0; i < 30; i++) { // Vérifier les 30 derniers jours max
      const dateStr = currentDate.toDateString();
      const hasActivity = sortedExercises.some((ex: any) => 
        new Date(ex.completedAt).toDateString() === dateStr
      );
      
      if (hasActivity) {
        streak++;
      } else if (streak > 0) {
        break; // Arrêter si on trouve un jour sans activité après avoir commencé le streak
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getMotivationalMessage = () => {
    if (stats.streakDays >= 7) {
      return "🔥 Incroyable ! Vous êtes en feu !";
    } else if (stats.streakDays >= 3) {
      return "💪 Excellente régularité !";
    } else if (stats.totalExercises > 0) {
      return "🌱 Bon début, continuez !";
    }
    return "🚀 Prêt à commencer votre parcours ?";
  };

  const handleAddTracking = (date: string) => {
    setSelectedDate(date);
    setTrackingModalVisible(true);
  };

  const handleSaveTracking = (tracking: DailyTracking) => {
    // Mettre à jour la liste des suivis
    setDailyTrackings(prev => {
      const existingIndex = prev.findIndex(t => t.date === tracking.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = tracking;
        return updated;
      } else {
        return [...prev, tracking];
      }
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const WeeklyChart = () => {
    const maxActivity = Math.max(...stats.weeklyActivity, 1);
    const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Activité de la semaine</Text>
          <TouchableOpacity
            style={styles.journalButton}
            onPress={navigateToJournal}
          >
            <BookOpen size={16} color={Colors.textLight} />
            <Text style={styles.journalButtonText}>Journal</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chart}>
          {stats.weeklyActivity.map((activity, index) => (
            <View key={index} style={styles.chartBar}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: Math.max((activity / maxActivity) * 60, 4),
                    backgroundColor: activity > 0 ? Colors.agpGreen : Colors.border
                  }
                ]} 
              />
              <Text style={styles.dayLabel}>{days[index]}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const DailyStatusCards = () => {
    // Générer les 7 derniers jours
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    return (
      <View style={styles.dailyStatusSection}>
        <Text style={styles.sectionTitle}>📅 Suivi quotidien</Text>
        <View style={styles.dailyStatusCards}>
          {days.map((day, index) => {
            const dateStr = day.toISOString().split('T')[0];
            const tracking = dailyTrackings.find(t => t.date === dateStr);
            const dayStatus = tracking ? TrackingService.calculateDayStatus(tracking) : null;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayStatusCard,
                  dayStatus && dayStatus.status === 'green' && styles.dayStatusCardGreen,
                  dayStatus && dayStatus.status === 'orange' && styles.dayStatusCardOrange,
                  dayStatus && dayStatus.status === 'red' && styles.dayStatusCardRed,
                ]}
                onPress={() => handleAddTracking(dateStr)}
              >
                <Text style={styles.dayStatusDate}>
                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                </Text>
                <Text style={styles.dayStatusDay}>
                  {day.getDate()}
                </Text>
                {dayStatus ? (
                  <View style={styles.dayStatusPercentage}>
                    <Text style={styles.dayStatusPercentageText}>
                      {dayStatus.completionPercentage}%
                    </Text>
                    {tracking.waterIntake > 0 && 
                      <View>
                        <Text style={styles.waterStatusText}>
                          💧{tracking.waterIntake}/{tracking.waterIntakeObjective || 8}
                        </Text>
                      </View>
                    }
                  </View>
                ) : (
                  <View style={styles.dayStatusAdd}>
                    <Plus size={16} color={Colors.textSecondary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.headerTitle}>Suivi Personnel</Text>
            <Text style={styles.headerSubtitle}>
              Votre progression AGP
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <BarChart3 size={32} color={Colors.textLight} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Message de motivation */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
          {user && (
            <Text style={styles.welcomeText}>
              Bonjour {user.firstName || user.username} ! 👋
            </Text>
          )}
        </View>

        {/* Suivi quotidien */}
        <DailyStatusCards />

        {/* Statistiques principales */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={Dumbbell}
            title="Exercices"
            value={stats.totalExercises}
            subtitle="complétés"
            color={Colors.agpBlue}
          />
          <StatCard
            icon={Clock}
            title="Temps total"
            value={formatDuration(stats.totalDuration)}
            subtitle="d'activité"
            color={Colors.agpGreen}
          />
          <StatCard
            icon={Heart}
            title="Favoris"
            value={stats.favoriteRecipes}
            subtitle="recettes"
            color={Colors.relaxation}
          />
          <StatCard
            icon={Award}
            title="Série"
            value={stats.streakDays}
            subtitle="jours consécutifs"
            color={Colors.morning}
          />
        </View>

        {/* Graphique d'activité */}
        <WeeklyChart />

        {/* Objectifs et badges */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Vos Réussites</Text>
          
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, stats.totalExercises >= 1 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <Star size={20} color={stats.totalExercises >= 1 ? Colors.morning : Colors.textSecondary} />
              <Text style={[styles.badgeText, stats.totalExercises >= 1 && styles.badgeTextUnlocked]}>
                Premier pas
              </Text>
            </View>
            
            <View style={[styles.badge, stats.totalExercises >= 10 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <Target size={20} color={stats.totalExercises >= 10 ? Colors.agpBlue : Colors.textSecondary} />
              <Text style={[styles.badgeText, stats.totalExercises >= 10 && styles.badgeTextUnlocked]}>
                Régulier
              </Text>
            </View>
            
            <View style={[styles.badge, stats.streakDays >= 7 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <TrendingUp size={20} color={stats.streakDays >= 7 ? Colors.agpGreen : Colors.textSecondary} />
              <Text style={[styles.badgeText, stats.streakDays >= 7 && styles.badgeTextUnlocked]}>
                Une semaine !
              </Text>
            </View>
            
            <View style={[styles.badge, stats.favoriteRecipes >= 5 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <Utensils size={20} color={stats.favoriteRecipes >= 5 ? Colors.relaxation : Colors.textSecondary} />
              <Text style={[styles.badgeText, stats.favoriteRecipes >= 5 && styles.badgeTextUnlocked]}>
                Gourmet
              </Text>
            </View>
          </View>
        </View>

        {/* Conseils personnalisés */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Conseils Personnalisés</Text>
          
          {stats.totalExercises === 0 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🌟 Commencez par un exercice de respiration de 2 minutes pour découvrir les bienfaits de la détente !
              </Text>
            </View>
          )}
          
          {stats.totalExercises > 0 && stats.streakDays < 3 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🔄 Essayez de pratiquer un petit exercice chaque jour pour créer une habitude durable.
              </Text>
            </View>
          )}
          
          {stats.favoriteRecipes === 0 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🍽️ Explorez nos recettes et ajoutez vos préférées en favoris pour les retrouver facilement !
              </Text>
            </View>
          )}
          
          {stats.streakDays >= 7 && (
            <View style={styles.tipCard}>
              <Text style={styles.tipText}>
                🎉 Félicitations pour votre régularité ! Vous pouvez maintenant essayer des exercices plus longs.
              </Text>
            </View>
          )}
        </View>

        {/* Dernière activité */}
        {stats.lastActivity && (
          <View style={styles.lastActivitySection}>
            <Text style={styles.sectionTitle}>📅 Dernière Activité</Text>
            <Text style={styles.lastActivityText}>
              {new Date(stats.lastActivity).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Modal de suivi quotidien */}
      <DailyTrackingModal
        visible={trackingModalVisible}
        onClose={() => setTrackingModalVisible(false)}
        date={selectedDate}
        onSave={handleSaveTracking}
      />
    </ScrollView>
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
    padding: 20,
  },
  motivationCard: {
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
  motivationText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  dailyStatusSection: {
    marginBottom: 24,
  },
  dailyStatusCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayStatusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    width: (width - 56) / 7,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 3,
    borderTopColor: Colors.border,
  },
  dayStatusCardGreen: {
    borderTopColor: Colors.agpGreen,
  },
  dayStatusCardOrange: {
    borderTopColor: Colors.morning,
  },
  dayStatusCardRed: {
    borderTopColor: Colors.relaxation,
  },
  dayStatusDate: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  dayStatusDay: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginVertical: 4,
  },
  dayStatusPercentage: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dayStatusPercentageText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpGreen
  },
  waterStatusText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpBlue,
    marginTop: 2
  },
  dayStatusAdd: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpGreen,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  journalButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textLight,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 52) / 2,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeUnlocked: {
    borderWidth: 2,
    borderColor: Colors.agpGreen,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  badgeTextUnlocked: {
    color: Colors.text,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: Colors.agpLightGreen,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpGreen,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  lastActivitySection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lastActivityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});