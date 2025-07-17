import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, CreditCard as Edit3, Save, Camera, Bell, Target, Activity, Heart, Settings, ChevronRight, LogOut, Trash2, Droplets } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import AGPLogo from '@/components/AGPLogo';
import { TrackingService } from '@/services/TrackingService';
import { UserProfile } from '@/types/Tracking';
import NotificationSettings from '@/components/NotificationSettings';
import NotificationTester from '@/components/NotificationTester';

// Variable pour contrôler l'affichage du testeur de notifications
const showNotificationSettings = true;

export default function ProfilScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    niveauSport: user?.niveauSport || 'debutant',
    preferencesAlimentaires: user?.preferencesAlimentaires || [],
    objectifs: user?.objectifs || [],
  });
  const [profileData, setProfileData] = useState({
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    waistMeasurement: 0,
  });
  const [notifications, setNotifications] = useState(true);
  const [waterNotifications, setWaterNotifications] = useState(true);
  const [waterObjective, setWaterObjective] = useState(8);

  // État pour suivre le processus de déconnexion
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        niveauSport: user.niveauSport || 'debutant',
        preferencesAlimentaires: user.preferencesAlimentaires || [],
        objectifs: user.objectifs || [],
      });
    }
    
    // Charger le profil de suivi
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await TrackingService.getUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
        setProfileData({
          currentWeight: profile.currentWeight || 0,
          targetWeight: profile.targetWeight || 0,
          height: profile.height || 0,
          waistMeasurement: profile.waistMeasurement || 0,
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // Sauvegarder les informations de base
      const result = await updateProfile(user.id, formData);
      
      // Sauvegarder le profil de suivi
      if (profileData.currentWeight > 0) {
        const profileToSave: UserProfile = {
          id: userProfile?.id || TrackingService.generateId(),
          currentWeight: profileData.currentWeight,
          targetWeight: profileData.targetWeight,
          height: profileData.height,
          waistMeasurement: profileData.waistMeasurement,
          startDate: userProfile?.startDate || new Date().toISOString().split('T')[0],
        };
        
        await TrackingService.saveUserProfile(user.id, profileToSave);
        setUserProfile(profileToSave);
      }
      
      if (result.success) {
        setIsEditing(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès !');
      } else {
        Alert.alert('Erreur', result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };

  const handleLogout = () => {
    console.log('Bouton de déconnexion cliqué');
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter de l\'application AGP ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              console.log('🔄 Tentative de déconnexion initiée depuis le profil...');
              await logout();
              console.log('✅ Déconnexion réussie, redirection vers login');
              router.replace('/login');
            } catch (error) {
              setIsLoggingOut(false);
              console.error('❌ Erreur lors de la déconnexion:', error);
              Alert.alert(
                'Erreur',
                'Un problème est survenu lors de la déconnexion. Veuillez réessayer.'
              );
            }
          },
        },
      ]
    );
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferencesAlimentaires: prev.preferencesAlimentaires.includes(preference)
        ? prev.preferencesAlimentaires.filter(p => p !== preference)
        : [...prev.preferencesAlimentaires, preference]
    }));
  };

  const toggleObjectif = (objectif: string) => {
    setFormData(prev => ({
      ...prev,
      objectifs: prev.objectifs.includes(objectif)
        ? prev.objectifs.filter(o => o !== objectif)
        : [...prev.objectifs, objectif]
    }));
  };

  const preferencesOptions = [
    'Végétarien',
    'Vegan',
    'Sans gluten',
    'Sans lactose',
    'Paléo',
    'Cétogène'
  ];

  const objectifsOptions = [
    'Perte de poids',
    'Prise de muscle',
    'Améliorer l\'énergie',
    'Réduire le stress',
    'Mieux dormir',
    'Améliorer la digestion'
  ];

  const niveauxSport = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' }
  ];

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const EditableField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder 
  }: { 
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    placeholder?: string;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Non renseigné'}</Text>
      )}
    </View>
  );

  const SelectField = ({ 
    label, 
    value, 
    options, 
    onSelect 
  }: { 
    label: string; 
    value: string; 
    options: { value: string; label: string }[]; 
    onSelect: (value: string) => void;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <View style={styles.selectContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.selectOption,
                value === option.value && styles.selectOptionSelected
              ]}
              onPress={() => onSelect(option.value)}
            >
              <Text style={[
                styles.selectOptionText,
                value === option.value && styles.selectOptionTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>
          {options.find(opt => opt.value === value)?.label || 'Non renseigné'}
        </Text>
      )}
    </View>
  );

  const MultiSelectField = ({ 
    label, 
    values, 
    options, 
    onToggle 
  }: { 
    label: string; 
    values: string[]; 
    options: string[]; 
    onToggle: (value: string) => void;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <View style={styles.multiSelectContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.multiSelectOption,
                values.includes(option) && styles.multiSelectOptionSelected
              ]}
              onPress={() => onToggle(option)}
            >
              <Text style={[
                styles.multiSelectOptionText,
                values.includes(option) && styles.multiSelectOptionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>
          {values.length > 0 ? values.join(', ') : 'Aucune préférence'}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
    >
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
            <Text style={styles.headerTitle}>Mon Profil</Text>
            <Text style={styles.headerSubtitle}>
              Personnalisez votre expérience AGP
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <Save size={24} color={Colors.textLight} />
            ) : (
              <Edit3 size={24} color={Colors.textLight} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Informations personnelles */}
        <ProfileSection title="👤 Informations personnelles">
          <EditableField
            label="Prénom"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            placeholder="Votre prénom"
          />
          
          <EditableField
            label="Nom"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            placeholder="Votre nom"
          />
          
          <EditableField
            label="Nom d'utilisateur"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Votre nom d'utilisateur"
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{user?.email}</Text>
          </View>
        </ProfileSection>

        {/* Mesures corporelles */}
        <ProfileSection title="⚖️ Mesures corporelles">
          <EditableField
            label="Poids actuel (kg)"
            value={profileData.currentWeight ? profileData.currentWeight.toString() : ''}
            onChangeText={(text) => setProfileData(prev => ({ 
              ...prev, 
              currentWeight: parseFloat(text) || 0 
            }))}
            placeholder="Ex: 70.5"
          />
          
          <EditableField
            label="Poids cible (kg)"
            value={profileData.targetWeight ? profileData.targetWeight.toString() : ''}
            onChangeText={(text) => setProfileData(prev => ({ 
              ...prev, 
              targetWeight: parseFloat(text) || 0 
            }))}
            placeholder="Ex: 65"
          />
          
          <EditableField
            label="Taille (cm)"
            value={profileData.height ? profileData.height.toString() : ''}
            onChangeText={(text) => setProfileData(prev => ({ 
              ...prev, 
              height: parseFloat(text) || 0 
            }))}
            placeholder="Ex: 175"
          />
          
          <EditableField
            label="Tour de taille (cm)"
            value={profileData.waistMeasurement ? profileData.waistMeasurement.toString() : ''}
            onChangeText={(text) => setProfileData(prev => ({ 
              ...prev, 
              waistMeasurement: parseFloat(text) || 0 
            }))}
            placeholder="Ex: 80"
          />
          
          {!isEditing && profileData.height > 0 && profileData.currentWeight > 0 && (
            <View style={styles.bmiContainer}>
              <Text style={styles.bmiLabel}>IMC :</Text>
              <Text style={styles.bmiValue}>
                {TrackingService.calculateBMI(profileData.currentWeight, profileData.height)}
              </Text>
              <Text style={styles.bmiCategory}>
                {getBMICategory(TrackingService.calculateBMI(profileData.currentWeight, profileData.height))}
              </Text>
            </View>
          )}
        </ProfileSection>

        {/* Préférences sportives */}
        <ProfileSection title="💪 Préférences sportives">
          <SelectField
            label="Niveau sportif"
            value={formData.niveauSport}
            options={niveauxSport}
            onSelect={(value) => handleInputChange('niveauSport', value)}
          />
        </ProfileSection>

        {/* Préférences alimentaires */}
        <ProfileSection title="🍽️ Préférences alimentaires">
          <MultiSelectField
            label="Régimes alimentaires"
            values={formData.preferencesAlimentaires}
            options={preferencesOptions}
            onToggle={togglePreference}
          />
        </ProfileSection>

        {/* Objectifs */}
        <ProfileSection title="🎯 Objectifs">
          <MultiSelectField
            label="Vos objectifs"
            values={formData.objectifs}
            options={objectifsOptions}
            onToggle={toggleObjectif}
          />
        </ProfileSection>

        {/* Paramètres */}
        <ProfileSection title="⚙️ Paramètres">
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={Colors.agpBlue} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.agpLightBlue }}
              thumbColor={notifications ? Colors.agpBlue : Colors.textSecondary}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Droplets size={20} color={Colors.agpBlue} />
              <Text style={styles.settingLabel}>Rappels d'hydratation</Text>
            </View>
            <Switch
              value={waterNotifications}
              onValueChange={setWaterNotifications}
              trackColor={{ false: Colors.border, true: Colors.agpLightBlue }}
              thumbColor={waterNotifications ? Colors.agpBlue : Colors.textSecondary}
            />
          </View>
          
          <NotificationSettings />

          {/* Testeur de notifications */}
          {showNotificationSettings && (
            <NotificationTester />
          )}

          {waterNotifications && (
            <View style={styles.waterObjectiveSetting}>
              <Text style={styles.waterObjectiveLabel}>Objectif quotidien d'eau</Text>
              <View style={styles.waterObjectiveControls}>
                <TouchableOpacity
                  style={styles.waterObjectiveButton}
                  onPress={() => setWaterObjective(Math.max(1, waterObjective - 1))}
                >
                  <Text style={styles.waterObjectiveButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.waterObjectiveValue}>
                  <Text style={styles.waterObjectiveValueText}>{waterObjective}</Text>
                  <Text style={styles.waterObjectiveUnit}>verres</Text>
                </View>
                <TouchableOpacity
                  style={styles.waterObjectiveButton}
                  onPress={() => setWaterObjective(waterObjective + 1)}
                >
                  <Text style={styles.waterObjectiveButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.waterObjectiveHelp}>
                Recommandation : 8 verres (environ 2L) par jour
              </Text>
            </View>
          )}
        </ProfileSection>

        {/* Statistiques */}
        <ProfileSection title="📊 Statistiques">
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Activity size={24} color={Colors.agpGreen} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Exercices</Text>
            </View>
            
            <View style={styles.statItem}>
              <Heart size={24} color={Colors.relaxation} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Favoris</Text>
            </View>
            
            <View style={styles.statItem}>
              <Target size={24} color={Colors.morning} />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Jours actifs</Text>
            </View>
          </View>
        </ProfileSection>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={Colors.relaxation} />
            ) : (
              <LogOut size={24} color={Colors.relaxation} />
            )}
            <Text style={[styles.actionButtonText, { color: Colors.relaxation }]}>
              Déconnexion
            </Text>
            <ChevronRight size={24} color={Colors.relaxation} />
          </TouchableOpacity>
        </View>

        {/* Informations de compte */}
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTitle}>Informations du compte</Text>
          <Text style={styles.accountInfoText}>
            Membre depuis : {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
          </Text>
          <Text style={styles.accountInfoText}>
            Dernière mise à jour : {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'Jamais'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// Fonction pour obtenir la catégorie d'IMC
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Insuffisance pondérale';
  if (bmi < 25) return 'Corpulence normale';
  if (bmi < 30) return 'Surpoids';
  if (bmi < 35) return 'Obésité modérée';
  if (bmi < 40) return 'Obésité sévère';
  return 'Obésité morbide';
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
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
  },
  content: {
    padding: 20,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    paddingVertical: 8,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectOption: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectOptionSelected: {
    backgroundColor: Colors.agpBlue,
    borderColor: Colors.agpBlue,
  },
  selectOptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  selectOptionTextSelected: {
    color: Colors.textLight,
  },
  multiSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  multiSelectOption: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  multiSelectOptionSelected: {
    backgroundColor: Colors.agpGreen,
    borderColor: Colors.agpGreen,
  },
  multiSelectOptionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  multiSelectOptionTextSelected: {
    color: Colors.textLight,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  waterObjectiveSetting: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginLeft: 36,
  },
  waterObjectiveLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginBottom: 12,
  },
  waterObjectiveControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  waterObjectiveButton: {
    backgroundColor: Colors.agpBlue,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterObjectiveButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  waterObjectiveValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
  },
  waterObjectiveValueText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    marginRight: 4,
  },
  waterObjectiveUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
  },
  waterObjectiveHelp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 24,
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 12,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.relaxation,
  },
  actionButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
  },
  accountInfo: {
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.agpBlue,
  },
  accountInfoTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  accountInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.agpLightBlue,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  bmiLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
    marginRight: 8,
  },
  bmiValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.agpBlue,
    marginRight: 8,
  },
  bmiCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
});