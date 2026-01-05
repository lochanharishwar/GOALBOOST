import { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal, Play, Pause, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimer } from '@/contexts/TimerContext';

const FLOATING_POSITION_KEY = 'floating-timer-position';

export const FloatingTimer = () => {
  const { 
    timeLeft, 
    mode, 
    isActive, 
    workTime, 
    breakTime, 
    isAlarmRinging,
    stopAlarm,
    setIsPiPActive,
    toggleTimer 
  } = useTimer();
  
  const getInitialPosition = () => {
    try {
      const saved = localStorage.getItem(FLOATING_POSITION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return { x: window.innerWidth - 200, y: 80 };
  };
  
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) {
      try {
        localStorage.setItem(FLOATING_POSITION_KEY, JSON.stringify(position));
      } catch (e) {}
    }
  }, [position, isDragging]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((workTime * 60 - timeLeft) / (workTime * 60)) * 100
    : ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 140, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 140, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const onClose = () => {
    setIsPiPActive(false);
  };

  const strokeColor = isAlarmRinging 
    ? 'hsl(0, 84%, 60%)' 
    : mode === 'work' 
      ? 'hsl(158, 64%, 50%)' 
      : 'hsl(168, 60%, 50%)';

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-[2147483647] rounded-2xl shadow-2xl overflow-hidden select-none",
        "backdrop-blur-xl transition-all duration-300 animate-scale-in",
        isAlarmRinging 
          ? "bg-destructive/90 border-2 border-destructive animate-ring-alarm" 
          : mode === 'work' 
            ? "bg-card/95 border border-primary/30 glow-primary" 
            : "bg-card/95 border border-accent/30 glow-accent",
        isDragging && "scale-105 shadow-2xl"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: '170px',
      }}
    >
      {/* Drag Handle */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing transition-colors",
          isAlarmRinging ? "bg-destructive/20" : "bg-muted/50"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={cn(
          "text-[11px] uppercase tracking-wider font-semibold",
          isAlarmRinging ? "text-destructive-foreground" : "text-muted-foreground"
        )}>
          {isAlarmRinging ? '🔔 ALARM' : mode === 'work' ? 'Focus' : 'Break'}
        </span>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-muted/50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Timer Content */}
      <div className="p-4 text-center">
        {/* Progress Ring */}
        <div className="relative w-20 h-20 mx-auto mb-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={strokeColor}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-xl font-bold transition-colors",
              isAlarmRinging ? "text-destructive-foreground" : "text-foreground"
            )}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Play/Pause or Stop Alarm Button */}
        {isAlarmRinging ? (
          <button
            onClick={stopAlarm}
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all bg-destructive hover:bg-destructive/80 animate-pulse"
          >
            <VolumeX className="h-5 w-5 text-destructive-foreground" />
          </button>
        ) : (
          <button
            onClick={toggleTimer}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all hover:scale-110",
              mode === 'work' 
                ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                : "bg-accent hover:bg-accent/90 text-accent-foreground"
            )}
          >
            {isActive ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>
        )}

        {/* Status */}
        <div className={cn(
          "text-[10px] font-medium px-3 py-1 rounded-full inline-flex items-center gap-1.5",
          isAlarmRinging 
            ? "bg-destructive/30 text-destructive-foreground"
            : isActive 
              ? "bg-primary/20 text-primary" 
              : "bg-muted text-muted-foreground"
        )}>
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            isAlarmRinging 
              ? "bg-destructive-foreground animate-pulse"
              : isActive 
                ? "bg-primary animate-pulse" 
                : "bg-muted-foreground"
          )} />
          {isAlarmRinging ? 'Stop Alarm' : isActive ? 'Running' : 'Paused'}
        </div>
      </div>
    </div>
  );
};
