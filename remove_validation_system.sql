-- Supprimer complètement le système de validation manuelle
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS is_approved;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS approved_at;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS approved_by;

-- Désactiver complètement RLS
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can approve users" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Auto-create profile on signup" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
