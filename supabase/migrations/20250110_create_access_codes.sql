/*
  # Création du système de codes d'accès uniques

  1. Nouvelle table
    - `access_codes`
      - `id` (uuid, clé primaire)
      - `code` (text, unique) - Le code d'accès unique
      - `is_used` (boolean) - Indique si le code a été utilisé
      - `used_by` (uuid, nullable) - ID de l'utilisateur qui a utilisé le code
      - `used_at` (timestamptz, nullable) - Date d'utilisation
      - `created_at` (timestamptz) - Date de création
      - `created_by` (text, nullable) - Email de l'admin qui a créé le code
      - `notes` (text, nullable) - Notes optionnelles

  2. Sécurité
    - RLS activé
    - Les utilisateurs peuvent lire les codes pour validation (mais pas voir les codes utilisés)
    - Seuls les admins peuvent créer des codes

  3. Fonction
    - Fonction pour générer des codes automatiquement
*/

-- Créer la table des codes d'accès
CREATE TABLE IF NOT EXISTS access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_used boolean DEFAULT false NOT NULL,
  used_by uuid REFERENCES auth.users(id),
  used_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by text,
  notes text
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON access_codes(is_used);

-- Activer RLS
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre aux utilisateurs de vérifier les codes non utilisés
CREATE POLICY "Anyone can check unused codes"
  ON access_codes
  FOR SELECT
  TO authenticated
  USING (is_used = false);

-- Policy pour permettre de marquer un code comme utilisé
CREATE POLICY "Users can mark code as used during signup"
  ON access_codes
  FOR UPDATE
  TO authenticated
  USING (is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());

-- Fonction pour générer un code aléatoire
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS text AS $$
DECLARE
  characters text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insérer 10 codes d'accès initiaux
DO $$
DECLARE
  new_code text;
  i integer;
BEGIN
  FOR i IN 1..10 LOOP
    LOOP
      new_code := generate_access_code();
      BEGIN
        INSERT INTO access_codes (code, created_by, notes)
        VALUES (new_code, 'system', 'Code initial généré automatiquement');
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        -- Si le code existe déjà, réessayer avec un nouveau
        CONTINUE;
      END;
    END LOOP;
  END LOOP;
END $$;
