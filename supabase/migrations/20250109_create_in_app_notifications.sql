/*
  # Créer table des notifications in-app

  1. Nouvelle Table
    - `in_app_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers auth.users)
      - `title` (text) - Titre de la notification
      - `body` (text) - Corps du message
      - `type` (text) - Type de notification (breakfast, lunch, snack, dinner, wellness, custom)
      - `is_read` (boolean) - Notification lue ou non
      - `created_at` (timestamptz) - Date de création
      - `read_at` (timestamptz) - Date de lecture

  2. Sécurité
    - Activer RLS sur `in_app_notifications`
    - Politiques pour que les utilisateurs puissent :
      - Voir leurs propres notifications
      - Marquer leurs notifications comme lues
      - Les notifications sont créées par le système ou edge functions

  3. Index
    - Index sur user_id pour requêtes rapides
    - Index sur is_read pour filtrer les non-lues
*/

CREATE TABLE IF NOT EXISTS in_app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text DEFAULT 'custom',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON in_app_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON in_app_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON in_app_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON in_app_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
  ON in_app_notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON in_app_notifications(user_id, created_at DESC);
