/*
  # Correction des politiques RLS et création automatique du profil

  1. Modifications
    - Suppression et recréation des politiques INSERT pour user_profiles
    - Ajout d'un trigger pour créer automatiquement le profil lors de l'inscription
    - Création du profil pour tous les utilisateurs existants qui n'en ont pas

  2. Sécurité
    - Les politiques RLS restent strictes
    - Le profil est créé automatiquement par le système (pas par l'utilisateur)
    - Les utilisateurs peuvent uniquement mettre à jour leur propre profil
*/

-- Supprimer l'ancienne politique INSERT
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;

-- Créer une nouvelle politique INSERT plus permissive pour l'upsert
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Fonction pour créer automatiquement un profil lors de l'inscription
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

-- Créer le trigger pour les nouveaux utilisateurs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Créer des profils pour tous les utilisateurs existants qui n'en ont pas
INSERT INTO public.user_profiles (id, email, full_name, notifications_enabled)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  false
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;
