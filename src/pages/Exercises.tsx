
import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExerciseCard } from '@/components/ExerciseCard';
import { exercises, exerciseCategories } from '@/data/exercises';
import { Exercise } from '@/types/exercise';
import { Search, Filter, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

const Exercises = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden transition-all duration-500 font-inter",
      isDarkMode 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" 
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100"
    )}>
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-inter">
              Exercise Library
            </h1>
          </div>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-inter max-w-2xl mx-auto">
            Discover comprehensive workouts for every fitness level and goal
          </p>
        </div>

        {/* Filter Section */}
        <Card className="shadow-2xl border-0 bg-black/20 backdrop-blur-xl border border-blue-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-400" />
              Filter Exercises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exercises or muscle groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-blue-400/30 text-white placeholder-gray-400 focus:border-blue-400"
              />
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-white font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "transition-all duration-200",
                    selectedCategory === 'all' 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-black/30 border-blue-400/30 text-white hover:bg-blue-500/20"
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
                      "transition-all duration-200",
                      selectedCategory === category.id 
                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                        : "bg-black/30 border-blue-400/30 text-white hover:bg-blue-500/20"
                    )}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-white font-semibold mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={cn(
                      "transition-all duration-200 capitalize",
                      selectedDifficulty === difficulty 
                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                        : "bg-black/30 border-blue-400/30 text-white hover:bg-blue-500/20"
                    )}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Badge>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>

        {/* No Results */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No exercises found</h3>
            <p className="text-gray-300">
              Try adjusting your search terms or filters to find exercises.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises;
