
import React from 'react';
import { Trophy, CheckCircle2, Circle, Target, Flame } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengesProps {
  challenges: Challenge[];
  onToggleChallenge: (id: string) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ challenges, onToggleChallenge }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-2">Mindful Missions</h2>
          <p className="text-stone-500 dark:text-stone-400">Small steps to reclaim your attention.</p>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-2 rounded-2xl flex gap-1">
          <button className="px-4 py-2 bg-stone-900 dark:bg-stone-700 text-white rounded-xl text-sm font-bold">Daily</button>
          <button className="px-4 py-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 rounded-xl text-sm font-bold">Weekly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((challenge) => (
          <div 
            key={challenge.id}
            onClick={() => onToggleChallenge(challenge.id)}
            className={`group p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
              challenge.completed 
                ? 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700' 
                : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-xl hover:shadow-emerald-50 dark:hover:shadow-none'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${
                challenge.completed ? 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                {challenge.completed ? <CheckCircle2 size={24} /> : <Target size={24} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                challenge.difficulty === 'Easy' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                challenge.difficulty === 'Medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
            
            <h3 className={`text-xl font-bold mb-2 transition-colors ${challenge.completed ? 'text-stone-400 dark:text-stone-600 line-through' : 'text-stone-800 dark:text-stone-200'}`}>
              {challenge.title}
            </h3>
            <p className={`text-sm leading-relaxed ${challenge.completed ? 'text-stone-300 dark:text-stone-700' : 'text-stone-500 dark:text-stone-400'}`}>
              {challenge.description}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 dark:text-amber-600 uppercase tracking-tighter">
                <Flame size={14} fill="currentColor" />
                <span>+15 Digital Harmony Points</span>
              </div>
              {!challenge.completed && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                  Mark Done
                </div>
              )}
            </div>

            {challenge.completed && (
              <div className="absolute top-2 right-2 text-stone-200 dark:text-stone-800 rotate-12">
                <Trophy size={64} opacity={0.1} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-emerald-900 dark:bg-stone-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-emerald-200/50 dark:shadow-none border dark:border-stone-800">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">Feeling Overwhelmed?</h3>
          <p className="text-emerald-100/70 dark:text-stone-400 mb-6">Complete all daily missions to unlock a "Zen Master" badge and a specialized meditation track.</p>
          <div className="w-full bg-white/10 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 dark:bg-emerald-600 h-full transition-all duration-1000" 
              style={{ width: `${(challenges.filter(c => c.completed).length / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center w-32 h-32 bg-emerald-800 dark:bg-stone-800 rounded-full border-4 border-emerald-700/50 dark:border-stone-700">
          <div className="text-center">
            <span className="block text-3xl font-bold">
              {Math.round((challenges.filter(c => c.completed).length / challenges.length) * 100)}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 dark:text-emerald-500">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
