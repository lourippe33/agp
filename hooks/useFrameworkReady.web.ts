import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      if (window.frameworkReady) {
        window.frameworkReady();
      }
    }
  }, []);
}