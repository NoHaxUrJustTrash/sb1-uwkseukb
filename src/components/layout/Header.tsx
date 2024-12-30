import React from 'react';
import { Moon, Sun, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Header = () => {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between z-10">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          U
        </div>
      </div>
    </header>
  );
};