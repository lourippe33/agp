/*
  # Add User Approval System

  1. Changes
    - Add `is_approved` column to user_profiles (default: false)
    - Add `role` column to user_profiles (default: 'client', options: 'admin', 'client')
    - Add `approved_at` column to track when user was approved
    - Add `approved_by` column to track which admin approved the user

  2. Security
    - Users can view their own approval status
    - Only admins can update approval status
    - New RLS policies for admin role management

  3. Important Notes
    - First user should be manually set as admin in Supabase dashboard
    - Run: UPDATE user_profiles SET role = 'admin', is_approved = true WHERE email = 'your-email@example.com';
*/

-- Add new columns to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_approved'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_approved boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role text DEFAULT 'client' CHECK (role IN ('admin', 'client'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN approved_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN approved_by uuid REFERENCES user_profiles(id);
  END IF;
END $$;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;

-- Create new RLS policies for approval system
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update user approval status"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
