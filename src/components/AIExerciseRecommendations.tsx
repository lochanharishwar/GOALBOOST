import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Target, AlertCircle, Dumbbell, CheckCircle2, ArrowRight, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { exercises } from '@/data/exercises';

const fitnessLevels = ['beginner', 'intermediate', 'advanced'] as const;
const goalOptions = ['Build Muscle', 'Lose Weight', 'Flexibility', 'Endurance'];
const muscleGroups = ['Chest', 'Back', 'Arms', 'Legs', 'Core', 'Shoulders'];

interface ExercisePlan {
  summary: string;
  exercises: {
    name: string;
    category: string;
    sets: number;
    reps: string;
    benefit: string;
    matchId?: string;
  }[];
  focusAreas: { area: string; percentage: number }[];
  tips: string[];
}

export const AIExerciseRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<ExercisePlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryInfo, setRetryInfo] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string>('beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const getMatchedExercise = (matchId?: string) => {
    if (!matchId) return null;
    return exercises.find(e => e.id === matchId);
  };

  const handleGetRecommendations = async (retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 5000; // Start with 5 seconds

    setIsLoading(true);
    setError(null);
    setRetryInfo(null);
    if (retryCount === 0) setPlan(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('exercise-recommendations', {
        body: {
          fitnessLevel,
          goals: selectedGoals.join(', ') || 'General fitness',
          availableEquipment: [],
          targetMuscles: selectedMuscles,
          preferences: '',
        }
      });

      if (fnError) throw fnError;
      if (data?.error) {
        // Check for rate limit error
        if (data.error.toLowerCase().includes('rate limit')) {
          if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount); // 5s, 10s, 20s
            const seconds = delay / 1000;
            
            // Countdown display
            for (let i = seconds; i > 0; i--) {
              setRetryInfo(`High demand - waiting ${i}s before retry ${retryCount + 1}/${maxRetries}...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            setRetryInfo(null);
            return handleGetRecommendations(retryCount + 1);
          }
          throw new Error('AI service is very busy right now. Please wait 1-2 minutes and try again.');
        }
        throw new Error(data.error);
      }

      setPlan(data.plan);
      setRetryInfo(null);
      toast({ title: "Plan Ready!", description: "Your workout plan has been generated." });
    } catch (err) {
      console.error('Error getting recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendations';
      
      // Handle rate limit with retry for network-level errors
      if (errorMessage.toLowerCase().includes('rate limit') && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        const seconds = delay / 1000;
        
        for (let i = seconds; i > 0; i--) {
          setRetryInfo(`High demand - waiting ${i}s before retry ${retryCount + 1}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setRetryInfo(null);
        return handleGetRecommendations(retryCount + 1);
      }
      
      setError(errorMessage);
      setRetryInfo(null);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      if (retryCount === 0 || retryCount >= maxRetries) {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-900/40 via-black/30 to-blue-900/40 backdrop-blur-xl border border-purple-500/30 overflow-hidden animate-fade-in">
      <CardHeader className="pb-4 pt-5 px-6 border-b border-purple-500/20">
        <CardTitle className="text-white text-xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/30">
            <Brain className="h-5 w-5 text-purple-300" />
          </div>
          AI Workout Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
          {/* Left Side - Input */}
          <div className="p-6 space-y-5 border-r border-purple-500/20 bg-black/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Configure Your Plan</span>
            </div>

            {/* Fitness Level */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Fitness Level</Label>
              <div className="flex flex-wrap gap-2">
                {fitnessLevels.map((level) => (
                  <Badge
                    key={level}
                    onClick={() => setFitnessLevel(level)}
                    className={cn(
                      "cursor-pointer text-sm capitalize px-4 py-2 transition-all duration-300 hover:scale-105",
                      fitnessLevel === level 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/30" 
                        : "bg-black/40 text-gray-400 border-gray-600/40 hover:border-purple-400/50 hover:text-purple-300"
                    )}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Fitness Goals</Label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                  <Badge
                    key={goal}
                    onClick={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
                    className={cn(
                      "cursor-pointer text-sm px-3 py-1.5 transition-all duration-300 hover:scale-105",
                      selectedGoals.includes(goal)
                        ? "bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-transparent shadow-lg shadow-green-500/20"
                        : "bg-black/40 text-gray-400 border-gray-600/40 hover:border-green-400/50 hover:text-green-300"
                    )}
                  >
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Target Muscles */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm font-medium">Target Muscles</Label>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map((muscle) => (
                  <Badge
                    key={muscle}
                    onClick={() => toggleSelection(muscle, selectedMuscles, setSelectedMuscles)}
                    className={cn(
                      "cursor-pointer text-sm px-3 py-1.5 transition-all duration-300 hover:scale-105",
                      selectedMuscles.includes(muscle)
                        ? "bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white border-transparent shadow-lg shadow-orange-500/20"
                        : "bg-black/40 text-gray-400 border-gray-600/40 hover:border-orange-400/50 hover:text-orange-300"
                    )}
                  >
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={() => handleGetRecommendations()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-6 text-base rounded-xl shadow-xl shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/40 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Workout Plan
                </>
              )}
            </Button>
          </div>

          {/* Right Side - Output */}
          <div className="p-6 bg-gradient-to-br from-black/30 to-purple-900/10 min-h-[400px] flex flex-col">
            {/* Retry Info Display */}
            {retryInfo && (
              <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center gap-3 animate-fade-in">
                <Loader2 className="h-5 w-5 text-yellow-400 animate-spin shrink-0" />
                <p className="text-yellow-300 text-sm">{retryInfo}</p>
              </div>
            )}

            {/* Error Display */}
            {error && !retryInfo && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!plan && !error && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                  <Sparkles className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Configure your preferences on the left and click generate to get your personalized workout plan.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="h-16 w-16 text-purple-400 animate-spin relative" />
                </div>
                <p className="text-gray-300 mt-4">Analyzing your preferences...</p>
              </div>
            )}

            {/* Plan Display */}
            {plan && !isLoading && (
              <div className="space-y-5 overflow-y-auto animate-fade-in">
                {/* Summary */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                  <p className="text-gray-200 text-sm italic">{plan.summary}</p>
                </div>

                {/* Focus Areas Chart */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">Focus Distribution</Label>
                  <div className="space-y-2">
                    {plan.focusAreas.map((area) => (
                      <div key={area.area} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20 shrink-0">{area.area}</span>
                        <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${area.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{area.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">Your Exercises</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {plan.exercises.map((ex, idx) => {
                      const matched = getMatchedExercise(ex.matchId);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/40 border border-purple-500/20 space-y-2 hover:border-purple-500/40 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-purple-500/20">
                                <Dumbbell className="h-3.5 w-3.5 text-purple-400" />
                              </div>
                              <span className="text-white text-sm font-medium">{ex.name}</span>
                            </div>
                            <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30">
                              {ex.sets}×{ex.reps}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-xs flex items-start gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                            {ex.benefit}
                          </p>
                          {matched && (
                            <a
                              href={`#${matched.id}`}
                              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                            >
                              <ArrowRight className="h-3 w-3" />
                              View in library below
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">Pro Tips</Label>
                  <ul className="space-y-1.5">
                    {plan.tips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-300 flex items-start gap-2 p-2 rounded-lg bg-black/20">
                        <span className="text-purple-400 text-lg leading-none">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
