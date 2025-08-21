import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Utensils, Coffee, Moon, Dumbbell, Heart, Calendar, ChevronRight, Target, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const handleNavigation = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      Alert.alert('Navigation', `Redirection vers ${route}`);
    }
  };

  const getCurrentMoment = () => {
    const hour = new Date().getHours();
    if (hour < 10) return 'matin';
    if (hour < 14) return 'midi';
    if (hour < 18) return 'gouter';
    return 'soir';
  };

  const getMomentText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const currentMoment = getCurrentMoment();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header personnalisé */}
        <LinearGradient
          colors={[Colors.agpBlue, Colors.agpGreen]} 
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              {getMomentText()}, Eric
            </Text>
            <Text style={styles.subtitle}>
              Votre parcours chronobiologique vous attend
            </Text>
          </View>
        </LinearGradient>

        {/* Bienvenue */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenue sur AGP, Eric 👋</Text>
        </View>

        {/* Programme 28 Jours */}
        <View style={styles.programmeSection}>
          <Text style={styles.sectionTitle}>Programme 28 Jours</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
            <View style={styles.daysContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <View key={day} style={styles.dayCircle}>
                  <Text style={styles.dayNumber}>{day}</Text>
                  <Text style={styles.dayLabel}>
                    {day === 1 ? 'lun.' : day === 2 ? 'mar.' : day === 3 ? 'mer.' : 
                     day === 4 ? 'jeu.' : day === 5 ? 'ven.' : day === 6 ? 'sam.' : 'dim.'}
                  </Text>
                  <Text style={styles.dayTime}>
                    {day <= 3 ? '20 min' : day <= 5 ? '25 min' : '30 min'}
                  </Text>
                  <View style={[styles.statusDot, { backgroundColor: day === 1 ? '#FF6B6B' : day <= 3 ? '#4A90E2' : '#E0E0E0' }]} />
                </View>
              ))}
              <TouchableOpacity style={styles.moreButton}>
                <ChevronRight size={20} color={Colors.agpBlue} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: '#FF5722' }]}
              onPress={() => handleNavigation('/sport')}
            >
              <Dumbbell size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Sport</Text>
              <Text style={styles.actionSubtitle}>activités</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardLarge, { backgroundColor: Colors.agpGreen }]}
              onPress={() => handleNavigation('/recettes')}
            >
              <Utensils size={32} color={Colors.textLight} />
              <Text style={styles.actionTitle}>Recettes</Text>
              <Text style={styles.actionSubtitle}>adaptées</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.actionCard, styles.actionCardFull, { backgroundColor: Colors.relaxation }]}
            onPress={() => handleNavigation('/detente')}
          >
            <Heart size={32} color={Colors.textLight} />
            <Text style={styles.actionTitle}>Détente</Text>
            <Text style={styles.actionSubtitle}>& bien-être</Text>
          </TouchableOpacity>
        </View>

        {/* Vos Réussites */}
        <View style={styles.reussitesSection}>
          <Text style={styles.sectionTitle}>Vos Réussites</Text>
          
          <View style={styles.reussiteCard}>
            <View style={styles.reussiteIcon}>
              <Target size={20} color={Colors.warning} />
            </View>
            <View style={styles.reussiteContent}>
              <Text style={styles.reussiteTitle}>📌 Prêt à commencer votre transformation ?</Text>
              <Text style={styles.reussiteText}>
                Les changements durables commencent par de petites actions quotidiennes. Lancez-vous dès aujourd'hui !
              </Text>
            </View>
          </View>
        </View>

        {/* Moment actuel */}
        <View style={styles.momentSection}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          
          <LinearGradient
            colors={currentMoment === 'gouter' ? ['#FF9800', '#FFB74D'] : [Colors.agpBlue, Colors.agpGreen]}
            style={styles.momentCard}
          >
            <View style={styles.momentHeader}>
              <Coffee size={24} color={Colors.textLight} />
              <Text style={styles.momentTitle}>Moment goûter</Text>
            </View>
            <Text style={styles.momentText}>
              Recharge-toi sans culpabiliser → Étirements, respiration, ou collation malgré - tout compte.
            </Text>
            <TouchableOpacity style={styles.momentButton}>
              <Text style={styles.momentButtonText}>Voir le programme</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Conseil du jour */}
        <View style={styles.conseilSection}>
          <Text style={styles.sectionTitle}>Conseil du jour</Text>
          
          <View style={styles.conseilCard}>
            <View style={styles.conseilIcon}>
              <Heart size={20} color={Colors.info} />
            </View>
            <View style={styles.conseilContent}>
              <Text style={styles.conseilTitle}>🚶 Bouger un peu plus</Text>
              <Text style={styles.conseilText}>
                Un pas après l'autre : 15 min de marche quotidienne suffisent à améliorer votre bien-être.
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
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    textAlign: 'center',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    textAlign: 'center',
  },
  programmeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
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
    color: Colors.agpBlue,
    backgroundColor: Colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 4,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  actionCardLarge: {
    flex: 1,
  },
  actionCardFull: {
    width: '100%',
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
    marginTop: 12,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
  },
  reussitesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  reussiteCard: {
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
  reussiteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reussiteContent: {
    flex: 1,
  },
  reussiteTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  reussiteText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  momentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  momentCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  momentTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  momentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    opacity: 0.9,
    lineHeight: 18,
    marginBottom: 16,
  },
  momentButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  momentButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
  },
  conseilSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  conseilCard: {
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
  conseilIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  conseilContent: {
    flex: 1,
  },
  conseilTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  conseilText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});