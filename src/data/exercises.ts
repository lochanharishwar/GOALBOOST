
import { Exercise, ExerciseCategory } from '@/types/exercise';

export const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'upper-body',
    name: 'Upper Body',
    description: 'Strengthen your arms, chest, shoulders, and back',
    icon: '💪',
    color: 'bg-red-500/20 border-red-400/30 text-red-400'
  },
  {
    id: 'lower-body',
    name: 'Lower Body',
    description: 'Build powerful legs and glutes',
    icon: '🦵',
    color: 'bg-blue-500/20 border-blue-400/30 text-blue-400'
  },
  {
    id: 'core',
    name: 'Core',
    description: 'Strengthen your abs and core muscles',
    icon: '🔥',
    color: 'bg-orange-500/20 border-orange-400/30 text-orange-400'
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Improve cardiovascular health and endurance',
    icon: '❤️',
    color: 'bg-pink-500/20 border-pink-400/30 text-pink-400'
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: 'Complete workouts targeting multiple muscle groups',
    icon: '🏃',
    color: 'bg-green-500/20 border-green-400/30 text-green-400'
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    description: 'Improve flexibility and mobility',
    icon: '🧘',
    color: 'bg-purple-500/20 border-purple-400/30 text-purple-400'
  }
];

export const exercises: Exercise[] = [
  // Upper Body Exercises
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'upper-body',
    difficulty: 'beginner',
    duration: '2-3 sets of 10-15 reps',
    equipment: ['None'],
    targetMuscles: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    steps: [
      'Start in a plank position with hands slightly wider than shoulder-width',
      'Keep your body in a straight line from head to heels',
      'Lower your chest toward the ground by bending your elbows',
      'Push back up to the starting position',
      'Keep your core engaged throughout the movement'
    ],
    benefits: ['Builds upper body strength', 'Improves core stability', 'No equipment needed'],
    tips: ['Keep your body straight', 'Control the movement', 'Breathe out as you push up']
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'upper-body',
    difficulty: 'intermediate',
    duration: '3 sets of 5-10 reps',
    equipment: ['Pull-up bar'],
    targetMuscles: ['Latissimus dorsi', 'Biceps', 'Rhomboids', 'Middle trapezius'],
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop',
    steps: [
      'Hang from a pull-up bar with palms facing away',
      'Keep your arms shoulder-width apart',
      'Pull yourself up until your chin clears the bar',
      'Lower yourself back down with control',
      'Keep your core engaged and avoid swinging'
    ],
    benefits: ['Builds back and arm strength', 'Improves grip strength', 'Functional movement'],
    tips: ['Start with assisted pull-ups if needed', 'Focus on form over quantity', 'Engage your lats']
  },

  // Lower Body Exercises
  {
    id: 'squats',
    name: 'Squats',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop',
    steps: [
      'Stand with feet shoulder-width apart',
      'Keep your chest up and core engaged',
      'Lower your body by bending at hips and knees',
      'Go down until your thighs are parallel to the floor',
      'Push through your heels to return to standing'
    ],
    benefits: ['Builds leg strength', 'Improves mobility', 'Functional movement for daily activities'],
    tips: ['Keep your knees aligned with your toes', 'Don\'t let knees cave inward', 'Keep weight on your heels']
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    steps: [
      'Stand tall with feet hip-width apart',
      'Take a large step forward with one leg',
      'Lower your hips until both knees are bent at 90 degrees',
      'Push back to the starting position',
      'Repeat with the other leg'
    ],
    benefits: ['Improves balance and coordination', 'Builds unilateral strength', 'Targets glutes effectively'],
    tips: ['Keep your front knee over your ankle', 'Don\'t let your knee touch the ground', 'Keep your torso upright']
  },

  // Core Exercises
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-60 seconds',
    equipment: ['None'],
    targetMuscles: ['Core', 'Shoulders', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    steps: [
      'Start in a push-up position on your forearms',
      'Keep your body in a straight line from head to heels',
      'Engage your core and glutes',
      'Hold the position while breathing normally',
      'Don\'t let your hips sag or pike up'
    ],
    benefits: ['Builds core stability', 'Improves posture', 'Strengthens entire core'],
    tips: ['Focus on breathing', 'Keep your head in neutral position', 'Start with shorter holds']
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 30 seconds',
    equipment: ['None'],
    targetMuscles: ['Core', 'Shoulders', 'Hip flexors', 'Legs'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    steps: [
      'Start in a plank position with hands under shoulders',
      'Bring one knee toward your chest',
      'Quickly switch legs, bringing the other knee forward',
      'Continue alternating legs in a running motion',
      'Keep your core engaged and hips level'
    ],
    benefits: ['Cardio and strength combination', 'Improves coordination', 'Burns calories'],
    tips: ['Keep your hips level', 'Land softly on your feet', 'Maintain plank position']
  },

  // Cardio Exercises
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    difficulty: 'beginner',
    duration: '3 sets of 30-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Full body', 'Cardiovascular system'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    steps: [
      'Stand with feet together and arms at your sides',
      'Jump while spreading your legs shoulder-width apart',
      'Simultaneously raise your arms overhead',
      'Jump back to the starting position',
      'Repeat in a rhythmic motion'
    ],
    benefits: ['Improves cardiovascular health', 'Full-body warm-up', 'Burns calories quickly'],
    tips: ['Land softly on your feet', 'Keep a steady rhythm', 'Engage your core']
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'full-body',
    difficulty: 'advanced',
    duration: '3 sets of 5-10 reps',
    equipment: ['None'],
    targetMuscles: ['Full body', 'Cardiovascular system'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    steps: [
      'Start standing with feet shoulder-width apart',
      'Squat down and place hands on the floor',
      'Jump feet back into a plank position',
      'Perform a push-up (optional)',
      'Jump feet back to squat position',
      'Jump up with arms overhead'
    ],
    benefits: ['Full-body workout', 'High calorie burn', 'Improves explosive power'],
    tips: ['Modify by stepping instead of jumping', 'Focus on form over speed', 'Take breaks as needed']
  },

  // Flexibility Exercises
  {
    id: 'child-pose',
    name: 'Child\'s Pose',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 'Hold for 30-60 seconds',
    equipment: ['Yoga mat (optional)'],
    targetMuscles: ['Back', 'Hips', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    steps: [
      'Kneel on the floor with big toes touching',
      'Separate your knees about hip-width apart',
      'Fold forward and extend your arms in front',
      'Rest your forehead on the ground',
      'Breathe deeply and relax'
    ],
    benefits: ['Stretches back and hips', 'Promotes relaxation', 'Relieves stress'],
    tips: ['Use a pillow under your forehead if needed', 'Keep breathing deeply', 'Don\'t force the stretch']
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 'Hold for 30-60 seconds',
    equipment: ['Yoga mat (optional)'],
    targetMuscles: ['Hamstrings', 'Calves', 'Shoulders', 'Back'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    steps: [
      'Start on hands and knees',
      'Tuck your toes under and lift your hips up',
      'Straighten your legs and form an inverted V',
      'Press your hands firmly into the ground',
      'Pedal your feet to stretch your calves'
    ],
    benefits: ['Stretches entire posterior chain', 'Strengthens arms and shoulders', 'Improves circulation'],
    tips: ['Bend your knees if hamstrings are tight', 'Keep your spine straight', 'Distribute weight evenly']
  }
];
