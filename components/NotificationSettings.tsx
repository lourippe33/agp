import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Bell, Clock, Droplets, Utensils, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/src/context/AuthContext';
import { NotificationService, NotificationSettings } from '@/services/NotificationService';

interface NotificationSettingsProps {
  onSave?: () => void;
}

export default function NotificationSettingsComponent({ onSave }: NotificationSettingsProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    meals: false,
    water: false,
    tracking: false,
    motivational: false,
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const userSettings = await NotificationService.getNotificationSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres de notification:', error);
    }
  };

  const saveSettings = async () => {
    if (!user || !settings) return;
    
    try {
      await NotificationService.saveNotificationSettings(user.id, settings);
      if (onSave) onSave();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres de notification:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleEnabled = (value: boolean) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      return { ...prev, enabled: value };
    });
    
    saveSettings();
  };

  const handleToggleSetting = (setting: keyof NotificationSettings) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      return { ...prev, [setting]: !prev[setting] };
    });
    
    saveSettings();
  };

  // Fonctions mémorisées pour éviter les re-renders
  const updateMealTime = useCallback((timeType: string, value: string) => {
    handleTimeChange(timeType, value);
  }, []);

  const updateWaterTime = useCallback((value: string, index: number) => {
    handleTimeChange('water', value, index);
  }, []);

  const updateTrackingTime = useCallback((value: string) => {
    handleTimeChange('tracking', value);
  }, []);

  const updateMotivationalTime = useCallback((value: string) => {
    handleTimeChange('motivational', value);
  }, []);

  const handleTimeChange = (timeType: string, value: string, index?: number) => {
    if (!settings) return;
    
    setSettings(prev => {
      if (!prev) return prev;
      
      if (timeType === 'breakfast' || timeType === 'lunch' || timeType === 'snack' || timeType === 'dinner') {
        return {
          ...prev,
          mealTimes: {
            ...prev.mealTimes,
            [timeType]: value
          }
        };
      } else if (timeType === 'water' && typeof index === 'number') {
        const newWaterTimes = [...prev.waterTimes];
        newWaterTimes[index] = value;
        return {
          ...prev,
          waterTimes: newWaterTimes
        };
      } else if (timeType === 'tracking') {
        return {
          ...prev,
          trackingTime: value
        };
      } else if (timeType === 'motivational') {
        return {
          ...prev,
          motivationalTime: value
        };
      }
      
      return prev;
    });
    
    saveSettings();
  };

  if (!settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Activation générale */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color={Colors.agpBlue} />
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Switch
            value={settings.enabled}
            onValueChange={handleToggleEnabled}
            trackColor={{ false: Colors.border, true: Colors.agpLightBlue }}
            thumbColor={settings.enabled ? Colors.agpBlue : Colors.textSecondary}
          />
        </View>
        <Text style={styles.sectionDescription}>
          Activez ou désactivez toutes les notifications de l'application
        </Text>
      </View>

      {settings.enabled && (
        <>
          {/* Rappels de repas */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('meals')}
            >
              <Utensils size={20} color={Colors.agpGreen} />
              <Text style={styles.sectionTitle}>Rappels de repas</Text>
              <View style={styles.headerRight}>
                <Switch
                  value={settings.mealReminders}
                  onValueChange={() => handleToggleSetting('mealReminders')}
                  trackColor={{ false: Colors.border, true: Colors.agpLightGreen }}
                  thumbColor={settings.mealReminders ? Colors.agpGreen : Colors.textSecondary}
                />
                {expandedSections.meals ? (
                  <ChevronUp size={20} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={Colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            
            {settings.mealReminders && expandedSections.meals && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionDescription}>
                  Configurez les heures de rappel pour chaque repas
                </Text>
                
                <View style={styles.timeSettings}>
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Petit-déjeuner</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.mealTimes.breakfast}
                      onChangeText={(value) => updateMealTime('breakfast', value)}
                      placeholder="07:30"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Déjeuner</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.mealTimes.lunch}
                      onChangeText={(value) => updateMealTime('lunch', value)}
                      placeholder="12:30"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Collation</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.mealTimes.snack}
                      onChangeText={(value) => updateMealTime('snack', value)}
                      placeholder="16:00"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                  
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Dîner</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.mealTimes.dinner}
                      onChangeText={(value) => updateMealTime('dinner', value)}
                      placeholder="19:30"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Rappels d'hydratation */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('water')}
            >
              <Droplets size={20} color={Colors.agpBlue} />
              <Text style={styles.sectionTitle}>Rappels d'hydratation</Text>
              <View style={styles.headerRight}>
                <Switch
                  value={settings.waterReminders}
                  onValueChange={() => handleToggleSetting('waterReminders')}
                  trackColor={{ false: Colors.border, true: Colors.agpLightBlue }}
                  thumbColor={settings.waterReminders ? Colors.agpBlue : Colors.textSecondary}
                />
                {expandedSections.water ? (
                  <ChevronUp size={20} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={Colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            
            {settings.waterReminders && expandedSections.water && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionDescription}>
                  Configurez les heures de rappel pour boire de l'eau
                </Text>
                
                <View style={styles.timeSettings}>
                  {settings.waterTimes.map((time, index) => (
                    <View key={index} style={styles.timeSetting}>
                      <Text style={styles.timeLabel}>Rappel {index + 1}</Text>
                      <TextInput
                        style={styles.timeInput}
                        value={time}
                        onChangeText={(value) => updateWaterTime(value, index)}
                        placeholder="09:00"
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Rappel de suivi */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('tracking')}
            >
              <Clock size={20} color={Colors.morning} />
              <Text style={styles.sectionTitle}>Rappel de suivi</Text>
              <View style={styles.headerRight}>
                <Switch
                  value={settings.trackingReminders}
                  onValueChange={() => handleToggleSetting('trackingReminders')}
                  trackColor={{ false: Colors.border, true: Colors.agpLightGreen }}
                  thumbColor={settings.trackingReminders ? Colors.morning : Colors.textSecondary}
                />
                {expandedSections.tracking ? (
                  <ChevronUp size={20} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={Colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            
            {settings.trackingReminders && expandedSections.tracking && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionDescription}>
                  Configurez l'heure du rappel pour remplir votre suivi quotidien
                </Text>
                
                <View style={styles.timeSettings}>
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Heure du rappel</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.trackingTime}
                      onChangeText={updateTrackingTime}
                      placeholder="20:30"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Message motivant */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection('motivational')}
            >
              <MessageSquare size={20} color={Colors.relaxation} />
              <Text style={styles.sectionTitle}>Message motivant</Text>
              <View style={styles.headerRight}>
                <Switch
                  value={settings.motivationalMessages}
                  onValueChange={() => handleToggleSetting('motivationalMessages')}
                  trackColor={{ false: Colors.border, true: '#FFE0E6' }}
                  thumbColor={settings.motivationalMessages ? Colors.relaxation : Colors.textSecondary}
                />
                {expandedSections.motivational ? (
                  <ChevronUp size={20} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={Colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            
            {settings.motivationalMessages && expandedSections.motivational && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionDescription}>
                  Configurez l'heure de réception de votre message motivant quotidien
                </Text>
                
                <View style={styles.timeSettings}>
                  <View style={styles.timeSetting}>
                    <Text style={styles.timeLabel}>Heure du message</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={settings.motivationalTime}
                      onChangeText={updateMotivationalTime}
                      placeholder="08:00"
                      keyboardType="numbers-and-punctuation"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        </>
      )}

      {/* Bouton de sauvegarde */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSettings}
      >
        <Text style={styles.saveButtonText}>Enregistrer les paramètres</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  timeSettings: {
    gap: 12,
  },
  timeSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  timeInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 80,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.agpGreen,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.textLight,
    fontWeight: '600',
  },
});