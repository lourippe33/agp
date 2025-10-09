/*
  # Création des tables de suivi du bien-être, alimentation et mesures

  1. Nouvelles Tables
    - `wellness_tracking`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `tracking_date` (date)
      - `energy_level` (integer, 1-5)
      - `sleep_quality` (integer, 1-5)
      - `stress_level` (integer, 1-5)
      - `mood` (integer, 1-5)
      - `chrono_respect` (boolean)
      - `activity_completed` (boolean)
      - `activity_type` (text)
      - `activity_duration` (integer, minutes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `food_tracking`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `tracking_date` (date)
      - `breakfast` (boolean)
      - `full_meal` (boolean)
      - `balanced_snack` (boolean)
      - `light_dinner` (boolean)
      - `hydration` (boolean)
      - `chrono_points` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `measurements`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `measurement_date` (date)
      - `weight` (numeric)
      - `waist` (numeric, cm)
      - `hip` (numeric, cm)
      - `thigh` (numeric, cm)
      - `arm` (numeric, cm)
      - `chest` (numeric, cm)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques permettant aux utilisateurs de gérer uniquement leurs propres données

  3. Index et Contraintes
    - Index sur (user_id, date) pour chaque table
    - Contrainte d'unicité sur (user_id, date) pour éviter les doublons
*/

-- Table wellness_tracking
CREATE TABLE IF NOT EXISTS wellness_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tracking_date date NOT NULL,
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  mood integer CHECK (mood >= 1 AND mood <= 5),
  chrono_respect boolean DEFAULT false,
  activity_completed boolean DEFAULT false,
  activity_type text DEFAULT '',
  activity_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tracking_date)
);

ALTER TABLE wellness_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wellness tracking"
  ON wellness_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own wellness tracking"
  ON wellness_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wellness tracking"
  ON wellness_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wellness tracking"
  ON wellness_tracking
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wellness_tracking_user_date ON wellness_tracking(user_id, tracking_date);

-- Table food_tracking
CREATE TABLE IF NOT EXISTS food_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tracking_date date NOT NULL,
  breakfast boolean DEFAULT false,
  full_meal boolean DEFAULT false,
  balanced_snack boolean DEFAULT false,
  light_dinner boolean DEFAULT false,
  hydration boolean DEFAULT false,
  chrono_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tracking_date)
);

ALTER TABLE food_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food tracking"
  ON food_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own food tracking"
  ON food_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food tracking"
  ON food_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own food tracking"
  ON food_tracking
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_food_tracking_user_date ON food_tracking(user_id, tracking_date);

-- Table measurements
CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  measurement_date date NOT NULL,
  weight numeric,
  waist numeric,
  hip numeric,
  thigh numeric,
  arm numeric,
  chest numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, measurement_date)
);

ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements"
  ON measurements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own measurements"
  ON measurements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own measurements"
  ON measurements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own measurements"
  ON measurements
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements(user_id, measurement_date);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_wellness_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_food_tracking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_measurements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_wellness_tracking_timestamp'
  ) THEN
    CREATE TRIGGER update_wellness_tracking_timestamp
      BEFORE UPDATE ON wellness_tracking
      FOR EACH ROW
      EXECUTE FUNCTION update_wellness_tracking_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_food_tracking_timestamp'
  ) THEN
    CREATE TRIGGER update_food_tracking_timestamp
      BEFORE UPDATE ON food_tracking
      FOR EACH ROW
      EXECUTE FUNCTION update_food_tracking_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_measurements_timestamp'
  ) THEN
    CREATE TRIGGER update_measurements_timestamp
      BEFORE UPDATE ON measurements
      FOR EACH ROW
      EXECUTE FUNCTION update_measurements_updated_at();
  END IF;
END $$;
