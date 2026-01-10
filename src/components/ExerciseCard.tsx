import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/exercise';
import { Clock, Target, Lightbulb, CheckCircle, ChevronDown, ChevronUp, Dumbbell, Flame, Sparkles, Star, Play, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getDifficultyConfig = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'beginner': 
        return { 
          className: 'bg-success/20 text-success border-success/40',
          icon: '🌱'
        };
      case 'intermediate': 
        return { 
          className: 'bg-warning/20 text-warning border-warning/40',
          icon: '⚡'
        };
      case 'advanced': 
        return { 
          className: 'bg-destructive/20 text-destructive border-destructive/40',
          icon: '🔥'
        };
      default: 
        return { 
          className: 'bg-muted text-muted-foreground border-border',
          icon: '⭐'
        };
    }
  };

  const getCategoryConfig = (category: Exercise['category']) => {
    switch (category) {
      case 'upper-body': 
        return { 
          className: 'bg-destructive/20 text-destructive border-destructive/40',
          icon: '💪'
        };
      case 'lower-body': 
        return { 
          className: 'bg-info/20 text-info border-info/40',
          icon: '🦵'
        };
      case 'core': 
        return { 
          className: 'bg-warning/20 text-warning border-warning/40',
          icon: '🎯'
        };
      case 'cardio': 
        return { 
          className: 'bg-accent/20 text-accent border-accent/40',
          icon: '❤️'
        };
      case 'full-body': 
        return { 
          className: 'bg-success/20 text-success border-success/40',
          icon: '🏋️'
        };
      case 'flexibility': 
        return { 
          className: 'bg-primary/20 text-primary border-primary/40',
          icon: '🧘'
        };
      default: 
        return { 
          className: 'bg-muted text-muted-foreground border-border',
          icon: '⭐'
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(exercise.difficulty);
  const categoryConfig = getCategoryConfig(exercise.category);

  return (
    <Card className="glass-bold border-2 border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden hover:shadow-xl">
      <CardHeader className="pb-4 relative">
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="relative shrink-0">
            <img 
              src={exercise.image} 
              alt={exercise.name}
              className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-full bg-background/90 shadow-lg">
                <Play className="h-4 w-4 text-foreground" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-xl font-bold leading-tight line-clamp-2 text-foreground">
                {exercise.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0 h-8 w-8 rounded-full transition-all",
                  isFavorite 
                    ? "text-destructive bg-destructive/20" 
                    : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn(
                "text-xs font-bold px-3 py-1 rounded-full border-2",
                categoryConfig.className
              )}>
                {categoryConfig.icon} {exercise.category.replace('-', ' ')}
              </Badge>
              <Badge className={cn(
                "text-xs font-bold px-3 py-1 rounded-full border-2",
                difficultyConfig.className
              )}>
                {difficultyConfig.icon} {exercise.difficulty}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-info/10 border border-info/20">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-sm font-bold text-info">
                  {exercise.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                <Target className="h-4 w-4 text-success" />
                <span className="text-sm font-bold truncate text-success">
                  {exercise.targetMuscles.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Steps Section */}
        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            How to Perform
          </h4>
          <ol className="space-y-2">
            {exercise.steps.slice(0, isExpanded ? exercise.steps.length : 3).map((step, index) => (
              <li key={index} className="text-sm flex gap-3 items-start text-muted-foreground">
                <span className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 bg-success text-success-foreground">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          
          {exercise.steps.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 font-bold rounded-lg text-success hover:text-success hover:bg-success/20"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
              ) : (
                <>Show All {exercise.steps.length} Steps <ChevronDown className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            {/* Tips Section */}
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-warning">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {exercise.tips.map((tip, index) => (
                    <li key={index} className="text-sm flex gap-3 items-start text-muted-foreground">
                      <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits Section */}
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-accent">
                <Star className="h-5 w-5" />
                Benefits
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, index) => (
                  <Badge 
                    key={index} 
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30"
                  >
                    ✨ {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Equipment Section */}
            <div className="p-4 rounded-xl bg-info/10 border border-info/20">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-info">
                <Dumbbell className="h-5 w-5" />
                Equipment Needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <Badge 
                    key={index} 
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-info/20 text-info border border-info/30"
                  >
                    🛠️ {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* All Target Muscles */}
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <h4 className="font-bold mb-3 flex items-center gap-2 text-destructive">
                <Flame className="h-5 w-5" />
                Target Muscles
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <Badge 
                    key={index} 
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-destructive/20 text-destructive border border-destructive/30"
                  >
                    💪 {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button for non-expanded state */}
        {!isExpanded && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsExpanded(true)}
            className="w-full font-bold rounded-xl h-12 transition-all hover:scale-[1.02] border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            View Full Details
            <ChevronDown className="h-5 w-5 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
