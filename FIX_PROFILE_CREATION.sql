-- ========================================
-- CORRECTION PROFIL AUTOMATIQUE
-- ========================================

-- 1. SUPPRIMER L'ANCIEN TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 2. CRÉER LA NOUVELLE FONCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    notifications_enabled,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    false,
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CRÉER LE NOUVEAU TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. VÉRIFIER LES RLS POLICIES
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;

CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. ACTIVER RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- VÉRIFICATION
SELECT
  'Setup complet!' as message,
  COUNT(*) as nombre_triggers
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
