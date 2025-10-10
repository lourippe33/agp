-- ============================================
-- CORRECTION DES POLICIES RLS POUR access_codes
-- ============================================

-- Problème identifié : La policy empêche la fonction Edge (service_role) de mettre à jour les codes

-- 1. Supprimer les anciennes policies
-- ============================================

DROP POLICY IF EXISTS "Anyone can check unused codes" ON access_codes;
DROP POLICY IF EXISTS "Users can mark code as used during signup" ON access_codes;

-- 2. Créer de nouvelles policies sécurisées
-- ============================================

-- SELECT: Les utilisateurs authentifiés peuvent vérifier les codes non utilisés
CREATE POLICY "select_unused_codes"
  ON access_codes
  FOR SELECT
  TO authenticated
  USING (is_used = false);

-- UPDATE: Le service_role peut mettre à jour les codes (pour la fonction Edge)
CREATE POLICY "service_role_can_update_codes"
  ON access_codes
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- S'assurer que RLS est activé
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
