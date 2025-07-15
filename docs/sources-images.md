# Guide des Sources d'Images Gratuites pour l'App AGP

## 🌟 Sources Principales Recommandées

### **1. Unsplash** ⭐⭐⭐
- **URL** : https://unsplash.com
- **Points forts** : 
  - Excellente qualité HD
  - Très bon pour la nourriture
  - API disponible
  - URLs directes stables
- **Format URL** : `https://images.unsplash.com/photo-[ID]?w=800&q=80`
- **Recherche** : "healthy breakfast", "quinoa bowl", "protein pancakes"

### **2. Foodiesfeed** ⭐⭐⭐
- **URL** : https://www.foodiesfeed.com
- **Spécialité** : 100% culinaire
- **Points forts** :
  - Photos de nourriture exclusivement
  - Haute qualité professionnelle
  - Gratuit pour usage commercial
  - Pas d'attribution requise

### **3. Burst by Shopify** ⭐⭐
- **URL** : https://burst.shopify.com
- **Points forts** :
  - Totalement gratuit
  - Bonne section food & drink
  - Optimisé pour le web

### **4. StockVault** ⭐⭐
- **URL** : https://www.stockvault.net
- **Points forts** :
  - Large sélection
  - Catégorie food bien fournie
  - Gratuit avec inscription

## 🍽️ Sources Spécialisées Cuisine

### **Kaboompics**
- **URL** : https://kaboompics.com
- **Spécialité** : Lifestyle et food
- **Avantage** : Style cohérent, moderne

### **Life of Pix**
- **URL** : https://www.lifeofpix.com
- **Avantage** : Photos authentiques, naturelles

### **Picjumbo**
- **URL** : https://picjumbo.com
- **Avantage** : Bonne section food, style premium

## 🔍 Stratégies de Recherche Efficaces

### **Mots-clés en anglais pour chaque moment :**

#### **Matin (Breakfast)**
- "healthy breakfast bowl"
- "protein pancakes"
- "overnight oats"
- "smoothie bowl"
- "avocado toast"

#### **Midi (Lunch)**
- "quinoa salad"
- "protein bowl"
- "healthy lunch"
- "grilled chicken salad"
- "buddha bowl"

#### **Goûter (Snack)**
- "healthy snacks"
- "protein muffins"
- "energy balls"
- "nut butter"
- "homemade granola"

#### **Soir (Dinner)**
- "light dinner"
- "vegetable stir fry"
- "tofu vegetables"
- "healthy dinner"
- "plant based meal"

## 🎨 Conseils pour la Cohérence Visuelle

### **Style à privilégier :**
- **Éclairage** : Naturel, lumineux
- **Angle** : Vue du dessus (flat lay) ou 45°
- **Couleurs** : Tons chauds et naturels
- **Composition** : Épurée, ingrédients visibles

### **À éviter :**
- Photos trop sombres
- Angles trop artistiques
- Trop de props/accessoires
- Filtres trop prononcés

## 🔧 Intégration Technique

### **Format d'URL recommandé :**
```json
{
  "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80"
}
```

### **Paramètres d'optimisation Unsplash :**
- `w=800` : Largeur optimale
- `q=80` : Qualité équilibrée
- `fit=crop` : Recadrage automatique
- `crop=center` : Centrage

### **Exemple complet :**
```json
{
  "id": 1,
  "titre": "Pancakes protéinés",
  "image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop&crop=center"
}
```

## 📱 Alternatives pour Mobile

### **Si besoin d'images spécifiques :**
1. **Créer ses propres photos** avec un smartphone
2. **Canva** : Templates gratuits avec photos incluses
3. **Freepik** : Version gratuite avec attribution

## 🚀 Workflow Recommandé

1. **Rechercher sur Unsplash** en premier
2. **Compléter avec Foodiesfeed** pour les spécialités
3. **Utiliser Pexels** en backup
4. **Tester les URLs** avant intégration
5. **Maintenir un style cohérent**

## 📋 Checklist Qualité

- [ ] Image en haute résolution (min 800px)
- [ ] Éclairage naturel et lumineux
- [ ] Composition épurée
- [ ] Couleurs harmonieuses avec l'app
- [ ] URL stable et accessible
- [ ] Temps de chargement rapide

## 🔄 Mise à Jour des Images

Pour changer une image dans votre app :

```json
// Avant
"image": "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg"

// Après
"image": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80"
```

## 💡 Astuce Pro

Créez une collection sur Unsplash avec vos images favorites pour un accès rapide et une cohérence garantie !