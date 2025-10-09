import { supabase } from '../lib/supabase';

const PUBLIC_VAPID_KEY = 'BKxYZ_PLACEHOLDER_VAPID_KEY_WILL_BE_GENERATED';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Ce navigateur ne supporte pas les notifications');
  }

  if (!('serviceWorker' in navigator)) {
    throw new Error('Ce navigateur ne supporte pas les Service Workers');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

export async function subscribeUserToPush(userId: string): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    const subscriptionData = JSON.parse(JSON.stringify(subscription));

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscriptionData,
        endpoint: subscription.endpoint,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error saving subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return false;
  }
}

export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing subscription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
}

export async function checkPushSubscription(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    return false;
  }
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}
