/*
  # Création de la table des activités quotidiennes

  1. Nouvelle table
    - `daily_activities`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `activity_date` (date)
      - `day_number` (integer, jour du programme 1-28)
      - `breakfast_completed` (boolean, défaut false)
      - `lunch_completed` (boolean, défaut false)
      - `snack_completed` (boolean, défaut false)
      - `dinner_completed` (boolean, défaut false)
      - `exercise_completed` (boolean, défaut false)
      - `breakfast_recipe_id` (integer, nullable)
      - `lunch_recipe_id` (integer, nullable)
      - `snack_recipe_id` (integer, nullable)
      - `dinner_recipe_id` (integer, nullable)
      - `exercise_id` (integer, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur la table `daily_activities`
    - Politique permettant aux utilisateurs de voir leurs propres activités
    - Politique permettant aux utilisateurs de créer leurs propres activités
    - Politique permettant aux utilisateurs de modifier leurs propres activités
    - Politique permettant aux utilisateurs de supprimer leurs propres activités

  3. Index
    - Index sur (user_id, activity_date) pour optimiser les requêtes
    - Contrainte d'unicité sur (user_id, activity_date) pour éviter les doublons
*/

CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 28),
  breakfast_completed boolean DEFAULT false,
  lunch_completed boolean DEFAULT false,
  snack_completed boolean DEFAULT false,
  dinner_completed boolean DEFAULT false,
  exercise_completed boolean DEFAULT false,
  breakfast_recipe_id integer,
  lunch_recipe_id integer,
  snack_recipe_id integer,
  dinner_recipe_id integer,
  exercise_id integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON daily_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON daily_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON daily_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON daily_activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON daily_activities(user_id, activity_date);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_daily_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_daily_activities_timestamp'
  ) THEN
    CREATE TRIGGER update_daily_activities_timestamp
      BEFORE UPDATE ON daily_activities
      FOR EACH ROW
      EXECUTE FUNCTION update_daily_activities_updated_at();
  END IF;
END $$;
