import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { playTickSound, playCompletionChime } from '@/utils/soundUtils';

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
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: 'work' | 'break') => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      
      playCompletionChime();
      
      if (mode === 'work') {
        toast({
          title: "🎉 Work Session Complete!",
          description: "Time for a well-deserved break!",
        });
        setMode('break');
        setTimeLeft(breakTime * 60);
      } else {
        toast({
          title: "✨ Break Complete!",
          description: "Ready for another focused work session?",
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
  }, [isActive, timeLeft, mode, workTime, breakTime, toast]);

  // Handle tick sound
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

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workTime * 60 : breakTime * 60);
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  const switchMode = (newMode: 'work' | 'break') => {
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
        toggleTimer,
        resetTimer,
        switchMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
