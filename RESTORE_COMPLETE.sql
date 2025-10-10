-- ========================================
-- RESTAURATION COMPLÈTE DE L'APPLICATION
-- ========================================
-- Exécute ce fichier EN UNE SEULE FOIS dans Supabase SQL Editor
-- Cela va restaurer l'état fonctionnel avec les codes d'accès

-- 1. NETTOYER TOUS LES TRIGGERS ET FONCTIONS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_user_approved() CASCADE;

-- 2. NETTOYER LES COLONNES DE VALIDATION MANUELLE
ALTER TABLE user_profiles DROP COLUMN IF EXISTS is_approved CASCADE;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS approved_at CASCADE;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS approved_by CASCADE;

-- 3. SUPPRIMER TOUTES LES POLITIQUES RLS DE user_profiles
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- 4. RECRÉER LES POLITIQUES RLS SIMPLES pour user_profiles
CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 5. ACTIVER RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. RECRÉER LA FONCTION TRIGGER
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

-- 7. RECRÉER LE TRIGGER
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. VÉRIFIER LES POLITIQUES RLS DES AUTRES TABLES
-- daily_activities
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own activities" ON daily_activities;
CREATE POLICY "Users can manage own activities"
  ON daily_activities FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- daily_journals
ALTER TABLE daily_journals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own journals" ON daily_journals;
CREATE POLICY "Users can manage own journals"
  ON daily_journals FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- wellness_entries
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own wellness entries" ON wellness_entries;
CREATE POLICY "Users can manage own wellness entries"
  ON wellness_entries FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- mood_entries
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- neurotransmitter_entries
ALTER TABLE neurotransmitter_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own neurotransmitter entries" ON neurotransmitter_entries;
CREATE POLICY "Users can manage own neurotransmitter entries"
  ON neurotransmitter_entries FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- in_app_notifications
ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON in_app_notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON in_app_notifications;
CREATE POLICY "Users can view own notifications"
  ON in_app_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications"
  ON in_app_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- FIN DE LA RESTAURATION
SELECT 'Restauration terminée avec succès!' as message;
