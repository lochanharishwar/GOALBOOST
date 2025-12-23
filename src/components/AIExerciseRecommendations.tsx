import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Target, AlertCircle, Dumbbell, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { exercises } from '@/data/exercises';

const fitnessLevels = ['beginner', 'intermediate', 'advanced'] as const;
const goalOptions = ['Build', 'Lose', 'Flex', 'Endure'];
const muscleGroups = ['Chest', 'Back', 'Arms', 'Legs'];

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

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

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
      if (data?.error) throw new Error(data.error);

      setPlan(data.plan);
      toast({ title: "Plan Ready!", description: "Your workout plan has been generated." });
    } catch (err) {
      console.error('Error getting recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendations';
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-black/20 backdrop-blur-xl border border-purple-500/20">
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Fitness Level */}
        <div>
          <Label className="text-gray-300 text-xs mb-1.5 block">Level</Label>
          <div className="flex gap-1.5">
            {fitnessLevels.map((level) => (
              <Badge
                key={level}
                onClick={() => setFitnessLevel(level)}
                className={cn(
                  "cursor-pointer text-xs capitalize px-2 py-0.5",
                  fitnessLevel === level 
                    ? "bg-purple-500/40 text-purple-200 border-purple-400/50" 
                    : "bg-black/30 text-gray-400 border-gray-600/30 hover:bg-purple-500/20"
                )}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Goals & Muscles Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-300 text-xs mb-1.5 block">Goals</Label>
            <div className="flex flex-wrap gap-1">
              {goalOptions.map((goal) => (
                <Badge
                  key={goal}
                  onClick={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
                  className={cn(
                    "cursor-pointer text-xs px-1.5 py-0.5",
                    selectedGoals.includes(goal)
                      ? "bg-green-500/30 text-green-300 border-green-400/40"
                      : "bg-black/20 text-gray-400 border-gray-600/20 hover:bg-green-500/20"
                  )}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-300 text-xs mb-1.5 block">Muscles</Label>
            <div className="flex flex-wrap gap-1">
              {muscleGroups.map((muscle) => (
                <Badge
                  key={muscle}
                  onClick={() => toggleSelection(muscle, selectedMuscles, setSelectedMuscles)}
                  className={cn(
                    "cursor-pointer text-xs px-1.5 py-0.5",
                    selectedMuscles.includes(muscle)
                      ? "bg-orange-500/30 text-orange-300 border-orange-400/40"
                      : "bg-black/20 text-gray-400 border-gray-600/20 hover:bg-orange-500/20"
                  )}
                >
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGetRecommendations}
          disabled={isLoading}
          size="sm"
          className="w-full bg-purple-500/80 hover:bg-purple-500 text-white text-sm py-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Get Plan
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-2 rounded bg-red-500/20 border border-red-500/30 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
            <p className="text-red-300 text-xs">{error}</p>
          </div>
        )}

        {/* Plan Display */}
        {plan && (
          <div className="space-y-3 pt-2">
            {/* Summary */}
            <p className="text-gray-300 text-xs italic">{plan.summary}</p>

            {/* Focus Areas Chart */}
            <div className="space-y-1.5">
              <Label className="text-gray-400 text-xs">Focus Distribution</Label>
              {plan.focusAreas.map((area) => (
                <div key={area.area} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">{area.area}</span>
                  <Progress value={area.percentage} className="h-2 flex-1" />
                  <span className="text-xs text-gray-500 w-8">{area.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Exercises List */}
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs">Your Exercises</Label>
              {plan.exercises.map((ex, idx) => {
                const matched = getMatchedExercise(ex.matchId);
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-black/30 border border-purple-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-white text-sm font-medium">{ex.name}</span>
                      </div>
                      <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30">
                        {ex.sets}×{ex.reps}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-xs flex items-start gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                      {ex.benefit}
                    </p>
                    {matched && (
                      <a
                        href={`#${matched.id}`}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <ArrowRight className="h-3 w-3" />
                        View in library below
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs">Quick Tips</Label>
              <ul className="space-y-1">
                {plan.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5">
                    <span className="text-purple-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
