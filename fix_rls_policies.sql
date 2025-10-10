/*
  🚧 FIX RECURSION INFINIE - POLICIES RLS

  Ce script nettoie complètement les policies RLS problématiques
  et les recrée de manière sécurisée sans récursion.
*/

-- 🔥 ÉTAPE 1 : Supprimer TOUTES les policies existantes sur user_profiles
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE tablename = 'user_profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname);
    RAISE NOTICE 'Supprimée: %', pol.policyname;
  END LOOP;
END $$;

-- 🔥 ÉTAPE 2 : Supprimer la fonction is_admin si elle existe
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- ✅ ÉTAPE 3 : Créer les policies SIMPLES et SÉCURISÉES

-- Lecture : Un utilisateur peut lire UNIQUEMENT son propre profil
CREATE POLICY "Allow users to read their own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Insertion : Un utilisateur peut insérer UNIQUEMENT son propre profil
CREATE POLICY "Allow users to insert their own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Mise à jour : Un utilisateur peut modifier UNIQUEMENT son propre profil
CREATE POLICY "Allow users to update their own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Suppression : Un utilisateur peut supprimer UNIQUEMENT son propre profil
CREATE POLICY "Allow users to delete their own profile"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 🔍 ÉTAPE 4 : Vérifier que RLS est bien activé
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ✅ Afficher les policies créées
SELECT
  tablename,
  policyname,
  cmd AS operation,
  CASE
    WHEN qual IS NOT NULL THEN 'USING défini'
    ELSE 'Pas de USING'
  END as using_clause,
  CASE
    WHEN with_check IS NOT NULL THEN 'WITH CHECK défini'
    ELSE 'Pas de WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_profiles' AND schemaname = 'public'
ORDER BY policyname;
