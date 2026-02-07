import { Moon, Sun, User, Zap, Calendar, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { SoundButton } from '@/components/SoundButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export const Header = ({ selectedDate, onDateSelect }: HeaderProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: '👋 Signed out',
      description: 'You have been signed out successfully.',
    });
    navigate('/auth');
  };

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
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b-2 border-border shadow-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="p-2 rounded-xl bg-primary/15 shadow-lg">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div className="absolute inset-0 bg-primary blur-xl opacity-25 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-gradient tracking-tight font-inter">
                GoalFlow
              </h1>
              <p className="text-xs text-muted-foreground font-semibold tracking-wider font-inter hidden sm:block">
                Your Daily Productivity Companion
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <SoundButton 
                key={item.path}
                variant="ghost" 
                className={cn(
                  "text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-semibold font-inter px-4",
                  isActive(item.path) && "text-primary bg-primary/15 shadow-sm"
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
                    className="gap-2 bg-primary/15 border-primary/30 text-foreground hover:bg-primary/25 backdrop-blur-sm shadow-lg font-semibold font-inter text-xs sm:text-sm hidden sm:flex"
                  >
                    <Calendar className="h-4 w-4 text-primary" />
                    {format(selectedDate, 'MMM dd')}
                  </SoundButton>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card/98 border-2 border-border backdrop-blur-xl shadow-2xl" align="center">
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile Menu Button */}
            <SoundButton
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 transition-all duration-300 shadow-md"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </SoundButton>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <SoundButton
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 transition-all duration-300 shadow-md"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary" />}
              </SoundButton>
              <SoundButton
                variant="outline"
                size="icon"
                onClick={handleSignOut}
                className="bg-primary/10 border-primary/30 text-foreground hover:bg-destructive/20 hover:border-destructive/30 transition-all duration-300 shadow-md"
                title={user?.email ? `Sign out (${user.email})` : 'Sign out'}
              >
                <LogOut className="h-4 w-4" />
              </SoundButton>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-2 border-border/60 animate-fade-in">
            <nav className="flex flex-col gap-1 mt-4">
              {navigationItems.map((item) => (
                <SoundButton
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-semibold font-inter",
                    isActive(item.path) && "text-primary bg-primary/15 shadow-sm"
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </SoundButton>
              ))}
              
              {/* Mobile Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-border/60">
                <SoundButton
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20 transition-all duration-300 shadow-md"
                >
                  {isDarkMode ? <Sun className="h-4 w-4 text-warning" /> : <Moon className="h-4 w-4 text-primary" />}
                </SoundButton>
                <SoundButton
                  variant="outline"
                  size="icon"
                  onClick={handleSignOut}
                  className="bg-primary/10 border-primary/30 text-foreground hover:bg-destructive/20 hover:border-destructive/30 transition-all duration-300 shadow-md"
                  title={user?.email ? `Sign out (${user.email})` : 'Sign out'}
                >
                  <LogOut className="h-4 w-4" />
                </SoundButton>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
