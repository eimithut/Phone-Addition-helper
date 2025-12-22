
import React from 'react';
import { ArrowRight, Sparkles, Zap, Leaf, Trophy } from 'lucide-react';
import { View, Challenge, FocusSession } from '../types';

interface DashboardProps {
  challenges: Challenge[];
  sessions: FocusSession[];
  onViewChange: (view: View) => void;
  onToggleChallenge: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ challenges, sessions, onViewChange, onToggleChallenge }) => {
  const completedCount = challenges.filter(c => c.completed).length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-900 dark:text-stone-100 mb-2 transition-colors">Welcome back, Human.</h1>
          <p className="text-stone-500 dark:text-stone-400">Ready to find some space away from the noise?</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-stone-900 p-3 px-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-lg">
              <Zap size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider font-bold">Streak</p>
              <p className="text-lg font-bold text-stone-800 dark:text-stone-200">4 Days</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100 dark:shadow-none relative overflow-hidden group cursor-pointer" onClick={() => onViewChange('focus')}>
          <div className="relative z-10">
            <div className="bg-emerald-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1">Deep Focus</h3>
            <p className="text-emerald-100 text-sm mb-4">Start a session to disconnect and clear your mind.</p>
            <div className="flex items-center gap-2 text-sm font-semibold bg-white/20 w-max px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-all">
              Launch Timer <ArrowRight size={16} />
            </div>
          </div>
          <Leaf className="absolute -bottom-4 -right-4 text-emerald-500/20 w-32 h-32 rotate-12" />
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-stone-400 dark:text-stone-500 text-sm font-medium mb-1 transition-colors">Time Recovered</p>
            <h4 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{totalMinutes}m</h4>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-2/3"></div>
            </div>
            <span className="text-xs text-stone-400 dark:text-stone-500 font-bold">65% of goal</span>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-stone-400 dark:text-stone-500 text-sm font-medium mb-1 transition-colors">Mindful Missions</p>
            <h4 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{completedCount}/{challenges.length}</h4>
          </div>
          <button 
            onClick={() => onViewChange('challenges')}
            className="mt-4 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 hover:underline"
          >
            View all tasks <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Tasks */}
        <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Mindful Missions</h2>
            <Trophy size={20} className="text-amber-500" />
          </div>
          <div className="space-y-4">
            {challenges.slice(0, 3).map((challenge) => (
              <div 
                key={challenge.id}
                onClick={() => onToggleChallenge(challenge.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  challenge.completed 
                    ? 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-60' 
                    : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    challenge.completed ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300 dark:border-stone-600'
                  }`}>
                    {challenge.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${challenge.completed ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-700 dark:text-stone-200'}`}>
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-stone-400 dark:text-stone-500">{challenge.difficulty} • 15pts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insight */}
        <section className="bg-stone-900 dark:bg-stone-950 p-8 rounded-3xl text-white relative overflow-hidden border dark:border-stone-800">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <span className="font-bold text-emerald-400 uppercase text-xs tracking-widest">AI Wellness Tip</span>
            </div>
            <p className="text-lg font-medium leading-relaxed mb-8 italic">
              "The craving to check your phone often stems from a search for dopamine. Try taking five deep breaths next time you feel the urge."
            </p>
            <button 
              onClick={() => onViewChange('coach')}
              className="mt-auto bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            >
              Talk to your Wellness Coach
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
