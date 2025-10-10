/*
  # Système de codes d'accès unique

  1. Nouvelle table
    - `access_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Le code d'activation
      - `is_used` (boolean) - Si le code a été utilisé
      - `used_by` (uuid) - Référence vers auth.users
      - `used_at` (timestamptz) - Date d'utilisation
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - Enable RLS sur `access_codes`
    - Policy pour que n'importe qui puisse vérifier les codes non utilisés
    - Policy pour que service_role puisse tout faire
    - Policy pour marquer un code comme utilisé lors du signup

  3. Index
    - Index sur la colonne `code` pour optimiser les recherches
    - Index sur `is_used` pour les requêtes de codes disponibles
*/

-- Créer la table access_codes
CREATE TABLE IF NOT EXISTS public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Policy : Permettre à tout le monde de vérifier si un code existe et n'est pas utilisé
CREATE POLICY "Anyone can check unused codes"
ON public.access_codes
FOR SELECT
TO anon, authenticated
USING (is_used = false);

-- Policy : Permettre aux utilisateurs authentifiés de marquer leur code comme utilisé
CREATE POLICY "Users can mark code as used during signup"
ON public.access_codes
FOR UPDATE
TO authenticated
USING (is_used = false)
WITH CHECK (is_used = true AND used_by = auth.uid());

-- Policy : Service role peut tout faire (pour la Edge Function)
CREATE POLICY "Service role can manage all codes"
ON public.access_codes
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON public.access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON public.access_codes(is_used);

-- Fonction pour générer des codes uniques aléatoires
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
