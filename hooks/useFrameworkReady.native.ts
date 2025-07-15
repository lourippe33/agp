import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Prevent splash screen from auto-hiding
      SplashScreen.preventAutoHideAsync();
      
      if (window.frameworkReady) {
        window.frameworkReady();
      }
    }
  }, []);
}