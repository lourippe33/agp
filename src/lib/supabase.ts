import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://znygwbrgughnhmkpxcvu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueWd3YnJndWdobmhta3B4Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDg2OTYsImV4cCI6MjA3NTQ4NDY5Nn0.1OTxyZuEDM2sWshc57b6dVaaHNscjEfAboOHjS13o7A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
