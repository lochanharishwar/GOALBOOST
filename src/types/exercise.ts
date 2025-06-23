
export interface Exercise {
  id: string;
  name: string;
  category: 'upper-body' | 'lower-body' | 'core' | 'cardio' | 'full-body' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  equipment: string[];
  targetMuscles: string[];
  steps: string[];
  image: string;
  tips?: string[];
  benefits: string[];
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
