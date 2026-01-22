import { createContext, useContext, useState, ReactNode } from 'react';
import { FallbackWorkoutPlan } from '@/data/fallbackWorkoutTemplates';

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

interface UserPreferences {
  fitnessLevel: string;
  goals: string[];
  targetMuscles: string[];
}

interface WorkoutPlanContextType {
  // User preferences from "Find Your Perfect Workout"
  userPreferences: UserPreferences;
  setUserPreferences: (prefs: UserPreferences) => void;
  
  // Generated workout plan
  currentPlan: ExercisePlan | FallbackWorkoutPlan | null;
  setCurrentPlan: (plan: ExercisePlan | FallbackWorkoutPlan | null) => void;
  
  // Selected exercise for AI Coach
  selectedExerciseForCoach: string | null;
  setSelectedExerciseForCoach: (exerciseId: string | null) => void;
  
  // Start exercise in coach
  startExerciseInCoach: (exerciseId: string) => void;
}

const WorkoutPlanContext = createContext<WorkoutPlanContextType | undefined>(undefined);

export const WorkoutPlanProvider = ({ children }: { children: ReactNode }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    fitnessLevel: 'beginner',
    goals: [],
    targetMuscles: []
  });
  const [currentPlan, setCurrentPlan] = useState<ExercisePlan | FallbackWorkoutPlan | null>(null);
  const [selectedExerciseForCoach, setSelectedExerciseForCoach] = useState<string | null>(null);

  const startExerciseInCoach = (exerciseId: string) => {
    setSelectedExerciseForCoach(exerciseId);
    // Scroll to AI Exercise Coach section
    setTimeout(() => {
      const coachSection = document.getElementById('ai-exercise-coach');
      if (coachSection) {
        coachSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <WorkoutPlanContext.Provider
      value={{
        userPreferences,
        setUserPreferences,
        currentPlan,
        setCurrentPlan,
        selectedExerciseForCoach,
        setSelectedExerciseForCoach,
        startExerciseInCoach
      }}
    >
      {children}
    </WorkoutPlanContext.Provider>
  );
};

export const useWorkoutPlan = () => {
  const context = useContext(WorkoutPlanContext);
  if (!context) {
    throw new Error('useWorkoutPlan must be used within a WorkoutPlanProvider');
  }
  return context;
};
