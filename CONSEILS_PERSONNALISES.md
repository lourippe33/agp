# Système de Conseils Personnalisés

## Fonctionnement

Le système de conseils personnalisés adapte automatiquement les recommandations en fonction de l'objectif principal de l'utilisateur.

### Synchronisation des objectifs

1. **Questionnaire initial** : L'objectif est enregistré dans `user_profiles.main_goal`
2. **Profil utilisateur** : Les objectifs détaillés sont dans `user_goals` (avec les recommandations IA)
3. **Synchronisation automatique** : Les deux sont maintenant liés !

### Objectifs disponibles

- **weight_loss** : Perdre du poids
- **weight_gain** : Prendre du poids
- **maintain** : Maintenir mon poids
- **health** : Améliorer ma santé
- **energy** : Avoir plus d'énergie
- **sleep** : Mieux dormir

### Conseils adaptés par objectif

#### Perte de poids
- Suivre les 4 repas de chronobiologie
- S'hydrater avec 1.5-2L d'eau par jour
- Pratiquer 30min d'activité physique 3-5x/semaine
- Dormir 7-8h pour optimiser le métabolisme
- Éviter les grignotages entre repas

#### Gain de poids
- Augmenter progressivement les portions
- Privilégier aliments riches en nutriments
- Ajouter collations nutritives
- Musculation pour masse musculaire
- Consommer suffisamment de protéines (1.6-2g/kg)

#### Énergie
- Respecter les 4 repas chronobiologiques
- Petit-déjeuner riche en protéines et bonnes graisses
- Éviter sucres rapides
- Activité physique régulière
- Bien dormir 7-8h

#### Sommeil
- Routine de coucher régulière
- Dîner léger 2h avant coucher
- Éviter écrans 1h avant dormir
- Environnement propice (sombre, calme, frais)
- Techniques de relaxation
- Limiter caféine après 15h

### Où les conseils apparaissent

1. **Page d'accueil** : Widget de conseils personnalisés (3 conseils)
2. **Programme AGP** : Section de recommandations (4 conseils)
3. **Profil** : Recommandations IA complètes générées depuis l'objectif

### Comment modifier son objectif

1. Aller dans **Profil** > **Mes objectifs**
2. Sélectionner le nouvel objectif
3. Cliquer sur **"Obtenir des recommandations IA"**
4. Les conseils sont mis à jour automatiquement partout dans l'app

### Algorithme de personnalisation

```typescript
// Charge l'objectif depuis user_profiles.main_goal
// Si l'utilisateur a généré des recommandations IA, les utilise
// Sinon, utilise les conseils par défaut de l'objectif
```

Les conseils sont toujours contextuels et adaptés à l'objectif actuel de l'utilisateur.
