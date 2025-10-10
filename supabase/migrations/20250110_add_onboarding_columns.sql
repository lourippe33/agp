/*
  # Ajout des colonnes pour le questionnaire d'onboarding

  1. Nouvelles colonnes dans user_profiles
    - `onboarding_completed` (boolean) - Indique si l'utilisateur a terminé le questionnaire
    - `main_goal` (text) - Objectif principal de l'utilisateur
    - `allergies` (text) - Allergies alimentaires
    - `food_preferences` (jsonb) - Préférences alimentaires (végétarien, vegan, etc.)
    - `activity_level` (text) - Niveau d'activité physique (sédentaire, léger, modéré, actif, très actif)
    - `chrono_type` (text) - Chronotype (alouette, intermédiaire, hibou)
    - `sleep_duration` (numeric) - Durée de sommeil en heures
    - `wake_up_time` (time) - Heure de réveil habituelle

  2. Notes
    - Toutes les colonnes existantes sont préservées
    - Les colonnes sont ajoutées uniquement si elles n'existent pas déjà
    - Les valeurs par défaut permettent une migration en douceur
*/

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
