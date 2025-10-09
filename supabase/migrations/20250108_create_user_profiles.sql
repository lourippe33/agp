/*
  # Création de la table user_profiles et user_goals

  1. Nouvelles Tables
    - `user_profiles`
      - `id` (uuid, clé primaire, référence vers auth.users)
      - `email` (text)
      - `full_name` (text)
      - `birth_date` (date)
      - `gender` (text)
      - `height` (numeric, cm)
      - `initial_weight` (numeric, kg)
      - `target_weight` (numeric, kg)
      - `notifications_enabled` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_goals`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `goal_type` (text: weight_loss, weight_gain, maintain, health)
      - `goal_description` (text)
      - `ai_recommendations` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques permettant aux utilisateurs de gérer uniquement leurs propres données

  3. Index et Contraintes
    - Index sur user_id
*/

-- Table user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  birth_date date,
  gender text DEFAULT '',
  height numeric,
  initial_weight numeric,
  target_weight numeric,
  notifications_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);

-- Table user_goals
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type text NOT NULL,
  goal_description text DEFAULT '',
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON user_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON user_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_goals_updated_at()
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
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_timestamp'
  ) THEN
    CREATE TRIGGER update_user_profiles_timestamp
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_user_profiles_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_goals_timestamp'
  ) THEN
    CREATE TRIGGER update_user_goals_timestamp
      BEFORE UPDATE ON user_goals
      FOR EACH ROW
      EXECUTE FUNCTION update_user_goals_updated_at();
  END IF;
END $$;
