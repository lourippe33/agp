import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationService } from '@/services/NotificationService';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import PWAUpdateBanner from '@/components/PWAUpdateBanner';
import OfflineBanner from '@/components/OfflineBanner';

// Styles CSS globaux pour les barres de défilement sur PC
const globalScrollStyles = `
  /* Forcer les barres de défilement sur TOUS les éléments */
  *, *::before, *::after {
    scrollbar-width: thin;
    scrollbar-color: #4A90E2 #f1f1f1;
  }
  
  *::-webkit-scrollbar, 
  div::-webkit-scrollbar,
  .scroll-container::-webkit-scrollbar,
  .scroll-visible::-webkit-scrollbar {
    width: 14px !important;
    height: 14px !important;
    display: block !important;
  }
  
  *::-webkit-scrollbar-track,
  div::-webkit-scrollbar-track,
  .scroll-container::-webkit-scrollbar-track,
  .scroll-visible::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }
  
  *::-webkit-scrollbar-thumb,
  div::-webkit-scrollbar-thumb,
  .scroll-container::-webkit-scrollbar-thumb,
  .scroll-visible::-webkit-scrollbar-thumb {
    background: #4A90E2;
    border-radius: 6px;
    border: 2px solid #f1f1f1;
  }
  
  *::-webkit-scrollbar-thumb:hover,
  div::-webkit-scrollbar-thumb:hover,
  .scroll-container::-webkit-scrollbar-thumb:hover,
  .scroll-visible::-webkit-scrollbar-thumb:hover {
    background: #357ABD;
  }
  
  *::-webkit-scrollbar-corner,
  div::-webkit-scrollbar-corner,
  .scroll-container::-webkit-scrollbar-corner,
  .scroll-visible::-webkit-scrollbar-corner {
    background: #f1f1f1;
  }
  
  /* Classes spécifiques pour forcer le défilement */
  .scroll-visible,
  .scroll-container,
  [data-scroll="true"] {
    overflow-y: scroll !important;
    scrollbar-width: thin !important;
    overflow-x: hidden !important;
  }
  
  /* Forcer sur les conteneurs React Native Web */
  div[style*="overflow"] {
    overflow-y: scroll !important;
    scrollbar-width: thin !important;
  }
  
  /* Spécifique aux ScrollView React Native */
  div[data-focusable="true"],
  div[role="scrollbar"] {
    overflow-y: scroll !important;
    scrollbar-width: thin !important;
  }
  
  /* Forcer sur tous les conteneurs avec scroll */
  div[style*="flex: 1"] {
    overflow-y: auto !important;
    scrollbar-width: thin !important;
  }
  
  /* Améliorer la visibilité sur tous les éléments scrollables */
  div {
    scrollbar-width: thin;
    scrollbar-color: #4A90E2 #f1f1f1;
  }
  
  div::-webkit-scrollbar {
    width: 14px !important;
    display: block !important;
  }
  
  /* Navigation au clavier sur TOUS les éléments */
  button, [role="button"], input, textarea, select {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  
  button:focus, [role="button"]:focus, input:focus, textarea:focus, select:focus {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
  }
  
  /* Focus visible sur TOUS les éléments */
  *:focus {
    outline: 2px solid #4A90E2 !important;
    outline-offset: 2px !important;
  }
  
  /* Forcer le défilement sur le body et html */
  html, body {
    overflow-y: scroll !important;
    scrollbar-width: thin !important;
  }
  
  /* Spécifique aux modales et overlays */
  div[style*="position: absolute"],
  div[style*="position: fixed"] {
    overflow-y: auto !important;
    scrollbar-width: thin !important;
  }
`;

// Injecter les styles CSS globaux pour le web
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('agp-global-scroll-styles');
  if (!existingStyle) {
    const styleElement = document.createElement('style');
    styleElement.id = 'agp-global-scroll-styles';
    styleElement.textContent = globalScrollStyles;
    document.head.appendChild(styleElement);
  }
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <OfflineBanner />
      <PWAUpdateBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recettes" options={{ headerShown: false }} />
        <Stack.Screen name="sport" options={{ headerShown: false }} />
        <Stack.Screen name="detente" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <PWAInstallBanner />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}