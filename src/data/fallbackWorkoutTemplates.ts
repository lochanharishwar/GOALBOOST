// Pre-generated workout templates for offline/rate-limited scenarios
export interface FallbackWorkoutPlan {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  targetMuscles: string[];
  exercises: {
    name: string;
    category: string;
    sets: number;
    reps: string;
    benefit: string;
    matchId: string;
  }[];
  focusAreas: { area: string; percentage: number }[];
  tips: string[];
  summary: string;
}

export const fallbackWorkoutTemplates: FallbackWorkoutPlan[] = [
  {
    id: 'full-body-beginner',
    name: 'Full Body Starter',
    difficulty: 'beginner',
    duration: '30-40 min',
    targetMuscles: ['Full Body'],
    summary: 'A balanced full-body workout perfect for beginners to build foundational strength.',
    exercises: [
      { name: 'Bodyweight Squats', category: 'lower-body', sets: 3, reps: '15', benefit: 'Builds leg strength and mobility', matchId: 'squats' },
      { name: 'Push-ups', category: 'upper-body', sets: 3, reps: '10-12', benefit: 'Develops chest and tricep strength', matchId: 'push-ups' },
      { name: 'Forearm Plank', category: 'core', sets: 3, reps: '30 sec', benefit: 'Core stability and endurance', matchId: 'plank' },
      { name: 'Glute Bridges', category: 'lower-body', sets: 3, reps: '15', benefit: 'Activates glutes and hamstrings', matchId: 'glute-bridges' },
      { name: 'Mountain Climbers', category: 'core', sets: 3, reps: '30 sec', benefit: 'Cardio and core conditioning', matchId: 'mountain-climbers' }
    ],
    focusAreas: [
      { area: 'Strength', percentage: 50 },
      { area: 'Cardio', percentage: 30 },
      { area: 'Core', percentage: 20 }
    ],
    tips: ['Focus on proper form over speed', 'Rest 60-90 seconds between sets', 'Stay hydrated throughout']
  },
  {
    id: 'upper-body-strength',
    name: 'Upper Body Power',
    difficulty: 'intermediate',
    duration: '40-50 min',
    targetMuscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    summary: 'An intense upper body workout to build muscle and strength in your chest, back, and arms.',
    exercises: [
      { name: 'Push-ups', category: 'upper-body', sets: 4, reps: '12-15', benefit: 'Chest and tricep development', matchId: 'push-ups' },
      { name: 'Dumbbell Rows', category: 'upper-body', sets: 4, reps: '10-12', benefit: 'Back strength and posture', matchId: 'dumbbell-rows' },
      { name: 'Pike Push-ups', category: 'upper-body', sets: 3, reps: '10', benefit: 'Shoulder strength', matchId: 'pike-push-ups' },
      { name: 'Diamond Push-ups', category: 'upper-body', sets: 3, reps: '10', benefit: 'Tricep isolation', matchId: 'diamond-push-ups' },
      { name: 'Bicep Curls', category: 'upper-body', sets: 3, reps: '12', benefit: 'Bicep development', matchId: 'bicep-curls' }
    ],
    focusAreas: [
      { area: 'Pushing', percentage: 40 },
      { area: 'Pulling', percentage: 40 },
      { area: 'Arms', percentage: 20 }
    ],
    tips: ['Warm up with arm circles', 'Squeeze at the top of each rep', 'Progressive overload weekly']
  },
  {
    id: 'lower-body-blast',
    name: 'Leg Day Crusher',
    difficulty: 'intermediate',
    duration: '45-55 min',
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    summary: 'A comprehensive lower body workout targeting all major leg muscles for strength and power.',
    exercises: [
      { name: 'Goblet Squats', category: 'lower-body', sets: 4, reps: '12-15', benefit: 'Quad and glute strength', matchId: 'goblet-squats' },
      { name: 'Romanian Deadlifts', category: 'lower-body', sets: 4, reps: '10-12', benefit: 'Hamstring development', matchId: 'deadlifts' },
      { name: 'Bulgarian Split Squats', category: 'lower-body', sets: 3, reps: '10 each', benefit: 'Unilateral leg strength', matchId: 'bulgarian-split-squats' },
      { name: 'Barbell Hip Thrusts', category: 'lower-body', sets: 4, reps: '12', benefit: 'Maximum glute activation', matchId: 'hip-thrusts' },
      { name: 'Calf Raises', category: 'lower-body', sets: 4, reps: '15-20', benefit: 'Calf development', matchId: 'calf-raises' }
    ],
    focusAreas: [
      { area: 'Quads', percentage: 35 },
      { area: 'Glutes', percentage: 35 },
      { area: 'Hamstrings', percentage: 30 }
    ],
    tips: ['Never skip the warm-up', 'Focus on mind-muscle connection', 'Stretch after your workout']
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    difficulty: 'intermediate',
    duration: '25-30 min',
    targetMuscles: ['Core', 'Abs', 'Obliques'],
    summary: 'An intense core workout to build a strong, stable midsection and improve overall athleticism.',
    exercises: [
      { name: 'Forearm Plank', category: 'core', sets: 3, reps: '45 sec', benefit: 'Core stability foundation', matchId: 'plank' },
      { name: 'Bicycle Crunches', category: 'core', sets: 3, reps: '20 each', benefit: 'Oblique development', matchId: 'bicycle-crunches' },
      { name: 'Russian Twists', category: 'core', sets: 3, reps: '20 each', benefit: 'Rotational core strength', matchId: 'russian-twists' },
      { name: 'Hanging Knee Raises', category: 'core', sets: 3, reps: '12-15', benefit: 'Lower ab targeting', matchId: 'hanging-knee-raises' },
      { name: 'Dead Bugs', category: 'core', sets: 3, reps: '12 each', benefit: 'Core control and stability', matchId: 'dead-bugs' }
    ],
    focusAreas: [
      { area: 'Abs', percentage: 40 },
      { area: 'Obliques', percentage: 30 },
      { area: 'Stability', percentage: 30 }
    ],
    tips: ['Breathe out during exertion', 'Keep lower back pressed to floor', 'Quality over quantity']
  },
  {
    id: 'cardio-hiit',
    name: 'HIIT Cardio Blast',
    difficulty: 'intermediate',
    duration: '20-25 min',
    targetMuscles: ['Full Body', 'Cardiovascular'],
    summary: 'A high-intensity interval training session to burn calories and improve cardiovascular fitness.',
    exercises: [
      { name: 'Burpees', category: 'cardio', sets: 4, reps: '10', benefit: 'Full body conditioning', matchId: 'burpees' },
      { name: 'High Knees', category: 'cardio', sets: 4, reps: '30 sec', benefit: 'Cardio and hip flexor work', matchId: 'high-knees' },
      { name: 'Jumping Jacks', category: 'cardio', sets: 4, reps: '45 sec', benefit: 'Full body warm-up and cardio', matchId: 'jumping-jacks' },
      { name: 'Mountain Climbers', category: 'core', sets: 4, reps: '30 sec', benefit: 'Core and cardio combo', matchId: 'mountain-climbers' },
      { name: 'Skater Jumps', category: 'cardio', sets: 4, reps: '20', benefit: 'Lateral power and agility', matchId: 'skaters' }
    ],
    focusAreas: [
      { area: 'Cardio', percentage: 60 },
      { area: 'Strength', percentage: 25 },
      { area: 'Agility', percentage: 15 }
    ],
    tips: ['Work at 80-90% max effort', '20-30 sec rest between exercises', 'Stay hydrated']
  },
  {
    id: 'muscle-building-advanced',
    name: 'Muscle Builder Pro',
    difficulty: 'advanced',
    duration: '60-70 min',
    targetMuscles: ['Full Body', 'All Muscle Groups'],
    summary: 'An advanced full-body workout designed for maximum muscle building and strength gains.',
    exercises: [
      { name: 'Barbell Back Squats', category: 'lower-body', sets: 5, reps: '6-8', benefit: 'Maximum leg development', matchId: 'barbell-squats' },
      { name: 'Barbell Bench Press', category: 'upper-body', sets: 5, reps: '6-8', benefit: 'Chest mass builder', matchId: 'bench-press' },
      { name: 'Pull-ups', category: 'upper-body', sets: 4, reps: '8-10', benefit: 'Back width and strength', matchId: 'pull-ups' },
      { name: 'Romanian Deadlifts', category: 'lower-body', sets: 4, reps: '8-10', benefit: 'Posterior chain power', matchId: 'deadlifts' },
      { name: 'Overhead Press', category: 'upper-body', sets: 4, reps: '8-10', benefit: 'Shoulder development', matchId: 'overhead-press' }
    ],
    focusAreas: [
      { area: 'Strength', percentage: 50 },
      { area: 'Hypertrophy', percentage: 35 },
      { area: 'Power', percentage: 15 }
    ],
    tips: ['Rest 2-3 min between heavy sets', 'Track your weights and progress', 'Eat adequate protein for recovery']
  },
  {
    id: 'flexibility-mobility',
    name: 'Flexibility & Recovery',
    difficulty: 'beginner',
    duration: '25-30 min',
    targetMuscles: ['Full Body', 'Joints', 'Muscles'],
    summary: 'A gentle recovery session focusing on flexibility, mobility, and muscle relaxation.',
    exercises: [
      { name: 'Full Body Stretch', category: 'flexibility', sets: 1, reps: '10 min', benefit: 'Overall flexibility improvement', matchId: 'stretching' },
      { name: 'Hip Opener Stretches', category: 'flexibility', sets: 1, reps: '5 min', benefit: 'Hip mobility and relief', matchId: 'hip-openers' },
      { name: 'Hamstring Stretches', category: 'flexibility', sets: 1, reps: '3 min', benefit: 'Hamstring flexibility', matchId: 'hamstring-stretches' },
      { name: 'Foam Rolling', category: 'flexibility', sets: 1, reps: '10 min', benefit: 'Muscle recovery and release', matchId: 'foam-rolling' },
      { name: 'Basic Yoga Flow', category: 'flexibility', sets: 1, reps: '5 min', benefit: 'Mind-body connection', matchId: 'yoga-poses' }
    ],
    focusAreas: [
      { area: 'Flexibility', percentage: 50 },
      { area: 'Mobility', percentage: 30 },
      { area: 'Recovery', percentage: 20 }
    ],
    tips: ['Never force a stretch', 'Breathe deeply and relax', 'Great for rest days or post-workout']
  },
  {
    id: 'weight-loss',
    name: 'Fat Burning Circuit',
    difficulty: 'intermediate',
    duration: '35-45 min',
    targetMuscles: ['Full Body'],
    summary: 'A high-energy circuit designed to maximize calorie burn and boost metabolism.',
    exercises: [
      { name: 'Burpees', category: 'cardio', sets: 3, reps: '12', benefit: 'Maximum calorie burn', matchId: 'burpees' },
      { name: 'Kettlebell Swings', category: 'full-body', sets: 3, reps: '15', benefit: 'Posterior chain power and cardio', matchId: 'kettlebell-swings' },
      { name: 'Thrusters', category: 'full-body', sets: 3, reps: '12', benefit: 'Full body strength and cardio', matchId: 'thrusters' },
      { name: 'Mountain Climbers', category: 'core', sets: 3, reps: '45 sec', benefit: 'Core and cardio combo', matchId: 'mountain-climbers' },
      { name: 'Jumping Jacks', category: 'cardio', sets: 3, reps: '60 sec', benefit: 'Active recovery and cardio', matchId: 'jumping-jacks' }
    ],
    focusAreas: [
      { area: 'Cardio', percentage: 45 },
      { area: 'Strength', percentage: 35 },
      { area: 'Endurance', percentage: 20 }
    ],
    tips: ['Minimal rest between exercises', 'Keep heart rate elevated', 'Combine with healthy nutrition']
  }
];

