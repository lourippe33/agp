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
import { NotificationService } from '@/services/NotificationService';

export default function NotificationTester() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async (type: 'meal' | 'water' | 'tracking' | 'motivational') => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour tester les notifications');
      return;
    }

    setLoading(true);

    try {
      switch (type) {
        case 'meal':
          await NotificationService.generateMealReminder(user.id, 'breakfast');
          break;
        case 'water':
          await NotificationService.generateWaterReminder(user.id);
          break;
        case 'tracking':
          await NotificationService.generateTrackingReminder(user.id);
          break;
        case 'motivational':
          await NotificationService.generateRandomMotivationalNotification(user.id);
          break;
      }

      Alert.alert('Succès', 'Notification de test envoyée avec succès !');
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
      <Text style={styles.description}>
        Utilisez les boutons ci-dessous pour tester les différents types de notifications.
      </Text>

      <ScrollView style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.agpLightGreen }]}
          onPress={() => sendTestNotification('meal')}
          disabled={loading}
        >
          <Utensils size={20} color={Colors.agpGreen} />
          <Text style={[styles.buttonText, { color: Colors.agpGreen }]}>
            Rappel de repas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors.agpLightBlue }]}
          onPress={() => sendTestNotification('water')}
          disabled={loading}
        >
          <Droplets size={20} color={Colors.agpBlue} />
          <Text style={[styles.buttonText, { color: Colors.agpBlue }]}>
            Rappel d'hydratation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFF3C4' }]}
          onPress={() => sendTestNotification('tracking')}
          disabled={loading}
        >
          <Clock size={20} color={Colors.morning} />
          <Text style={[styles.buttonText, { color: Colors.morning }]}>
            Rappel de suivi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FFE0E6' }]}
          onPress={() => sendTestNotification('motivational')}
          disabled={loading}
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
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  note: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 16,
  },
});