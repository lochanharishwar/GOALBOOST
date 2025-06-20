
import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Header } from '@/components/Header';
import { GoalCard } from '@/components/GoalCard';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { useClickSound } from '@/utils/soundUtils';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'daily' | 'long-term'>('daily');
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
      setNewTaskPriority('daily');
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
      title: "Task Cancelled",
      description: "Objective has been removed from your ASPIRA portfolio.",
    });
  };

  const postponeTask = (taskId: string) => {
    playClickSound();
    const nextDay = format(addDays(selectedDate, 1), 'yyyy-MM-dd');
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, date: nextDay }
        : task
    ));
    toast({
      title: "📅 Task Postponed",
      description: "Objective moved to tomorrow. Stay focused on today's priorities.",
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
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Goals Card */}
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

export default Dashboard;
