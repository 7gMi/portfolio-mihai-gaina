import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.PROD) {
    console.error('Supabase configuration is missing in production — contact form disabled');
  } else {
    console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — contact form will not work');
  }
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
