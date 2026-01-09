import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/exercise';
import { Clock, Target, Lightbulb, CheckCircle, ChevronDown, ChevronUp, Dumbbell, Flame, Sparkles, Star, Play, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getDifficultyConfig = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'beginner': 
        return { 
          gradient: 'from-green-400 to-emerald-500', 
          bg: isDarkMode ? 'bg-green-500/20' : 'bg-green-100',
          text: isDarkMode ? 'text-green-300' : 'text-green-700',
          border: isDarkMode ? 'border-green-400/40' : 'border-green-300',
          icon: '🌱'
        };
      case 'intermediate': 
        return { 
          gradient: 'from-yellow-400 to-orange-500', 
          bg: isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
          text: isDarkMode ? 'text-yellow-300' : 'text-yellow-700',
          border: isDarkMode ? 'border-yellow-400/40' : 'border-yellow-300',
          icon: '⚡'
        };
      case 'advanced': 
        return { 
          gradient: 'from-red-400 to-rose-500', 
          bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-100',
          text: isDarkMode ? 'text-red-300' : 'text-red-700',
          border: isDarkMode ? 'border-red-400/40' : 'border-red-300',
          icon: '🔥'
        };
      default: 
        return { 
          gradient: 'from-gray-400 to-gray-500', 
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-400/40',
          icon: '⭐'
        };
    }
  };

  const getCategoryConfig = (category: Exercise['category']) => {
    switch (category) {
      case 'upper-body': 
        return { 
          gradient: 'from-red-500 to-orange-500', 
          bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-100',
          text: isDarkMode ? 'text-red-300' : 'text-red-700',
          border: isDarkMode ? 'border-red-400/40' : 'border-red-300',
          icon: '💪'
        };
      case 'lower-body': 
        return { 
          gradient: 'from-blue-500 to-cyan-500', 
          bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100',
          text: isDarkMode ? 'text-blue-300' : 'text-blue-700',
          border: isDarkMode ? 'border-blue-400/40' : 'border-blue-300',
          icon: '🦵'
        };
      case 'core': 
        return { 
          gradient: 'from-orange-500 to-yellow-500', 
          bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100',
          text: isDarkMode ? 'text-orange-300' : 'text-orange-700',
          border: isDarkMode ? 'border-orange-400/40' : 'border-orange-300',
          icon: '🎯'
        };
      case 'cardio': 
        return { 
          gradient: 'from-pink-500 to-rose-500', 
          bg: isDarkMode ? 'bg-pink-500/20' : 'bg-pink-100',
          text: isDarkMode ? 'text-pink-300' : 'text-pink-700',
          border: isDarkMode ? 'border-pink-400/40' : 'border-pink-300',
          icon: '❤️'
        };
      case 'full-body': 
        return { 
          gradient: 'from-green-500 to-emerald-500', 
          bg: isDarkMode ? 'bg-green-500/20' : 'bg-green-100',
          text: isDarkMode ? 'text-green-300' : 'text-green-700',
          border: isDarkMode ? 'border-green-400/40' : 'border-green-300',
          icon: '🏋️'
        };
      case 'flexibility': 
        return { 
          gradient: 'from-purple-500 to-violet-500', 
          bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100',
          text: isDarkMode ? 'text-purple-300' : 'text-purple-700',
          border: isDarkMode ? 'border-purple-400/40' : 'border-purple-300',
          icon: '🧘'
        };
      default: 
        return { 
          gradient: 'from-gray-500 to-gray-600', 
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-400/40',
          icon: '⭐'
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(exercise.difficulty);
  const categoryConfig = getCategoryConfig(exercise.category);

  return (
    <Card className={cn(
      "shadow-2xl border-0 backdrop-blur-xl transition-all duration-500 group overflow-hidden hover:shadow-3xl",
      isDarkMode 
        ? "bg-gradient-to-br from-white/10 via-white/5 to-purple-900/20 border-2 border-white/20 hover:border-purple-400/50" 
        : "bg-white/90 border-2 border-purple-100 hover:border-purple-300"
    )}>
      {/* Glowing Effect on Hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        `bg-gradient-to-br ${categoryConfig.gradient} blur-3xl`
      )} style={{ transform: 'scale(0.5)', opacity: '0.1' }} />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start gap-4">
          {/* Image with gradient overlay */}
          <div className="relative shrink-0">
            <div className={cn(
              "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-60",
              categoryConfig.gradient
            )} />
            <img 
              src={exercise.image} 
              alt={exercise.name}
              className="w-24 h-24 object-cover rounded-2xl relative z-10 shadow-xl group-hover:scale-105 transition-transform duration-300"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-full bg-white/90 shadow-lg">
                <Play className="h-4 w-4 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className={cn(
                "text-xl font-black leading-tight line-clamp-2",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                {exercise.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0 h-8 w-8 rounded-full transition-all",
                  isFavorite 
                    ? "text-red-500 bg-red-500/20" 
                    : isDarkMode ? "text-slate-400 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                )}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn(
                "text-xs font-bold px-3 py-1 rounded-full border-2 shadow-sm",
                categoryConfig.bg,
                categoryConfig.text,
                categoryConfig.border
              )}>
                {categoryConfig.icon} {exercise.category.replace('-', ' ')}
              </Badge>
              <Badge className={cn(
                "text-xs font-bold px-3 py-1 rounded-full border-2 shadow-sm",
                difficultyConfig.bg,
                difficultyConfig.text,
                difficultyConfig.border
              )}>
                {difficultyConfig.icon} {exercise.difficulty}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl",
                isDarkMode ? "bg-blue-500/20" : "bg-blue-50"
              )}>
                <Clock className={cn("h-4 w-4", isDarkMode ? "text-blue-400" : "text-blue-600")} />
                <span className={cn("text-sm font-bold", isDarkMode ? "text-blue-300" : "text-blue-700")}>
                  {exercise.duration}
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl",
                isDarkMode ? "bg-green-500/20" : "bg-green-50"
              )}>
                <Target className={cn("h-4 w-4", isDarkMode ? "text-green-400" : "text-green-600")} />
                <span className={cn("text-sm font-bold truncate", isDarkMode ? "text-green-300" : "text-green-700")}>
                  {exercise.targetMuscles.slice(0, 2).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Steps Section */}
        <div className={cn(
          "p-4 rounded-2xl",
          isDarkMode ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20" : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
        )}>
          <h4 className={cn(
            "font-bold mb-3 flex items-center gap-2",
            isDarkMode ? "text-green-300" : "text-green-700"
          )}>
            <CheckCircle className="h-5 w-5" />
            How to Perform
          </h4>
          <ol className="space-y-2">
            {exercise.steps.slice(0, isExpanded ? exercise.steps.length : 3).map((step, index) => (
              <li key={index} className={cn(
                "text-sm flex gap-3 items-start",
                isDarkMode ? "text-slate-300" : "text-slate-700"
              )}>
                <span className={cn(
                  "rounded-full w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-md",
                  `bg-gradient-to-br ${categoryConfig.gradient} text-white`
                )}>
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
              className={cn(
                "mt-3 font-bold rounded-xl",
                isDarkMode 
                  ? "text-green-400 hover:text-green-300 hover:bg-green-500/20" 
                  : "text-green-600 hover:text-green-700 hover:bg-green-100"
              )}
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
              <div className={cn(
                "p-4 rounded-2xl",
                isDarkMode ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20" : "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
              )}>
                <h4 className={cn(
                  "font-bold mb-3 flex items-center gap-2",
                  isDarkMode ? "text-yellow-300" : "text-yellow-700"
                )}>
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {exercise.tips.map((tip, index) => (
                    <li key={index} className={cn(
                      "text-sm flex gap-3 items-start",
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    )}>
                      <Sparkles className={cn("h-4 w-4 shrink-0 mt-0.5", isDarkMode ? "text-yellow-400" : "text-yellow-600")} />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits Section */}
            <div className={cn(
              "p-4 rounded-2xl",
              isDarkMode ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20" : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
            )}>
              <h4 className={cn(
                "font-bold mb-3 flex items-center gap-2",
                isDarkMode ? "text-purple-300" : "text-purple-700"
              )}>
                <Star className="h-5 w-5" />
                Benefits
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, index) => (
                  <Badge 
                    key={index} 
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full",
                      isDarkMode 
                        ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 border border-purple-400/30" 
                        : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200"
                    )}
                  >
                    ✨ {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Equipment Section */}
            <div className={cn(
              "p-4 rounded-2xl",
              isDarkMode ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20" : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
            )}>
              <h4 className={cn(
                "font-bold mb-3 flex items-center gap-2",
                isDarkMode ? "text-blue-300" : "text-blue-700"
              )}>
                <Dumbbell className="h-5 w-5" />
                Equipment Needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <Badge 
                    key={index} 
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full",
                      isDarkMode 
                        ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 border border-blue-400/30" 
                        : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
                    )}
                  >
                    🛠️ {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* All Target Muscles */}
            <div className={cn(
              "p-4 rounded-2xl",
              isDarkMode ? "bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20" : "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200"
            )}>
              <h4 className={cn(
                "font-bold mb-3 flex items-center gap-2",
                isDarkMode ? "text-red-300" : "text-red-700"
              )}>
                <Flame className="h-5 w-5" />
                Target Muscles
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <Badge 
                    key={index} 
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full",
                      isDarkMode 
                        ? "bg-gradient-to-r from-red-500/30 to-orange-500/30 text-red-200 border border-red-400/30" 
                        : "bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200"
                    )}
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
            className={cn(
              "w-full font-bold rounded-2xl h-12 transition-all hover:scale-[1.02]",
              isDarkMode 
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 text-purple-300 hover:border-purple-400 hover:bg-purple-500/30" 
                : "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-purple-700 hover:border-purple-300 hover:bg-purple-100"
            )}
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