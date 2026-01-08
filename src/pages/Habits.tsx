import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Target, TrendingUp, Plus, Edit, Trash2, BookOpen, Flame, Zap, Sparkles, Award, Star, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { YearlyHeatmap } from '@/components/YearlyHeatmap';
import confetti from 'canvas-confetti';

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
  const [weekOffset, setWeekOffset] = useState(0);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
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

  // Confetti effect when all habits are completed
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  // Check for all habits completed and trigger confetti
  useEffect(() => {
    if (habits.length > 0 && completedToday === habits.length && !hasShownConfetti) {
      triggerConfetti();
      setHasShownConfetti(true);
      toast({
        title: "🎉 All Habits Completed!",
        description: "Amazing work! You've completed all your habits for today!",
      });
    }
    // Reset confetti flag when not all are completed
    if (completedToday < habits.length) {
      setHasShownConfetti(false);
    }
  }, [completedToday, habits.length, hasShownConfetti, triggerConfetti, toast]);

  // Get week dates for heatmap
  const getWeekDates = (offset: number = 0) => {
    const dates = [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + (offset * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(weekOffset);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getHeatmapIntensity = (date: string) => {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
    return (completedCount / habits.length) * 100;
  };

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted/50';
    if (intensity <= 25) return 'bg-success/20';
    if (intensity <= 50) return 'bg-success/40';
    if (intensity <= 75) return 'bg-success/60';
    return 'bg-success';
  };

  const formatWeekRange = () => {
    const start = new Date(weekDates[0]);
    const end = new Date(weekDates[6]);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

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

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      "bg-background"
    )}>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-success/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-warning/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-2xl gradient-primary glow-primary">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-gradient tracking-tight">Habit Tracker</h1>
              <p className="text-muted-foreground font-semibold text-lg">Build better habits, transform your life</p>
            </div>
          </div>
          
          {/* Completion Progress Bar */}
          {habits.length > 0 && (
            <div className="mt-8 glass-bold rounded-3xl p-6 border-2 border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-base font-bold text-foreground">Today's Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-primary">{completedToday}</span>
                  <span className="text-muted-foreground font-medium">/ {habits.length}</span>
                </div>
              </div>
              <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                    completionRate === 100 ? "bg-gradient-to-r from-success via-success to-emerald-400" : "gradient-primary"
                  )}
                  style={{ width: `${completionRate}%` }}
                />
                {completionRate > 0 && (
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full bg-white/20 animate-pulse"
                    style={{ width: `${completionRate}%` }}
                  />
                )}
              </div>
              {completionRate === 100 && (
                <div className="flex items-center gap-3 mt-4 text-success animate-fade-in">
                  <div className="p-2 rounded-full bg-success/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold">All habits completed! You're unstoppable! 🎉</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Heatmap Views */}
        {habits.length > 0 && (
          <Tabs defaultValue="weekly" className="mb-8">
            <TabsList className="glass-bold border-2 border-accent/20 p-1 h-auto">
              <TabsTrigger 
                value="weekly" 
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-bold px-4 py-2"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Weekly View
              </TabsTrigger>
              <TabsTrigger 
                value="yearly" 
                className="data-[state=active]:bg-success data-[state=active]:text-success-foreground font-bold px-4 py-2"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Yearly Heatmap
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="mt-6">
              <Card className="glass-bold border-2 border-accent/20 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-success via-primary to-accent" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent/20">
                        <Calendar className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground">Weekly Progress Heatmap</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">{formatWeekRange()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(weekOffset - 1)}
                        className="h-9 w-9 p-0 border-2 hover:bg-accent/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(0)}
                        disabled={weekOffset === 0}
                        className="border-2 hover:bg-accent/10 font-semibold"
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(weekOffset + 1)}
                        disabled={weekOffset >= 0}
                        className="h-9 w-9 p-0 border-2 hover:bg-accent/10"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-3">
                    {weekDates.map((date, index) => {
                      const intensity = getHeatmapIntensity(date);
                      const isToday = date === today;
                      const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
                      
                      return (
                        <div
                          key={date}
                          className={cn(
                            "relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-105",
                            getHeatmapColor(intensity),
                            isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                          )}
                        >
                          <span className={cn(
                            "text-xs font-bold uppercase tracking-wide mb-1",
                            intensity > 50 ? "text-success-foreground" : "text-muted-foreground"
                          )}>
                            {dayNames[index]}
                          </span>
                          <span className={cn(
                            "text-2xl font-black",
                            intensity > 50 ? "text-success-foreground" : "text-foreground"
                          )}>
                            {new Date(date).getDate()}
                          </span>
                          <div className={cn(
                            "mt-2 text-xs font-bold px-2 py-1 rounded-full",
                            intensity === 100 ? "bg-success-foreground/20 text-success-foreground" : 
                            intensity > 0 ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            {completedCount}/{habits.length}
                          </div>
                          {intensity === 100 && (
                            <div className="absolute -top-1 -right-1">
                              <Star className="h-5 w-5 text-warning fill-warning animate-pulse" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-muted/50" />
                      <span className="text-xs text-muted-foreground font-medium">No activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-success/20" />
                      <span className="text-xs text-muted-foreground font-medium">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-success/50" />
                      <span className="text-xs text-muted-foreground font-medium">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-success" />
                      <span className="text-xs text-muted-foreground font-medium">Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="yearly" className="mt-6">
              <YearlyHeatmap habits={habits} />
            </TabsContent>
          </Tabs>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-primary/20">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/15 rounded-full blur-2xl group-hover:bg-primary/25 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl font-black text-primary">{habits.length}</div>
                <div className="text-sm font-semibold text-muted-foreground">Total Habits</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-success/20">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-success/15 rounded-full blur-2xl group-hover:bg-success/25 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-success/20 group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                </div>
                <div className="text-4xl font-black text-success">{completedToday}</div>
                <div className="text-sm font-semibold text-muted-foreground">Completed Today</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-warning/20">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-warning/15 rounded-full blur-2xl group-hover:bg-warning/25 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-warning/20 group-hover:scale-110 transition-transform">
                    <Flame className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <div className="text-4xl font-black text-warning">{Math.max(...habits.map(h => h.streak), 0)}</div>
                <div className="text-sm font-semibold text-muted-foreground">Best Streak</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-bold hover-lift group overflow-hidden border-2 border-accent/20">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/15 rounded-full blur-2xl group-hover:bg-accent/25 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-accent/20 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="text-4xl font-black text-accent">{habits.reduce((total, h) => total + h.completedDates.length, 0)}</div>
                <div className="text-sm font-semibold text-muted-foreground">Total Completions</div>
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
            className="btn-bold gradient-primary text-primary-foreground glow-primary hover:scale-105 transition-transform text-base font-bold px-6 py-3"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {showForm ? 'Cancel' : 'Add New Habit'}
          </Button>
        </div>

        {/* Add/Edit Habit Form */}
        {showForm && (
          <Card className="glass-bold border-2 border-primary/30 mb-8 animate-fade-in overflow-hidden">
            <div className="h-1.5 w-full gradient-primary" />
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-foreground text-sm font-bold mb-2 block">Habit Name</label>
                  <Input
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Morning Exercise"
                    className="bg-background/50 border-2 border-border focus:border-primary transition-colors font-medium"
                  />
                </div>
                <div>
                  <label className="text-foreground text-sm font-bold mb-2 block">Category</label>
                  <Select value={newHabit.category} onValueChange={(value: 'health' | 'productivity' | 'personal' | 'learning') => setNewHabit({ ...newHabit, category: value })}>
                    <SelectTrigger className="bg-background/50 border-2 border-border font-medium">
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
                <label className="text-foreground text-sm font-bold mb-2 block">Description</label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                  className="bg-background/50 border-2 border-border focus:border-primary transition-colors font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-foreground text-sm font-bold mb-2 block">Frequency</label>
                  <Select value={newHabit.frequency} onValueChange={(value: 'daily' | 'weekly') => setNewHabit({ ...newHabit, frequency: value })}>
                    <SelectTrigger className="bg-background/50 border-2 border-border font-medium">
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
                    <label className="text-foreground text-sm font-bold mb-2 block">Weekly Goal</label>
                    <Input
                      type="number"
                      value={newHabit.weeklyGoal}
                      onChange={(e) => setNewHabit({ ...newHabit, weeklyGoal: parseInt(e.target.value) || 1 })}
                      min="1"
                      max="7"
                      className="bg-background/50 border-2 border-border focus:border-primary transition-colors font-medium"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-foreground text-sm font-bold mb-2 block">Notes</label>
                <Textarea
                  value={newHabit.notes}
                  onChange={(e) => setNewHabit({ ...newHabit, notes: e.target.value })}
                  placeholder="Additional notes or motivation..."
                  className="bg-background/50 border-2 border-border focus:border-primary transition-colors font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={editingHabit ? updateHabit : addHabit}
                  className="btn-bold gradient-primary text-primary-foreground font-bold"
                >
                  {editingHabit ? 'Update Habit' : 'Create Habit'}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-2 border-border hover:bg-muted font-semibold"
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
                  "glass-bold overflow-hidden transition-all duration-300 hover:scale-[1.02] border-2 animate-fade-in",
                  styles.glow,
                  styles.border,
                  isCompletedToday && "ring-2 ring-success/50 ring-offset-2 ring-offset-background"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Top accent line */}
                <div className={cn(
                  "h-1.5 w-full",
                  habit.category === 'health' && "bg-gradient-to-r from-success to-emerald-400",
                  habit.category === 'productivity' && "bg-gradient-to-r from-info to-cyan-400",
                  habit.category === 'personal' && "bg-gradient-to-r from-accent to-pink-400",
                  habit.category === 'learning' && "bg-gradient-to-r from-warning to-amber-400"
                )} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getCategoryIcon(habit.category)}</span>
                      <div>
                        <CardTitle className="text-foreground text-lg font-black">{habit.name}</CardTitle>
                        <Badge className={cn("text-xs border font-semibold", styles.badge)}>
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
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">{habit.description}</p>
                  )}

                  {/* Streak Display */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2">
                      <StreakIcon className={cn("h-5 w-5", streakInfo.color)} />
                      <span className="text-sm font-bold text-muted-foreground">{streakInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className={cn("h-5 w-5", habit.streak > 0 ? "text-warning" : "text-muted-foreground")} />
                      <span className={cn("font-black text-xl", habit.streak > 0 ? "text-warning" : "text-muted-foreground")}>
                        {habit.streak}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">days</span>
                    </div>
                  </div>

                  {habit.frequency === 'weekly' && habit.weeklyGoal && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-bold">Weekly Progress</span>
                        <span className="text-info font-black">{Math.round(weeklyProgress)}%</span>
                      </div>
                      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-info to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${weeklyProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {habit.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs font-bold">Notes</span>
                      </div>
                      <p className="text-muted-foreground text-xs bg-muted/50 p-2 rounded-lg font-medium">{habit.notes}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={cn(
                      "w-full font-bold transition-all duration-300 text-base",
                      isCompletedToday
                        ? "bg-gradient-to-r from-success to-emerald-500 hover:from-success/90 hover:to-emerald-500/90 text-success-foreground glow-success"
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
            <CardContent className="text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="relative p-6 rounded-full gradient-primary glow-primary">
                  <Target className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-foreground mb-3">No Habits Yet</h3>
              <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg font-medium">
                Start building better habits today! Create your first habit and begin your transformation journey.
              </p>
              <Button
                onClick={() => {
                  playClickSound();
                  setShowForm(true);
                }}
                className="btn-bold gradient-primary text-primary-foreground glow-primary hover:scale-105 transition-transform text-lg font-bold px-8 py-4"
                size="lg"
              >
                <Plus className="h-6 w-6 mr-2" />
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
