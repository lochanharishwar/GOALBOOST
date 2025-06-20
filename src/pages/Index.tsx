
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { GoalCard } from '@/components/GoalCard';
import { StatsCard } from '@/components/StatsCard';
import { SoundButton } from '@/components/SoundButton';
import { Task } from '@/types/task';
import { useClickSound } from '@/utils/soundUtils';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const { playClickSound } = useClickSound();

  // Load tasks and theme from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('aspiraTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    const savedTheme = localStorage.getItem('aspiraTheme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('aspiraTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage whenever theme changes
  useEffect(() => {
    localStorage.setItem('aspiraTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  // Get task status for a specific date
  const getDateTaskStatus = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dateTasks = tasks.filter(task => task.date === dateString);
    const completedDateTasks = dateTasks.filter(task => task.completed);
    
    if (dateTasks.length === 0) return 'none';
    if (completedDateTasks.length === dateTasks.length) return 'completed';
    if (completedDateTasks.length > 0) return 'partial';
    return 'pending';
  };

  // Custom day component with status indicators
  const DayContent = ({ date, className, ...props }: { date: Date; className?: string; [key: string]: any }) => {
    const status = getDateTaskStatus(date);
    const dayNumber = date.getDate();
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={className}>{dayNumber}</span>
        {status !== 'none' && (
          <div 
            className={cn(
              "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-lg animate-pulse",
              status === 'completed' && "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-400/50",
              status === 'partial' && "bg-gradient-to-r from-red-400 to-red-600 shadow-red-400/50", 
              status === 'pending' && "bg-gradient-to-r from-red-500 to-red-700 shadow-red-500/50"
            )}
          />
        )}
      </div>
    );
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      playClickSound();
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
        date: selectedDateString,
        createdAt: new Date().toISOString(),
        priority: 'daily'
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      toast({
        title: "🏆 Elite Goal Added!",
        description: "Your premium objective has been registered in ASPIRA.",
      });
    }
  };

  const toggleTask = (taskId: string) => {
    playClickSound();
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "💎 Excellence Achieved!",
        description: "Outstanding performance! ASPIRA recognizes your elite level execution.",
      });
    }
  };

  const deleteTask = (taskId: string) => {
    playClickSound();
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Executive Adjustment",
      description: "Objective has been refined in your ASPIRA portfolio.",
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
  const progressPercentage = todayTasks.length > 0 
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-red-900 to-blue-900" 
        : "bg-gradient-to-br from-blue-50 via-red-50 to-slate-100"
    )}>
      {/* Premium animated background */}
      <div className={cn(
        "absolute inset-0 transition-all duration-500",
        isDarkMode 
          ? "bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10"
          : "bg-gradient-to-br from-red-200/20 via-transparent to-blue-200/20"
      )}></div>
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse",
          isDarkMode ? "bg-red-500/5" : "bg-red-300/10"
        )}></div>
        <div className={cn(
          "absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000",
          isDarkMode ? "bg-blue-500/5" : "bg-blue-300/10"
        )}></div>
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl animate-spin duration-[20s]",
          isDarkMode 
            ? "bg-gradient-conic from-red-500/10 via-blue-500/10 to-red-500/10"
            : "bg-gradient-conic from-red-300/20 via-blue-300/20 to-red-300/20"
        )}></div>
      </div>

      {/* Header */}
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Date Selector */}
        <div className="flex justify-center mb-8">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <SoundButton 
                variant="outline" 
                className="gap-3 bg-gradient-to-r from-red-500/20 to-blue-500/20 border-red-400/30 text-white hover:from-red-500/30 hover:to-blue-500/30 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-red-500/20"
              >
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, 'MMM dd, yyyy')}
              </SoundButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/90 border-red-500/30 backdrop-blur-xl shadow-2xl" align="center">
              <div className="p-4 border-b bg-gradient-to-r from-red-500/10 to-blue-500/10 border-red-500/20">
                <div className="flex items-center gap-6 text-xs text-gray-300 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-400/50"></div>
                    <span>Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-lg shadow-red-400/50"></div>
                    <span>Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 shadow-lg shadow-red-500/50"></div>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    playClickSound();
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
                className="pointer-events-auto bg-black/50 text-white"
                components={{
                  Day: ({ date, ...props }) => <DayContent date={date} {...props} />
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Goals Card */}
          <GoalCard
            tasks={tasks}
            newTaskText={newTaskText}
            selectedDate={selectedDateString}
            onNewTaskChange={setNewTaskText}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
            onKeyPress={handleKeyPress}
          />

          {/* Stats and Motivation */}
          <div className="space-y-8">
            <StatsCard tasks={tasks} selectedDate={selectedDateString} />

            {/* Premium Motivational Card */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-red-600/30 to-blue-600/30 backdrop-blur-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-5xl mb-4 animate-bounce">
                    {progressPercentage === 100 ? '👑' : 
                     progressPercentage >= 50 ? '💎' : '⚡'}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white drop-shadow-lg">
                    {progressPercentage === 100 ? 'ELITE PERFORMANCE!' :
                     progressPercentage >= 50 ? 'EXECUTIVE EXCELLENCE!' :
                     'PREMIUM POTENTIAL!'}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed font-medium">
                    {progressPercentage === 100 
                      ? 'Outstanding achievement! You\'ve reached the pinnacle of executive performance with ASPIRA.' :
                      progressPercentage >= 50
                        ? 'Exceptional progress! You\'re operating at premium levels with ASPIRA\'s guidance.' :
                        'Elite minds start with premium objectives. Your ASPIRA success story begins now.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Executive Tip */}
            <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  💡 ASPIRA Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  Premium performance requires strategic decomposition. ASPIRA's methodology amplifies achievement rates while maintaining executive-level quality standards through precise, executable actions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
