/*
  # Génération de 10 codes d'accès de test

  Ce script génère 10 codes d'accès uniques pour tester le système.
  Les codes sont au format XXXX-XXXX (8 caractères sans le tiret).
*/

-- Insérer 10 codes d'accès
INSERT INTO public.access_codes (code) VALUES
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code()),
  (generate_access_code());

-- Afficher tous les codes générés
SELECT code, is_used, created_at
FROM public.access_codes
ORDER BY created_at DESC
LIMIT 10;
