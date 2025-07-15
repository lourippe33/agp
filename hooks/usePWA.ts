import { useEffect, useState } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  installPWA: () => Promise<void>;
  isOnline: boolean;
  updateAvailable: boolean;
  updatePWA: () => void;
}

export function usePWA(): UsePWAReturn {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as any);
      setIsInstallable(true);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    // Écouter les changements de statut réseau
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkIfInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Vérifier si nous sommes dans un environnement qui supporte les Service Workers
    const isStackBlitz = window.location.hostname.includes('stackblitz') || 
                         window.location.hostname.includes('webcontainer') ||
                         window.location.hostname === 'localhost';

    // Enregistrer le Service Worker seulement si supporté
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !isStackBlitz) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration);

          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Erreur Service Worker:', error);
        });
    } else if (isStackBlitz) {
      console.warn('⚠️ Service Worker non disponible dans cet environnement de développement');
    }
  }, []);

  const installPWA = async (): Promise<void> => {
    if (!installPrompt) {
      throw new Error('Installation non disponible');
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ PWA installée');
        setIsInstalled(true);
      } else {
        console.log('❌ Installation refusée');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('❌ Erreur installation PWA:', error);
      throw error;
    }
  };

  const updatePWA = (): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPWA,
    isOnline,
    updateAvailable,
    updatePWA,
  };
}