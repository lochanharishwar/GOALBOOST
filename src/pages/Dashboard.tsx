
import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Award } from 'lucide-react';
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
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100"
    )}>
      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-inter">
            Welcome to GoalFlow
          </h1>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-inter max-w-2xl mx-auto">
            Transform your daily routine into meaningful achievements
          </p>
        </div>

        {/* Enhanced Stats Cards with Better Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <StatsCard
            title="Today's Progress"
            value={completionRate}
            suffix="%"
            description={`${completedTasks.length}/${todayTasks.length} goals completed`}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            title="This Week"
            value={weekCompleted}
            suffix=" goals"
            description="Weekly achievements"
            isDarkMode={isDarkMode}
          />
          <StatsCard
            title="Total Completed"
            value={allCompletedTasks}
            suffix=" goals"
            description="All-time achievements"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Streak Tracker and Recent Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <div className="lg:col-span-2">
            <StreakTracker stats={userStats} isDarkMode={isDarkMode} />
          </div>
          
          <div className="lg:col-span-1">
            <Card className="shadow-2xl border-0 bg-black/20 backdrop-blur-xl border border-purple-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
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
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-gray-300 text-sm">
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
          {/* Date Selector - Enhanced Mobile Layout */}
          <div className="lg:col-span-1">
            <Card className="shadow-2xl border-0 bg-black/20 backdrop-blur-xl border border-blue-500/20 font-inter">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg flex items-center gap-2 font-inter">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black/30 border-blue-400/30 text-white hover:bg-black/40 h-12 font-inter",
                        !selectedDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black/90 border-blue-500/30" align="start">
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
                <div className="mt-6 text-center p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
                  <p className="text-gray-300 text-sm font-inter mb-1">
                    Planning for:
                  </p>
                  <p className="text-white font-semibold font-inter text-lg">
                    {format(selectedDate, 'EEEE')}
                  </p>
                  <p className="text-blue-300 font-medium font-inter">
                    {format(selectedDate, 'MMMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals Section - Enhanced for Mobile */}
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
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-full px-6 py-3 border border-green-400/30">
              <span className="text-2xl">🎉</span>
              <p className="text-white font-semibold font-inter">
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
