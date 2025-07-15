# 🚀 Guide de Déploiement PWA sur Netlify

## 📋 Prérequis

Votre build PWA est prêt dans le dossier `dist/` avec :
- ✅ Manifest PWA configuré
- ✅ Service Worker fonctionnel
- ✅ Icônes et assets optimisés
- ✅ Pages statiques générées

## 🌐 Méthode 1 : Déploiement Direct (Recommandé)

### **1. Créer un compte Netlify**
- Allez sur [netlify.com](https://netlify.com)
- Créez un compte gratuit (GitHub/GitLab/Email)

### **2. Déploiement par glisser-déposer**

1. **Connectez-vous à Netlify**
2. **Cliquez sur "Sites"** dans le menu principal
3. **Faites glisser le dossier `dist/`** directement sur la zone "Want to deploy a new site without connecting to Git?"
4. **Attendez le déploiement** (1-2 minutes)
5. **Votre site est en ligne !** 🎉

### **3. Configuration du domaine**

Netlify vous donnera une URL comme : `https://amazing-name-123456.netlify.app`

**Pour personnaliser :**
1. Allez dans **Site settings > Domain management**
2. Cliquez sur **"Change site name"**
3. Choisissez : `agp-chronobiologie` → `https://agp-chronobiologie.netlify.app`

## 🔧 Méthode 2 : Déploiement via CLI

### **1. Installation Netlify CLI**
```bash
npm install -g netlify-cli
```

### **2. Connexion**
```bash
netlify login
```

### **3. Déploiement**
```bash
# Déploiement de test
netlify deploy --dir=dist

# Déploiement en production
netlify deploy --dir=dist --prod
```

## 📱 Configuration PWA Optimale

### **1. Headers personnalisés**

Créez un fichier `dist/_headers` :

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/manifest.json
  Content-Type: application/manifest+json

/sw.js
  Content-Type: application/javascript
  Cache-Control: no-cache
```

### **2. Redirections pour SPA**

Créez un fichier `dist/_redirects` :

```
# Redirection pour Single Page Application
/*    /index.html   200

# Redirections spécifiques
/recettes/*  /recettes/index.html  200
/sport       /sport.html           200
/detente     /detente.html         200
```

## 🎯 Configuration Avancée

### **1. Variables d'environnement**

Dans Netlify Dashboard :
1. **Site settings > Environment variables**
2. Ajoutez vos variables :
   ```
   EXPO_PUBLIC_API_URL=https://votre-api.com
   EXPO_PUBLIC_ANALYTICS_ID=your-id
   ```

### **2. Optimisations de performance**

Dans **Site settings > Build & deploy > Post processing** :
- ✅ **Asset optimization** : ON
- ✅ **Pretty URLs** : ON
- ✅ **Bundle analyzer** : ON

### **3. HTTPS et sécurité**

Netlify active automatiquement :
- ✅ **HTTPS** avec certificat SSL gratuit
- ✅ **HTTP/2** pour de meilleures performances
- ✅ **Brotli compression** pour des fichiers plus légers

## 📊 Fonctionnalités PWA Activées

Votre PWA sur Netlify aura :

### **Installation**
- ✅ Bannière d'installation automatique
- ✅ Icône sur l'écran d'accueil
- ✅ Lancement en mode standalone

### **Hors ligne**
- ✅ Cache des ressources statiques
- ✅ Fonctionnement sans connexion
- ✅ Synchronisation automatique

### **Mises à jour**
- ✅ Détection automatique des nouvelles versions
- ✅ Notification de mise à jour
- ✅ Mise à jour en arrière-plan

## 🔄 Workflow de Mise à Jour

### **1. Modifier votre app**
```bash
# Faire vos modifications dans le code source
# Puis rebuilder
npm run build:web
```

### **2. Redéployer**
```bash
# Via CLI
netlify deploy --dir=dist --prod

# Ou glisser-déposer le nouveau dossier dist/ sur Netlify
```

### **3. Versionning automatique**
Le Service Worker détectera automatiquement la nouvelle version !

## 📱 Test sur Mobile

### **1. Test d'installation**
1. Ouvrez votre site sur mobile : `https://votre-site.netlify.app`
2. Le navigateur proposera d'installer l'app
3. Testez l'installation et le fonctionnement

### **2. Test hors ligne**
1. Installez l'app
2. Activez le mode avion
3. Ouvrez l'app → Elle doit fonctionner !

### **3. Outils de test**
- **Chrome DevTools** : Lighthouse audit
- **PWA Builder** : [pwabuilder.com](https://pwabuilder.com)
- **Web.dev** : Test de performance PWA

## 🎨 Personnalisation Avancée

### **1. Domaine personnalisé**

Si vous avez un domaine :
1. **Site settings > Domain management**
2. **Add custom domain**
3. Configurez vos DNS selon les instructions

### **2. Analytics**

Ajoutez Google Analytics :
1. **Site settings > Build & deploy > Snippet injection**
2. Ajoutez votre code de tracking dans `</head>`

### **3. Formulaires de contact**

Netlify Forms pour les retours utilisateurs :
```html
<form name="feedback" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="feedback" />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <button type="submit">Envoyer</button>
</form>
```

## 🚀 Commandes Rapides

```bash
# Build et déploiement en une commande
npm run build:web && netlify deploy --dir=dist --prod

# Voir les logs de déploiement
netlify logs

# Ouvrir le site en ligne
netlify open:site

# Voir les statistiques
netlify status
```

## 📈 Monitoring et Analytics

### **1. Netlify Analytics**
- Trafic en temps réel
- Pages les plus visitées
- Géolocalisation des utilisateurs

### **2. Performance**
- Core Web Vitals automatiques
- Temps de chargement
- Taux de conversion PWA

### **3. Erreurs**
- Monitoring automatique des erreurs 404
- Logs de déploiement
- Alertes par email

## 🎯 Résultat Final

Votre PWA AGP Chronobiologie sera :

- 🌐 **Accessible** : `https://agp-chronobiologie.netlify.app`
- 📱 **Installable** : Sur tous les appareils
- ⚡ **Rapide** : Chargement instantané
- 🔒 **Sécurisée** : HTTPS par défaut
- 📊 **Mesurable** : Analytics intégrées
- 🔄 **Mise à jour automatique** : Sans intervention

## 💡 Conseils Pro

1. **Testez toujours** sur mobile avant de déployer
2. **Utilisez Lighthouse** pour optimiser les performances
3. **Activez les notifications** Netlify pour les déploiements
4. **Sauvegardez** votre configuration Netlify
5. **Documentez** vos variables d'environnement

---

🎉 **Félicitations !** Votre PWA AGP Chronobiologie est maintenant déployée et accessible dans le monde entier !