# AGP Chronobiologie - Application Mobile

Application de chronobiologie pour une alimentation équilibrée, des exercices adaptés et une gestion du stress optimale.

## 🔐 Authentification Netlify Identity

### Configuration Netlify Identity

1. **Activer Identity** :
   - Allez dans votre dashboard Netlify
   - Site settings → Identity → Enable Identity

2. **Configuration des inscriptions** :
   - **Open registration** : Permet à tout le monde de s'inscrire
   - **Invite only** : Seules les personnes invitées peuvent s'inscrire
   - Recommandé : Commencer par "Open" pour les tests

3. **Services optionnels** :
   - Enable Git Gateway : Pour l'édition de contenu (optionnel)
   - External providers : Google, GitHub, etc. (optionnel)

### Pages Publiques et Privées

#### **Pages Publiques** (accessibles sans connexion) :
- `/` - Page d'accueil/redirection
- `/auth/login` - Connexion
- `/auth/register` - Inscription  
- `/auth/reset` - Réinitialisation mot de passe

#### **Pages Privées** (nécessitent une connexion) :
- `/(tabs)/*` - Toutes les pages principales
- `/recettes/*` - Toutes les pages de recettes
- `/sport` - Activités sportives
- `/detente` - Exercices de détente
- `/search` - Recherche globale
- `/programme` - Programme 28 jours

### Changer le Mode d'Inscription

Dans votre dashboard Netlify :

1. **Site settings → Identity → Settings**
2. **Registration preferences** :
   - **Open** : Inscription libre pour tous
   - **Invite only** : Inscription sur invitation uniquement
3. **Save settings**

### Fonctionnalités d'Auth

- ✅ Inscription avec email/mot de passe
- ✅ Connexion sécurisée
- ✅ Réinitialisation de mot de passe
- ✅ Protection automatique des pages
- ✅ Déconnexion depuis le profil
- ✅ Redirection intelligente

### Développement Local

Pour tester localement avec Netlify Identity :
1. Déployez d'abord sur Netlify
2. Configurez Identity sur le site déployé
3. L'auth fonctionnera ensuite en local

## 🚀 Déploiement

L'application est prête pour le déploiement sur Netlify avec Identity activé.