import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, X, Check, Trash2, Square, SquareCheck as CheckSquare } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationService, Notification } from '@/services/NotificationService';

interface NotificationBellProps {
  style?: any;
}

const { height } = Dimensions.get('window');

export default function NotificationBell({ style }: NotificationBellProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Vérifier les notifications toutes les minutes
      const interval = setInterval(() => {
        checkForNewNotifications();
      }, 60000); // 60 secondes
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const userNotifications = await NotificationService.getNotifications(user.id);
      setNotifications(userNotifications);
      
      // Calculer le nombre de notifications non lues
      const unread = userNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const checkForNewNotifications = async () => {
    if (!user) return;
    
    try {
      // Vérifier et envoyer les notifications selon l'heure
      await NotificationService.checkAndSendNotifications(user.id);
      
      // Recharger les notifications
      loadNotifications();
    } catch (error) {
      console.error('Erreur lors de la vérification des notifications:', error);
    }
  };

  const handleOpenNotifications = () => {
    console.log('Ouverture des notifications');
    setModalVisible(true);
  };

  const handleCloseNotifications = () => {
    console.log('Fermeture des notifications');
    setModalVisible(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      console.log('Marquage notification comme lue:', notificationId);
      await NotificationService.markNotificationAsRead(user.id, notificationId);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      console.log('Marquage de toutes les notifications comme lues');
      await NotificationService.markAllNotificationsAsRead(user.id);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Mettre à jour le compteur
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    
    console.log('🔍 [DEBUG] Début handleClearAll');
    console.log('🔍 [DEBUG] User ID:', user.id);
    console.log('🔍 [DEBUG] Notifications actuelles:', notifications.length);
    
    Alert.alert(
      'Supprimer toutes les notifications',
      'Êtes-vous sûr de vouloir supprimer toutes vos notifications ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ [DEBUG] Début de la suppression');
              const notificationKey = `@agp_notifications_${user.id}`;
              console.log('🔑 [DEBUG] Clé de stockage:', notificationKey);
              
              // Vérifier d'abord ce qui existe
              const existingData = await AsyncStorage.getItem(notificationKey);
              console.log('📋 [DEBUG] Données existantes:', existingData ? 'Trouvées' : 'Aucune');
              
              // Supprimer les données
              await AsyncStorage.removeItem(notificationKey);
              console.log('🗑️ [DEBUG] removeItem exécuté');
              
              // Vérifier la suppression
              const afterRemoval = await AsyncStorage.getItem(notificationKey);
              console.log('🔍 [DEBUG] Après suppression:', afterRemoval);
              
              if (afterRemoval === null) {
                console.log('✅ [DEBUG] Suppression vérifiée avec succès');
                
                // Mettre à jour l'état local
                setNotifications([]);
                setUnreadCount(0);
                console.log('🔄 [DEBUG] État local mis à jour');
                
                // Sortir du mode sélection si actif
                setSelectionMode(false);
                setSelectedNotifications([]);
                console.log('🔄 [DEBUG] Mode sélection désactivé');
                
                Alert.alert(
                  '✅ Suppression réussie',
                  'Toutes vos notifications ont été supprimées.',
                  [{ text: 'OK', style: 'default' }]
                );
              } else {
                console.error('❌ [DEBUG] Échec de vérification, données encore présentes:', afterRemoval);
                throw new Error('Les données n\'ont pas été supprimées');
              }
            } catch (error) {
              console.error('❌ [DEBUG] Erreur complète:', error);
              Alert.alert(
                'Erreur',
                `Une erreur est survenue: ${error.message}. Veuillez réessayer.`,
                [{ text: 'OK', style: 'default' }]
              );
            }
          }
        }
      ]
    );
  };

  const handleDeleteSelected = async () => {
    if (!user || selectedNotifications.length === 0) return;
    
    console.log('🔍 [DEBUG] Début handleDeleteSelected');
    console.log('🔍 [DEBUG] Notifications sélectionnées:', selectedNotifications.length);
    
    Alert.alert(
      'Supprimer les notifications sélectionnées',
      `Êtes-vous sûr de vouloir supprimer ${selectedNotifications.length} notification${selectedNotifications.length > 1 ? 's' : ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`🗑️ [DEBUG] Suppression de ${selectedNotifications.length} notifications`);
              console.log('📋 [DEBUG] IDs à supprimer:', selectedNotifications);
              
              // Filtrer les notifications pour supprimer celles sélectionnées
              const updatedNotifications = notifications.filter(
                notification => !selectedNotifications.includes(notification.id)
              );
              
              console.log(`📊 [DEBUG] Notifications restantes: ${updatedNotifications.length}`);
              
              // Sauvegarder les notifications restantes
              const notificationKey = `@agp_notifications_${user.id}`;
              console.log('🔑 [DEBUG] Clé de sauvegarde:', notificationKey);
              
              if (updatedNotifications.length === 0) {
                // Si plus de notifications, supprimer complètement la clé
                await AsyncStorage.removeItem(notificationKey);
                console.log('🗑️ [DEBUG] Clé supprimée (plus de notifications)');
              } else {
                // Sinon sauvegarder les notifications restantes
                await AsyncStorage.setItem(notificationKey, JSON.stringify(updatedNotifications));
                console.log('💾 [DEBUG] Notifications restantes sauvegardées');
              }
              
              // Vérifier la sauvegarde
              const verification = await AsyncStorage.getItem(notificationKey);
              const savedNotifications = verification ? JSON.parse(verification) : [];
              console.log('🔍 [DEBUG] Vérification - Notifications sauvées:', savedNotifications.length);
              
              if (savedNotifications.length === updatedNotifications.length) {
                console.log('✅ [DEBUG] Sauvegarde vérifiée avec succès');
                
                // Mettre à jour l'état local
                setNotifications(updatedNotifications);
                
                // Recalculer le nombre de non lues
                const unread = updatedNotifications.filter(n => !n.read).length;
                setUnreadCount(unread);
                console.log('🔄 [DEBUG] État local mis à jour');
                
                // Sortir du mode sélection
                setSelectionMode(false);
                setSelectedNotifications([]);
                console.log('🔄 [DEBUG] Mode sélection désactivé');
                
                Alert.alert(
                  '✅ Suppression réussie',
                  `${selectedNotifications.length} notification${selectedNotifications.length > 1 ? 's ont été supprimées' : ' a été supprimée'}.`,
                  [{ text: 'OK', style: 'default' }]
                );
              } else {
                console.error('❌ [DEBUG] Échec vérification - Attendu:', updatedNotifications.length, 'Trouvé:', savedNotifications.length);
                throw new Error(`Vérification échouée: attendu ${updatedNotifications.length}, trouvé ${savedNotifications.length}`);
              }
            } catch (error) {
              console.error('❌ [DEBUG] Erreur suppression sélective:', error);
              Alert.alert(
                'Erreur',
                `Erreur de suppression: ${error.message}. Veuillez réessayer.`,
                [{ text: 'OK', style: 'default' }]
              );
            }
          }
        }
      ]
    );
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedNotifications([]);
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const isSelected = selectedNotifications.includes(item.id);
    
    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'meal':
          return '🍽️';
        case 'water':
          return '💧';
        case 'tracking':
          return '📝';
        case 'motivational':
          return '✨';
        default:
          return '📣';
      }
    };

    const getTimeAgo = (timestamp: string) => {
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffMs = now.getTime() - notificationTime.getTime();
      const diffMins = Math.round(diffMs / 60000);
      
      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Hier';
      if (diffDays < 7) return `Il y a ${diffDays}j`;
      
      return notificationTime.toLocaleDateString('fr-FR');
    };

    return (
      <TouchableOpacity 
        style={[
        styles.notificationItem,
        !item.read && styles.notificationItemUnread,
        isSelected && styles.notificationItemSelected
      ]}
        onPress={() => {
          if (selectionMode) {
            toggleNotificationSelection(item.id);
          } else if (!item.read) {
            handleMarkAsRead(item.id);
          }
        }}
        onLongPress={() => {
          if (!selectionMode) {
            setSelectionMode(true);
            setSelectedNotifications([item.id]);
          }
        }}
        activeOpacity={0.7}
      >
        {selectionMode && (
          <TouchableOpacity
            style={styles.selectionCheckbox}
            onPress={() => toggleNotificationSelection(item.id)}
          >
            {isSelected ? (
              <CheckSquare size={20} color={Colors.agpBlue} />
            ) : (
              <Square size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationIcon}>
              {getNotificationIcon(item.type)}
            </Text>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>
              {getTimeAgo(item.timestamp)}
            </Text>
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
        </View>
        
        {!item.read && !selectionMode && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Check size={16} color={Colors.agpGreen} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // Fonction de test pour diagnostiquer le problème
  const testAsyncStorage = async () => {
    if (!user) return;
    
    try {
      const testKey = `@agp_test_${user.id}`;
      console.log('🧪 [TEST] Test AsyncStorage avec clé:', testKey);
      
      // Test d'écriture
      await AsyncStorage.setItem(testKey, 'test-data');
      console.log('✅ [TEST] Écriture réussie');
      
      // Test de lecture
      const readData = await AsyncStorage.getItem(testKey);
      console.log('📖 [TEST] Lecture:', readData);
      
      // Test de suppression
      await AsyncStorage.removeItem(testKey);
      console.log('🗑️ [TEST] Suppression effectuée');
      
      // Vérification
      const afterDelete = await AsyncStorage.getItem(testKey);
      console.log('🔍 [TEST] Après suppression:', afterDelete);
      
      Alert.alert('Test AsyncStorage', `Résultat: ${afterDelete === null ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.error('❌ [TEST] Erreur test:', error);
      Alert.alert('Test AsyncStorage', `Erreur: ${error.message}`);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.bellContainer, style, unreadCount > 0 && styles.bellContainerWithBadge]}
        onPress={handleOpenNotifications}
        activeOpacity={0.7}
      >
        <Bell size={24} color={unreadCount > 0 ? Colors.agpBlue : Colors.textLight} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseNotifications}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseNotifications}
              >
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              {notifications.length > 0 && (
                <>
                  {/* Bouton de test pour diagnostiquer */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={testAsyncStorage}
                  >
                    <Text style={[styles.actionButtonText, { color: Colors.morning }]}>
                      Test Storage
                    </Text>
                  </TouchableOpacity>
                  
                  {selectionMode ? (
                    <>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={selectAllNotifications}
                      >
                        <CheckSquare size={16} color={Colors.agpBlue} />
                        <Text style={[styles.actionButtonText, { color: Colors.agpBlue }]}>
                          {selectedNotifications.length === notifications.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDeleteSelected}
                        disabled={selectedNotifications.length === 0}
                      >
                        <Trash2 size={16} color={selectedNotifications.length > 0 ? Colors.relaxation : Colors.textSecondary} />
                        <Text style={[
                          styles.actionButtonText, 
                          { color: selectedNotifications.length > 0 ? Colors.relaxation : Colors.textSecondary }
                        ]}>
                          Supprimer ({selectedNotifications.length})
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={toggleSelectionMode}
                      >
                        <X size={16} color={Colors.textSecondary} />
                        <Text style={[styles.actionButtonText, { color: Colors.textSecondary }]}>
                          Annuler
                        </Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleMarkAllAsRead}
                      >
                        <Check size={16} color={Colors.agpGreen} />
                        <Text style={styles.actionButtonText}>Tout marquer comme lu</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={toggleSelectionMode}
                      >
                        <CheckSquare size={16} color={Colors.agpBlue} />
                        <Text style={[styles.actionButtonText, { color: Colors.agpBlue }]}>
                          Sélectionner
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleClearAll}
                      >
                        <Trash2 size={16} color={Colors.relaxation} />
                        <Text style={[styles.actionButtonText, { color: Colors.relaxation }]}>
                          Tout effacer
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </View>

            {notifications.length > 0 ? (
              <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.notificationsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Bell size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>Aucune notification</Text>
                <Text style={styles.emptyStateText}>
                  Vous recevrez des notifications pour vos repas, hydratation et messages motivants.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  bellContainerWithBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.relaxation,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: Colors.textLight,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
  },
  closeButton: {
    padding: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.agpGreen,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationItemUnread: {
    backgroundColor: Colors.agpLightBlue,
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpBlue,
  },
  notificationItemSelected: {
    backgroundColor: Colors.agpLightGreen,
    borderLeftWidth: 3,
    borderLeftColor: Colors.agpGreen,
  },
  selectionCheckbox: {
    padding: 8,
    marginRight: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
  },
  markReadButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});