import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { playTickSound } from '@/utils/soundUtils';

export type AlarmSound = 'classic' | 'gentle' | 'urgent' | 'chime' | 'digital';

interface TimerContextType {
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  mode: 'work' | 'break';
  setMode: (mode: 'work' | 'break') => void;
  workTime: number;
  setWorkTime: (time: number) => void;
  breakTime: number;
  setBreakTime: (time: number) => void;
  isPiPActive: boolean;
  setIsPiPActive: (active: boolean) => void;
  isAlarmRinging: boolean;
  stopAlarm: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: 'work' | 'break') => void;
  alarmSound: AlarmSound;
  setAlarmSound: (sound: AlarmSound) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

const TIMER_STORAGE_KEY = 'pomodoro-timer-state';

interface TimerState {
  timeLeft: number;
  isActive: boolean;
  mode: 'work' | 'break';
  workTime: number;
  breakTime: number;
  isPiPActive: boolean;
  alarmSound: AlarmSound;
  lastUpdated: number;
}

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const getInitialState = (): Partial<TimerState> => {
    try {
      const saved = localStorage.getItem(TIMER_STORAGE_KEY);
      if (saved) {
        const state: TimerState = JSON.parse(saved);
        // If timer was active, calculate elapsed time and continue from where left off
        if (state.isActive && state.lastUpdated) {
          const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
          const newTimeLeft = Math.max(0, state.timeLeft - elapsed);
          // Only return active state if there's still time left
          if (newTimeLeft > 0) {
            return { ...state, timeLeft: newTimeLeft, isActive: true };
          } else {
            // Timer completed while away, reset to appropriate mode time
            return { 
              ...state, 
              timeLeft: state.mode === 'work' ? state.workTime * 60 : state.breakTime * 60, 
              isActive: false 
            };
          }
        }
        return state;
      }
    } catch (error) {
      console.warn('Failed to load timer state:', error);
    }
    return {};
  };

  const initialState = getInitialState();
  
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft ?? 25 * 60);
  const [isActive, setIsActive] = useState(initialState.isActive ?? false);
  const [mode, setMode] = useState<'work' | 'break'>(initialState.mode ?? 'work');
  const [workTime, setWorkTime] = useState(initialState.workTime ?? 25);
  const [breakTime, setBreakTime] = useState(initialState.breakTime ?? 5);
  const [isPiPActive, setIsPiPActive] = useState(initialState.isPiPActive ?? false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [alarmSound, setAlarmSound] = useState<AlarmSound>(initialState.alarmSound ?? 'classic');
  
  const { toast } = useToast();
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alarmIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alarmContextRef = useRef<AudioContext | null>(null);
  const alarmSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Save state frequently with timestamp
  useEffect(() => {
    try {
      const state: TimerState = {
        timeLeft,
        isActive,
        mode,
        workTime,
        breakTime,
        isPiPActive,
        alarmSound,
        lastUpdated: Date.now()
      };
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save timer state:', error);
    }
  }, [timeLeft, isActive, mode, workTime, breakTime, isPiPActive, alarmSound]);

  // Save state on visibility change (when user navigates away)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        try {
          const state: TimerState = {
            timeLeft,
            isActive,
            mode,
            workTime,
            breakTime,
            isPiPActive,
            alarmSound,
            lastUpdated: Date.now()
          };
          localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.warn('Failed to save timer state on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also save on page unload
    const handleBeforeUnload = () => {
      try {
        const state: TimerState = {
          timeLeft,
          isActive,
          mode,
          workTime,
          breakTime,
          isPiPActive,
          alarmSound,
          lastUpdated: Date.now()
        };
        localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save timer state on unload:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timeLeft, isActive, mode, workTime, breakTime, isPiPActive, alarmSound]);

  const createAlarmBuffer = useCallback((ctx: AudioContext, type: AlarmSound): AudioBuffer => {
    const sampleRate = ctx.sampleRate;
    const duration = 1.2;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    switch (type) {
      case 'gentle': {
        // Soft bell-like chime
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const envelope = Math.exp(-t * 3);
          const freq1 = 523.25; // C5
          const freq2 = 659.25; // E5
          data[i] = envelope * (
            Math.sin(2 * Math.PI * freq1 * t) * 0.4 +
            Math.sin(2 * Math.PI * freq2 * t) * 0.3
          );
        }
        break;
      }
      case 'urgent': {
        // Fast beeping alarm
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const beepCycle = Math.floor(t * 8) % 2;
          const envelope = beepCycle === 0 ? 1 : 0.1;
          data[i] = envelope * Math.sin(2 * Math.PI * 880 * t) * 0.6;
        }
        break;
      }
      case 'chime': {
        // Musical chime sequence
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const noteIndex = Math.min(Math.floor(t * 4), notes.length - 1);
          const noteStart = noteIndex / 4;
          const noteT = t - noteStart;
          const envelope = Math.exp(-noteT * 4);
          data[i] = envelope * Math.sin(2 * Math.PI * notes[noteIndex] * t) * 0.4;
        }
        break;
      }
      case 'digital': {
        // Retro digital sound
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const cycle = Math.floor(t * 6) % 3;
          const freqs = [1000, 1200, 800];
          const envelope = Math.sin(Math.PI * (t % (1/6)) * 6);
          data[i] = envelope * (Math.sin(2 * Math.PI * freqs[cycle] * t) > 0 ? 0.4 : -0.4);
        }
        break;
      }
      default: { // classic
        // Classic alternating alarm
        for (let i = 0; i < length; i++) {
          const t = i / sampleRate;
          const cycle = Math.floor(t * 4) % 2;
          const frequency = cycle === 0 ? 800 : 1000;
          const envelope = Math.sin(Math.PI * (t % 0.25) / 0.25);
          data[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.5;
        }
      }
    }

    return buffer;
  }, []);

  const playAlarmSound = useCallback(() => {
    try {
      if (!alarmContextRef.current) {
        alarmContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = alarmContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const buffer = createAlarmBuffer(ctx, alarmSound);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      alarmSourceRef.current = source;
    } catch (error) {
      console.log('Error playing alarm:', error);
    }
  }, [alarmSound, createAlarmBuffer]);

  const stopAlarm = useCallback(() => {
    setIsAlarmRinging(false);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (alarmSourceRef.current) {
      try {
        alarmSourceRef.current.stop();
      } catch (e) {}
      alarmSourceRef.current = null;
    }
  }, []);

  const startAlarm = useCallback(() => {
    setIsAlarmRinging(true);
    playAlarmSound();
    alarmIntervalRef.current = setInterval(() => {
      playAlarmSound();
    }, 1400);
  }, [playAlarmSound]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      
      startAlarm();
      
      if (mode === 'work') {
        toast({
          title: "🎉 Work Session Complete!",
          description: "Time for a well-deserved break! Click to stop alarm.",
        });
        setMode('break');
        setTimeLeft(breakTime * 60);
      } else {
        toast({
          title: "✨ Break Complete!",
          description: "Ready for another focused work session? Click to stop alarm.",
        });
        setMode('work');
        setTimeLeft(workTime * 60);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode, workTime, breakTime, toast, startAlarm]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      tickIntervalRef.current = setInterval(() => {
        playTickSound();
      }, 1000);
    } else {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Keyboard shortcuts are now handled in Pomodoro.tsx only

  const toggleTimer = () => {
    if (isAlarmRinging) {
      stopAlarm();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (isAlarmRinging) {
      stopAlarm();
    }
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workTime * 60 : breakTime * 60);
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  const switchMode = (newMode: 'work' | 'break') => {
    if (isAlarmRinging) {
      stopAlarm();
    }
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workTime * 60 : breakTime * 60);
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  return (
    <TimerContext.Provider
      value={{
        timeLeft,
        setTimeLeft,
        isActive,
        setIsActive,
        mode,
        setMode,
        workTime,
        setWorkTime,
        breakTime,
        setBreakTime,
        isPiPActive,
        setIsPiPActive,
        isAlarmRinging,
        stopAlarm,
        toggleTimer,
        resetTimer,
        switchMode,
        alarmSound,
        setAlarmSound,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
