-- EXÉCUTE CE SCRIPT DIRECTEMENT DANS SUPABASE SQL EDITOR
-- Dashboard Supabase > SQL Editor > New Query > Colle ce code > Run

-- 1. Supprimer TOUTES les politiques existantes
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 2. Désactiver temporairement RLS pour vérifier que la table est accessible
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 3. Vérifier que ton profil existe
SELECT id, email, full_name, onboarding_completed
FROM user_profiles
WHERE email = 'anneemariegatas@gmail.com';

-- 4. Si le résultat ci-dessus est vide, créer le profil manuellement
-- Remplace 'USER_ID_FROM_AUTH' par ton vrai user ID qu'on voit dans la console
INSERT INTO user_profiles (id, email, full_name, notifications_enabled, onboarding_completed)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  false,
  false
FROM auth.users
WHERE email = 'anneemariegatas@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- 5. Réactiver RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Créer des politiques ULTRA PERMISSIVES pour authenticated users
CREATE POLICY "authenticated_users_all_access"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Vérifier à nouveau que ton profil est visible
SELECT id, email, full_name, onboarding_completed
FROM user_profiles
WHERE email = 'anneemariegatas@gmail.com';
