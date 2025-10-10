/*
  SCRIPT DE SUPPRESSION DU SYSTÈME DE CODES D'ACCÈS

  Exécuter ce script dans le SQL Editor de Supabase pour :
  1. Supprimer complètement le système de codes d'accès
  2. Revenir à une inscription simple avec validation email uniquement
  3. Garder le questionnaire d'onboarding
  4. Garder les colonnes d'approbation pour validation manuelle future
*/

-- 1. Supprimer les policies de access_codes
DROP POLICY IF EXISTS "Anyone can check unused codes" ON public.access_codes;
DROP POLICY IF EXISTS "Users can mark code as used during signup" ON public.access_codes;
DROP POLICY IF EXISTS "Service role can manage all codes" ON public.access_codes;

-- 2. Supprimer les index
DROP INDEX IF EXISTS idx_access_codes_code;
DROP INDEX IF EXISTS idx_access_codes_is_used;

-- 3. Supprimer la fonction de génération de codes
DROP FUNCTION IF EXISTS generate_access_code();

-- 4. Supprimer la table access_codes
DROP TABLE IF EXISTS public.access_codes;

-- 5. Vérifier que user_profiles a des policies simples (sans vérification d'approbation)
-- Les colonnes approved_at et approved_by restent pour validation manuelle future

-- 6. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Système de codes d''accès supprimé avec succès';
  RAISE NOTICE '✅ L''inscription est maintenant libre (validation email uniquement)';
  RAISE NOTICE '✅ Le questionnaire d''onboarding reste actif';
  RAISE NOTICE '✅ Les colonnes d''approbation restent disponibles pour validation manuelle future';
END $$;
