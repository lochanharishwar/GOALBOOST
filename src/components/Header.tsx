
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Zap, Calendar, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { SoundButton } from '@/components/SoundButton';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Header = ({ isDarkMode, onToggleTheme, selectedDate, onDateSelect }: HeaderProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/habits', label: 'Habits' },
    { path: '/pomodoro', label: 'Focus Timer' },
    { path: '/exercises', label: 'Exercises' },
    { path: '/reminders', label: 'Reminders' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300">
            <div className="relative">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 blur-lg opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-white bg-clip-text text-transparent tracking-wide font-inter">
                GoalFlow
              </h1>
              <p className="text-xs text-blue-200/80 font-medium tracking-wider font-inter hidden sm:block">
                Your Daily Productivity Companion
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <SoundButton 
                key={item.path}
                variant="ghost" 
                className={cn(
                  "text-white hover:text-blue-400 transition-colors font-inter",
                  isActive(item.path) && "text-blue-400 bg-blue-500/20"
                )}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </SoundButton>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Calendar Selector - Only show on dashboard */}
            {selectedDate && onDateSelect && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <SoundButton 
                    variant="outline" 
                    className="gap-2 bg-gradient-to-r from-blue-500/20 to-white/20 border-blue-400/30 text-white hover:from-blue-500/30 hover:to-white/30 backdrop-blur-sm shadow-xl font-inter text-xs sm:text-sm hidden sm:flex"
                  >
                    <Calendar className="h-4 w-4" />
                    {format(selectedDate, 'MMM dd')}
                  </SoundButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/90 border-blue-500/30 backdrop-blur-xl shadow-2xl" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        onDateSelect(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto bg-black/50 text-white"
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile Menu Button */}
            <SoundButton
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-black/20 border-blue-400/30 text-white hover:bg-blue-500/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </SoundButton>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <SoundButton
                variant="outline"
                size="icon"
                onClick={onToggleTheme}
                className="bg-black/20 border-blue-400/30 text-white hover:bg-blue-500/20 transition-all duration-300"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </SoundButton>
              <SoundButton
                variant="outline"
                size="icon"
                className="bg-black/20 border-blue-400/30 text-white hover:bg-blue-500/20 transition-all duration-300"
              >
                <User className="h-4 w-4" />
              </SoundButton>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500/20">
            <nav className="flex flex-col gap-2 mt-4">
              {navigationItems.map((item) => (
                <SoundButton
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "justify-start text-white hover:text-blue-400 hover:bg-blue-500/20 transition-colors font-inter",
                    isActive(item.path) && "text-blue-400 bg-blue-500/20"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </SoundButton>
              ))}
              
              {/* Mobile Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-blue-500/20">
                <SoundButton
                  variant="outline"
                  size="icon"
                  onClick={onToggleTheme}
                  className="bg-black/20 border-blue-400/30 text-white hover:bg-blue-500/20 transition-all duration-300"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </SoundButton>
                <SoundButton
                  variant="outline"
                  size="icon"
                  className="bg-black/20 border-blue-400/30 text-white hover:bg-blue-500/20 transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                </SoundButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
