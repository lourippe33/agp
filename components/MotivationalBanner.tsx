import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { X, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function MotivationalBanner() {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (user) {
      checkForMotivationalMessage();
    }
  }, [user]);

  const checkForMotivationalMessage = async () => {
    if (!user) return;
    
    try {
      // Vérifier les paramètres de notification
      const settings = await NotificationService.getNotificationSettings(user.id);
      
      if (!settings.enabled || !settings.motivationalMessages) {
        return;
      }
      
      // Récupérer les notifications récentes
      const notifications = await NotificationService.getNotifications(user.id);
      
      // Trouver la dernière notification motivante
      const latestMotivational = notifications.find(n => n.type === 'motivational');
      
      if (latestMotivational) {
        setMessage(latestMotivational.message);
        showBanner();
      } else {
        // Générer un message motivant aléatoire si aucun n'existe
        await NotificationService.generateRandomMotivationalNotification(user.id);
        const updatedNotifications = await NotificationService.getNotifications(user.id);
        const newMotivational = updatedNotifications.find(n => n.type === 'motivational');
        
        if (newMotivational) {
          setMessage(newMotivational.message);
          showBanner();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des messages motivants:', error);
    }
  };

  const showBanner = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    
    // Masquer automatiquement après 10 secondes
    setTimeout(hideBanner, 10000);
  };

  const hideBanner = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  if (!visible || !message) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <MessageSquare size={20} color={Colors.relaxation} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={hideBanner}>
          <X size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: Colors.relaxation,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});