import React, { useState } from 'react';
import { Clock, Mail, LogOut, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PendingApprovalProps {
  onRefresh?: () => void;
}

export function PendingApproval({ onRefresh }: PendingApprovalProps = {}) {
  const [checking, setChecking] = useState(false);

  async function handleCheckStatus() {
    setChecking(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      window.location.reload();
    }
    setChecking(false);
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
