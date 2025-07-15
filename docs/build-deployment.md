# 📱 Guide de Build et Déploiement Mobile

## 🚀 Options de Déploiement

### **Option 1 : EAS Build (Recommandé)**

#### **1. Installation d'EAS CLI**
```bash
npm install -g @expo/eas-cli
```

#### **2. Connexion à votre compte Expo**
```bash
eas login
```

#### **3. Configuration du projet**
```bash
eas build:configure
```

#### **4. Build Android (APK)**
```bash
# Pour un APK de développement
eas build --platform android --profile development

# Pour un APK de production
eas build --platform android --profile production
```

#### **5. Build iOS (IPA)**
```bash
# Pour iOS (nécessite un compte développeur Apple)
eas build --platform ios --profile production
```

### **Option 2 : Build Local (Plus complexe)**

#### **1. Installation des outils**
```bash
# Pour Android
npm install -g @expo/cli
npx expo install expo-dev-client

# Pour iOS (Mac uniquement)
# Installer Xcode depuis l'App Store
```

#### **2. Génération des fichiers natifs**
```bash
npx expo prebuild
```

#### **3. Build Android local**
```bash
# Installer Android Studio et configurer les variables d'environnement
npx expo run:android --variant release
```

## 📋 Configuration EAS (eas.json)

Créez un fichier `eas.json` à la racine :

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🔧 Configuration App.json pour Production

Mettez à jour votre `app.json` :

```json
{
  "expo": {
    "name": "AGP Chronobiologie",
    "slug": "agp-chrono-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4A90E2"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.agp.chronobiologie"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#4A90E2"
      },
      "package": "com.agp.chronobiologie"
    },
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "extra": {
      "eas": {
        "projectId": "votre-project-id"
      }
    }
  }
}
```

## 📱 Étapes Détaillées pour Android APK

### **Méthode Rapide avec EAS :**

1. **Installer EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Se connecter**
   ```bash
   eas login
   ```

3. **Configurer le projet**
   ```bash
   eas build:configure
   ```

4. **Lancer le build APK**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Télécharger l'APK**
   - Allez sur https://expo.dev/accounts/[votre-username]/projects/agp-chrono-app/builds
   - Téléchargez l'APK généré
   - Transférez-le sur votre téléphone Android
   - Activez "Sources inconnues" dans les paramètres
   - Installez l'APK

## 🍎 Pour iOS (iPhone/iPad)

### **Prérequis :**
- Compte développeur Apple (99$/an)
- Mac avec Xcode

### **Étapes :**
1. **Build avec EAS**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Distribution :**
   - **TestFlight** : Pour les tests internes
   - **App Store** : Pour la distribution publique
   - **Ad Hoc** : Pour un nombre limité d'appareils

## 🔄 Alternative : Expo Go (Développement)

Pour les tests rapides sans build :

1. **Installer Expo Go** sur votre téléphone
2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
3. **Scanner le QR code** avec Expo Go

⚠️ **Limitation** : Expo Go ne supporte pas toutes les fonctionnalités natives.

## 📦 Distribution

### **Android :**
- **Google Play Store** : Distribution officielle
- **APK Direct** : Installation manuelle
- **Firebase App Distribution** : Tests internes

### **iOS :**
- **App Store** : Distribution officielle
- **TestFlight** : Tests bêta
- **Enterprise Distribution** : Pour les entreprises

## 🛠️ Commandes Utiles

```bash
# Vérifier le statut des builds
eas build:list

# Voir les logs d'un build
eas build:view [build-id]

# Soumettre à l'App Store/Play Store
eas submit --platform android
eas submit --platform ios

# Mettre à jour OTA (Over-The-Air)
eas update
```

## 🎯 Recommandation

**Pour commencer rapidement :**
1. Utilisez **EAS Build** avec le profil `preview`
2. Générez un **APK Android** pour les tests
3. Une fois validé, passez au profil `production` pour les stores

**Commande recommandée :**
```bash
eas build --platform android --profile preview
```

Cette commande génèrera un APK que vous pourrez installer directement sur Android !