
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Target, TrendingUp, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'health' | 'productivity' | 'personal' | 'learning';
  frequency: 'daily' | 'weekly';
  streak: number;
  completedDates: string[];
  weeklyGoal?: number;
  notes: string;
  createdAt: string;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health' as 'health' | 'productivity' | 'personal' | 'learning',
    frequency: 'daily' as 'daily' | 'weekly',
    weeklyGoal: 7,
    notes: ''
  });

  const { playClickSound } = useClickSound();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  useEffect(() => {
    const savedHabits = localStorage.getItem('aspiraHabits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aspiraHabits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabit.name.trim()) {
      playClickSound();
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        category: newHabit.category,
        frequency: newHabit.frequency,
        streak: 0,
        completedDates: [],
        weeklyGoal: newHabit.frequency === 'weekly' ? newHabit.weeklyGoal : undefined,
        notes: newHabit.notes.trim(),
        createdAt: new Date().toISOString()
      };
      
      setHabits([...habits, habit]);
      setNewHabit({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        weeklyGoal: 7,
        notes: ''
      });
      setShowForm(false);
      
      toast({
        title: "🎯 Habit Added!",
        description: `${habit.name} has been added to your habits.`,
      });
    }
  };

  const updateHabit = () => {
    if (editingHabit && newHabit.name.trim()) {
      playClickSound();
      const updatedHabit: Habit = {
        ...editingHabit,
        name: newHabit.name.trim(),
        description: newHabit.description.trim(),
        category: newHabit.category,
        frequency: newHabit.frequency,
        weeklyGoal: newHabit.frequency === 'weekly' ? newHabit.weeklyGoal : undefined,
        notes: newHabit.notes.trim()
      };
      
      setHabits(habits.map(h => h.id === editingHabit.id ? updatedHabit : h));
      resetForm();
      
      toast({
        title: "✏️ Habit Updated!",
        description: `${updatedHabit.name} has been updated.`,
      });
    }
  };

  const deleteHabit = (habitId: string) => {
    playClickSound();
    setHabits(habits.filter(h => h.id !== habitId));
    toast({
      title: "🗑️ Habit Deleted",
      description: "Habit has been removed from your list.",
    });
  };

  const toggleHabitCompletion = (habitId: string) => {
    playClickSound();
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completedDates.includes(today);
        
        if (isCompletedToday) {
          return {
            ...habit,
            completedDates: habit.completedDates.filter(date => date !== today),
            streak: Math.max(0, habit.streak - 1)
          };
        } else {
          return {
            ...habit,
            completedDates: [...habit.completedDates, today],
            streak: habit.streak + 1
          };
        }
      }
      return habit;
    }));
  };

  const resetForm = () => {
    setNewHabit({
      name: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      weeklyGoal: 7,
      notes: ''
    });
    setShowForm(false);
    setEditingHabit(null);
  };

  const startEditing = (habit: Habit) => {
    playClickSound();
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description,
      category: habit.category,
      frequency: habit.frequency,
      weeklyGoal: habit.weeklyGoal || 7,
      notes: habit.notes
    });
    setShowForm(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return '💪';
      case 'productivity': return '⚡';
      case 'personal': return '🌱';
      case 'learning': return '📚';
      default: return '📌';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-500/20 border-green-400/30 text-green-400';
      case 'productivity': return 'bg-blue-500/20 border-blue-400/30 text-blue-400';
      case 'personal': return 'bg-purple-500/20 border-purple-400/30 text-purple-400';
      case 'learning': return 'bg-orange-500/20 border-orange-400/30 text-orange-400';
      default: return 'bg-gray-500/20 border-gray-400/30 text-gray-400';
    }
  };

  const getWeeklyProgress = (habit: Habit) => {
    if (habit.frequency !== 'weekly' || !habit.weeklyGoal) return 0;
    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    const thisWeekCompletions = habit.completedDates.filter(date => date >= weekStart).length;
    return Math.min((thisWeekCompletions / habit.weeklyGoal) * 100, 100);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" 
        : "bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-100"
    )}>
      <Header />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Habit Tracker</h1>
          <p className="text-gray-300">Build better habits, one day at a time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-400">{habits.length}</div>
                  <div className="text-sm text-purple-300">Total Habits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {habits.filter(h => h.completedDates.includes(today)).length}
                  </div>
                  <div className="text-sm text-green-300">Completed Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.max(...habits.map(h => h.streak), 0)}
                  </div>
                  <div className="text-sm text-blue-300">Best Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-orange-400">
                    {habits.reduce((total, h) => total + h.completedDates.length, 0)}
                  </div>
                  <div className="text-sm text-orange-300">Total Completions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Habit Button */}
        <div className="mb-6">
          <Button
            onClick={() => {
              playClickSound();
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add New Habit'}
          </Button>
        </div>

        {/* Add/Edit Habit Form */}
        {showForm && (
          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {editingHabit ? 'Edit Habit' : 'Add New Habit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Habit Name</label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Morning Exercise"
                    className="bg-black/20 border-purple-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Category</label>
                  <Select value={newHabit.category} onValueChange={(value: 'health' | 'productivity' | 'personal' | 'learning') => setNewHabit({ ...newHabit, category: value })}>
                    <SelectTrigger className="bg-black/20 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">💪 Health</SelectItem>
                      <SelectItem value="productivity">⚡ Productivity</SelectItem>
                      <SelectItem value="personal">🌱 Personal</SelectItem>
                      <SelectItem value="learning">📚 Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                  className="bg-black/20 border-purple-400/30 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Frequency</label>
                  <Select value={newHabit.frequency} onValueChange={(value: 'daily' | 'weekly') => setNewHabit({ ...newHabit, frequency: value })}>
                    <SelectTrigger className="bg-black/20 border-purple-400/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newHabit.frequency === 'weekly' && (
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Weekly Goal</label>
                    <Input
                      type="number"
                      value={newHabit.weeklyGoal}
                      onChange={(e) => setNewHabit({ ...newHabit, weeklyGoal: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="7"
                      className="bg-black/20 border-purple-400/30 text-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={newHabit.notes}
                  onChange={(e) => setNewHabit({ ...newHabit, notes: e.target.value })}
                  placeholder="Additional notes or motivation..."
                  className="bg-black/20 border-purple-400/30 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={editingHabit ? updateHabit : addHabit}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                >
                  {editingHabit ? 'Update Habit' : 'Add Habit'}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(today);
            const weeklyProgress = getWeeklyProgress(habit);

            return (
              <Card
                key={habit.id}
                className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20 transform hover:scale-[1.02] transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(habit.category)}</span>
                      <div>
                        <CardTitle className="text-white text-lg">{habit.name}</CardTitle>
                        <Badge className={`text-xs ${getCategoryColor(habit.category)}`}>
                          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(habit)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHabit(habit.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {habit.description && (
                    <p className="text-gray-300 text-sm mb-4">{habit.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Streak</span>
                      <span className="text-orange-400 font-bold">{habit.streak} days</span>
                    </div>

                    {habit.frequency === 'weekly' && habit.weeklyGoal && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Weekly Progress</span>
                          <span className="text-blue-400 text-sm">{Math.round(weeklyProgress)}%</span>
                        </div>
                        <Progress value={weeklyProgress} className="h-2" />
                      </div>
                    )}

                    {habit.notes && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-400 text-xs">Notes</span>
                        </div>
                        <p className="text-gray-300 text-xs bg-black/20 p-2 rounded">{habit.notes}</p>
                      </div>
                    )}

                    <Button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={cn(
                        "w-full transition-all duration-300",
                        isCompletedToday
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-600 hover:bg-gray-500 text-white"
                      )}
                    >
                      <CheckCircle className={cn("h-4 w-4 mr-2", isCompletedToday && "animate-pulse")} />
                      {isCompletedToday ? 'Completed Today' : 'Mark Complete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {habits.length === 0 && (
          <Card className="shadow-xl border-0 bg-black/40 backdrop-blur-xl border border-purple-500/20">
            <CardContent className="text-center py-12">
              <Target className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Habits Yet</h3>
              <p className="text-gray-300 mb-6">Start building better habits by adding your first one!</p>
              <Button
                onClick={() => {
                  playClickSound();
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Habits;
