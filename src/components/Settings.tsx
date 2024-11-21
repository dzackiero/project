import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function Settings() {
  const { user, userSettings, loadUserSettings } = useAuthStore();
  const [name, setName] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (userSettings) {
      setName(userSettings.name || '');
      setOpenaiKey(userSettings.openai_key || '');
      setTavilyKey(userSettings.tavily_key || '');
    } else {
      loadUserSettings();
    }
  }, [userSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          name,
          openai_key: openaiKey,
          tavily_key: tavilyKey,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      await loadUserSettings();
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Settings</h2>

        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="openai" className="block text-sm font-medium text-gray-700">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="openai"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="tavily" className="block text-sm font-medium text-gray-700">
              Tavily API Key
            </label>
            <input
              type="password"
              id="tavily"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
