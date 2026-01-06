import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, PictureInPicture2, Volume2 } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { useTimer, AlarmSound } from '@/contexts/TimerContext';
import { useTheme } from '@/contexts/ThemeContext';

const ALARM_SOUNDS: { value: AlarmSound; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional alarm beep' },
  { value: 'gentle', label: 'Gentle', description: 'Soft bell chime' },
  { value: 'urgent', label: 'Urgent', description: 'Fast beeping' },
  { value: 'chime', label: 'Chime', description: 'Musical sequence' },
  { value: 'digital', label: 'Digital', description: 'Retro digital sound' },
];

const Pomodoro = () => {
  const {
    timeLeft,
    setTimeLeft,
    isActive,
    mode,
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
  } = useTimer();
  
  const [showSettings, setShowSettings] = useState(false);
  const { playClickSound } = useClickSound();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (timeLeft === 25 * 60 && workTime !== 25) {
      setTimeLeft(workTime * 60);
    }
  }, []);

  // Keyboard shortcuts - only on this page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.code === 'Space') {
        e.preventDefault();
        if (isAlarmRinging) {
          stopAlarm();
        } else {
          toggleTimer();
        }
      } else if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlarmRinging, stopAlarm, toggleTimer, resetTimer]);

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

  const togglePiP = () => {
    playClickSound();
    setIsPiPActive(!isPiPActive);
  };

  const handleToggleTimer = () => {
    playClickSound();
    if (isAlarmRinging) {
      stopAlarm();
    } else {
      toggleTimer();
    }
  };

  const handleResetTimer = () => {
    playClickSound();
    resetTimer();
  };

  const progress = mode === 'work' 
    ? ((workTime * 60 - timeLeft) / (workTime * 60)) * 100
    : ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 animate-spin-slow",
          mode === 'work' ? "bg-primary" : "bg-accent"
        )} />
        <div className={cn(
          "absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-10 animate-spin-slow",
          mode === 'work' ? "bg-accent" : "bg-primary"
        )} style={{ animationDirection: 'reverse' }} />
      </div>

      <Header />

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8 animate-fade-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused and productive</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-8 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex bg-muted/50 rounded-xl p-1.5 backdrop-blur-xl border border-border/50">
            <SoundButton
              onClick={() => switchMode('work')}
              className={cn(
                "px-6 py-2.5 rounded-lg transition-all duration-300 font-medium",
                mode === 'work' 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Focus ({workTime}min)
            </SoundButton>
            <SoundButton
              onClick={() => switchMode('break')}
              className={cn(
                "px-6 py-2.5 rounded-lg transition-all duration-300 font-medium",
                mode === 'break' 
                  ? "bg-accent text-accent-foreground shadow-lg" 
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Break ({breakTime}min)
            </SoundButton>
          </div>
        </div>

        {/* Timer Display */}
        <Card className={cn(
          "border-0 max-w-md mx-auto mb-6 transition-all duration-500 animate-scale-in glass",
          isAlarmRinging 
            ? "border-2 border-destructive/50 animate-ring-alarm" 
            : mode === 'work'
              ? "glow-primary"
              : "glow-accent"
        )}>
          <CardContent className="p-8 text-center">
            {/* Alarm Banner */}
            {isAlarmRinging && (
              <div className="mb-4 bg-destructive/20 border border-destructive/30 rounded-xl p-4 animate-bounce-in">
                <p className="text-destructive font-semibold">🔔 Time's up!</p>
                <p className="text-destructive/70 text-sm mt-1">Press Space or click to stop</p>
              </div>
            )}
            
            <div className="relative mb-6">
              {/* Circular Progress */}
              <svg className="w-52 h-52 transform -rotate-90 mx-auto" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  className="text-muted/30"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke={isAlarmRinging ? 'hsl(var(--destructive))' : mode === 'work' ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.64} 264`}
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(
                    "text-5xl font-bold mb-1 transition-colors",
                    isAlarmRinging ? "text-destructive" : "text-foreground"
                  )}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {isAlarmRinging ? 'Alarm Ringing!' : mode === 'work' ? 'Focus Time' : 'Break Time'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <SoundButton
                onClick={handleToggleTimer}
                size="lg"
                className={cn(
                  "rounded-full w-14 h-14 transition-all duration-300 hover:scale-110",
                  isAlarmRinging
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    : mode === 'work' 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-accent hover:bg-accent/90 text-accent-foreground"
                )}
              >
                {isAlarmRinging ? (
                  <span className="text-xl">🔕</span>
                ) : isActive ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </SoundButton>
              
              <SoundButton
                onClick={handleResetTimer}
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14 border-border text-muted-foreground hover:text-foreground hover:border-foreground/50 hover:scale-110 transition-all"
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
                className={cn(
                  "rounded-full w-14 h-14 border-border transition-all hover:scale-110",
                  showSettings 
                    ? "bg-primary/10 text-primary border-primary/50" 
                    : "text-muted-foreground hover:text-foreground hover:border-foreground/50"
                )}
              >
                <Settings className="h-5 w-5" />
              </SoundButton>

              <SoundButton
                onClick={togglePiP}
                size="lg"
                variant="outline"
                className={cn(
                  "rounded-full w-14 h-14 transition-all duration-300 hover:scale-110",
                  isPiPActive 
                    ? "border-primary text-primary bg-primary/10" 
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
                )}
                title="Floating Timer Mode"
              >
                <PictureInPicture2 className="h-5 w-5" />
              </SoundButton>
            </div>
            
            {/* Keyboard Shortcuts Hint */}
            <div className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="bg-muted px-2 py-1 rounded text-[10px] font-mono">Space</kbd>
                Play/Pause
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="bg-muted px-2 py-1 rounded text-[10px] font-mono">R</kbd>
                Reset
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="border-0 max-w-md mx-auto glass animate-slide-in-from-bottom">
            <CardContent className="p-6">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Timer Settings
              </h3>
              
              <div className="space-y-5">
                {/* Time Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground text-sm mb-2">Focus (min)</label>
                    <div className="flex items-center gap-1">
                      <SoundButton
                        onClick={() => updateWorkTime(Math.max(1, workTime - 5))}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 rounded-lg"
                      >
                        -
                      </SoundButton>
                      <input
                        type="number"
                        value={workTime}
                        onChange={(e) => updateWorkTime(parseInt(e.target.value) || 25)}
                        className="w-14 bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-foreground text-center text-sm"
                        min="1"
                        max="120"
                      />
                      <SoundButton
                        onClick={() => updateWorkTime(Math.min(120, workTime + 5))}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 rounded-lg"
                      >
                        +
                      </SoundButton>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-muted-foreground text-sm mb-2">Break (min)</label>
                    <div className="flex items-center gap-1">
                      <SoundButton
                        onClick={() => updateBreakTime(Math.max(1, breakTime - 1))}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 rounded-lg"
                      >
                        -
                      </SoundButton>
                      <input
                        type="number"
                        value={breakTime}
                        onChange={(e) => updateBreakTime(parseInt(e.target.value) || 5)}
                        className="w-14 bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-foreground text-center text-sm"
                        min="1"
                        max="60"
                      />
                      <SoundButton
                        onClick={() => updateBreakTime(Math.min(60, breakTime + 1))}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 p-0 rounded-lg"
                      >
                        +
                      </SoundButton>
                    </div>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Quick Presets</p>
                  <div className="flex gap-2">
                    <SoundButton
                      onClick={() => {
                        updateWorkTime(25);
                        updateBreakTime(5);
                      }}
                      size="sm"
                      variant="outline"
                      className="text-xs rounded-lg"
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
                      className="text-xs rounded-lg"
                    >
                      Extended (50/10)
                    </SoundButton>
                  </div>
                </div>

                {/* Alarm Sound Selection */}
                <div>
                  <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Alarm Sound
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ALARM_SOUNDS.map((sound) => (
                      <SoundButton
                        key={sound.value}
                        onClick={() => {
                          playClickSound();
                          setAlarmSound(sound.value);
                        }}
                        size="sm"
                        variant="outline"
                        className={cn(
                          "text-xs rounded-lg flex flex-col items-start p-2 h-auto",
                          alarmSound === sound.value 
                            ? "border-primary bg-primary/10 text-primary" 
                            : ""
                        )}
                      >
                        <span className="font-medium">{sound.label}</span>
                        <span className="text-[10px] text-muted-foreground">{sound.description}</span>
                      </SoundButton>
                    ))}
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
