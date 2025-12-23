
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Music, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Wind, 
  Trees,
  Loader2,
  AlertCircle,
  Bird,
  Waves
} from 'lucide-react';
import { FocusSession } from '../types';

interface FocusModeProps {
  onSessionComplete: (session: FocusSession) => void;
}

const AMBIENT_TRACKS = [
  { id: 'none', label: 'Silence', icon: VolumeX, url: '' },
  { id: 'birds', label: 'Birdsong', icon: Bird, url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bird_Song_in_the_Woods.mp3' },
  { id: 'zen', label: 'Zen Calm', icon: Waves, url: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Soft_ambient_pad.mp3' },
  { id: 'rain', label: 'Rainfall', icon: CloudRain, url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Rain_Heavy_Loud.mp3' },
  { id: 'wind', label: 'Mountain', icon: Wind, url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Storm_in_the_mountains.mp3' },
  { id: 'nature', label: 'Forest', icon: Trees, url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Forest_in_morning.mp3' },
];

const FocusMode: React.FC<FocusModeProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [currentTrack, setCurrentTrack] = useState(AMBIENT_TRACKS[0]);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const executePlay = async () => {
    if (!audioRef.current || !currentTrack.url || isMusicMuted) return;
    
    try {
      setAudioError(null);
      await audioRef.current.play();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const msg = err instanceof Error ? err.message : "Playback interrupted";
        console.warn("Audio play failed:", msg);
        setAudioError("Playback Issue. Try toggling again.");
      }
    }
  };

  const toggleTimer = async () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    
    if (nextActive) {
      await executePlay();
    } else {
      audioRef.current?.pause();
    }
  };

  const handleTrackChange = (track: typeof AMBIENT_TRACKS[0]) => {
    setAudioError(null);
    if (audioRef.current) audioRef.current.pause();
    setCurrentTrack(track);
    
    if (track.url) {
      setIsAudioLoading(true);
    } else {
      setIsAudioLoading(false);
    }
  };

  const onAudioCanPlay = async () => {
    setIsAudioLoading(false);
    if (isActive && !isMusicMuted) {
      await executePlay();
    }
  };

  const onAudioError = (e: any) => {
    console.error("Audio stream error encountered");
    setIsAudioLoading(false);
    setAudioError("Unable to load track.");
  };

  const toggleMute = async () => {
    const nextMuted = !isMusicMuted;
    setIsMusicMuted(nextMuted);
    if (!nextMuted && isActive) {
      await executePlay();
    } else {
      audioRef.current?.pause();
    }
  };

  const handleComplete = () => {
    if (audioRef.current) audioRef.current.pause();
    if (mode === 'focus') {
      onSessionComplete({
        id: Date.now().toString(),
        duration: Math.floor(initialTime / 60),
        timestamp: Date.now(),
        label: 'Focus Session'
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    const nextTime = nextMode === 'focus' ? 25 * 60 : 5 * 60;
    setMode(nextMode);
    setTimeLeft(nextTime);
    setInitialTime(nextTime);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (audioRef.current) audioRef.current.pause();
    setTimeLeft(initialTime);
  };

  const setDuration = (mins: number) => {
    setIsActive(false);
    if (audioRef.current) audioRef.current.pause();
    setTimeLeft(mins * 60);
    setInitialTime(mins * 60);
    setMode('focus');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-2 transition-colors">Deep Work Zone</h2>
        <p className="text-stone-500 dark:text-stone-400">Put your phone away and focus on what matters.</p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none flex flex-col items-center relative overflow-hidden transition-colors">
        {currentTrack.url && (
          <audio 
            key={currentTrack.id}
            ref={audioRef}
            src={currentTrack.url}
            loop
            preload="auto"
            onCanPlay={onAudioCanPlay}
            onError={onAudioError}
          />
        )}

        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-stone-100 dark:text-stone-800"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * progress) / 100}
              className={`transition-all duration-500 ${mode === 'focus' ? 'text-emerald-500' : 'text-amber-500'}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-stone-800 dark:text-stone-100 tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mt-2">
              {mode === 'focus' ? 'Focusing' : 'Resting'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-full text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all"
            title="Reset Timer"
          >
            <RotateCcw size={28} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 ${
              isActive ? 'bg-stone-800 dark:bg-stone-700' : 'bg-emerald-600 shadow-emerald-200 dark:shadow-none'
            }`}
          >
            {isAudioLoading ? (
              <Loader2 size={32} className="animate-spin" />
            ) : isActive ? (
              <Pause size={32} fill="white" />
            ) : (
              <Play size={32} fill="white" className="ml-1" />
            )}
          </button>

          <button 
            onClick={handleComplete}
            className="p-4 rounded-full text-stone-400 dark:text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            title="Force Complete"
          >
            <CheckCircle2 size={28} />
          </button>
        </div>

        <div className="w-full border-t border-stone-100 dark:border-stone-800 pt-8 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mb-2">
             <Music size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Ambient Soundscape</span>
           </div>
           <div className="flex gap-2 overflow-x-auto pb-4 w-full justify-start md:justify-center px-4 no-scrollbar">
             {AMBIENT_TRACKS.map((track) => (
               <button
                 key={track.id}
                 onClick={() => handleTrackChange(track)}
                 title={track.label}
                 className={`p-3 min-w-[54px] rounded-2xl flex flex-col items-center gap-1 transition-all flex-shrink-0 ${
                   currentTrack.id === track.id
                     ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                     : 'bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 border border-transparent'
                 }`}
               >
                 <track.icon size={20} />
                 <span className="text-[8px] font-bold uppercase tracking-tighter">{track.label}</span>
               </button>
             ))}
             <button
                onClick={toggleMute}
                className={`p-3 min-w-[54px] rounded-2xl flex flex-col items-center gap-1 transition-all flex-shrink-0 ${
                  isMusicMuted 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/40' 
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 border border-transparent'
                }`}
              >
                {isMusicMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                <span className="text-[8px] font-bold uppercase tracking-tighter">{isMusicMuted ? 'Muted' : 'Sound On'}</span>
             </button>
           </div>
           
           {audioError && (
             <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full animate-in fade-in zoom-in">
               <AlertCircle size={12} />
               {audioError}
             </div>
           )}

           {currentTrack.id !== 'none' && !isMusicMuted && isActive && !audioError && (
             <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-tighter animate-pulse">
               {isAudioLoading ? 'Buffering Sound...' : `Now Playing: ${currentTrack.label}`}
             </p>
           )}
        </div>

        {showSuccess && (
          <div className="absolute inset-0 bg-emerald-600/95 dark:bg-emerald-900/95 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in zoom-in duration-300 z-20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-tight">Focus Achieved</h3>
            <p className="text-emerald-50">Session logged. Take a mindful break.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Sun, label: '15m Sprint', value: 15 },
          { icon: Moon, label: '25m Focus', value: 25 },
          { icon: Coffee, label: '60m Deep', value: 60 },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDuration(opt.value)}
            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
              initialTime === opt.value * 60 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm' 
                : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <opt.icon size={24} />
            <span className="font-bold text-sm whitespace-nowrap">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FocusMode;
