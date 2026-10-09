import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Clean URL: strip trailing slashes or subpaths like /rest/v1 or /auth/v1 if accidentally pasted
const cleanUrl = rawUrl
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/auth\/v1\/?$/, '')
  .replace(/\/+$/, '');

const cleanKey = rawKey.trim();

// Check if valid credentials are provided (and not template placeholders)
export const isSupabaseConfigured = Boolean(
  cleanUrl &&
  cleanKey &&
  !cleanUrl.includes('your-project') &&
  !cleanKey.includes('your-anon-key') &&
  cleanUrl.startsWith('https://')
);

// Fallback dummy URL to prevent createClient from throwing on initialization if env vars are missing
const safeUrl = isSupabaseConfigured ? cleanUrl : 'https://dummy-placeholder.supabase.co';
const safeKey = isSupabaseConfigured ? cleanKey : 'dummy-placeholder-key-xyz1234567890';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
