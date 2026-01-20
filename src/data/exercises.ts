import { ExerciseCategory } from '@/types/exercise';
import { upperBodyExercises } from './exercises/upperBodyExercises';
import { lowerBodyExercises } from './exercises/lowerBodyExercises';
import { coreExercises } from './exercises/coreExercises';
import { cardioExercises, flexibilityExercises, fullBodyExercises } from './exercises/otherExercises';
import { 
  additionalUpperBodyExercises, 
  additionalLowerBodyExercises, 
  additionalCoreExercises,
  additionalCardioExercises,
  additionalFlexibilityExercises,
  additionalFullBodyExercises
} from './exercises/additionalExercises';

export const exerciseCategories: ExerciseCategory[] = [
  { id: 'upper-body', name: 'Upper Body', description: 'Strengthen your arms, chest, shoulders, and back', icon: '💪', color: 'bg-red-500/20 border-red-400/30 text-red-400' },
  { id: 'lower-body', name: 'Lower Body', description: 'Build powerful legs and glutes', icon: '🦵', color: 'bg-blue-500/20 border-blue-400/30 text-blue-400' },
  { id: 'core', name: 'Core', description: 'Strengthen your abs and core muscles', icon: '🔥', color: 'bg-orange-500/20 border-orange-400/30 text-orange-400' },
  { id: 'cardio', name: 'Cardio', description: 'Improve cardiovascular health and endurance', icon: '❤️', color: 'bg-pink-500/20 border-pink-400/30 text-pink-400' },
  { id: 'full-body', name: 'Full Body', description: 'Complete workouts targeting multiple muscle groups', icon: '🏃', color: 'bg-green-500/20 border-green-400/30 text-green-400' },
  { id: 'flexibility', name: 'Flexibility', description: 'Improve flexibility and mobility', icon: '🧘', color: 'bg-purple-500/20 border-purple-400/30 text-purple-400' }
];

// Combine all exercises from separate files - 250+ exercises total
export const exercises = [
  ...upperBodyExercises,
  ...additionalUpperBodyExercises,
  ...lowerBodyExercises,
  ...additionalLowerBodyExercises,
  ...coreExercises,
  ...additionalCoreExercises,
  ...cardioExercises,
  ...additionalCardioExercises,
  ...flexibilityExercises,
  ...additionalFlexibilityExercises,
  ...fullBodyExercises,
  ...additionalFullBodyExercises
];

// Export total count for display
export const exerciseCount = exercises.length;
