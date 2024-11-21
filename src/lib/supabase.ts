import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

if (!env.supabase.url || !env.supabase.url.startsWith('https://')) {
  console.error('Invalid or missing VITE_SUPABASE_URL');
  throw new Error('Supabase configuration error. Please check your environment variables.');
}

if (!env.supabase.anonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY');
  throw new Error('Supabase configuration error. Please check your environment variables.');
}

export const supabase = createClient(env.supabase.url, env.supabase.anonKey);