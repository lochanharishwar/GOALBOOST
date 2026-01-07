
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Target, TrendingUp, Plus, Edit, Trash2, BookOpen, Flame, Zap, Sparkles, Award, Star } from 'lucide-react';
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

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'health': return {
        badge: 'bg-success/20 border-success/40 text-success',
        glow: 'hover:shadow-[0_0_30px_hsl(var(--success)/0.3)]',
        border: 'border-success/30',
        icon: 'text-success'
      };
      case 'productivity': return {
        badge: 'bg-info/20 border-info/40 text-info',
        glow: 'hover:shadow-[0_0_30px_hsl(var(--info)/0.3)]',
        border: 'border-info/30',
        icon: 'text-info'
      };
      case 'personal': return {
        badge: 'bg-accent/20 border-accent/40 text-accent',
        glow: 'hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]',
        border: 'border-accent/30',
        icon: 'text-accent'
      };
      case 'learning': return {
        badge: 'bg-warning/20 border-warning/40 text-warning',
        glow: 'hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)]',
        border: 'border-warning/30',
        icon: 'text-warning'
      };
      default: return {
        badge: 'bg-muted border-border text-muted-foreground',
        glow: '',
        border: 'border-border',
        icon: 'text-muted-foreground'
      };
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

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { label: 'Legendary', color: 'text-warning', icon: Award };
    if (streak >= 14) return { label: 'On Fire', color: 'text-destructive', icon: Flame };
    if (streak >= 7) return { label: 'Consistent', color: 'text-success', icon: TrendingUp };
    if (streak >= 3) return { label: 'Building', color: 'text-info', icon: Zap };
    return { label: 'Starting', color: 'text-muted-foreground', icon: Star };
  };

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      "bg-background"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl gradient-primary glow-primary">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gradient tracking-tight">Habit Tracker</h1>
              <p className="text-muted-foreground font-medium">Build better habits, one day at a time</p>
            </div>
          </div>
          
          {/* Completion Progress Bar */}
          {habits.length > 0 && (
            <div className="mt-6 glass-bold rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">Today's Progress</span>
                <span className="text-sm font-bold text-primary">{completedToday}/{habits.length} completed</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 gradient-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              {completionRate === 100 && (
                <div className="flex items-center gap-2 mt-2 text-success">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-semibold">All habits completed! 🎉</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-bold hover-lift group overflow-hidden">
            <CardContent className="p-5 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="stat-value text-primary">{habits.length}</div>
                <div className="stat-label">Total Habits</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden">
            <CardContent className="p-5 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-full blur-2xl group-hover:bg-success/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-success/20">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                </div>
                <div className="stat-value text-success">{completedToday}</div>
                <div className="stat-label">Completed Today</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden">
            <CardContent className="p-5 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-warning/10 rounded-full blur-2xl group-hover:bg-warning/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-warning/20">
                    <Flame className="h-5 w-5 text-warning" />
                  </div>
                </div>
                <div className="stat-value text-warning">{Math.max(...habits.map(h => h.streak), 0)}</div>
                <div className="stat-label">Best Streak</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden">
            <CardContent className="p-5 relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-accent/20">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="stat-value text-accent">{habits.reduce((total, h) => total + h.completedDates.length, 0)}</div>
                <div className="stat-label">Total Completions</div>
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
            className="btn-bold gradient-primary text-primary-foreground glow-primary hover:scale-105 transition-transform"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {showForm ? 'Cancel' : 'Add New Habit'}
          </Button>
        </div>

        {/* Add/Edit Habit Form */}
        {showForm && (
          <Card className="glass-bold border-2 border-primary/30 mb-8 animate-fade-in overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-foreground text-sm font-semibold mb-2 block">Habit Name</label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Morning Exercise"
                    className="bg-background/50 border-2 border-border focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-foreground text-sm font-semibold mb-2 block">Category</label>
                  <Select value={newHabit.category} onValueChange={(value: 'health' | 'productivity' | 'personal' | 'learning') => setNewHabit({ ...newHabit, category: value })}>
                    <SelectTrigger className="bg-background/50 border-2 border-border">
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
                <label className="text-foreground text-sm font-semibold mb-2 block">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                  className="bg-background/50 border-2 border-border focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-foreground text-sm font-semibold mb-2 block">Frequency</label>
                  <Select value={newHabit.frequency} onValueChange={(value: 'daily' | 'weekly') => setNewHabit({ ...newHabit, frequency: value })}>
                    <SelectTrigger className="bg-background/50 border-2 border-border">
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
                    <label className="text-foreground text-sm font-semibold mb-2 block">Weekly Goal</label>
                    <Input
                      type="number"
                      value={newHabit.weeklyGoal}
                      onChange={(e) => setNewHabit({ ...newHabit, weeklyGoal: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="7"
                      className="bg-background/50 border-2 border-border focus:border-primary transition-colors"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-foreground text-sm font-semibold mb-2 block">Notes</label>
                <Textarea
                  value={newHabit.notes}
                  onChange={(e) => setNewHabit({ ...newHabit, notes: e.target.value })}
                  placeholder="Additional notes or motivation..."
                  className="bg-background/50 border-2 border-border focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={editingHabit ? updateHabit : addHabit}
                  className="btn-bold gradient-primary text-primary-foreground"
                >
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-2 border-border hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit, index) => {
            const isCompletedToday = habit.completedDates.includes(today);
            const weeklyProgress = getWeeklyProgress(habit);
            const styles = getCategoryStyles(habit.category);
            const streakInfo = getStreakLevel(habit.streak);
            const StreakIcon = streakInfo.icon;

            return (
              <Card
                key={habit.id}
                className={cn(
                  "glass-bold overflow-hidden transition-all duration-300 hover:scale-[1.02]",
                  styles.glow,
                  styles.border,
                  isCompletedToday && "ring-2 ring-success/50"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Top accent line */}
                <div className={cn(
                  "h-1 w-full",
                  habit.category === 'health' && "bg-success",
                  habit.category === 'productivity' && "bg-info",
                  habit.category === 'personal' && "bg-accent",
                  habit.category === 'learning' && "bg-warning"
                )} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getCategoryIcon(habit.category)}</span>
                      <div>
                        <CardTitle className="text-foreground text-lg font-bold">{habit.name}</CardTitle>
                        <Badge className={cn("text-xs border", styles.badge)}>
                          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(habit)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHabit(habit.id)}
                        className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {habit.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">{habit.description}</p>
                  )}

                  {/* Streak Display */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2">
                      <StreakIcon className={cn("h-5 w-5", streakInfo.color)} />
                      <span className="text-sm font-medium text-muted-foreground">{streakInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className={cn("h-4 w-4", habit.streak > 0 ? "text-warning" : "text-muted-foreground")} />
                      <span className={cn("font-bold text-lg", habit.streak > 0 ? "text-warning" : "text-muted-foreground")}>
                        {habit.streak}
                      </span>
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  </div>

                  {habit.frequency === 'weekly' && habit.weeklyGoal && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Weekly Progress</span>
                        <span className="text-info font-bold">{Math.round(weeklyProgress)}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-info rounded-full transition-all duration-500"
                          style={{ width: `${weeklyProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {habit.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs font-medium">Notes</span>
                      </div>
                      <p className="text-muted-foreground text-xs bg-muted/50 p-2 rounded-lg">{habit.notes}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={cn(
                      "w-full font-semibold transition-all duration-300",
                      isCompletedToday
                        ? "bg-success hover:bg-success/90 text-success-foreground glow-success"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <CheckCircle className={cn("h-5 w-5 mr-2", isCompletedToday && "animate-pulse")} />
                    {isCompletedToday ? 'Completed Today ✨' : 'Mark Complete'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {habits.length === 0 && (
          <Card className="glass-bold border-2 border-dashed border-primary/30 animate-fade-in">
            <CardContent className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative p-4 rounded-full gradient-primary glow-primary">
                  <Target className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No Habits Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start building better habits today! Create your first habit and begin your journey to self-improvement.
              </p>
              <Button
                onClick={() => {
                  playClickSound();
                  setShowForm(true);
                }}
                className="btn-bold gradient-primary text-primary-foreground glow-primary hover:scale-105 transition-transform"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Habits;
