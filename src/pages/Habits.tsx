import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Circle, Plus, Target, Flame, Trophy, Calendar, Trash2 } from 'lucide-react';
import { SoundButton } from '@/components/SoundButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useClickSound } from '@/utils/soundUtils';

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'health' | 'productivity' | 'personal' | 'learning';
  totalDays: number;
  completedDates: string[];
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  notes: string;
}

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('🎯');
  const [newHabitCategory, setNewHabitCategory] = useState<'health' | 'productivity' | 'personal' | 'learning'>('personal');
  const [newHabitWeeklyGoal, setNewHabitWeeklyGoal] = useState(7);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();
  const { playClickSound } = useClickSound();

  // Get current week dates
  const getCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = getCurrentWeek();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedHabits = localStorage.getItem('aspiraHabits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aspiraHabits', JSON.stringify(habits));
  }, [habits]);

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return { current: 0, longest: 0 };
    
    const sortedDates = completedDates.sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (sortedDates.includes(today) || sortedDates.includes(yesterdayString)) {
      currentStreak = 1;
      
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedDates[i + 1]);
        const prevDate = new Date(sortedDates[i]);
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const addHabit = () => {
    if (newHabitName.trim()) {
      playClickSound();
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: newHabitName.trim(),
        icon: newHabitIcon,
        category: newHabitCategory,
        totalDays: 0,
        completedDates: [],
        createdAt: new Date().toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoal: newHabitWeeklyGoal,
        notes: ''
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      toast({
        title: "🎯 New Habit Added!",
        description: "Your habit has been added to ASPIRA tracking system.",
      });
    }
  };

  const toggleHabit = (habitId: string, date: string) => {
    playClickSound();
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        const streaks = calculateStreak(completedDates);
        
        return {
          ...habit,
          completedDates,
          totalDays: completedDates.length,
          currentStreak: streaks.current,
          longestStreak: streaks.longest
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    playClickSound();
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast({
      title: "🗑️ Habit Deleted",
      description: "Habit has been removed from tracking.",
    });
  };

  const updateHabitNotes = (habitId: string, notes: string) => {
    setHabits(habits.map(habit =>
      habit.id === habitId ? { ...habit, notes } : habit
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addHabit();
    }
  };

  const toggleTheme = () => {
    playClickSound();
    setIsDarkMode(!isDarkMode);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'productivity': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'personal': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'learning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory);

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100"
    )}>
      {/* Premium animated background */}
      <div className={cn(
        "absolute inset-0 transition-all duration-500",
        isDarkMode 
          ? "bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"
          : "bg-gradient-to-br from-blue-200/20 via-transparent to-indigo-200/20"
      )}></div>

      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Habit Tracker</h1>
          <p className="text-gray-300">Discipline equals freedom</p>
        </div>

        {/* Category Filter */}
        <Card className="mb-6 shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <SoundButton
                onClick={() => setSelectedCategory('all')}
                size="sm"
                className={cn(
                  "transition-all duration-300",
                  selectedCategory === 'all' 
                    ? "bg-white text-black" 
                    : "bg-black/30 text-gray-300 hover:text-white"
                )}
              >
                All Categories
              </SoundButton>
              {['health', 'productivity', 'personal', 'learning'].map((category) => (
                <SoundButton
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className={cn(
                    "transition-all duration-300 capitalize",
                    selectedCategory === category 
                      ? getCategoryColor(category)
                      : "bg-black/30 text-gray-300 hover:text-white"
                  )}
                >
                  {category}
                </SoundButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Habit */}
        <Card className="mb-8 shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Add New Habit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-3">
                <select 
                  value={newHabitIcon} 
                  onChange={(e) => setNewHabitIcon(e.target.value)}
                  className="bg-black/30 border-blue-400/30 text-white rounded-md px-3 py-2"
                >
                  <option value="🎯">🎯</option>
                  <option value="💪">💪</option>
                  <option value="📚">📚</option>
                  <option value="🧘">🧘</option>
                  <option value="🏃">🏃</option>
                  <option value="💧">💧</option>
                  <option value="🥗">🥗</option>
                  <option value="😴">😴</option>
                  <option value="🎵">🎵</option>
                  <option value="✍️">✍️</option>
                </select>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter habit name..."
                  className="flex-1 bg-black/30 border-blue-400/30 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={newHabitCategory} onValueChange={setNewHabitCategory}>
                  <SelectTrigger className="bg-black/30 border-blue-400/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-blue-500/30">
                    <SelectItem value="health" className="text-green-300">🏥 Health</SelectItem>
                    <SelectItem value="productivity" className="text-blue-300">⚡ Productivity</SelectItem>
                    <SelectItem value="personal" className="text-purple-300">🌟 Personal</SelectItem>
                    <SelectItem value="learning" className="text-yellow-300">📖 Learning</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm whitespace-nowrap">Weekly Goal:</span>
                  <Input
                    type="number"
                    value={newHabitWeeklyGoal}
                    onChange={(e) => setNewHabitWeeklyGoal(Number(e.target.value))}
                    min="1"
                    max="7"
                    className="w-16 bg-black/30 border-blue-400/30 text-white text-center"
                  />
                </div>
                
                <SoundButton 
                  onClick={addHabit}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                >
                  <Plus className="h-5 w-5" />
                </SoundButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Habits List */}
        <div className="space-y-6">
          {filteredHabits.length === 0 ? (
            <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-white text-lg font-medium">No habits tracked yet.</p>
                <p className="text-gray-400 text-sm">Add your first habit above to start building discipline.</p>
              </CardContent>
            </Card>
          ) : (
            filteredHabits.map((habit) => {
              const weekProgress = weekDates.filter(date => habit.completedDates.includes(date)).length;
              const weekProgressPercentage = Math.round((weekProgress / habit.weeklyGoal) * 100);
              
              return (
                <Card key={habit.id} className="shadow-2xl border-0 bg-black/40 backdrop-blur-xl border border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{habit.icon}</span>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{habit.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getCategoryColor(habit.category)}>
                              {habit.category}
                            </Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                              {habit.totalDays} Total Days
                            </Badge>
                            {habit.currentStreak > 0 && (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                                <Flame className="h-3 w-3 mr-1" />
                                {habit.currentStreak} day streak
                              </Badge>
                            )}
                            {habit.longestStreak > 3 && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                                <Trophy className="h-3 w-3 mr-1" />
                                Best: {habit.longestStreak}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <SoundButton
                        onClick={() => deleteHabit(habit.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:text-red-300 border-red-400/30 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </SoundButton>
                    </div>

                    {/* Weekly Progress */}
                    <div className="mb-4 p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          This Week ({weekProgress}/{habit.weeklyGoal})
                        </span>
                        <span className="text-sm text-gray-300">{weekProgressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            weekProgressPercentage >= 100 
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : weekProgressPercentage >= 80
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                : "bg-gradient-to-r from-blue-400 to-blue-500"
                          )}
                          style={{ width: `${Math.min(weekProgressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Daily Tracker */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {weekDates.map((date, index) => {
                        const isCompleted = habit.completedDates.includes(date);
                        const isToday = date === today;
                        
                        return (
                          <div key={date} className="text-center">
                            <div className="text-xs text-gray-400 mb-1">{weekDays[index]}</div>
                            <div className="text-xs text-gray-400 mb-2">{new Date(date).getDate()}</div>
                            <button
                              onClick={() => toggleHabit(habit.id, date)}
                              className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110",
                                isCompleted 
                                  ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30"
                                  : "border-gray-500 hover:border-blue-400",
                                isToday && "ring-2 ring-white/50"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notes Section */}
                    <div className="mt-4">
                      <Textarea
                        value={habit.notes}
                        onChange={(e) => updateHabitNotes(habit.id, e.target.value)}
                        placeholder="Add notes about this habit..."
                        className="bg-black/20 border-blue-400/30 text-white placeholder:text-gray-400 text-sm"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Habits;
