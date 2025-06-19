
import { useState, useEffect } from 'react';
import { format, isEqual, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, CheckCircle2, Circle, Trash2, Trophy, Target, Zap } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyGoalTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('dailyGoalTasks', JSON.stringify(tasks));
  }, [tasks]);

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const todayTasks = tasks.filter(task => task.date === selectedDateString);
  const completedTasks = todayTasks.filter(task => task.completed);

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
  const DayContent = ({ date, ...props }: { date: Date; className?: string; [key: string]: any }) => {
    const status = getDateTaskStatus(date);
    const dayNumber = date.getDate();
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={props.className}>{dayNumber}</span>
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
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
        date: selectedDateString,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      toast({
        title: "🏆 Elite Goal Added!",
        description: "Your premium objective has been registered in the executive suite.",
      });
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "💎 Excellence Achieved!",
        description: "Outstanding performance! You're operating at elite levels.",
      });
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Executive Adjustment",
      description: "Objective has been refined in your premium portfolio.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const progressPercentage = todayTasks.length > 0 
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-blue-900 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-blue-600/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-red-500/10 via-blue-500/10 to-red-500/10 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      {/* Header */}
      <div className="relative bg-black/30 backdrop-blur-xl border-b border-red-500/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Trophy className="h-8 w-8 text-red-400 animate-pulse" />
                  <div className="absolute inset-0 bg-red-400 blur-lg opacity-30 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-blue-500 bg-clip-text text-transparent tracking-wide">
                    EXECUTIVE GOALS
                  </h1>
                  <p className="text-sm text-gray-300 font-medium tracking-wider">
                    PREMIUM PERFORMANCE SUITE
                  </p>
                </div>
              </div>
            </div>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-3 bg-gradient-to-r from-red-500/20 to-blue-500/20 border-red-400/30 text-white hover:from-red-500/30 hover:to-blue-500/30 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-red-500/20"
                >
                  <CalendarIcon className="h-5 w-5" />
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/90 border-red-500/30 backdrop-blur-xl shadow-2xl" align="end">
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
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Goals List */}
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-red-500/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-red-500/20">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-red-400" />
                  <CardTitle className="text-2xl text-white font-bold tracking-wide">
                    Executive Objectives
                  </CardTitle>
                </div>
                {todayTasks.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-4 py-2 text-sm font-bold shadow-lg transform hover:scale-105 transition-all duration-300",
                      progressPercentage === 100 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30"
                    )}
                  >
                    {completedTasks.length}/{todayTasks.length} Elite
                  </Badge>
                )}
              </div>
              
              {/* Premium Progress Bar */}
              {todayTasks.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-300 mb-3 font-medium">
                    <span>Executive Progress</span>
                    <span className="font-bold">{progressPercentage}%</span>
                  </div>
                  <div className="relative w-full bg-gray-800/50 rounded-full h-4 shadow-inner overflow-hidden">
                    <div 
                      className={cn(
                        "h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                        progressPercentage === 100 
                          ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
                          : "bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/50"
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Premium Add Goal Input */}
              <div className="flex gap-3">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Define your executive objective..."
                  className="flex-1 bg-black/30 border-red-400/30 text-white placeholder:text-gray-400 focus:border-red-400 backdrop-blur-sm shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                />
                <Button 
                  onClick={addTask}
                  className="bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white border-0 shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-red-500/30"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Premium Goals List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-lg font-medium">No executive objectives defined.</p>
                    <p className="text-sm opacity-70">Establish your premium goals above.</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] backdrop-blur-sm",
                        task.completed 
                          ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/30 shadow-blue-500/20" 
                          : "bg-black/30 border-red-400/20 hover:border-red-400/40 shadow-lg"
                      )}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-white hover:text-red-400 transition-colors transform hover:scale-110 duration-300"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-6 w-6 text-blue-400 drop-shadow-lg" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>
                      
                      <span
                        className={cn(
                          "flex-1 transition-all duration-300 font-medium",
                          task.completed
                            ? "text-blue-300 line-through opacity-75"
                            : "text-white"
                        )}
                      >
                        {task.text}
                      </span>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-2 transform hover:scale-110 duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Premium Stats & Motivation */}
          <div className="space-y-8">
            {/* Executive Stats */}
            <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-blue-500/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-xl text-white font-bold">Executive Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-400 mb-2 drop-shadow-lg">
                      {completedTasks.length}
                    </div>
                    <div className="text-sm text-blue-300 font-medium tracking-wide">ACHIEVED</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl border border-red-400/30 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-3xl font-bold text-red-400 mb-2 drop-shadow-lg">
                      {todayTasks.length - completedTasks.length}
                    </div>
                    <div className="text-sm text-red-300 font-medium tracking-wide">PENDING</div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      ? 'Outstanding achievement! You\'ve reached the pinnacle of executive performance today.' :
                      progressPercentage >= 50
                        ? 'Exceptional progress! You\'re operating at premium levels of productivity.' :
                        'Elite minds start with premium objectives. Your success story begins now.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Premium Executive Tip */}
            <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-white/10 transform hover:scale-[1.02] transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  💡 Executive Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                  Premium performance requires strategic decomposition. Break complex objectives into precise, executable actions. This methodology amplifies achievement rates while maintaining executive-level quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #ef4444, #3b82f6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #dc2626, #2563eb);
        }
      `}</style>
    </div>
  );
};

export default Index;
