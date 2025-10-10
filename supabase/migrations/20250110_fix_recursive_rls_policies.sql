/*
  # Correction définitive des politiques RLS récursives

  1. Problème identifié
    - Erreur 42P17: récursion infinie détectée dans les politiques RLS pour user_profiles
    - Conflit entre trigger automatique et politiques INSERT

  2. Solution
    - Supprimer TOUTES les politiques existantes
    - Recréer des politiques simples et non-récursives
    - Garantir que le trigger fonctionne sans contrainte RLS

  3. Sécurité
    - Les utilisateurs peuvent UNIQUEMENT lire/modifier leur propre profil
    - Le trigger système crée les profils automatiquement (SECURITY DEFINER)
*/

-- Supprimer TOUTES les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Recréer des politiques simples et non-récursives
CREATE POLICY "Allow users to read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- S'assurer que RLS est activé
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Recréer la fonction trigger avec SECURITY DEFINER pour bypasser RLS
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

-- Recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
