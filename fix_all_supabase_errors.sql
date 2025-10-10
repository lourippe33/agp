-- ============================================
-- CORRECTION COMPLÈTE DE TOUS LES PROBLÈMES SUPABASE
-- ============================================

-- 1. SUPPRIMER TOUTES LES POLITIQUES RLS RÉCURSIVES
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 2. RECRÉER DES POLITIQUES RLS SIMPLES ET SÉCURISÉES
-- ============================================

-- SELECT: Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Allow users to read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- UPDATE: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Allow users to update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT: Les utilisateurs peuvent créer leur propre profil
CREATE POLICY "Allow users to insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. ACTIVER RLS
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. RECRÉER LA FONCTION TRIGGER AVEC SECURITY DEFINER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, notifications_enabled)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RECRÉER LE TRIGGER
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. VÉRIFIER QUE LA TABLE in_app_notifications EXISTE
-- ============================================

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

-- 7. ACTIVER RLS SUR in_app_notifications
-- ============================================

ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own notifications" ON in_app_notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON in_app_notifications;
DROP POLICY IF EXISTS "Service role can insert notifications" ON in_app_notifications;

-- Recréer les politiques
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

-- 8. CRÉER LES INDEX
-- ============================================

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON in_app_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
  ON in_app_notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON in_app_notifications(user_id, created_at DESC);

-- 9. CRÉER LES PROFILS MANQUANTS
-- ============================================

INSERT INTO public.user_profiles (id, email, full_name, notifications_enabled)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  false
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIN DU SCRIPT DE CORRECTION
-- ============================================
