import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { GoalCard } from '@/components/GoalCard';
import { StatsCard } from '@/components/StatsCard';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'daily' | 'long-term'>('daily');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    const savedTasks = localStorage.getItem('aspiraTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aspiraTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskText.trim()) {
      playClickSound();
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
        date: selectedDateString,
        createdAt: new Date().toISOString(),
        priority: newTaskPriority
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      toast({
        title: "🎯 Goal Added!",
        description: `Goal added for ${format(selectedDate, 'MMM dd, yyyy')}`,
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

  const toggleTheme = () => {
    playClickSound();
    setIsDarkMode(!isDarkMode);
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
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100"
    )}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Your productivity at a glance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Today's Goals"
            value={completionRate}
            suffix="%"
            description={`${completedTasks.length}/${todayTasks.length} completed`}
            isDarkMode={isDarkMode}
          />
          <StatsCard
            title="This Week"
            value={weekCompleted}
            suffix=" goals"
            description="Goals completed this week"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Date Selector */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-black/30 backdrop-blur-xl border border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
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
                        "w-full justify-start text-left font-normal bg-black/20 border-blue-400/30 text-white hover:bg-black/30",
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
                
                <div className="mt-4 text-center">
                  <p className="text-gray-300 text-sm">
                    Setting goals for:
                  </p>
                  <p className="text-white font-medium">
                    {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals for Selected Date */}
          <div className="lg:col-span-2">
            <GoalCard
              tasks={tasks}
              newTaskText={newTaskText}
              newTaskPriority={newTaskPriority}
              selectedDate={selectedDateString}
              onNewTaskChange={setNewTaskText}
              onNewTaskPriorityChange={setNewTaskPriority}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onPostponeTask={postponeTask}
              onCancelTask={cancelTask}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
