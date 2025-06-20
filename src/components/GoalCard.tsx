
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Circle, Trash2, Plus, Target, Flag, X, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { SoundButton } from '@/components/SoundButton';

interface GoalCardProps {
  tasks: Task[];
  newTaskText: string;
  newTaskPriority: 'urgent' | 'daily' | 'long-term';
  selectedDate: string;
  onNewTaskChange: (text: string) => void;
  onNewTaskPriorityChange: (priority: 'urgent' | 'daily' | 'long-term') => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onPostponeTask: (taskId: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const GoalCard = ({
  tasks,
  newTaskText,
  newTaskPriority,
  selectedDate,
  onNewTaskChange,
  onNewTaskPriorityChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onPostponeTask,
  onKeyPress
}: GoalCardProps) => {
  const todayTasks = tasks.filter(task => task.date === selectedDate);
  const completedTasks = todayTasks.filter(task => task.completed);
  const progressPercentage = todayTasks.length > 0 
    ? Math.round((completedTasks.length / todayTasks.length) * 100)
    : 0;

  const getPriorityColor = (priority: 'urgent' | 'daily' | 'long-term') => {
    switch (priority) {
      case 'urgent': return 'bg-white/90 text-black border-white shadow-white/50 animate-pulse';
      case 'daily': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'long-term': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getTaskGlow = (priority: 'urgent' | 'daily' | 'long-term') => {
    if (priority === 'urgent') {
      return 'shadow-xl shadow-white/20 ring-2 ring-white/30';
    }
    return '';
  };

  // Sort tasks by priority (urgent first)
  const sortedTasks = [...todayTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, daily: 1, 'long-term': 2 };
    return priorityOrder[a.priority || 'daily'] - priorityOrder[b.priority || 'daily'];
  });

  return (
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
        <div className="space-y-3">
          <div className="flex gap-3">
            <Input
              value={newTaskText}
              onChange={(e) => onNewTaskChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Define your executive objective..."
              className="flex-1 bg-black/30 border-red-400/30 text-white placeholder:text-gray-400 focus:border-red-400 backdrop-blur-sm shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            />
            <SoundButton 
              onClick={onAddTask}
              className="bg-gradient-to-r from-red-500 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white border-0 shadow-xl transform hover:scale-110 transition-all duration-300 hover:shadow-red-500/30"
            >
              <Plus className="h-5 w-5" />
            </SoundButton>
          </div>

          {/* Priority Selector */}
          <Select value={newTaskPriority} onValueChange={onNewTaskPriorityChange}>
            <SelectTrigger className="bg-black/30 border-red-400/30 text-white">
              <SelectValue placeholder="Set priority level" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-red-500/30 text-white">
              <SelectItem value="urgent" className="text-white hover:bg-white/10">
                🔥 Urgent - Critical Priority
              </SelectItem>
              <SelectItem value="daily" className="text-blue-300 hover:bg-blue-500/10">
                ⭐ Daily - Regular Priority
              </SelectItem>
              <SelectItem value="long-term" className="text-purple-300 hover:bg-purple-500/10">
                📅 Long-term - Future Priority
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Premium Goals List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg font-medium">No executive objectives defined.</p>
              <p className="text-sm opacity-70">Establish your premium goals above.</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] backdrop-blur-sm group",
                  task.completed 
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-400/30 shadow-blue-500/20" 
                    : "bg-black/30 border-red-400/20 hover:border-red-400/40 shadow-lg",
                  getTaskGlow(task.priority || 'daily')
                )}
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="text-white hover:text-red-400 transition-colors transform hover:scale-110 duration-300"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-blue-400 drop-shadow-lg animate-bounce" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                
                <div className="flex-1 space-y-2">
                  <span
                    className={cn(
                      "block transition-all duration-300 font-medium",
                      task.completed
                        ? "text-blue-300 line-through opacity-75"
                        : task.priority === 'urgent' 
                          ? "text-white font-bold drop-shadow-lg"
                          : "text-white"
                    )}
                  >
                    {task.text}
                  </span>
                  
                  {task.priority && (
                    <Badge 
                      className={cn(
                        "text-xs px-2 py-1 font-medium border",
                        getPriorityColor(task.priority),
                        task.priority === 'urgent' && "font-bold text-black"
                      )}
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      {task.priority.toUpperCase()}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SoundButton
                    onClick={() => onPostponeTask(task.id)}
                    size="sm"
                    variant="outline"
                    className="text-yellow-400 hover:text-yellow-300 border-yellow-400/30 hover:bg-yellow-500/10"
                  >
                    <SkipForward className="h-3 w-3" />
                  </SoundButton>
                  <SoundButton
                    onClick={() => onDeleteTask(task.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-400 hover:text-red-300 border-red-400/30 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" />
                  </SoundButton>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
