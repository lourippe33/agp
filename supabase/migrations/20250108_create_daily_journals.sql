/*
  # Création de la table des journaux quotidiens

  1. Nouvelle table
    - `daily_journals`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, référence vers auth.users)
      - `journal_date` (date)
      - `energy_level` (integer, 1-5)
      - `satiety_level` (integer, 1-5)
      - `general_feeling` (integer, 1-5)
      - `breakfast_time` (text, format HH:MM)
      - `lunch_time` (text, format HH:MM)
      - `dinner_time` (text, format HH:MM)
      - `sleep_quality` (integer, 1-5)
      - `sleep_hours` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Activer RLS sur la table `daily_journals`
    - Politique permettant aux utilisateurs de voir leurs propres journaux
    - Politique permettant aux utilisateurs de créer leurs propres journaux
    - Politique permettant aux utilisateurs de modifier leurs propres journaux
    - Politique permettant aux utilisateurs de supprimer leurs propres journaux

  3. Index
    - Index sur (user_id, journal_date) pour optimiser les requêtes
    - Contrainte d'unicité sur (user_id, journal_date) pour éviter les doublons
*/

CREATE TABLE IF NOT EXISTS daily_journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journal_date date NOT NULL,
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  satiety_level integer CHECK (satiety_level >= 1 AND satiety_level <= 5),
  general_feeling integer CHECK (general_feeling >= 1 AND general_feeling <= 5),
  breakfast_time text,
  lunch_time text,
  dinner_time text,
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_hours numeric CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, journal_date)
);

ALTER TABLE daily_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journals"
  ON daily_journals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journals"
  ON daily_journals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON daily_journals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON daily_journals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_journals_user_date ON daily_journals(user_id, journal_date);
