/*
  # Correction complète des politiques RLS et création de profil

  1. Problème identifié
    - Récursion infinie dans user_profiles à cause de is_user_approved()
    - Erreur lors de la création de compte car le trigger ne peut pas insérer dans user_profiles
    - Les politiques INSERT vérifient l'approbation qui n'existe pas encore

  2. Solution
    - Supprimer TOUTES les politiques user_profiles
    - Recréer des politiques SIMPLES sans vérification d'approbation
    - Modifier is_user_approved() pour utiliser SECURITY DEFINER
    - S'assurer que le trigger fonctionne sans restrictions

  3. Sécurité
    - user_profiles: Accessible uniquement par le propriétaire (pas de vérification d'approbation)
    - Autres tables: Vérifient l'approbation via is_user_approved()
*/

-- 1. Supprimer TOUTES les politiques existantes de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- 2. Recréer is_user_approved avec SECURITY DEFINER pour éviter la récursion
CREATE OR REPLACE FUNCTION is_user_approved()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = auth.uid()
    AND approved_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recréer des politiques SIMPLES pour user_profiles (sans vérification d'approbation)
CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. S'assurer que RLS est activé
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Recréer la fonction trigger avec SECURITY DEFINER
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

-- 6. Recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
