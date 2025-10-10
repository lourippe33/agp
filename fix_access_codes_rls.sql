-- Correction des policies RLS pour permettre la vérification des codes lors de l'inscription
-- Les utilisateurs NON authentifiés doivent pouvoir vérifier si un code existe et n'est pas utilisé

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes policies
DROP POLICY IF EXISTS "Users can view unused codes" ON access_codes;
DROP POLICY IF EXISTS "Users can mark code as used" ON access_codes;
DROP POLICY IF EXISTS "Users can create codes" ON access_codes;
DROP POLICY IF EXISTS "Anyone can check codes" ON access_codes;
DROP POLICY IF EXISTS "Authenticated can mark code as used" ON access_codes;
DROP POLICY IF EXISTS "Authenticated can create codes" ON access_codes;

-- 1. Permettre à TOUT LE MONDE (même non authentifié) de LIRE les codes non utilisés
--    C'est nécessaire pour vérifier le code AVANT l'inscription
CREATE POLICY "Anyone can check codes"
  ON access_codes FOR SELECT
  TO public
  USING (is_used = false);

-- 2. Permettre aux utilisateurs authentifiés de marquer un code comme utilisé
--    On ne vérifie PAS used_by dans le WITH CHECK car on est en train de le définir
CREATE POLICY "Authenticated can mark code as used"
  ON access_codes FOR UPDATE
  TO authenticated
  USING (is_used = false)
  WITH CHECK (is_used = true);

-- 3. Permettre aux utilisateurs authentifiés de créer des codes
CREATE POLICY "Authenticated can create codes"
  ON access_codes FOR INSERT
  TO authenticated
  WITH CHECK (true);
