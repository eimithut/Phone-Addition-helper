
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

const MindfulCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello. I'm Zen, your digital wellness companion. How are you feeling about your screen time today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMsg: Message = { role: 'user', text: trimmedInput };
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(currentHistory, trimmedInput);
      const modelMsg: Message = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e: any) {
      const errorMsg = e instanceof Error ? e.message : "Disconnected";
      console.error("Coach interaction failed:", errorMsg);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm a bit disconnected right now. Let's try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col space-y-4">
      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800 transition-colors">
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-emerald-800 dark:text-emerald-400">Mindfulness Coach</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-500">Always here to help you disconnect.</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 p-2 no-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm flex flex-col gap-2 transition-colors ${
              msg.role === 'user' 
                ? 'bg-stone-800 dark:bg-stone-700 text-white rounded-tr-none shadow-stone-200 dark:shadow-none' 
                : 'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-stone-700 dark:text-stone-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className={`text-[10px] uppercase tracking-widest font-bold opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? 'You' : 'Zen'}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-6 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-stone-400 dark:bg-stone-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-stone-400 dark:bg-stone-600 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-stone-400 dark:bg-stone-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-lg flex items-center gap-3 transition-all">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Share your struggles or ask for an offline idea..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-stone-700 dark:text-stone-200 py-2 px-2 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={`p-3 rounded-2xl transition-all transform active:scale-95 ${
            input.trim() && !isLoading 
              ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none shadow-md' 
              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
          }`}
        >
          <SafeSendIcon />
        </button>
      </div>
      <p className="text-center text-[10px] text-stone-400 dark:text-stone-500 uppercase font-bold tracking-widest pb-2">
        Powered by Gemini • Private Sanctuary
      </p>
    </div>
  );
};

// Extracted internal icon to avoid repeated imports
const SafeSendIcon = () => <Send size={20} />;

export default MindfulCoach;
