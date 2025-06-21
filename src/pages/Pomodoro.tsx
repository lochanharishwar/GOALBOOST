import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound, playTickSound, playCompletionChime } from '@/utils/soundUtils';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer with work time
  useEffect(() => {
    setTimeLeft(workTime * 60);
  }, [workTime]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Clear tick sound when timer ends
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      
      // Play completion chime
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

  // Handle tick sound when timer is active
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Start ticking sound every second
      tickIntervalRef.current = setInterval(() => {
        playTickSound();
      }, 1000);
    } else {
      // Clear tick sound when paused or completed
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
    playClickSound();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playClickSound();
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workTime * 60 : breakTime * 60);
    // Clear tick sound when resetting
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  const switchMode = (newMode: 'work' | 'break') => {
    playClickSound();
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? workTime * 60 : breakTime * 60);
    // Clear tick sound when switching modes
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  const toggleTheme = () => {
    playClickSound();
    setIsDarkMode(!isDarkMode);
  };

  const updateWorkTime = (minutes: number) => {
    playClickSound();
    setWorkTime(minutes);
    if (mode === 'work' && !isActive) {
      setTimeLeft(minutes * 60);
    }
  };

  const updateBreakTime = (minutes: number) => {
    playClickSound();
    setBreakTime(minutes);
    if (mode === 'break' && !isActive) {
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((workTime * 60 - timeLeft) / (workTime * 60)) * 100
    : ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-green-900 to-teal-900" 
        : "bg-gradient-to-br from-green-50 via-teal-50 to-slate-100"
    )}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Timer</h1>
          <p className="text-gray-300">Stay focused and productive</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/30 rounded-lg p-1 backdrop-blur-xl">
            <SoundButton
              onClick={() => switchMode('work')}
              className={cn(
                "px-6 py-2 rounded-md transition-all duration-300",
                mode === 'work' 
                  ? "bg-green-500 text-white" 
                  : "bg-transparent text-gray-300 hover:text-white"
              )}
            >
              Focus ({workTime}min)
            </SoundButton>
            <SoundButton
              onClick={() => switchMode('break')}
              className={cn(
                "px-6 py-2 rounded-md transition-all duration-300",
                mode === 'break' 
                  ? "bg-teal-500 text-white" 
                  : "bg-transparent text-gray-300 hover:text-white"
              )}
            >
              Break ({breakTime}min)
            </SoundButton>
          </div>
        </div>

        {/* Timer Display */}
        <Card className="shadow-xl border-0 bg-black/30 backdrop-blur-xl border border-green-500/20 max-w-md mx-auto mb-6">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              {/* Circular Progress */}
              <svg className="w-48 h-48 transform -rotate-90 mx-auto" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={mode === 'work' ? "#10b981" : "#14b8a6"}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-300 capitalize">
                    {mode === 'work' ? 'Focus Time' : 'Break Time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <SoundButton
                onClick={toggleTimer}
                size="lg"
                className={cn(
                  "rounded-full w-12 h-12 transition-all duration-300",
                  mode === 'work' 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-teal-500 hover:bg-teal-600 text-white"
                )}
              >
                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </SoundButton>
              
              <SoundButton
                onClick={resetTimer}
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12 border-gray-500 text-gray-300 hover:text-white hover:border-white"
              >
                <RotateCcw className="h-5 w-5" />
              </SoundButton>

              <SoundButton
                onClick={() => {
                  playClickSound();
                  setShowSettings(!showSettings);
                }}
                size="lg"
                variant="outline"
                className="rounded-full w-12 h-12 border-gray-500 text-gray-300 hover:text-white hover:border-white"
              >
                <Settings className="h-5 w-5" />
              </SoundButton>
            </div>
          </CardContent>
        </Card>

        {/* Custom Settings */}
        {showSettings && (
          <Card className="shadow-xl border-0 bg-black/30 backdrop-blur-xl border border-green-500/20 max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Timer Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Focus Time (minutes)</label>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      onClick={() => updateWorkTime(Math.max(1, workTime - 5))}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                    >
                      -
                    </SoundButton>
                    <input
                      type="number"
                      value={workTime}
                      onChange={(e) => updateWorkTime(parseInt(e.target.value) || 25)}
                      className="w-20 bg-black/30 border border-green-400/30 rounded px-2 py-1 text-white text-center"
                      min="1"
                      max="120"
                    />
                    <SoundButton
                      onClick={() => updateWorkTime(Math.min(120, workTime + 5))}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                    >
                      +
                    </SoundButton>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Break Time (minutes)</label>
                  <div className="flex items-center gap-2">
                    <SoundButton
                      onClick={() => updateBreakTime(Math.max(1, breakTime - 1))}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                    >
                      -
                    </SoundButton>
                    <input
                      type="number"
                      value={breakTime}
                      onChange={(e) => updateBreakTime(parseInt(e.target.value) || 5)}
                      className="w-20 bg-black/30 border border-green-400/30 rounded px-2 py-1 text-white text-center"
                      min="1"
                      max="60"
                    />
                    <SoundButton
                      onClick={() => updateBreakTime(Math.min(60, breakTime + 1))}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                    >
                      +
                    </SoundButton>
                  </div>
                </div>

                {/* Preset Buttons */}
                <div className="pt-2">
                  <p className="text-gray-300 text-sm mb-2">Quick Presets:</p>
                  <div className="flex gap-2">
                    <SoundButton
                      onClick={() => {
                        updateWorkTime(25);
                        updateBreakTime(5);
                      }}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Classic (25/5)
                    </SoundButton>
                    <SoundButton
                      onClick={() => {
                        updateWorkTime(50);
                        updateBreakTime(10);
                      }}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Extended (50/10)
                    </SoundButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Pomodoro;
