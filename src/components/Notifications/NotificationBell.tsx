import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationBellProps {
  onOpenNotifications: () => void;
}

export function NotificationBell({ onOpenNotifications }: NotificationBellProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();

      const subscription = supabase
        .channel('in_app_notifications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'in_app_notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadUnreadCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('in_app_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  return (
    <button
      onClick={onOpenNotifications}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Bell className="w-6 h-6 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
