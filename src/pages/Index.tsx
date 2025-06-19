
import { useState, useEffect } from 'react';
import { format, isEqual, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
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
  const DayContent = ({ date, ...props }: { date: Date }) => {
    const status = getDateTaskStatus(date);
    const dayNumber = date.getDate();
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={props.className}>{dayNumber}</span>
        {status !== 'none' && (
          <div 
            className={cn(
              "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full",
              status === 'completed' && "bg-green-500",
              status === 'partial' && "bg-yellow-500", 
              status === 'pending' && "bg-red-400"
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
        title: "Goal Added! 🎯",
        description: "Your new goal has been added to today's list.",
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
        title: "Great job! ✅",
        description: "You completed a goal. Keep up the momentum!",
      });
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Goal Removed",
      description: "The goal has been deleted from your list.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Daily Goals
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track your progress, achieve your dreams
              </p>
            </div>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-blue-50 border-blue-200">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, 'MMM dd, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b bg-gray-50">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>All completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>In progress</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
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
                  className="pointer-events-auto"
                  components={{
                    Day: ({ date, ...props }) => <DayContent date={date} {...props} />
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Goals List */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800">
                  Today's Goals
                </CardTitle>
                {todayTasks.length > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-3 py-1 text-sm font-medium",
                      progressPercentage === 100 
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {completedTasks.length}/{todayTasks.length} Complete
                  </Badge>
                )}
              </div>
              
              {/* Progress Bar */}
              {todayTasks.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500 ease-out",
                        progressPercentage === 100 
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gradient-to-r from-blue-400 to-teal-500"
                      )}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Add New Goal Input */}
              <div className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new goal for today..."
                  className="flex-1 border-gray-200 focus:border-blue-300"
                />
                <Button 
                  onClick={addTask}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Goals List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎯</div>
                    <p>No goals set for this day yet.</p>
                    <p className="text-sm">Add your first goal above!</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                        task.completed 
                          ? "bg-green-50 border-green-200" 
                          : "bg-white border-gray-200 hover:border-blue-200"
                      )}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      
                      <span
                        className={cn(
                          "flex-1 transition-all duration-200",
                          task.completed
                            ? "text-green-700 line-through"
                            : "text-gray-800"
                        )}
                      >
                        {task.text}
                      </span>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats & Motivation */}
          <div className="space-y-6">
            {/* Daily Stats */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {completedTasks.length}
                    </div>
                    <div className="text-sm text-blue-700">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">
                      {todayTasks.length - completedTasks.length}
                    </div>
                    <div className="text-sm text-teal-700">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-teal-500 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">
                    {progressPercentage === 100 ? '🎉' : 
                     progressPercentage >= 50 ? '💪' : '🌟'}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {progressPercentage === 100 ? 'Amazing work!' :
                     progressPercentage >= 50 ? 'You\'re doing great!' :
                     'Every step counts!'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {progressPercentage === 100 
                      ? 'You\'ve completed all your goals for today. Time to celebrate!' :
                      progressPercentage >= 50
                        ? 'You\'re more than halfway there. Keep pushing forward!' :
                        'Small steps every day lead to big results. You\'ve got this!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">💡 Daily Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Break large goals into smaller, actionable tasks. This makes them less overwhelming and gives you more opportunities to celebrate progress!
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
