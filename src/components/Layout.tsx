import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen">
      <nav className="w-16 bg-indigo-700 flex flex-col items-center py-4">
        <div className="flex-1 flex flex-col items-center space-y-4">
          <Link
            to="/"
            className={`p-2 rounded-lg ${
              location.pathname === '/' ? 'bg-indigo-800' : 'hover:bg-indigo-600'
            }`}
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Link>
          <Link
            to="/settings"
            className={`p-2 rounded-lg ${
              location.pathname === '/settings' ? 'bg-indigo-800' : 'hover:bg-indigo-600'
            }`}
          >
            <SettingsIcon className="h-6 w-6 text-white" />
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-indigo-600 mt-4"
          title="Logout"
        >
          <LogOut className="h-6 w-6 text-white" />
        </button>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}