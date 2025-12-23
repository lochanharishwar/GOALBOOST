import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Dumbbell, Target, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const fitnessLevels = ['beginner', 'intermediate', 'advanced'] as const;
const goalOptions = ['Build Muscle', 'Lose Weight', 'Improve Flexibility', 'Increase Endurance', 'General Fitness'];
const equipmentOptions = ['None/Bodyweight', 'Dumbbells', 'Barbell', 'Pull-up Bar', 'Bench', 'Cable Machine', 'Resistance Bands', 'Kettlebell'];
const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs', 'Glutes', 'Full Body'];

export const AIExerciseRecommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fitnessLevel, setFitnessLevel] = useState<string>('beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const { toast } = useToast();

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('exercise-recommendations', {
        body: {
          fitnessLevel,
          goals: selectedGoals.join(', ') || 'General fitness',
          availableEquipment: selectedEquipment,
          targetMuscles: selectedMuscles,
          preferences: additionalPreferences,
        }
      });

      if (fnError) {
        throw fnError;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations);
      toast({
        title: "Recommendations Ready!",
        description: "Your personalized exercise plan has been generated.",
      });
    } catch (err) {
      console.error('Error getting recommendations:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recommendations';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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

        {/* Goals & Equipment Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-gray-300 text-xs mb-1.5 block">Goals</Label>
            <div className="flex flex-wrap gap-1">
              {goalOptions.slice(0, 4).map((goal) => (
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
                  {goal.split(' ')[0]}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-300 text-xs mb-1.5 block">Muscles</Label>
            <div className="flex flex-wrap gap-1">
              {muscleGroups.slice(0, 4).map((muscle) => (
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
              Get Recommendations
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

        {/* Recommendations Display */}
        {recommendations && (
          <div className="p-3 rounded-lg bg-black/30 border border-purple-500/20">
            <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-purple-400" />
              Your Plan
            </h3>
            <div className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {recommendations}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
