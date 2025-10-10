import React, { useState, useEffect } from 'react';
import { Clock, Mail, LogOut, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PendingApprovalProps {
  onRefresh?: () => void;
}

export function PendingApproval({ onRefresh }: PendingApprovalProps = {}) {
  const [checking, setChecking] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkProfileExists();
  }, []);

  async function checkProfileExists() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking profile:', error);
      }

      if (!data) {
        console.log('No profile found - trigger may have failed');
        setNoProfile(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleCheckStatus() {
    setChecking(true);
    await checkProfileExists();
    if (onRefresh) {
      await onRefresh();
    } else {
      window.location.reload();
    }
    setChecking(false);
  }

  async function handleCreateProfile() {
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Utilisateur non connecté');
        return;
      }

      console.log('Creating profile for user:', user.id, user.email);

      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          notifications_enabled: false,
          is_approved: false
        });

      if (error) {
        console.error('Error creating profile:', error);
        alert('Erreur lors de la création du profil: ' + error.message);
      } else {
        setNoProfile(false);
        alert('Profil créé avec succès ! Votre compte est maintenant en attente de validation.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur: ' + error);
    }
    setCreating(false);
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.clear();
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            En attente de validation
          </h1>

          <p className="text-gray-600 mb-6">
            Votre compte a été créé avec succès ! Un administrateur doit maintenant valider votre accès à l'application AGP.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Vous serez notifié par email</p>
                <p className="text-blue-700">
                  Dès que votre compte sera approuvé, vous recevrez un email de confirmation et pourrez accéder à toutes les fonctionnalités de l'application.
                </p>
              </div>
            </div>
          </div>

          {noProfile && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">
                  <p className="font-medium mb-1">Profil non trouvé</p>
                  <p className="text-red-700 mb-2">
                    Votre profil utilisateur n'a pas été créé automatiquement. Cliquez sur le bouton ci-dessous pour le créer manuellement.
                  </p>
                  <button
                    onClick={handleCreateProfile}
                    disabled={creating}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {creating ? 'Création...' : 'Créer mon profil'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Vérification...' : 'Vérifier le statut'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Besoin d'aide ? Contactez l'administrateur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
