
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/exercise';
import { Clock, Users, Target, Lightbulb, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getCategoryColor = (category: Exercise['category']) => {
    switch (category) {
      case 'upper-body': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'lower-body': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'core': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'cardio': return 'bg-pink-500/20 text-pink-400 border-pink-400/30';
      case 'full-body': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'flexibility': return 'bg-purple-500/20 text-purple-400 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-black/20 backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-xl mb-2 font-inter">{exercise.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn("text-xs", getCategoryColor(exercise.category))}>
                {exercise.category.replace('-', ' ')}
              </Badge>
              <Badge className={cn("text-xs", getDifficultyColor(exercise.difficulty))}>
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
          <img 
            src={exercise.image} 
            alt={exercise.name}
            className="w-20 h-20 object-cover rounded-lg ml-4"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="h-4 w-4 text-blue-400" />
            {exercise.duration}
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Target className="h-4 w-4 text-green-400" />
            {exercise.targetMuscles.slice(0, 2).join(', ')}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            How to do it:
          </h4>
          <ol className="space-y-2">
            {exercise.steps.slice(0, isExpanded ? exercise.steps.length : 3).map((step, index) => (
              <li key={index} className="text-gray-300 text-sm flex gap-3">
                <span className="bg-blue-500/20 text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          
          {exercise.steps.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>Show More <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          )}
        </div>

        {isExpanded && (
          <>
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                Tips:
              </h4>
              <ul className="space-y-1">
                {exercise.tips?.map((tip, index) => (
                  <li key={index} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-yellow-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, index) => (
                  <Badge key={index} className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Equipment:</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
