/*
  🔧 CRÉATION DES TABLES MANQUANTES

  Ce script crée toutes les tables manquantes détectées dans les erreurs.
*/

-- ==========================================
-- 1. TABLE ACCESS_CODES
-- ==========================================

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

CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON access_codes(is_used);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes policies
DROP POLICY IF EXISTS "Anyone can check unused codes" ON access_codes;
DROP POLICY IF EXISTS "Users can mark code as used during signup" ON access_codes;
DROP POLICY IF EXISTS "Admins can manage codes" ON access_codes;
DROP POLICY IF EXISTS "Users can view unused codes" ON access_codes;
DROP POLICY IF EXISTS "Users can mark code as used" ON access_codes;
DROP POLICY IF EXISTS "Authenticated users can create codes" ON access_codes;

-- Nouvelles policies SIMPLES
CREATE POLICY "Users can view unused codes"
  ON access_codes FOR SELECT TO authenticated
  USING (is_used = false);

CREATE POLICY "Users can mark code as used"
  ON access_codes FOR UPDATE TO authenticated
  USING (is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());

CREATE POLICY "Users can create codes"
  ON access_codes FOR INSERT TO authenticated
  WITH CHECK (true);

-- ==========================================
-- 2. TABLE USER_GOAL_PROGRESS
-- ==========================================

CREATE TABLE IF NOT EXISTS user_goal_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id text NOT NULL,
  current_value numeric DEFAULT 0,
  target_value numeric NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, goal_id)
);

CREATE INDEX IF NOT EXISTS idx_user_goal_progress_user ON user_goal_progress(user_id);

ALTER TABLE user_goal_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own goals" ON user_goal_progress;

CREATE POLICY "Users can manage their own goals"
  ON user_goal_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. FONCTION GENERATE_ACCESS_CODE
-- ==========================================

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

-- ==========================================
-- 4. GÉNÉRER 10 CODES INITIAUX
-- ==========================================

DO $$
DECLARE
  new_code text;
  i integer;
  code_count integer;
BEGIN
  SELECT COUNT(*) INTO code_count FROM access_codes;

  IF code_count = 0 THEN
    FOR i IN 1..10 LOOP
      LOOP
        new_code := generate_access_code();
        BEGIN
          INSERT INTO access_codes (code, created_by, notes)
          VALUES (new_code, 'system', 'Code initial');
          EXIT;
        EXCEPTION WHEN unique_violation THEN
          CONTINUE;
        END;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- ==========================================
-- 5. VÉRIFICATION
-- ==========================================

SELECT 'access_codes' as table_name, COUNT(*) as row_count FROM access_codes
UNION ALL
SELECT 'user_goal_progress', COUNT(*) FROM user_goal_progress;
