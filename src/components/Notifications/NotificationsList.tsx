import { useState, useEffect } from 'react';
import { X, Check, Clock, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

interface NotificationsListProps {
  onClose: () => void;
}

export function NotificationsList({ onClose }: NotificationsListProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('in_app_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('in_app_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const unreadIds = notifications
        .filter((notif) => !notif.is_read)
        .map((notif) => notif.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('in_app_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadIds)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          is_read: true,
          read_at: notif.read_at || new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'snack':
        return '☕';
      case 'dinner':
        return '🌙';
      case 'wellness':
        return '✨';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-[#2B7BBE]" />
            <div>
              <h2 className="text-xl font-bold text-[#333333]">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex-shrink-0">
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#2B7BBE] font-semibold hover:text-[#2364A5] flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Tout marquer comme lu</span>
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B7BBE]"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">Aucune notification</p>
              <p className="text-sm text-gray-500 mt-1">
                Vos notifications apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2 p-1 hover:bg-white rounded transition-colors flex-shrink-0"
                            title="Marquer comme lu"
                          >
                            <Check className="w-4 h-4 text-[#2B7BBE]" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.body}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(notification.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#2B7BBE] text-white rounded-lg hover:bg-[#2364A5] transition-colors font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
