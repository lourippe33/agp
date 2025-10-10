import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Target, Ruler, Weight, UtensilsCrossed, Moon, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingData {
  fullName: string;
  birthDate: string;
  gender: string;
  height: number | '';
  initialWeight: number | '';
  targetWeight: number | '';
  mainGoal: string;
  allergies: string;
  foodPreferences: string[];
  activityLevel: string;
  chronoType: string;
  sleepDuration: number | '';
  wakeUpTime: string;
}

interface OnboardingQuestionnaireProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: 'Informations personnelles', icon: Target },
  { id: 2, title: 'Objectifs', icon: Target },
  { id: 3, title: 'Mesures corporelles', icon: Ruler },
  { id: 4, title: 'Alimentation', icon: UtensilsCrossed },
  { id: 5, title: 'Activité & Sommeil', icon: Activity },
];

export function OnboardingQuestionnaire({ onComplete }: OnboardingQuestionnaireProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    birthDate: '',
    gender: '',
    height: '',
    initialWeight: '',
    targetWeight: '',
    mainGoal: '',
    allergies: '',
    foodPreferences: [],
    activityLevel: '',
    chronoType: '',
    sleepDuration: '',
    wakeUpTime: '',
  });

  useEffect(() => {
    loadExistingData();
  }, [user]);

  const loadExistingData = async () => {
    if (!user) return;

    setLoadingData(true);
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (profile) {
        setData({
          fullName: profile.full_name || '',
          birthDate: profile.birth_date || '',
          gender: profile.gender || '',
          height: profile.height || '',
          initialWeight: profile.initial_weight || '',
          targetWeight: profile.target_weight || '',
          mainGoal: profile.main_goal || '',
          allergies: profile.allergies || '',
          foodPreferences: Array.isArray(profile.food_preferences) ? profile.food_preferences : [],
          activityLevel: profile.activity_level || '',
          chronoType: profile.chrono_type || '',
          sleepDuration: profile.sleep_duration || '',
          wakeUpTime: profile.wake_up_time || '',
        });
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des données:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const togglePreference = (pref: string) => {
    setData(prev => ({
      ...prev,
      foodPreferences: prev.foodPreferences.includes(pref)
        ? prev.foodPreferences.filter(p => p !== pref)
        : [...prev.foodPreferences, pref]
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.fullName,
          birth_date: data.birthDate,
          gender: data.gender,
          height: data.height || null,
          initial_weight: data.initialWeight || null,
          target_weight: data.targetWeight || null,
          main_goal: data.mainGoal,
          allergies: data.allergies,
          food_preferences: data.foodPreferences,
          activity_level: data.activityLevel,
          chrono_type: data.chronoType,
          sleep_duration: data.sleepDuration || null,
          wake_up_time: data.wakeUpTime,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onComplete();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.fullName && data.birthDate && data.gender;
      case 2:
        return data.mainGoal;
      case 3:
        return data.height && data.initialWeight && data.targetWeight;
      case 4:
        return true;
      case 5:
        return data.activityLevel && data.chronoType;
      default:
        return false;
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#7AC943] via-[#4A7729] to-[#2D4A1A] flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7AC943]"></div>
            <p className="text-gray-700">Chargement de vos données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#7AC943] via-[#4A7729] to-[#2D4A1A] flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
        <div className="bg-gradient-to-r from-[#7AC943] to-[#4A7729] p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Bienvenue dans AGP</h2>
          <p className="text-green-100">Configurons votre profil en quelques étapes</p>

          <div className="mt-6 flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep > step.id ? 'bg-white text-[#4A7729]' :
                  currentStep === step.id ? 'bg-white text-[#4A7729]' :
                  'bg-green-600 text-white'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-1 w-12 mx-1 ${
                    currentStep > step.id ? 'bg-white' : 'bg-green-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#333333] mb-4">Informations personnelles</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateData('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                <input
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => updateData('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexe *</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Homme', 'Femme'].map(gender => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => updateData('gender', gender)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        data.gender === gender
                          ? 'border-[#7AC943] bg-green-50 text-[#4A7729]'
                          : 'border-gray-300 text-gray-700 hover:border-[#7AC943]'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#333333] mb-4">Votre objectif principal</h3>

              <div className="space-y-3">
                {[
                  { value: 'weight_loss', label: 'Perdre du poids', emoji: '📉' },
                  { value: 'weight_gain', label: 'Prendre du poids', emoji: '📈' },
                  { value: 'maintain', label: 'Maintenir mon poids', emoji: '⚖️' },
                  { value: 'health', label: 'Améliorer ma santé', emoji: '💚' },
                  { value: 'energy', label: 'Avoir plus d\'énergie', emoji: '⚡' },
                  { value: 'sleep', label: 'Mieux dormir', emoji: '😴' },
                ].map(goal => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => updateData('mainGoal', goal.value)}
                    className={`w-full px-6 py-4 rounded-lg border-2 font-medium transition-all flex items-center space-x-3 ${
                      data.mainGoal === goal.value
                        ? 'border-[#7AC943] bg-green-50 text-[#4A7729]'
                        : 'border-gray-300 text-gray-700 hover:border-[#7AC943]'
                    }`}
                  >
                    <span className="text-2xl">{goal.emoji}</span>
                    <span>{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#333333] mb-4">Vos mesures</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Ruler className="inline w-4 h-4 mr-1" />
                    Taille (cm) *
                  </label>
                  <input
                    type="number"
                    value={data.height}
                    onChange={(e) => updateData('height', e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                    placeholder="170"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="inline w-4 h-4 mr-1" />
                    Poids actuel (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.initialWeight}
                    onChange={(e) => updateData('initialWeight', e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                    placeholder="70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="inline w-4 h-4 mr-1" />
                  Poids objectif (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={data.targetWeight}
                  onChange={(e) => updateData('targetWeight', e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                  placeholder="65"
                />
              </div>

              {data.height && data.initialWeight && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Votre IMC actuel</p>
                  <p className="text-2xl font-bold text-[#4A7729]">
                    {(Number(data.initialWeight) / Math.pow(Number(data.height) / 100, 2)).toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#333333] mb-4">Alimentation</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies ou intolérances
                </label>
                <textarea
                  value={data.allergies}
                  onChange={(e) => updateData('allergies', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                  placeholder="Lactose, gluten, noix..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Préférences alimentaires (plusieurs choix possibles)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'omnivore', label: 'Omnivore' },
                    { value: 'vegetarian', label: 'Végétarien' },
                    { value: 'vegan', label: 'Végétalien' },
                    { value: 'pescatarian', label: 'Pescétarien' },
                    { value: 'no_pork', label: 'Sans porc' },
                    { value: 'halal', label: 'Halal' },
                    { value: 'kosher', label: 'Casher' },
                    { value: 'gluten_free', label: 'Sans gluten' },
                  ].map(pref => (
                    <button
                      key={pref.value}
                      type="button"
                      onClick={() => togglePreference(pref.value)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        data.foodPreferences.includes(pref.value)
                          ? 'border-[#7AC943] bg-green-50 text-[#4A7729]'
                          : 'border-gray-300 text-gray-700 hover:border-[#7AC943]'
                      }`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#333333] mb-4">Activité & Sommeil</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="inline w-4 h-4 mr-1" />
                  Niveau d'activité physique *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'sedentary', label: 'Sédentaire', desc: 'Peu ou pas d\'exercice' },
                    { value: 'light', label: 'Léger', desc: '1-3 jours/semaine' },
                    { value: 'moderate', label: 'Modéré', desc: '3-5 jours/semaine' },
                    { value: 'active', label: 'Actif', desc: '6-7 jours/semaine' },
                    { value: 'very_active', label: 'Très actif', desc: 'Sport intense quotidien' },
                  ].map(level => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateData('activityLevel', level.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        data.activityLevel === level.value
                          ? 'border-[#7AC943] bg-green-50 text-[#4A7729]'
                          : 'border-gray-300 text-gray-700 hover:border-[#7AC943]'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm opacity-75">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Moon className="inline w-4 h-4 mr-1" />
                  Votre chrono-type *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'lark', label: '🌅 Alouette', desc: 'Couche-tôt, lève-tôt' },
                    { value: 'middle', label: '🦜 Intermédiaire', desc: 'Rythme classique' },
                    { value: 'owl', label: '🦉 Hibou', desc: 'Couche-tard, lève-tard' },
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateData('chronoType', type.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                        data.chronoType === type.value
                          ? 'border-[#7AC943] bg-green-50 text-[#4A7729]'
                          : 'border-gray-300 text-gray-700 hover:border-[#7AC943]'
                      }`}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm opacity-75">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée de sommeil (h)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.sleepDuration}
                    onChange={(e) => updateData('sleepDuration', e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de réveil
                  </label>
                  <input
                    type="time"
                    value={data.wakeUpTime}
                    onChange={(e) => updateData('wakeUpTime', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="sticky bottom-0 bg-white flex items-center justify-between mt-8 pt-6 border-t border-gray-200 -mx-6 md:-mx-8 px-6 md:px-8 pb-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all ${
                !isStepValid() || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#7AC943] to-[#4A7729] text-white hover:shadow-lg'
              }`}
            >
              <span>{currentStep === STEPS.length ? 'Terminer' : 'Suivant'}</span>
              {currentStep === STEPS.length ? (
                <Check className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
