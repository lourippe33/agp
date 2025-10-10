-- ============================================
-- SUPPRESSION COMPLÈTE DU SYSTÈME DE CODES D'ACCÈS
-- ============================================

-- 1. Supprimer les policies RLS
-- ============================================

DROP POLICY IF EXISTS "Anyone can check unused codes" ON access_codes;
DROP POLICY IF EXISTS "Users can mark code as used during signup" ON access_codes;
DROP POLICY IF EXISTS "select_unused_codes" ON access_codes;
DROP POLICY IF EXISTS "service_role_can_update_codes" ON access_codes;

-- 2. Supprimer les index
-- ============================================

DROP INDEX IF EXISTS idx_access_codes_code;
DROP INDEX IF EXISTS idx_access_codes_is_used;

-- 3. Supprimer la fonction de génération de code
-- ============================================

DROP FUNCTION IF EXISTS generate_access_code();

-- 4. Supprimer la table access_codes
-- ============================================

DROP TABLE IF EXISTS access_codes;

-- 5. Retirer les colonnes d'approbation de user_profiles
-- ============================================

ALTER TABLE user_profiles DROP COLUMN IF EXISTS is_approved;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS approval_date;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS approved_by;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
