import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Trophy, Flame, Target, ChevronRight, Star, Lightbulb, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProgrammeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.agpBlue, Colors.agpGreen]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Programme 28 Jours</Text>
        <Text style={styles.headerSubtitle}>
          Votre transformation AGP personnalisée
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Trophy size={24} color={Colors.warning} />
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Progression</Text>
          </View>
          
          <View style={styles.statItem}>
            <Flame size={24} color={Colors.error} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Jours consécutifs</Text>
          </View>
          
          <View style={styles.statItem}>
            <Target size={24} color={Colors.success} />
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>Jours restants</Text>
          </View>
        </View>

        {/* Message de progression */}
        <View style={styles.progressMessage}>
          <Text style={styles.progressText}>
            🎯 Vous avez complété 0% du programme !
          </Text>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayButtonText}>📍 Aller à aujourd'hui</Text>
          </TouchableOpacity>
        </View>

        {/* Indicateur de semaine */}
        <View style={styles.weekIndicator}>
          <Text style={styles.weekText}>📅 Vous êtes dans la semaine 1 🏁</Text>
        </View>

        {/* Semaine 1 */}
        <View style={styles.weekSection}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Semaine 1</Text>
            <Text style={styles.weekProgress}>0%</Text>
            <ChevronRight size={20} color={Colors.agpBlue} />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            <View style={styles.daysContainer}>
              {[1, 2, 3, 4, 5, 6].map((day) => (
                <View key={day} style={styles.dayCircle}>
                  <Text style={[styles.dayNumber, day === 1 && styles.dayNumberActive]}>
                    {day}
                  </Text>
                  <Text style={styles.dayLabel}>
                    {day === 1 ? 'lun.' : day === 2 ? 'mar.' : day === 3 ? 'mer.' : 
                     day === 4 ? 'jeu.' : day === 5 ? 'ven.' : 'sam.'}
                  </Text>
                  <Text style={styles.dayTime}>
                    {day <= 3 ? '20 min' : '25 min'}
                  </Text>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: day === 1 ? '#FF6B6B' : day <= 3 ? '#4A90E2' : '#E0E0E0' }
                  ]} />
                </View>
              ))}
              <TouchableOpacity style={styles.moreButton}>
                <ChevronRight size={20} color={Colors.agpBlue} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Section motivation */}
        <View style={styles.motivationSection}>
          <View style={styles.motivationCard}>
            <View style={styles.motivationIcon}>
              <Star size={20} color={Colors.warning} />
            </View>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>📌 Commencez votre transformation</Text>
              <Text style={styles.motivationText}>
                Chaque grand voyage commence par un premier pas.
              </Text>
            </View>
          </View>
        </View>

        {/* Conseil de la semaine */}
        <View style={styles.conseilSection}>
          <Text style={styles.sectionTitle}>💡 Conseil de la semaine 1</Text>
          <View style={styles.conseilCard}>
            <Text style={styles.conseilText}>
              Concentrez-vous sur la création d'habitudes. La régularité est plus importante que la perfection.
            </Text>
          </View>
        </View>

        {/* Navigation directe */}
        <View style={styles.navigationSection}>
          <View style={styles.navigationCard}>
            <View style={styles.navigationIcon}>
              <Zap size={20} color={Colors.info} />
            </View>
            <View style={styles.navigationContent}>
              <Text style={styles.navigationTitle}>🚀 Navigation Directe ACTIVE !</Text>
              <Text style={styles.navigationText}>
                Cliquez sur une activité pour accéder directement à la recette ou l'exercice spécifique ! Plus besoin de chercher dans les listes.
              </Text>
            </View>
          </View>
        </View>
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
    marginBottom: 20,
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
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  progressMessage: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  todayButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  todayButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  weekIndicator: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.agpBlue,
  },
  weekSection: {
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
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  weekProgress: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
  },
  daysScroll: {
    marginHorizontal: -20,
  },
  daysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    alignItems: 'center',
  },
  dayCircle: {
    alignItems: 'center',
    width: 60,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dayNumberActive: {
    color: Colors.textLight,
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dayTime: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreButton: {
    padding: 8,
  },
  motivationSection: {
    marginBottom: 20,
  },
  motivationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  motivationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  conseilSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  conseilCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  conseilText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 18,
  },
  navigationSection: {
    marginBottom: 20,
  },
  navigationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navigationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navigationContent: {
    flex: 1,
  },
  navigationTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  navigationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});