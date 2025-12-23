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
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
          AI Exercise Recommendations
        </CardTitle>
        <p className="text-gray-400 text-sm mt-2">
          Get personalized exercise recommendations based on your fitness level, goals, and preferences.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fitness Level */}
        <div>
          <Label className="text-white font-semibold mb-3 block">Fitness Level</Label>
          <div className="flex flex-wrap gap-2">
            {fitnessLevels.map((level) => (
              <Button
                key={level}
                variant={fitnessLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFitnessLevel(level)}
                className={cn(
                  "capitalize transition-all duration-200",
                  fitnessLevel === level 
                    ? "bg-purple-500 text-white hover:bg-purple-600" 
                    : "bg-black/30 border-purple-400/30 text-white hover:bg-purple-500/20"
                )}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <Label className="text-white font-semibold mb-3 block">Your Goals</Label>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((goal) => (
              <Badge
                key={goal}
                onClick={() => toggleSelection(goal, selectedGoals, setSelectedGoals)}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedGoals.includes(goal)
                    ? "bg-green-500/30 text-green-300 border-green-400/50 hover:bg-green-500/40"
                    : "bg-black/30 text-gray-300 border-gray-500/30 hover:bg-gray-500/20"
                )}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div>
          <Label className="text-white font-semibold mb-3 block">Available Equipment</Label>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((equipment) => (
              <Badge
                key={equipment}
                onClick={() => toggleSelection(equipment, selectedEquipment, setSelectedEquipment)}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedEquipment.includes(equipment)
                    ? "bg-blue-500/30 text-blue-300 border-blue-400/50 hover:bg-blue-500/40"
                    : "bg-black/30 text-gray-300 border-gray-500/30 hover:bg-gray-500/20"
                )}
              >
                {equipment}
              </Badge>
            ))}
          </div>
        </div>

        {/* Target Muscles */}
        <div>
          <Label className="text-white font-semibold mb-3 block">Target Muscle Groups</Label>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <Badge
                key={muscle}
                onClick={() => toggleSelection(muscle, selectedMuscles, setSelectedMuscles)}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedMuscles.includes(muscle)
                    ? "bg-orange-500/30 text-orange-300 border-orange-400/50 hover:bg-orange-500/40"
                    : "bg-black/30 text-gray-300 border-gray-500/30 hover:bg-gray-500/20"
                )}
              >
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Preferences */}
        <div>
          <Label className="text-white font-semibold mb-3 block">Additional Preferences (Optional)</Label>
          <Textarea
            placeholder="E.g., I have a shoulder injury, prefer low-impact exercises, want quick workouts under 30 min..."
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
            className="bg-black/30 border-purple-400/30 text-white placeholder-gray-500 focus:border-purple-400 min-h-[80px]"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGetRecommendations}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Get AI Recommendations
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Recommendations Display */}
        {recommendations && (
          <div className="mt-6 p-6 rounded-xl bg-black/30 border border-purple-500/30">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Your Personalized Recommendations
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {recommendations}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
