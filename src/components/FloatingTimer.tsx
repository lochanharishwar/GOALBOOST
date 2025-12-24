import { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingTimerProps {
  timeLeft: number;
  mode: 'work' | 'break';
  isActive: boolean;
  workTime: number;
  breakTime: number;
  onClose: () => void;
}

export const FloatingTimer = ({
  timeLeft,
  mode,
  isActive,
  workTime,
  breakTime,
  onClose
}: FloatingTimerProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 180, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      
      const newX = Math.max(0, Math.min(window.innerWidth - 160, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 120, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - 160, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 120, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 rounded-2xl shadow-2xl border overflow-hidden select-none",
        "backdrop-blur-xl transition-shadow duration-200",
        mode === 'work' 
          ? "bg-emerald-900/95 border-emerald-500/30" 
          : "bg-teal-900/95 border-teal-500/30",
        isDragging && "shadow-emerald-500/20 shadow-2xl"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: '150px',
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-grab active:cursor-grabbing bg-black/20"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <GripHorizontal className="h-3 w-3 text-white/50" />
        <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium">
          {mode === 'work' ? 'Focus' : 'Break'}
        </span>
        <button 
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Timer Content */}
      <div className="p-3 text-center">
        {/* Mini Progress Ring */}
        <div className="relative w-16 h-16 mx-auto mb-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={mode === 'work' ? "#10b981" : "#14b8a6"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full inline-block",
          isActive 
            ? "bg-green-500/20 text-green-400" 
            : "bg-white/10 text-white/60"
        )}>
          {isActive ? '● Running' : '○ Paused'}
        </div>
      </div>
    </div>
  );
};
