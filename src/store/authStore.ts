import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface UserSettings {
  name: string;
  openai_key: string;
  tavily_key: string;
}

interface AuthState {
  user: any;
  session: any;
  userSettings: UserSettings | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: any) => void;
  loadUserSettings: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  userSettings: null,
  loading: true,
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.status === 429) {
        throw new Error('Too many attempts. Please try again later.');
      }
      throw error;
    }
    
    set({ user: data.user, session: data.session });
    await get().loadUserSettings();
  },
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      if (error.status === 429) {
        throw new Error('Too many attempts. Please try again later.');
      }
      throw error;
    }

    if (data.user && !data.user.confirmed_at) {
      throw new Error('Please check your email for verification link.');
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, session: null, userSettings: null });
  },
  setUser: (user) => set({ user }),
  loadUserSettings: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_settings')
      .select('name, openai_key, tavily_key')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error loading user settings:', error);
      return;
    }

    set({ userSettings: data || { name: '', openai_key: '', tavily_key: '' } });
  },
}));