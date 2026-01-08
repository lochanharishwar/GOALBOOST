import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Award, Target, TrendingUp, Sparkles, Flame, Zap, Star } from 'lucide-react';
import { GoalCard } from '@/components/GoalCard';
import { StatsCard } from '@/components/StatsCard';
import { StreakTracker } from '@/components/StreakTracker';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Task, UserStats } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { checkForNewAchievements, calculateStreak } from '@/utils/achievementUtils';
import { useTheme } from '@/contexts/ThemeContext';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'daily' | 'long-term'>('daily');
  const [newTaskCategory, setNewTaskCategory] = useState<'work' | 'personal' | 'health' | 'learning' | 'finance'>('personal');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    achievements: []
  });
  const { toast } = useToast();
  const { playClickSound } = useClickSound();
  const { isDarkMode } = useTheme();

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  // Enhanced localStorage with error handling
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('goalflow-tasks');
      const savedStats = localStorage.getItem('goalflow-stats');
      
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
      }

      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.warn('Failed to load saved data:', error);
      localStorage.removeItem('goalflow-tasks');
      localStorage.removeItem('goalflow-stats');
    }
  }, []);

  // Update stats when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const streakData = calculateStreak(tasks);
      const completedCount = tasks.filter(task => task.completed).length;
      
      const newStats: UserStats = {
        currentStreak: streakData.current,
        longestStreak: Math.max(streakData.longest, userStats.longestStreak),
        totalCompleted: completedCount,
        lastCompletionDate: streakData.lastDate,
        achievements: userStats.achievements
      };

      // Check for new achievements
      const newAchievements = checkForNewAchievements(tasks, newStats);
      if (newAchievements.length > 0) {
        newStats.achievements = [...newStats.achievements, ...newAchievements];
        
        // Show achievement notifications
        newAchievements.forEach(achievement => {
          toast({
            title: `🏆 Achievement Unlocked!`,
            description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
          });
        });
      }

      setUserStats(newStats);
      localStorage.setItem('goalflow-stats', JSON.stringify(newStats));
    }
  }, [tasks]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('goalflow-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks:', error);
    }
  }, [tasks]);

  // Save theme preference
  useEffect(() => {
    try {
      localStorage.setItem('goalflow-theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }, [isDarkMode]);

  const addTask = () => {
    if (newTaskText.trim()) {
      playClickSound();
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
        date: selectedDateString,
        createdAt: new Date().toISOString(),
        priority: newTaskPriority,
        category: newTaskCategory,
        dueTime: newTaskTime || undefined
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setNewTaskTime('');
      toast({
        title: "🎯 Goal Added!",
        description: `Goal added for ${format(selectedDate, 'MMM dd, yyyy')}${newTaskTime ? ` at ${newTaskTime}` : ''}`,
      });
    }
  };

  const toggleTask = (taskId: string) => {
    playClickSound();
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    playClickSound();
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "🗑️ Goal Deleted",
      description: "Goal has been removed from your list.",
    });
  };

  const postponeTask = (taskId: string) => {
    playClickSound();
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = format(tomorrow, 'yyyy-MM-dd');
    
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, date: tomorrowString } : task
    ));
    
    toast({
      title: "⏰ Goal Postponed",
      description: `Goal moved to ${format(tomorrow, 'MMM dd, yyyy')}`,
    });
  };

  const cancelTask = (taskId: string) => {
    playClickSound();
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, cancelled: true } : task
    ));
    
    toast({
      title: "❌ Goal Cancelled",
      description: "Goal marked as cancelled/didn't happen.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const todayTasks = tasks.filter(task => task.date === selectedDateString);
  const completedTasks = todayTasks.filter(task => task.completed);
  const completionRate = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= currentWeekStart && taskDate < addDays(currentWeekStart, 7);
  });
  const weekCompleted = weekTasks.filter(task => task.completed).length;

  const allCompletedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500 font-inter",
      "bg-background"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-success/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-warning/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-2xl gradient-primary glow-primary">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gradient tracking-tight">
                GoalFlow
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl font-semibold">
                Transform your daily routine into meaningful achievements
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-primary/30">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Today's Progress</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary">{completionRate}</span>
                  <span className="text-2xl font-bold text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {completedTasks.length}/{todayTasks.length} goals completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-success/30">
            <div className="h-1.5 w-full bg-gradient-to-r from-success to-success/50" />
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 rounded-full blur-2xl group-hover:bg-success/30 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-success/20 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-success" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">This Week</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-success">{weekCompleted}</span>
                  <span className="text-lg font-bold text-muted-foreground">goals</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  Weekly achievements
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-warning/30 sm:col-span-2 lg:col-span-1">
            <div className="h-1.5 w-full bg-gradient-to-r from-warning to-warning/50" />
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/20 rounded-full blur-2xl group-hover:bg-warning/30 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-warning/20 group-hover:scale-110 transition-transform">
                    <Award className="h-7 w-7 text-warning" />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Completed</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-warning">{allCompletedTasks}</span>
                  <span className="text-lg font-bold text-muted-foreground">goals</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  All-time achievements
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streak Tracker and Recent Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card className="glass-bold border-2 border-accent/30 overflow-hidden h-full">
              <div className="h-1.5 w-full bg-gradient-to-r from-accent via-primary to-success" />
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent/20">
                    <Flame className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Streak Tracker</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-6 w-6 text-warning" />
                      <span className="text-sm font-bold text-muted-foreground">Current Streak</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-warning">{userStats.currentStreak}</span>
                      <span className="text-lg font-bold text-muted-foreground">days</span>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-6 w-6 text-primary" />
                      <span className="text-sm font-bold text-muted-foreground">Best Streak</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">{userStats.longestStreak}</span>
                      <span className="text-lg font-bold text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="glass-bold border-2 border-accent/30 overflow-hidden h-full">
              <div className="h-1.5 w-full bg-gradient-to-r from-accent to-primary" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-accent/20">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userStats.achievements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {userStats.achievements.slice(-4).map((achievement) => (
                      <AchievementBadge
                        key={achievement.id}
                        achievement={achievement}
                        size="sm"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-accent" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Complete goals to unlock achievements!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Date Selector */}
          <div className="lg:col-span-1">
            <Card className="glass-bold border-2 border-info/30 overflow-hidden font-inter">
              <div className="h-1.5 w-full bg-gradient-to-r from-info to-info/50" />
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-info/20">
                    <CalendarIcon className="h-5 w-5 text-info" />
                  </div>
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-semibold bg-background/50 border-2 border-border hover:border-info/50 hover:bg-info/5 h-12 transition-all",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-info" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-xl border-2 border-info/30" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                          playClickSound();
                        }
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                {/* Enhanced Date Display */}
                <div className="mt-6 text-center p-5 bg-gradient-to-br from-info/10 to-info/5 rounded-2xl border-2 border-info/20">
                  <p className="text-muted-foreground text-sm font-bold mb-1">
                    Planning for:
                  </p>
                  <p className="text-foreground font-black text-xl">
                    {format(selectedDate, 'EEEE')}
                  </p>
                  <p className="text-info font-bold">
                    {format(selectedDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Section */}
          <div className="lg:col-span-3">
            <GoalCard
              tasks={tasks}
              newTaskText={newTaskText}
              newTaskPriority={newTaskPriority}
              newTaskCategory={newTaskCategory}
              newTaskTime={newTaskTime}
              selectedDate={selectedDateString}
              onNewTaskChange={setNewTaskText}
              onNewTaskPriorityChange={setNewTaskPriority}
              onNewTaskCategoryChange={setNewTaskCategory}
              onNewTaskTimeChange={setNewTaskTime}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onPostponeTask={postponeTask}
              onCancelTask={cancelTask}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        {/* Motivational Footer */}
        {completionRate === 100 && todayTasks.length > 0 && (
          <div className="mt-10 sm:mt-14 text-center">
            <div className="inline-flex items-center gap-3 glass-bold rounded-full px-8 py-4 border-2 border-success/30 glow-success">
              <span className="text-3xl">🎉</span>
              <p className="text-foreground font-bold text-lg">
                Amazing! You've completed all your goals for today!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
