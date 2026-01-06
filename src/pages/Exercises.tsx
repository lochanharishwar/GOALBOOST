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
import { Search, Filter, Dumbbell, Sparkles } from 'lucide-react';
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

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500 font-inter",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100"
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-float" />
      </div>

      <Header />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/30 animate-bounce-subtle">
              <Dumbbell className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground font-inter">
              Exercise Library
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-inter max-w-2xl mx-auto">
            Discover comprehensive workouts for every fitness level and goal
          </p>
        </div>

        {/* Filter Section */}
        <Card className="shadow-2xl border bg-gradient-to-br from-black/40 to-blue-900/20 backdrop-blur-xl border-blue-500/30 mb-8 animate-fade-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="border-b border-blue-500/20">
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              Filter Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search exercises or muscle groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-black/30 border-blue-400/30 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all h-12 rounded-xl"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "transition-all duration-300 hover:scale-105 rounded-xl",
                    selectedCategory === 'all' 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                      : "bg-black/30 border-blue-400/30 text-muted-foreground hover:bg-blue-500/20 hover:text-foreground hover:border-blue-400/50"
                  )}
                >
                  All
                </Button>
                {exerciseCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "transition-all duration-300 hover:scale-105 rounded-xl",
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "bg-black/30 border-blue-400/30 text-muted-foreground hover:bg-blue-500/20 hover:text-foreground hover:border-blue-400/50"
                    )}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty, index) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={cn(
                      "transition-all duration-300 capitalize hover:scale-105 rounded-xl",
                      selectedDifficulty === difficulty 
                        ? difficulty === 'beginner' ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : difficulty === 'intermediate' ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30"
                        : difficulty === 'advanced' ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-black/30 border-blue-400/30 text-muted-foreground hover:bg-blue-500/20 hover:text-foreground hover:border-blue-400/50"
                    )}
                  >
                    {difficulty}
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
        <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Badge className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 border-blue-400/30 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Badge>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExercises.map((exercise, index) => (
            <div 
              key={exercise.id} 
              className="animate-fade-in hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-black/40 to-blue-900/20 border border-blue-500/20 inline-block mb-6">
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No exercises found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find exercises.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
