/*
  # Create push subscriptions table

  1. New Tables
    - `push_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `subscription` (jsonb) - Contains the push subscription object with endpoint and keys
      - `endpoint` (text) - The push service endpoint URL for quick lookups
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `push_subscriptions` table
    - Add policies for users to manage their own push subscriptions

  3. Indexes
    - Index on user_id for fast lookups
    - Index on endpoint for deduplication

  4. Notes
    - Each user can only have one active subscription (enforced by unique constraint on user_id)
    - The subscription JSONB contains the full PushSubscription object needed to send notifications
*/

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription jsonb NOT NULL,
  endpoint text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON push_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscription"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
