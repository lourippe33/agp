import { useState, useEffect } from 'react';
import { Bell, X, Check, Smartphone, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  requestNotificationPermission,
  subscribeUserToPush,
  unsubscribeFromPush,
  checkPushSubscription,
  isNotificationSupported
} from '../../utils/pushNotifications';

interface NotificationsSettingsProps {
  onClose: () => void;
}

export function NotificationsSettings({ onClose }: NotificationsSettingsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    setNotificationSupported(isNotificationSupported());
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
    if (user) {
      loadSettings();
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    const isSubscribed = await checkPushSubscription();
    setPushSubscribed(isSubscribed);
  };

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('notifications_enabled')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRemindersEnabled(data.notifications_enabled || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleToggle = async () => {
    if (!user) return;

    const newValue = !remindersEnabled;
    setLoading(true);

    try {
      if (newValue) {
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setPermissionStatus(permission);

          if (permission !== 'granted') {
            alert('Vous devez autoriser les notifications pour activer les rappels');
            setLoading(false);
            return;
          }
        }
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          notifications_enabled: newValue,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setRemindersEnabled(newValue);

      if (newValue) {
        new Notification('Rappels activés!', {
          body: 'Vous recevrez maintenant des notifications pour vos repas et suivi quotidien.',
          icon: '/LOGO AGP.png'
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Erreur lors de la mise à jour');
      await loadSettings();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-[#4A7729]" />
            <h2 className="text-xl font-bold text-[#333333]">Rappels</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!notificationSupported && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800 mb-1">
                  Notifications non disponibles
                </p>
                <p className="text-sm text-orange-700">
                  Votre navigateur ne supporte pas les notifications push. Essayez Chrome, Firefox ou Safari.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-[#333333]">
                  Notifications Push
                </h3>
                <Smartphone className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">
                Recevez des rappels sur votre téléphone même quand l'app est fermée
              </p>
            </div>
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                remindersEnabled ? 'bg-[#4A7729]' : 'bg-gray-300'
              } disabled:opacity-50`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  remindersEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {remindersEnabled && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800">Rappels activés</p>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Vous recevrez des rappels chronobiologiques :
              </p>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 7h00 - Protéines et bons gras</li>
                <li>• 12h00 - Repas principal</li>
                <li>• 16h00 - Collation équilibrée</li>
                <li>• 19h00 - Dîner léger</li>
                <li>• 21h00 - Suivi quotidien</li>
              </ul>
            </div>
          )}

          {!remindersEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Les rappels sont désactivés. Activez-les pour ne rien oublier!
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#4A7729] text-white rounded-lg hover:bg-[#3d6322] transition-colors font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
