import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './components/Calendar';
import { TaskList } from './components/tasks/TaskList';
import { Analytics } from './components/Analytics';
import { Settings } from './components/settings/Settings';
import { Leaderboard } from './components/competition/Leaderboard';
import { AuthDialog } from './components/auth/AuthDialog';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';

function App() {
  const { darkMode, user, setUser } = useStore();
  const [showAuth, setShowAuth] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  React.useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user's tasks when authenticated
  React.useEffect(() => {
    if (user) {
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            useStore.getState().tasks = data;
          }
        });
    }
  }, [user]);

  // Update timer every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      useStore.getState().updateElapsedTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold mb-8">Welcome to Taskify</h1>
          <div className="space-x-4">
            <button
              onClick={() => {
                setAuthMode('signin');
                setShowAuth(true);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuth(true);
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Create Account
            </button>
          </div>
        </div>
        <AuthDialog
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          mode={authMode}
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Sidebar />
          <Header />
          <main className="ml-64 pt-16 p-6">
            <div className="max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/competition" element={<Leaderboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;