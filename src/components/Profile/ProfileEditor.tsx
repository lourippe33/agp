import { useState, useEffect } from 'react';
import { User, Save, X, Lock, ClipboardList } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  fullName: string;
  birthDate: string;
  gender: string;
  height: number | '';
  initialWeight: number | '';
  targetWeight: number | '';
}

interface ProfileEditorProps {
  onClose: () => void;
  onSave: () => void;
  onOpenQuestionnaire?: () => void;
}

interface ErrorDetails {
  message: string;
  hint?: string;
  details?: string;
}

export function ProfileEditor({ onClose, onSave, onOpenQuestionnaire }: ProfileEditorProps) {
  const { user, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    birthDate: '',
    gender: '',
    height: '',
    initialWeight: '',
    targetWeight: '',
  });

  const calculateBMI = () => {
    if (profileData.height && profileData.initialWeight) {
      const heightInMeters = Number(profileData.height) / 100;
      const bmi = Number(profileData.initialWeight) / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Insuffisance pondérale', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Poids normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { label: 'Surpoids', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Obésité', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null;

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileData({
          fullName: data.full_name || '',
          birthDate: data.birth_date || '',
          gender: data.gender || '',
          height: data.height || '',
          initialWeight: data.initial_weight || '',
          targetWeight: data.target_weight || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updatePassword(newPassword);
      setSuccess('Mot de passe modifié avec succès!');
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      setError(error?.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profileUpdate = {
        full_name: profileData.fullName,
        birth_date: profileData.birthDate || null,
        gender: profileData.gender,
        height: profileData.height || null,
        initial_weight: profileData.initialWeight || null,
        target_weight: profileData.targetWeight || null,
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          ...profileUpdate,
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      const errorMsg = error?.message || 'Erreur inconnue';
      const errorDetails = error?.details || error?.hint || '';
      setError(`Erreur: ${errorMsg}${errorDetails ? ' - ' + errorDetails : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-[#4A7729]" />
            <h2 className="text-xl font-bold text-[#333333]">Modifier mon profil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              placeholder="Votre nom"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance
              </label>
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexe
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taille (cm)
            </label>
            <input
              type="number"
              value={profileData.height}
              onChange={(e) => setProfileData({ ...profileData, height: e.target.value ? parseFloat(e.target.value) : '' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
              placeholder="170"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids initial (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={profileData.initialWeight}
                onChange={(e) => setProfileData({ ...profileData, initialWeight: e.target.value ? parseFloat(e.target.value) : '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                placeholder="75.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poids cible (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={profileData.targetWeight}
                onChange={(e) => setProfileData({ ...profileData, targetWeight: e.target.value ? parseFloat(e.target.value) : '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                placeholder="70.0"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-3">
            {onOpenQuestionnaire && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuestionnaire();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#7AC943] to-[#4A7729] text-white hover:shadow-lg rounded-lg transition-all"
              >
                <div className="flex items-center space-x-3">
                  <ClipboardList className="w-5 h-5" />
                  <span className="font-medium">Modifier mon questionnaire</span>
                </div>
                <span className="text-white">→</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Changer le mot de passe</span>
              </div>
              <span className="text-gray-400">{showPasswordChange ? '−' : '+'}</span>
            </button>

            {showPasswordChange && (
              <div className="mt-4 space-y-4 px-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7AC943] focus:border-transparent"
                    placeholder="Retapez le mot de passe"
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full px-4 py-3 bg-[#4A9CD9] text-white rounded-lg hover:bg-[#3a7cb9] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </div>
            )}
          </div>

          {bmi && bmiCategory && (
            <div className={`${bmiCategory.bg} border-2 ${bmiCategory.color.replace('text', 'border')} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Indice de Masse Corporelle (IMC)</h3>
                <span className={`text-2xl font-bold ${bmiCategory.color}`}>{bmi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${bmiCategory.color}`}>{bmiCategory.label}</span>
                <span className="text-xs text-gray-600">IMC = Poids (kg) / Taille² (m²)</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>&lt; 18.5: Insuffisance</span>
                  <span>18.5-24.9: Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>25-29.9: Surpoids</span>
                  <span>≥ 30: Obésité</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
