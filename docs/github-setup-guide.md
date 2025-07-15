# 🚀 Guide Setup GitHub pour Images

## 📋 **Étapes Détaillées**

### **1. Créer le Repository GitHub**

1. **Allez sur** [github.com](https://github.com)
2. **Cliquez** sur "New repository"
3. **Nom** : `agp-recipe-images`
4. **Description** : "Images pour l'application AGP Chronobiologie"
5. **Public** ✅ (pour les URLs Raw gratuites)
6. **Créer** le repository

### **2. Structure des Dossiers**

Créez cette structure dans votre repo :

```
agp-recipe-images/
└── recipes/
    ├── matin/
    │   ├── porridge-aux-fruits-rouges.jpg
    │   ├── smoothie-bowl-banane-epinards.jpg
    │   ├── toast-avocat-oeuf-mollet.jpg
    │   ├── overnight-oats-coco-mangue.jpg
    │   ├── crepes-epeautre-proteinees.jpg
    │   ├── bowl-cake-coco-framboise.jpg
    │   ├── pancakes-a-la-banane.jpg
    │   ├── muesli-croquant-maison.jpg
    │   ├── pudding-chia-vanille.jpg
    │   └── smoothie-peche-avoine.jpg
    ├── midi/
    │   ├── poke-bowl-saumon-avocat.jpg
    │   ├── buddha-bowl-tofu-quinoa.jpg
    │   ├── salade-lentilles-saumon.jpg
    │   ├── wok-legumes-tofu.jpg
    │   ├── poulet-curry-coco.jpg
    │   ├── salade-quinoa-pois-chiches.jpg
    │   ├── wrap-poulet-avocat.jpg
    │   ├── tajine-pois-chiches.jpg
    │   ├── riz-saute-crevettes-legumes.jpg
    │   └── spaghetti-bolo-veggie.jpg
    ├── gouter/
    │   ├── cake-proteine-chocolat-noisette.jpg
    │   ├── compote-pomme-cannelle.jpg
    │   ├── barres-cereales-maison.jpg
    │   ├── smoothie-proteine-banane-huel.jpg
    │   ├── tartine-puree-noisette-pomme.jpg
    │   ├── mugcake-huel-chocolat.jpg
    │   ├── yaourt-vegetal-granola.jpg
    │   ├── energy-balls-dattes-amandes.jpg
    │   ├── flan-coco-allege.jpg
    │   └── galette-riz-puree-amande.jpg
    └── soir/
        ├── saute-tofu-legumes.jpg
        ├── soupe-miso-legumes.jpg
        ├── salade-courgetti-pesto.jpg
        ├── curry-legumes-lait-coco.jpg
        ├── omelette-herbes-legumes.jpg
        ├── salade-quinoa-legumes-grilles.jpg
        ├── veloute-brocoli-gingembre.jpg
        ├── salade-lentilles-legumes-croquants.jpg
        ├── ratatouille-legere-herbes.jpg
        └── papillote-legumes-citron.jpg
```

### **3. Upload des Images**

**Via l'interface GitHub :**
1. Cliquez sur "Add file" > "Upload files"
2. Glissez-déposez vos images dans les bons dossiers
3. Commit avec le message : "Add recipe images"

**Via Git (si vous préférez) :**
```bash
git clone https://github.com/votre-username/agp-recipe-images.git
cd agp-recipe-images
mkdir -p recipes/{matin,midi,gouter,soir}
# Copiez vos images dans les dossiers
git add .
git commit -m "Add recipe images"
git push
```

### **4. Obtenir les URLs Raw**

**Format URL GitHub Raw :**
```
https://raw.githubusercontent.com/[USERNAME]/agp-recipe-images/main/recipes/[MOMENT]/[FILENAME].jpg
```

**Exemple :**
```
https://raw.githubusercontent.com/john-doe/agp-recipe-images/main/recipes/matin/porridge-aux-fruits-rouges.jpg
```

### **5. Mise à Jour Automatique**

**Utilisez le script fourni :**
```bash
# 1. Modifiez le script avec votre username GitHub
# 2. Exécutez le script
node scripts/update-image-urls.js
```

**Ou manuellement :**
```json
{
  "id": 1,
  "titre": "Porridge aux fruits rouges",
  "image": "https://raw.githubusercontent.com/votre-username/agp-recipe-images/main/recipes/matin/porridge-aux-fruits-rouges.jpg"
}
```

## ✅ **Avantages de cette Solution**

- **Gratuit** : GitHub offre un hébergement gratuit
- **Fiable** : URLs stables et rapides
- **Organisé** : Structure claire par moments
- **Évolutif** : Facile d'ajouter de nouvelles images
- **Contrôlé** : Vous gardez la maîtrise totale

## 🎯 **Prochaines Étapes**

1. **Créez** votre repository GitHub
2. **Uploadez** vos images avec la structure proposée
3. **Modifiez** le script avec votre username
4. **Exécutez** le script pour mettre à jour les URLs
5. **Testez** dans l'application

Voulez-vous que je vous aide avec une étape spécifique ? 🚀