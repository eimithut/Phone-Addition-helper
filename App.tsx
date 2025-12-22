
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Timer, 
  MessageSquare, 
  Trophy, 
  BarChart3,
  LogOut,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import FocusMode from './components/FocusMode';
import MindfulCoach from './components/MindfulCoach';
import Challenges from './components/Challenges';
import Stats from './components/Stats';
import { View, Challenge, FocusSession } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '1', title: 'Morning Silence', description: 'No phone for 30 minutes after waking up.', difficulty: 'Easy', completed: false },
    { id: '2', title: 'Analog Meal', description: 'Eat lunch without looking at any screen.', difficulty: 'Medium', completed: false },
    { id: '3', title: 'Sunset Walk', description: 'Take a 20-minute walk without your phone.', difficulty: 'Medium', completed: false },
    { id: '4', title: 'Deep Work', description: 'Complete a 60-minute focus session.', difficulty: 'Hard', completed: false },
  ]);
  const [sessions, setSessions] = useState<FocusSession[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleChallenge = (id: string) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const addSession = (session: FocusSession) => {
    setSessions(prev => [session, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard challenges={challenges} sessions={sessions} onViewChange={setCurrentView} onToggleChallenge={toggleChallenge} />;
      case 'focus': return <FocusMode onSessionComplete={addSession} />;
      case 'coach': return <MindfulCoach />;
      case 'challenges': return <Challenges challenges={challenges} onToggleChallenge={toggleChallenge} />;
      case 'stats': return <Stats sessions={sessions} />;
      default: return <Dashboard challenges={challenges} sessions={sessions} onViewChange={setCurrentView} onToggleChallenge={toggleChallenge} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 lg:w-64 bg-white dark:bg-stone-900 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 p-4 flex md:flex-col justify-between items-center md:items-stretch sticky top-0 md:h-screen z-50">
        <div className="flex items-center gap-3 mb-0 md:mb-12">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
            <Timer size={24} />
          </div>
          <span className="hidden lg:block font-serif text-xl text-stone-900 dark:text-stone-100">Unplug</span>
        </div>

        <div className="flex md:flex-col gap-2 md:gap-4 flex-1 justify-center md:justify-start">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'focus', icon: Timer, label: 'Focus' },
            { id: 'coach', icon: MessageSquare, label: 'Coach' },
            { id: 'challenges', icon: Trophy, label: 'Tasks' },
            { id: 'stats', icon: BarChart3, label: 'Stats' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                  : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <item.icon size={22} />
              <span className="hidden lg:block font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-4 mt-auto pt-6 border-t border-stone-100 dark:border-stone-800">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 p-3 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all"
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="flex items-center gap-3 p-3 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all">
            <Bell size={22} />
            <span className="hidden lg:block font-medium">Alerts</span>
          </button>
          <button className="flex items-center gap-3 p-3 text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
            <LogOut size={22} />
            <span className="hidden lg:block font-medium">Log out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-12">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
