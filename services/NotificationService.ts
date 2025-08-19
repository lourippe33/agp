import { LocalStorageService } from './LocalStorageService';

// Types pour les notifications
export interface NotificationSettings {
  enabled: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  trackingReminders: boolean;
  motivationalMessages: boolean;
  mealTimes: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  waterTimes: string[];
  trackingTime: string;
  motivationalTime: string;
}

export interface Notification {
  id: string;
  type: 'meal' | 'water' | 'tracking' | 'motivational';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEYS = {
  NOTIFICATION_SETTINGS: '@agp_notification_settings',
  NOTIFICATIONS: '@agp_notifications',
};

// Liste des messages motivants
const MOTIVATIONAL_MESSAGES = [
  "Aujourd'hui est un nouveau départ 🌞",
  "Vous êtes plus fort que vos excuses 💪",
  "Chaque petit pas compte 🚶",
  "Prenez soin de vous, c'est un acte d'amour 💚",
  "Rappelez-vous pourquoi vous avez commencé 🌱",
  "Le changement durable commence par la régularité 🔄",
  "Votre corps mérite ce qu'il y a de mieux 🍽️",
  "Pensez chrono, vivez en harmonie avec votre rythme ⏰",
  "Rien ne vaut la sensation d'avancer dans la bonne direction ➡️",
  "Une journée, un repas, une victoire 🏆",
  "Ce que vous faites aujourd'hui construit votre demain 🧱",
  "L'énergie vient aussi de vos choix 🥗💧",
  "Prenez soin de votre corps, c'est votre première maison 🏠",
  "Bravo pour chaque effort, même petit 👏",
  "Le plus difficile, c'est de commencer. Le reste suit 🎯",
  "Vous n'avez pas besoin d'être parfait, seulement constant 🌤️",
  "Ne sous-estimez jamais la puissance de la répétition 🔁",
  "Chaque repas chrono est un pas de plus vers votre objectif 👣",
  "Écoutez votre corps, il vous guide 🧘",
  "Aujourd'hui, vous progressez 💫",
  "Se lever avec une intention, c'est déjà réussir ✨",
  "Ne vous comparez pas, avancez à votre rythme 🛤️",
  "Tout progrès commence par une bonne décision 🎬",
  "Respecter votre rythme chrono, c'est vous respecter vous-même 💖",
  "Aujourd'hui est une chance de faire mieux qu'hier ☀️",
  "Vous êtes capable de grandes choses 🌟",
  "Le changement est un chemin, pas une course 🛣️",
  "L'équilibre commence dans l'assiette ⚖️",
  "Prenez le temps de savourer chaque avancée 🕊️",
  "Vos habitudes façonnent votre futur 🧩",
  "Un repas pris avec conscience vaut mille régimes 🙏",
  "Croyez en votre potentiel, il est là 🎈",
  "Laissez-vous surprendre par ce dont vous êtes capable 🎁",
  "Vous n'êtes pas seul dans ce chemin 💬",
  "L'écoute de soi est le plus beau des cadeaux 🎧",
  "Vous méritez de vous sentir bien dans votre corps et dans votre tête 🌼",
  "Chaque bonne décision vous rapproche de votre objectif 🎯",
  "Un jour à la fois, un choix à la fois 📅",
  "Le respect de votre horloge biologique change tout 🕓",
  "Le plus grand pouvoir, c'est celui de vos choix 🛠️",
  "Restez engagé, même dans les journées moins faciles 💭",
  "Souriez à vos efforts, ils portent leurs fruits 🍓",
  "Faites-le pour vous, et rien que pour vous ❤️",
  "Vos progrès ne dépendent que de vous 🚀",
  "Votre santé est votre plus bel investissement 💸",
  "La régularité est la clé, pas la perfection 🗝️",
  "Aujourd'hui, soyez votre priorité 🎁",
  "Se respecter, c'est aussi savoir dire non aux automatismes 🙅‍♂️",
  "Félicitez-vous pour chaque petit pas 👣",
  "Continuez, vous êtes sur la bonne voie 🌈"
];

// Messages pour les rappels de repas
const MEAL_MESSAGES = [
  "C'est l'heure de votre repas AGP : pensez à respecter votre rythme chrono 🍽️",
  "Pensez à manger en conscience et dans le bon timing ⏱️",
  "Votre repas vous attend ! Prenez le temps de savourer 🍽️",
  "Moment repas : nourrissez votre corps selon votre chronobiologie 🕰️",
  "C'est l'heure de recharger vos batteries ! Bon appétit 🍴"
];

// Messages pour les rappels d'hydratation
const WATER_MESSAGES = [
  "Un petit verre d'eau ? Votre corps vous dira merci ! 💧",
  "Hydratez-vous pour soutenir votre énergie ! 💦",
  "Moment hydratation : votre corps a besoin d'eau 💧",
  "N'oubliez pas de boire de l'eau régulièrement 🚰",
  "L'eau est votre meilleur allié pour rester en forme 💧"
];

// Messages pour les rappels de suivi
const TRACKING_MESSAGES = [
  "Avez-vous rempli votre journal AGP aujourd'hui ? Cela ne prend que 2 minutes.",
  "Votre régularité fait toute la différence. Complétez votre suivi 😊",
  "Un petit moment pour votre suivi quotidien ? 📝",
  "Prenez 2 minutes pour noter votre journée, c'est important ! 🖊️",
  "Votre suivi vous attend ! Gardez le cap avec régularité 📊"
];

export class NotificationService {
  // Récupérer les paramètres de notification
  static async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const settingsJson = await LocalStorageService.getItem(`${STORAGE_KEYS.NOTIFICATION_SETTINGS}_${userId}`);
      
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      
      // Paramètres par défaut
      return {
        enabled: true,
        mealReminders: true,
        waterReminders: true,
        trackingReminders: true,
        motivationalMessages: true,
        mealTimes: {
          breakfast: '07:30',
          lunch: '12:30',
          snack: '16:00',
          dinner: '19:30'
        },
        waterTimes: ['09:00', '12:00', '15:00', '18:00'],
        trackingTime: '20:30',
        motivationalTime: '08:00'
      };
    } catch (error) {
      console.error('Erreur récupération paramètres notifications:', error);
      return this.getDefaultSettings();
    }
  }

  // Sauvegarder les paramètres de notification
  static async saveNotificationSettings(userId: string, settings: NotificationSettings): Promise<void> {
    try {
      await LocalStorageService.setItem(
        `${STORAGE_KEYS.NOTIFICATION_SETTINGS}_${userId}`,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Erreur sauvegarde paramètres notifications:', error);
    }
  }

  // Récupérer les notifications
  static async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const notificationsJson = await LocalStorageService.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`);
      return notificationsJson ? JSON.parse(notificationsJson) : [];
    } catch (error) {
      console.error('Erreur récupération notifications:', error);
      return [];
    }
  }

  // Ajouter une notification
  static async addNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    try {
      console.log(`📣 Ajout d'une notification de type ${notification.type} pour l'utilisateur ${userId}`);
      const notifications = await this.getNotifications(userId);
      
      const newNotification: Notification = {
        ...notification,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      notifications.unshift(newNotification); // Ajouter au début pour avoir les plus récentes en premier
      
      // Limiter à 50 notifications
      const limitedNotifications = notifications.slice(0, 50);
      
      await LocalStorageService.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
        JSON.stringify(limitedNotifications)
      );
      
      console.log(`✅ Notification ajoutée avec succès: ${notification.title}`);
    } catch (error) {
      console.error('Erreur ajout notification:', error);
    }
  }

  // Marquer une notification comme lue
  static async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId);
      
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      await LocalStorageService.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  }

  // Marquer toutes les notifications comme lues
  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId);
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      await LocalStorageService.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
        JSON.stringify(updatedNotifications)
      );
    } catch (error) {
      console.error('Erreur marquage toutes notifications:', error);
    }
  }

  // Supprimer une notification
  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId);
      
      const filteredNotifications = notifications.filter(
        notification => notification.id !== notificationId
      );
      
      await LocalStorageService.setItem(
        `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`,
        JSON.stringify(filteredNotifications)
      );
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  }

  // Supprimer toutes les notifications
  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      console.log(`🗑️ [Service] Début de suppression des notifications pour l'utilisateur ${userId}`);
      
      // Vérifier si l'utilisateur existe
      if (!userId) {
        throw new Error('ID utilisateur manquant');
      }
      
      // Construire la clé de stockage
      const storageKey = `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`;
      console.log(`🔑 [Service] Clé de stockage: ${storageKey}`);
      
      // Supprimer directement les notifications avec removeItem
      await LocalStorageService.removeItem(storageKey);
      console.log(`🗑️ [Service] Suppression effectuée avec removeItem pour ${storageKey}`);
      
      // Vérifier que la suppression a fonctionné
      const afterClear = await LocalStorageService.getItem(storageKey);
      
      if (!afterClear) {
        console.log('✅ [Service] Toutes les notifications ont été supprimées avec succès');
        return true;
      } else {
        console.error('❌ [Service] Échec de la suppression des notifications');
        throw new Error('Échec de la suppression des notifications');
      }
    } catch (error) {
      console.error('❌ [Service] Erreur lors de la suppression de toutes les notifications:', error);
      throw error; // Propager l'erreur pour la gérer dans le composant
    }
  }

  // Générer une notification motivante aléatoire
  static async generateRandomMotivationalNotification(userId: string): Promise<void> {
    const settings = await this.getNotificationSettings(userId);
    
    if (!settings.enabled || !settings.motivationalMessages) {
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    const message = MOTIVATIONAL_MESSAGES[randomIndex];
    
    await this.addNotification(userId, {
      type: 'motivational',
      title: '✨ Motivation du jour',
      message
    });
  }

  // Générer une notification de rappel de repas
  static async generateMealReminder(userId: string, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'): Promise<void> {
    const settings = await this.getNotificationSettings(userId);
    
    if (!settings.enabled || !settings.mealReminders) {
      return;
    }
    
    const mealTitles = {
      breakfast: '🌅 Petit-déjeuner',
      lunch: '☀️ Déjeuner',
      snack: '🍪 Goûter',
      dinner: '🌙 Dîner'
    };
    
    const randomIndex = Math.floor(Math.random() * MEAL_MESSAGES.length);
    const message = MEAL_MESSAGES[randomIndex];
    
    await this.addNotification(userId, {
      type: 'meal',
      title: mealTitles[mealType],
      message
    });
  }

  // Générer une notification de rappel d'hydratation
  static async generateWaterReminder(userId: string): Promise<void> {
    const settings = await this.getNotificationSettings(userId);
    
    if (!settings.enabled || !settings.waterReminders) {
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * WATER_MESSAGES.length);
    const message = WATER_MESSAGES[randomIndex];
    
    await this.addNotification(userId, {
      type: 'water',
      title: '💧 Hydratation',
      message
    });
  }

  // Générer une notification de rappel de suivi
  static async generateTrackingReminder(userId: string): Promise<void> {
    const settings = await this.getNotificationSettings(userId);
    
    if (!settings.enabled || !settings.trackingReminders) {
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * TRACKING_MESSAGES.length);
    const message = TRACKING_MESSAGES[randomIndex];
    
    await this.addNotification(userId, {
      type: 'tracking',
      title: '📝 Suivi quotidien',
      message
    });
  }

  // Vérifier et envoyer les notifications selon l'heure
  static async checkAndSendNotifications(userId: string): Promise<void> {
    const settings = await this.getNotificationSettings(userId);
    
    if (!settings.enabled) {
      return;
    }
    
    // Vérifier si c'est 23h59 pour nettoyer les notifications du jour
    await this.cleanupDailyNotifications(userId);
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Vérifier les rappels de repas
    if (settings.mealReminders) {
      if (this.isTimeMatch(currentTime, settings.mealTimes.breakfast)) {
        await this.generateMealReminder(userId, 'breakfast');
      }
      if (this.isTimeMatch(currentTime, settings.mealTimes.lunch)) {
        await this.generateMealReminder(userId, 'lunch');
      }
      if (this.isTimeMatch(currentTime, settings.mealTimes.snack)) {
        await this.generateMealReminder(userId, 'snack');
      }
      if (this.isTimeMatch(currentTime, settings.mealTimes.dinner)) {
        await this.generateMealReminder(userId, 'dinner');
      }
    }
    
    // Vérifier les rappels d'hydratation
    if (settings.waterReminders) {
      for (const waterTime of settings.waterTimes) {
        if (this.isTimeMatch(currentTime, waterTime)) {
          await this.generateWaterReminder(userId);
          break;
        }
      }
    }
    
    // Vérifier le rappel de suivi
    if (settings.trackingReminders && this.isTimeMatch(currentTime, settings.trackingTime)) {
      await this.generateTrackingReminder(userId);
    }
    
    // Vérifier le message motivant
    if (settings.motivationalMessages && this.isTimeMatch(currentTime, settings.motivationalTime)) {
      await this.generateRandomMotivationalNotification(userId);
    }
  }

  // Nettoyer toutes les notifications du jour à 23h59
  static async cleanupDailyNotifications(userId: string): Promise<void> {
    try {
      const now = new Date();
      const isCleanupTime = now.getHours() === 23 && now.getMinutes() === 59; // Exactement 23h59
      
      if (!isCleanupTime) {
        return; // Ne nettoyer qu'à 23h59
      }
      
      console.log('🧹 Nettoyage automatique des notifications du jour à 23h59...');
      
      // Supprimer toutes les notifications du jour
      const storageKey = `${STORAGE_KEYS.NOTIFICATIONS}_${userId}`;
      await LocalStorageService.removeItem(storageKey);
      
      console.log('✅ Toutes les notifications du jour ont été effacées à 23h59');
      
      // Le lendemain, l'utilisateur aura une interface vierge
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage quotidien:', error);
    }
  }

  // Vérifier si l'heure actuelle correspond à l'heure de notification (avec une marge de 5 minutes)
  private static isTimeMatch(currentTime: string, targetTime: string): boolean {
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [targetHour, targetMinute] = targetTime.split(':').map(Number);
    
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const targetTotalMinutes = targetHour * 60 + targetMinute;
    
    // Marge de 5 minutes
    return Math.abs(currentTotalMinutes - targetTotalMinutes) <= 5;
  }

  // Paramètres par défaut
  private static getDefaultSettings(): NotificationSettings {
    return {
      enabled: true,
      mealReminders: true,
      waterReminders: true,
      trackingReminders: true,
      motivationalMessages: true,
      mealTimes: {
        breakfast: '07:30',
        lunch: '12:30',
        snack: '16:00',
        dinner: '19:30'
      },
      waterTimes: ['09:00', '12:00', '15:00', '18:00'],
      trackingTime: '20:30',
      motivationalTime: '08:00'
    };
  }

  // Générer un ID unique
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}