interface EnvConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const env: EnvConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
};