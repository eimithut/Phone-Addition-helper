
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Calendar, Clock, TrendingUp, Info } from 'lucide-react';
import { FocusSession } from '../types';

interface StatsProps {
  sessions: FocusSession[];
}

const Stats: React.FC<StatsProps> = ({ sessions }) => {
  // Aggregate data for the last 7 days
  const data = [
    { name: 'Mon', mins: 45 },
    { name: 'Tue', mins: 30 },
    { name: 'Wed', mins: 60 },
    { name: 'Thu', mins: 25 },
    { name: 'Fri', mins: 50 },
    { name: 'Sat', mins: 90 },
    { name: 'Sun', mins: 120 },
  ];

  const totalFocus = sessions.reduce((acc, s) => acc + s.duration, 0) + 420;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-2">Your Impact</h2>
        <p className="text-stone-500 dark:text-stone-400">The time you reclaimed from the digital void.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Total Reclaimed', val: `${totalFocus}m`, color: 'emerald' },
          { icon: Calendar, label: 'Current Streak', val: '4 Days', color: 'blue' },
          { icon: TrendingUp, label: 'Focus Intensity', val: 'High', color: 'orange' },
          { icon: Info, label: 'Quality Score', val: '88%', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-colors">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
              <stat.icon size={20} />
            </div>
            <p className="text-stone-400 dark:text-stone-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm transition-colors">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-8 flex items-center gap-2">
            Weekly Focus Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(28, 25, 23, 0.95)',
                    color: '#fff'
                  }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="mins" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorMins)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-stone-900 dark:bg-stone-950 p-8 rounded-[3rem] text-white flex flex-col justify-between border dark:border-stone-800">
          <div>
            <h3 className="text-xl font-bold mb-4">Focus Quality</h3>
            <p className="text-stone-400 text-sm mb-6">You are most focused in the morning between 8 AM and 11 AM. Your attention spans have increased by 12% this week.</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-widest">Morning Deep Work</span>
              <span className="text-sm font-bold">82%</span>
            </div>
            <div className="w-full h-2 bg-white/10 dark:bg-stone-800 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[82%]"></div>
            </div>
            
            <div className="flex justify-between items-end mt-4">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">Evening Unwind</span>
              <span className="text-sm font-bold">45%</span>
            </div>
            <div className="w-full h-2 bg-white/10 dark:bg-stone-800 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[45%]"></div>
            </div>
          </div>
          <button className="mt-8 text-center text-xs text-stone-500 hover:text-white transition-all uppercase tracking-widest font-bold">
            Download full report
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-stone-900 p-8 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm transition-colors">
        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-6">Recent Sessions</h3>
        <div className="space-y-4">
          {sessions.length > 0 ? sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-bold text-stone-800 dark:text-stone-200">{s.label}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(s.timestamp).toLocaleDateString()} at {new Date(s.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-800 dark:text-stone-100">+{s.duration}m</p>
                <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500 tracking-widest">Success</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-stone-400 dark:text-stone-600">
              <p>No recorded sessions yet.</p>
              <p className="text-sm">Start a focus timer to see your stats grow!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