export const getRecommendedTemplate = (
  fitnessLevel: string,
  goals: string[],
  targetMuscles: string[]
): FallbackWorkoutPlan => {
  // Smart template selection based on user preferences
  let bestMatch = fallbackWorkoutTemplates[0];
  let bestScore = 0;

  for (const template of fallbackWorkoutTemplates) {
    let score = 0;

    // Match difficulty
    if (template.difficulty === fitnessLevel) score += 3;
    if (template.difficulty === 'intermediate' && fitnessLevel === 'beginner') score += 1;
    if (template.difficulty === 'beginner' && fitnessLevel === 'intermediate') score += 1;

    // Match goals
    if (goals.includes('Build Muscle') && (template.id.includes('muscle') || template.id.includes('upper') || template.id.includes('lower'))) score += 2;
    if (goals.includes('Lose Weight') && (template.id.includes('cardio') || template.id.includes('hiit') || template.id.includes('weight'))) score += 2;
    if (goals.includes('Flexibility') && template.id.includes('flexibility')) score += 2;
    if (goals.includes('Endurance') && (template.id.includes('cardio') || template.id.includes('hiit'))) score += 2;

    // Match target muscles
    const templateMuscles = template.targetMuscles.map(m => m.toLowerCase());
    for (const muscle of targetMuscles) {
      if (templateMuscles.some(tm => tm.includes(muscle.toLowerCase()))) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  }

  return bestMatch;
};
