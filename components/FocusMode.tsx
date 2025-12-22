
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
  AlertCircle
} from 'lucide-react';
import { FocusSession } from '../types';

interface FocusModeProps {
  onSessionComplete: (session: FocusSession) => void;
}

const AMBIENT_TRACKS = [
  { id: 'none', label: 'Silence', icon: VolumeX, url: '' },
  { id: 'rain', label: 'Soft Rain', icon: CloudRain, url: 'https://www.soundjay.com/nature/rain-01.mp3' },
  { id: 'wind', label: 'Mountain Wind', icon: Wind, url: 'https://www.soundjay.com/nature/wind-howl-01.mp3' },
  { id: 'nature', label: 'Forest Birds', icon: Trees, url: 'https://www.soundjay.com/nature/birds-chirping-01.mp3' },
];

const FocusMode: React.FC<FocusModeProps> = ({ onSessionComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  // Audio state
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

  // Handle music logic
  const playAudio = async () => {
    if (audioRef.current && currentTrack.url && !isMusicMuted) {
      try {
        setAudioError(null);
        // Ensure the browser allows the operation
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (err: any) {
        console.warn("Audio playback failed:", err);
        // Don't show error for standard AbortError (e.g. paused before it could play)
        if (err.name !== 'AbortError') {
          setAudioError("Audio playback not supported or blocked.");
        }
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggleTimer = async () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    
    if (nextActive) {
      await playAudio();
    } else {
      pauseAudio();
    }
  };

  const handleTrackChange = async (track: typeof AMBIENT_TRACKS[0]) => {
    setAudioError(null);
    pauseAudio();
    setCurrentTrack(track);
    
    if (track.url === '') {
      setIsAudioLoading(false);
      return;
    }

    // Set loading state until the new source is ready
    setIsAudioLoading(true);
  };

  // Called when the audio element has loaded enough data to play
  const onAudioCanPlay = async () => {
    setIsAudioLoading(false);
    if (isActive && !isMusicMuted) {
      await playAudio();
    }
  };

  const onAudioError = () => {
    setIsAudioLoading(false);
    setAudioError("Failed to load audio source.");
  };

  const toggleMute = async () => {
    const nextMuted = !isMusicMuted;
    setIsMusicMuted(nextMuted);
    if (!nextMuted && isActive) {
      await playAudio();
    } else {
      pauseAudio();
    }
  };

  const handleComplete = () => {
    pauseAudio();
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
    pauseAudio();
    setTimeLeft(initialTime);
  };

  const setDuration = (mins: number) => {
    setIsActive(false);
    pauseAudio();
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
        <h2 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-2">Deep Work Zone</h2>
        <p className="text-stone-500 dark:text-stone-400">Put your phone away and focus on what matters.</p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none flex flex-col items-center relative overflow-hidden transition-colors">
        {/* Only render audio if a track is selected to avoid blank source errors */}
        {currentTrack.url && (
          <audio 
            key={currentTrack.id}
            ref={audioRef}
            src={currentTrack.url}
            loop
            preload="auto"
            crossOrigin="anonymous"
            onCanPlay={onAudioCanPlay}
            onError={onAudioError}
          />
        )}

        {/* Progress Circle Visual */}
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
          >
            <CheckCircle2 size={28} />
          </button>
        </div>

        {/* Music Selection Controls */}
        <div className="w-full border-t border-stone-100 dark:border-stone-800 pt-8 flex flex-col items-center gap-4">
           <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mb-2">
             <Music size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Ambient Soundscape</span>
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-center px-4 no-scrollbar">
             {AMBIENT_TRACKS.map((track) => (
               <button
                 key={track.id}
                 onClick={() => handleTrackChange(track)}
                 title={track.label}
                 className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                   currentTrack.id === track.id
                     ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800'
                     : 'bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 border border-transparent'
                 }`}
               >
                 <track.icon size={20} />
               </button>
             ))}
             <button
                onClick={toggleMute}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  isMusicMuted 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/40' 
                    : 'bg-stone-50 dark:bg-stone-800 text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 border border-transparent'
                }`}
              >
                {isMusicMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
           </div>
           
           {audioError && (
             <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-wider">
               <AlertCircle size={12} />
               {audioError}
             </div>
           )}

           {currentTrack.id !== 'none' && !isMusicMuted && isActive && !audioError && (
             <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-tighter animate-pulse">
               {isAudioLoading ? 'Buffering...' : `Playing: ${currentTrack.label}`}
             </p>
           )}
        </div>

        {showSuccess && (
          <div className="absolute inset-0 bg-emerald-600/95 dark:bg-emerald-900/95 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in zoom-in duration-300 z-20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Great Session!</h3>
            <p className="text-emerald-50">Your progress has been logged. Take a break.</p>
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
