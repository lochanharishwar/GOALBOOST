import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExerciseCard } from '@/components/ExerciseCard';
import { AIExerciseRecommendations } from '@/components/AIExerciseRecommendations';
import { exercises, exerciseCategories } from '@/data/exercises';
import { Exercise } from '@/types/exercise';
import { Search, Filter, Dumbbell, Sparkles, Flame, Trophy, Zap, Heart, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const Exercises = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.targetMuscles.some(muscle => 
                             muscle.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Stats
  const totalExercises = exercises.length;
  const categoryStats = exerciseCategories.map(cat => ({
    ...cat,
    count: exercises.filter(e => e.category === cat.id).length
  }));

  const getCategoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'upper-body': return 'from-red-500 to-orange-500';
      case 'lower-body': return 'from-blue-500 to-cyan-500';
      case 'core': return 'from-orange-500 to-yellow-500';
      case 'cardio': return 'from-pink-500 to-rose-500';
      case 'full-body': return 'from-green-500 to-emerald-500';
      case 'flexibility': return 'from-purple-500 to-violet-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-emerald-500';
      case 'intermediate': return 'from-yellow-400 to-orange-500';
      case 'advanced': return 'from-red-400 to-rose-500';
      default: return 'from-blue-400 to-indigo-500';
    }
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500 font-inter",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950" 
        : "bg-gradient-to-br from-orange-50 via-rose-50 to-purple-100"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-full blur-3xl animate-float" />
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 text-4xl opacity-20 animate-float">💪</div>
        <div className="absolute top-40 right-32 text-3xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🏋️</div>
        <div className="absolute bottom-40 left-32 text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🔥</div>
        <div className="absolute bottom-20 right-20 text-4xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>⚡</div>
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className={cn(
              "p-4 rounded-3xl bg-gradient-to-br shadow-2xl animate-bounce-subtle",
              isDarkMode 
                ? "from-orange-500/40 to-pink-500/40 border-2 border-orange-400/50" 
                : "from-orange-400 to-pink-500 border-2 border-orange-300"
            )}>
              <Dumbbell className={cn("h-10 w-10", isDarkMode ? "text-orange-300" : "text-white")} />
            </div>
          </div>
          <h1 className={cn(
            "text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight",
            isDarkMode ? "text-white" : "text-slate-900"
          )}>
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Exercise Library
            </span>
          </h1>
          <p className={cn(
            "text-lg sm:text-xl lg:text-2xl font-medium max-w-2xl mx-auto",
            isDarkMode ? "text-slate-300" : "text-slate-600"
          )}>
            Discover <span className="text-orange-500 font-bold">{totalExercises}+</span> comprehensive workouts for every fitness level
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: Flame, label: 'Upper Body', count: categoryStats.find(c => c.id === 'upper-body')?.count || 0, gradient: 'from-red-500 to-orange-500' },
            { icon: Zap, label: 'Lower Body', count: categoryStats.find(c => c.id === 'lower-body')?.count || 0, gradient: 'from-blue-500 to-cyan-500' },
            { icon: Heart, label: 'Cardio', count: categoryStats.find(c => c.id === 'cardio')?.count || 0, gradient: 'from-pink-500 to-rose-500' },
            { icon: Target, label: 'Core', count: categoryStats.find(c => c.id === 'core')?.count || 0, gradient: 'from-orange-500 to-yellow-500' },
          ].map((stat, index) => (
            <Card 
              key={stat.label}
              className={cn(
                "border-0 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group",
                isDarkMode 
                  ? "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20" 
                  : "bg-white/80 backdrop-blur-xl border border-white/50"
              )}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn(
                  "p-3 rounded-2xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform",
                  stat.gradient
                )}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={cn("text-2xl font-black", isDarkMode ? "text-white" : "text-slate-900")}>
                    {stat.count}
                  </p>
                  <p className={cn("text-xs font-semibold uppercase tracking-wider", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <Card className={cn(
          "shadow-2xl border-0 backdrop-blur-xl mb-8 animate-fade-in overflow-hidden",
          isDarkMode 
            ? "bg-gradient-to-br from-white/10 to-purple-900/20 border-2 border-purple-500/30" 
            : "bg-white/90 border-2 border-purple-200"
        )} style={{ animationDelay: '0.15s' }}>
          <CardHeader className={cn(
            "border-b",
            isDarkMode ? "border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10" : "border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50"
          )}>
            <CardTitle className={cn(
              "text-xl font-bold flex items-center gap-3",
              isDarkMode ? "text-white" : "text-slate-900"
            )}>
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
              )}>
                <Filter className="h-5 w-5 text-white" />
              </div>
              Find Your Perfect Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-400 transition-colors z-10" />
              <Input
                placeholder="Search exercises, muscles, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-12 relative z-10 h-14 rounded-2xl text-base font-medium transition-all",
                  isDarkMode 
                    ? "bg-black/40 border-2 border-purple-400/30 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20" 
                    : "bg-white border-2 border-purple-200 text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20"
                )}
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className={cn(
                "font-bold text-sm uppercase tracking-widest flex items-center gap-2",
                isDarkMode ? "text-purple-300" : "text-purple-700"
              )}>
                <Trophy className="h-4 w-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "transition-all duration-300 hover:scale-105 rounded-2xl font-bold text-sm px-6",
                    selectedCategory === 'all' 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 border-0" 
                      : isDarkMode 
                        ? "bg-white/10 border-2 border-purple-400/30 text-white hover:bg-purple-500/20 hover:border-purple-400/50"
                        : "bg-white border-2 border-purple-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300"
                  )}
                >
                  🎯 All
                </Button>
                {exerciseCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "transition-all duration-300 hover:scale-105 rounded-2xl font-bold text-sm px-6",
                      selectedCategory === category.id 
                        ? `bg-gradient-to-r ${getCategoryGradient(category.id)} text-white shadow-xl border-0` 
                        : isDarkMode 
                          ? "bg-white/10 border-2 border-purple-400/30 text-white hover:bg-purple-500/20 hover:border-purple-400/50"
                          : "bg-white border-2 border-purple-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300"
                    )}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <h3 className={cn(
                "font-bold text-sm uppercase tracking-widest flex items-center gap-2",
                isDarkMode ? "text-orange-300" : "text-orange-700"
              )}>
                <TrendingUp className="h-4 w-4" />
                Difficulty Level
              </h3>
              <div className="flex flex-wrap gap-3">
                {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={cn(
                      "transition-all duration-300 capitalize hover:scale-105 rounded-2xl font-bold text-sm px-6",
                      selectedDifficulty === difficulty 
                        ? `bg-gradient-to-r ${getDifficultyGradient(difficulty)} text-white shadow-xl border-0`
                        : isDarkMode 
                          ? "bg-white/10 border-2 border-orange-400/30 text-white hover:bg-orange-500/20 hover:border-orange-400/50"
                          : "bg-white border-2 border-orange-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300"
                    )}
                  >
                    {difficulty === 'all' ? '🌟 All Levels' : difficulty === 'beginner' ? '🌱 Beginner' : difficulty === 'intermediate' ? '⚡ Intermediate' : '🔥 Advanced'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <AIExerciseRecommendations />
        </div>

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <Badge className={cn(
            "px-6 py-3 text-base font-bold rounded-2xl shadow-xl",
            isDarkMode 
              ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border-2 border-purple-400/40" 
              : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200"
          )}>
            <Sparkles className="h-5 w-5 mr-2" />
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Badge>
          
          {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className={cn(
                "rounded-xl font-semibold",
                isDarkMode 
                  ? "border-purple-400/30 text-purple-300 hover:bg-purple-500/20" 
                  : "border-purple-200 text-purple-600 hover:bg-purple-50"
              )}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExercises.map((exercise, index) => (
            <div 
              key={exercise.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.03}s` }}
            >
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className={cn(
              "p-8 rounded-3xl inline-block mb-8",
              isDarkMode 
                ? "bg-gradient-to-br from-white/10 to-purple-900/20 border-2 border-purple-500/30" 
                : "bg-white/80 border-2 border-purple-200"
            )}>
              <Dumbbell className={cn("h-20 w-20 mx-auto", isDarkMode ? "text-purple-400" : "text-purple-500")} />
            </div>
            <h3 className={cn("text-2xl font-bold mb-3", isDarkMode ? "text-white" : "text-slate-900")}>
              No exercises found
            </h3>
            <p className={cn("text-lg mb-6", isDarkMode ? "text-slate-400" : "text-slate-600")}>
              Try adjusting your search terms or filters to find exercises.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;