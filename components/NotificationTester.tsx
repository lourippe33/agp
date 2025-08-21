import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Bell, Droplets, Utensils, MessageSquare, Clock } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService, Notification } from '@/services/NotificationService';

export default function NotificationTester() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async (type: 'meal' | 'water' | 'tracking' | 'motivational') => {
    if (!user) {
      console.log('Tentative d\'envoi de notification sans utilisateur connecté');
      Alert.alert(
        'Erreur de connexion',
        'Vous devez être connecté pour tester les notifications. Veuillez vous reconnecter.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setLoading(true);

    try {
      console.log(`Envoi d'une notification de test de type: ${type}`);
      
      let notification: Partial<Notification> = {
        id: '',
        read: false,
        timestamp: new Date().toISOString()
      };
      
      switch (type) {
        case 'meal':
          console.log('Génération d\'une notification de repas');
          await NotificationService.generateMealReminder(user.id, 'breakfast');
          notification = {
            ...notification,
            type: 'meal',
            title: '🌅 Petit-déjeuner',
            message: 'C\'est l\'heure de votre petit-déjeuner ! Pensez à respecter votre rythme chrono 🍽️'
          };
          break;
        case 'water':
          console.log('Génération d\'une notification d\'hydratation');
          await NotificationService.generateWaterReminder(user.id);
          notification = {
            ...notification,
            type: 'water',
            title: '💧 Hydratation',
            message: 'N\'oubliez pas de boire de l\'eau régulièrement 💦'
          };
          break;
        case 'tracking':
          console.log('Génération d\'une notification de suivi');
          await NotificationService.generateTrackingReminder(user.id);
          notification = {
            ...notification,
            type: 'tracking',
            title: '📝 Suivi quotidien',
            message: 'Avez-vous rempli votre journal AGP aujourd\'hui ? Cela ne prend que 2 minutes.'
          };
          break;
        case 'motivational':
          console.log('Génération d\'une notification motivante');
          await NotificationService.generateRandomMotivationalNotification(user.id);
          notification = {
            ...notification,
            type: 'motivational',
            title: '✨ Motivation du jour',
            message: 'Chaque petit pas compte ! Vous êtes sur la bonne voie 🌱'
          };
          break;
      }

      Alert.alert(
        '✅ Notification envoyée !',
        `${notification.title}\n\n${notification.message}\n\nVérifiez l'icône de cloche en haut à droite de l'application.`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de test:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer la notification de test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tester les notifications</Text>
      <Text style={styles.description} testID="notification-description">
        Utilisez les boutons ci-dessous pour tester les différents types de notifications. Vérifiez l'icône de cloche en haut à droite après avoir cliqué.
      </Text>

      <ScrollView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.agpLightGreen }, styles.activeButton]}
          onPress={() => sendTestNotification('meal')}
          disabled={loading}
          activeOpacity={0.7}
          testID="meal-notification-button"
        >
          <Utensils size={20} color={Colors.agpGreen} />
          <Text style={[styles.buttonText, { color: Colors.agpGreen }]}>
            Rappel de repas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.agpLightBlue }, styles.activeButton]}
          onPress={() => sendTestNotification('water')}
          disabled={loading}
          activeOpacity={0.7}
          testID="water-notification-button"
        >
          <Droplets size={20} color={Colors.agpBlue} />
          <Text style={[styles.buttonText, { color: Colors.agpBlue }]}>
            Rappel d'hydratation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFF3C4' }, styles.activeButton]}
          onPress={() => sendTestNotification('tracking')}
          disabled={loading}
          activeOpacity={0.7}
          testID="tracking-notification-button"
        >
          <Clock size={20} color={Colors.morning} />
          <Text style={[styles.buttonText, { color: Colors.morning }]}>
            Rappel de suivi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFE0E6' }, styles.activeButton]}
          onPress={() => sendTestNotification('motivational')}
          disabled={loading}
          activeOpacity={0.7}
          testID="motivational-notification-button"
        >
          <MessageSquare size={20} color={Colors.relaxation} />
          <Text style={[styles.buttonText, { color: Colors.relaxation }]}>
            Message motivant
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.note}>
        Note: Les notifications apparaîtront dans l'icône de cloche en haut à droite de l'application.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    maxHeight: 300,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
    minHeight: 70,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 16,
  },
});