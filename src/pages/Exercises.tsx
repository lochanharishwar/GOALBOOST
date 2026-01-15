import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExerciseCard } from '@/components/ExerciseCard';
import { AIExerciseRecommendations } from '@/components/AIExerciseRecommendations';
import AIExerciseCamera from '@/components/AIExerciseCamera';
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

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-500 font-inter bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-success/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-warning/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative p-4 rounded-2xl gradient-primary glow-primary">
                <Dumbbell className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gradient tracking-tight">
                Exercise Library
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl font-semibold">
                Discover <span className="text-primary font-bold">{totalExercises}+</span> comprehensive workouts
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10 animate-fade-in">
          {[
            { icon: Flame, label: 'Upper Body', count: categoryStats.find(c => c.id === 'upper-body')?.count || 0, colorClass: 'destructive' },
            { icon: Zap, label: 'Lower Body', count: categoryStats.find(c => c.id === 'lower-body')?.count || 0, colorClass: 'info' },
            { icon: Heart, label: 'Cardio', count: categoryStats.find(c => c.id === 'cardio')?.count || 0, colorClass: 'accent' },
            { icon: Target, label: 'Core', count: categoryStats.find(c => c.id === 'core')?.count || 0, colorClass: 'warning' },
          ].map((stat, index) => (
            <Card 
              key={stat.label}
              className="glass-bold hover-lift group overflow-hidden border-2 border-primary/20"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />
              <CardContent className="p-4 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                <div className="relative flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{stat.count}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <Card className="glass-bold border-2 border-primary/20 mb-8 overflow-hidden animate-fade-in">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-success" />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-bold text-foreground">Find Your Perfect Workout</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                placeholder="Search exercises, muscles, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 rounded-xl text-base font-medium bg-background border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "transition-all duration-300 hover:scale-105 rounded-xl font-bold text-sm px-6",
                    selectedCategory === 'all' && "gradient-primary text-primary-foreground shadow-lg"
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
                      "transition-all duration-300 hover:scale-105 rounded-xl font-bold text-sm px-6",
                      selectedCategory === category.id && "gradient-primary text-primary-foreground shadow-lg"
                    )}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
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
                      "transition-all duration-300 capitalize hover:scale-105 rounded-xl font-bold text-sm px-6",
                      selectedDifficulty === difficulty && "gradient-accent text-accent-foreground shadow-lg"
                    )}
                  >
                    {difficulty === 'all' ? '🌟 All Levels' : difficulty === 'beginner' ? '🌱 Beginner' : difficulty === 'intermediate' ? '⚡ Intermediate' : '🔥 Advanced'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Camera Exercise Detector */}
        <div className="mb-8 animate-fade-in">
          <AIExerciseCamera />
        </div>

        {/* AI Recommendations Section */}
        <div className="mb-8 animate-fade-in">
          <AIExerciseRecommendations />
        </div>

        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between animate-fade-in">
          <Badge className="px-6 py-3 text-base font-bold rounded-xl bg-primary/20 text-primary border-2 border-primary/30">
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
              className="rounded-xl font-semibold border-2 hover:bg-destructive/10"
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
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <Card className="glass-bold border-2 border-muted/30 inline-block p-8 mb-8">
              <Dumbbell className="h-20 w-20 mx-auto text-muted-foreground" />
            </Card>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              No exercises found
            </h3>
            <p className="text-lg mb-6 text-muted-foreground">
              Try adjusting your search terms or filters to find exercises.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="gradient-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
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
