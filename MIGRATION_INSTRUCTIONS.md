# Instructions pour appliquer la migration Supabase

## Étape 1: Accéder au SQL Editor de Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **SQL Editor**

## Étape 2: Copier et exécuter le script SQL

Copiez et collez le code SQL suivant dans l'éditeur SQL:

```sql
-- Ajouter onboarding_completed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN onboarding_completed boolean DEFAULT false;
  END IF;
END $$;

-- Ajouter main_goal
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'main_goal'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN main_goal text DEFAULT '';
  END IF;
END $$;

-- Ajouter allergies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'allergies'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN allergies text DEFAULT '';
  END IF;
END $$;

-- Ajouter food_preferences
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'food_preferences'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN food_preferences jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Ajouter activity_level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'activity_level'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN activity_level text DEFAULT '';
  END IF;
END $$;

-- Ajouter chrono_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'chrono_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN chrono_type text DEFAULT '';
  END IF;
END $$;

-- Ajouter sleep_duration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'sleep_duration'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN sleep_duration numeric;
  END IF;
END $$;

-- Ajouter wake_up_time
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'wake_up_time'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN wake_up_time time;
  END IF;
END $$;
```

## Étape 3: Exécuter le script

Cliquez sur le bouton **Run** (ou appuyez sur Ctrl+Enter)

## Étape 4: Vérifier que tout fonctionne

Rechargez votre application et essayez de compléter le questionnaire. Vos données seront maintenant sauvegardées correctement!

## En cas d'erreur

Si vous rencontrez une erreur, vérifiez que:
- Vous êtes bien connecté au bon projet Supabase
- Le script a été copié complètement
- Vous avez les permissions nécessaires pour modifier la base de données
