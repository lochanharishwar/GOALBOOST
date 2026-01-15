import { Exercise } from '@/types/exercise';

export const lowerBodyExercises: Exercise[] = [
  // QUADRICEPS EXERCISES
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=400&fit=crop',
    steps: [
      'Stand with feet shoulder-width apart',
      'Keep chest up and core engaged',
      'Lower body by bending at hips and knees',
      'Go down until thighs are parallel',
      'Push through heels to stand'
    ],
    benefits: ['Builds leg strength', 'Improves mobility', 'Functional movement'],
    tips: ['Keep knees aligned with toes', 'Don\'t let knees cave', 'Weight on heels']
  },
  {
    id: 'barbell-squats',
    name: 'Barbell Back Squats',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '4 sets of 6-10 reps',
    equipment: ['Barbell', 'Squat rack', 'Weight plates'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core', 'Lower Back'],
    image: 'https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=500&h=400&fit=crop',
    steps: [
      'Position bar on upper back',
      'Unrack and step back',
      'Descend by bending hips and knees',
      'Go to parallel or below',
      'Drive up through heels'
    ],
    benefits: ['Maximum leg development', 'Full body strength', 'Hormone response'],
    tips: ['Keep chest up', 'Brace core hard', 'Control the descent']
  },
  {
    id: 'front-squats',
    name: 'Front Squats',
    category: 'lower-body',
    difficulty: 'advanced',
    duration: '4 sets of 6-8 reps',
    equipment: ['Barbell', 'Squat rack'],
    targetMuscles: ['Quadriceps', 'Core', 'Upper Back', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&h=400&fit=crop',
    steps: [
      'Position bar on front of shoulders',
      'Keep elbows high throughout',
      'Descend with upright torso',
      'Drive up through the full foot'
    ],
    benefits: ['Quad emphasis', 'Core strength', 'Mobility improvement'],
    tips: ['Keep elbows up', 'Stay upright', 'Work on wrist flexibility']
  },
  {
    id: 'goblet-squats',
    name: 'Goblet Squats',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps',
    equipment: ['Dumbbell', 'Kettlebell'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop',
    steps: [
      'Hold weight at chest level',
      'Stand with feet shoulder-width apart',
      'Squat down keeping chest up',
      'Go as deep as comfortable',
      'Stand back up'
    ],
    benefits: ['Great for beginners', 'Teaches squat form', 'Core activation'],
    tips: ['Keep weight close to chest', 'Elbows inside knees at bottom', 'Stay upright']
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['Bench', 'Dumbbells (optional)'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&h=400&fit=crop',
    steps: [
      'Place back foot on bench behind you',
      'Lower down by bending front knee',
      'Keep torso upright',
      'Drive up through front foot'
    ],
    benefits: ['Unilateral strength', 'Balance improvement', 'Hip mobility'],
    tips: ['Keep front knee over ankle', 'Don\'t lean too far forward', 'Control the descent']
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '4 sets of 10-15 reps',
    equipment: ['Leg press machine'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1597452485677-d661670d9640?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with back against pad',
      'Place feet shoulder-width on platform',
      'Lower weight by bending knees',
      'Push platform back to start'
    ],
    benefits: ['Safe heavy loading', 'Quad development', 'Less lower back stress'],
    tips: ['Don\'t lock knees at top', 'Keep lower back on pad', 'Full range of motion']
  },
  {
    id: 'hack-squats',
    name: 'Hack Squats',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps',
    equipment: ['Hack squat machine'],
    targetMuscles: ['Quadriceps', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=500&h=400&fit=crop',
    steps: [
      'Stand on platform with shoulders under pads',
      'Lower by bending knees',
      'Go to parallel or below',
      'Push back up to start'
    ],
    benefits: ['Quad isolation', 'Safe for back', 'Heavy loading possible'],
    tips: ['Keep back against pad', 'Control the descent', 'Don\'t bounce at bottom']
  },
  {
    id: 'sissy-squats',
    name: 'Sissy Squats',
    category: 'lower-body',
    difficulty: 'advanced',
    duration: '3 sets of 10-15 reps',
    equipment: ['Sissy squat bench (optional)'],
    targetMuscles: ['Quadriceps'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=400&fit=crop',
    steps: [
      'Stand holding something for balance',
      'Rise onto toes and lean back',
      'Lower by bending knees forward',
      'Go as deep as possible',
      'Return to start'
    ],
    benefits: ['Extreme quad stretch', 'Knee strengthening', 'No equipment needed'],
    tips: ['Start with partial range', 'Hold onto something', 'Progress slowly']
  },
  {
    id: 'leg-extensions',
    name: 'Leg Extensions',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps',
    equipment: ['Leg extension machine'],
    targetMuscles: ['Quadriceps'],
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with pad on lower shins',
      'Extend legs until straight',
      'Squeeze quads at top',
      'Lower with control'
    ],
    benefits: ['Quad isolation', 'Easy to learn', 'Good for warm-up'],
    tips: ['Don\'t use too much weight', 'Control the negative', 'Full contraction at top']
  },
  {
    id: 'wall-sits',
    name: 'Wall Sits',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 30-60 seconds',
    equipment: ['Wall'],
    targetMuscles: ['Quadriceps', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Stand with back against wall',
      'Slide down until thighs parallel',
      'Keep knees at 90 degrees',
      'Hold position'
    ],
    benefits: ['Isometric strength', 'No equipment needed', 'Quad endurance'],
    tips: ['Keep back flat on wall', 'Don\'t drop below parallel', 'Breathe steadily']
  },

  // GLUTE EXERCISES
  {
    id: 'hip-thrusts',
    name: 'Barbell Hip Thrusts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps',
    equipment: ['Barbell', 'Bench', 'Pad'],
    targetMuscles: ['Glutes', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500&h=400&fit=crop',
    steps: [
      'Sit on ground with upper back on bench',
      'Roll barbell over hips',
      'Drive hips up until body straight',
      'Squeeze glutes at top',
      'Lower with control'
    ],
    benefits: ['Maximum glute activation', 'Hip extension strength', 'Athletic performance'],
    tips: ['Chin tucked throughout', 'Feet flat on floor', 'Squeeze hard at top']
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with knees bent',
      'Feet flat on floor near glutes',
      'Drive hips up squeezing glutes',
      'Hold briefly at top',
      'Lower with control'
    ],
    benefits: ['Glute activation', 'Hip mobility', 'Low impact'],
    tips: ['Push through heels', 'Don\'t hyperextend', 'Squeeze at top']
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single Leg Glute Bridge',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 12-15 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with one knee bent',
      'Extend other leg straight',
      'Drive hips up using one leg',
      'Lower with control'
    ],
    benefits: ['Unilateral strength', 'Balance improvement', 'Core stability'],
    tips: ['Keep hips level', 'Don\'t rotate', 'Full extension at top']
  },
  {
    id: 'donkey-kicks',
    name: 'Donkey Kicks',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Glutes'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=400&fit=crop',
    steps: [
      'Start on hands and knees',
      'Keep knee bent at 90 degrees',
      'Lift leg up toward ceiling',
      'Squeeze glute at top',
      'Lower with control'
    ],
    benefits: ['Glute isolation', 'No equipment', 'Good activation'],
    tips: ['Don\'t arch back', 'Keep core tight', 'Control the movement']
  },
  {
    id: 'fire-hydrants',
    name: 'Fire Hydrants',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Glute Medius', 'Hip Abductors'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=400&fit=crop',
    steps: [
      'Start on hands and knees',
      'Keep knee bent at 90 degrees',
      'Lift leg out to side',
      'Lower with control'
    ],
    benefits: ['Hip stability', 'Glute medius targeting', 'Warm-up exercise'],
    tips: ['Keep hips level', 'Don\'t rotate torso', 'Control throughout']
  },
  {
    id: 'cable-kickbacks',
    name: 'Cable Kickbacks',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps per leg',
    equipment: ['Cable machine', 'Ankle strap'],
    targetMuscles: ['Glutes'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Attach ankle strap to low cable',
      'Face machine holding for support',
      'Kick leg straight back',
      'Squeeze glute at top',
      'Return with control'
    ],
    benefits: ['Constant tension', 'Glute isolation', 'Adjustable resistance'],
    tips: ['Don\'t swing', 'Keep core engaged', 'Control the negative']
  },
  {
    id: 'step-ups',
    name: 'Step Ups',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps per leg',
    equipment: ['Box', 'Bench', 'Step'],
    targetMuscles: ['Glutes', 'Quadriceps', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1580086319619-3ed498161c77?w=500&h=400&fit=crop',
    steps: [
      'Stand facing elevated surface',
      'Step up with one foot',
      'Drive through heel to stand',
      'Step back down with control'
    ],
    benefits: ['Functional movement', 'Unilateral strength', 'Balance improvement'],
    tips: ['Don\'t push off back foot', 'Keep torso upright', 'Control the descent']
  },

  // HAMSTRING EXERCISES
  {
    id: 'deadlifts',
    name: 'Romanian Deadlifts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '4 sets of 6-8 reps',
    equipment: ['Barbell', 'Weight plates'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower back', 'Core'],
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&h=400&fit=crop',
    steps: [
      'Stand holding barbell with overhand grip',
      'Keep knees slightly bent',
      'Hinge at hips, pushing hips back',
      'Lower until stretch in hamstrings',
      'Drive hips forward to stand'
    ],
    benefits: ['Hamstring development', 'Hip hinge pattern', 'Posterior chain strength'],
    tips: ['Keep back flat', 'Push hips back', 'Bar stays close to legs']
  },
  {
    id: 'conventional-deadlifts',
    name: 'Conventional Deadlifts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '4 sets of 5-8 reps',
    equipment: ['Barbell', 'Weight plates'],
    targetMuscles: ['Full Posterior Chain', 'Quads', 'Core', 'Back'],
    image: 'https://images.unsplash.com/photo-1550259979-ed79b48d2a30?w=500&h=400&fit=crop',
    steps: [
      'Stand with feet hip-width, bar over mid-foot',
      'Hinge and grip bar outside legs',
      'Brace core and drive through floor',
      'Stand up straight',
      'Lower with control'
    ],
    benefits: ['Full body strength', 'Maximum loading', 'Functional pattern'],
    tips: ['Keep bar close', 'Don\'t round back', 'Drive through heels']
  },
  {
    id: 'sumo-deadlifts',
    name: 'Sumo Deadlifts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '4 sets of 5-8 reps',
    equipment: ['Barbell', 'Weight plates'],
    targetMuscles: ['Glutes', 'Adductors', 'Hamstrings', 'Quads'],
    image: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=500&h=400&fit=crop',
    steps: [
      'Take wide stance with toes pointed out',
      'Grip bar with arms inside legs',
      'Drive through floor spreading feet',
      'Stand up straight',
      'Lower with control'
    ],
    benefits: ['Reduced back stress', 'Hip emphasis', 'Different stimulus'],
    tips: ['Push knees out', 'Keep chest up', 'Open hips at top']
  },
  {
    id: 'stiff-leg-deadlifts',
    name: 'Stiff Leg Deadlifts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps',
    equipment: ['Barbell', 'Dumbbells'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    image: 'https://images.unsplash.com/photo-1598575436892-042c66d85c4e?w=500&h=400&fit=crop',
    steps: [
      'Hold weight with legs nearly straight',
      'Hinge at hips lowering weight',
      'Keep legs straight (slight bend okay)',
      'Feel deep hamstring stretch',
      'Return to standing'
    ],
    benefits: ['Extreme hamstring stretch', 'Flexibility improvement', 'Posterior chain'],
    tips: ['Don\'t round back', 'Control the stretch', 'Don\'t go too heavy']
  },
  {
    id: 'single-leg-deadlifts',
    name: 'Single Leg Deadlifts',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['Dumbbell', 'Kettlebell'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Core'],
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&h=400&fit=crop',
    steps: [
      'Stand on one leg holding weight',
      'Hinge forward raising back leg',
      'Keep back leg and torso aligned',
      'Return to standing'
    ],
    benefits: ['Balance training', 'Core stability', 'Unilateral strength'],
    tips: ['Keep hips level', 'Slight knee bend', 'Control throughout']
  },
  {
    id: 'leg-curls',
    name: 'Lying Leg Curls',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps',
    equipment: ['Leg curl machine'],
    targetMuscles: ['Hamstrings'],
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=500&h=400&fit=crop',
    steps: [
      'Lie face down on machine',
      'Position pad above heels',
      'Curl legs up toward glutes',
      'Lower with control'
    ],
    benefits: ['Hamstring isolation', 'Easy to learn', 'Knee flexion strength'],
    tips: ['Don\'t lift hips', 'Full range of motion', 'Control the negative']
  },
  {
    id: 'seated-leg-curls',
    name: 'Seated Leg Curls',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps',
    equipment: ['Seated leg curl machine'],
    targetMuscles: ['Hamstrings'],
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with legs extended',
      'Position pad above ankles',
      'Curl legs down and back',
      'Return with control'
    ],
    benefits: ['Comfortable position', 'Good stretch', 'Isolated movement'],
    tips: ['Keep back against pad', 'Full contraction', 'Control the weight']
  },
  {
    id: 'nordic-curls',
    name: 'Nordic Curls',
    category: 'lower-body',
    difficulty: 'advanced',
    duration: '3 sets of 5-10 reps',
    equipment: ['Partner', 'Anchor point'],
    targetMuscles: ['Hamstrings'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Kneel with ankles secured',
      'Keep body straight from knees to head',
      'Lower slowly toward ground',
      'Catch yourself and push back up'
    ],
    benefits: ['Eccentric strength', 'Injury prevention', 'Advanced training'],
    tips: ['Start with negatives only', 'Keep hips extended', 'Progress gradually']
  },
  {
    id: 'good-mornings',
    name: 'Good Mornings',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps',
    equipment: ['Barbell'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    image: 'https://images.unsplash.com/photo-1598575436892-042c66d85c4e?w=500&h=400&fit=crop',
    steps: [
      'Position bar on upper back',
      'Keep slight knee bend',
      'Hinge at hips pushing them back',
      'Lower until stretch in hamstrings',
      'Return to standing'
    ],
    benefits: ['Posterior chain development', 'Hip hinge pattern', 'Core strength'],
    tips: ['Keep back flat', 'Don\'t go too heavy', 'Control throughout']
  },

  // CALF EXERCISES
  {
    id: 'calf-raises',
    name: 'Standing Calf Raises',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['Calf raise machine', 'Step'],
    targetMuscles: ['Gastrocnemius', 'Soleus'],
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=500&h=400&fit=crop',
    steps: [
      'Stand on edge of step on balls of feet',
      'Lower heels below step level',
      'Rise up onto toes',
      'Hold briefly at top',
      'Lower with control'
    ],
    benefits: ['Calf development', 'Ankle strength', 'Simple exercise'],
    tips: ['Full range of motion', 'Pause at top', 'Control the negative']
  },
  {
    id: 'seated-calf-raises',
    name: 'Seated Calf Raises',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['Seated calf raise machine'],
    targetMuscles: ['Soleus'],
    image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with pad on thighs',
      'Place balls of feet on platform',
      'Lower heels for stretch',
      'Push up onto toes',
      'Lower with control'
    ],
    benefits: ['Soleus focus', 'Knee bent position', 'Good stretch'],
    tips: ['Full range of motion', 'Pause at top', 'Control throughout']
  },
  {
    id: 'donkey-calf-raises',
    name: 'Donkey Calf Raises',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 15-20 reps',
    equipment: ['Donkey calf machine', 'Partner'],
    targetMuscles: ['Gastrocnemius'],
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=500&h=400&fit=crop',
    steps: [
      'Bend forward at hips on machine',
      'Place balls of feet on platform',
      'Lower heels for stretch',
      'Push up onto toes',
      'Lower with control'
    ],
    benefits: ['Great stretch', 'Classic exercise', 'Calf development'],
    tips: ['Keep legs straight', 'Full range of motion', 'Control the movement']
  },
  {
    id: 'single-leg-calf-raises',
    name: 'Single Leg Calf Raises',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 12-15 reps per leg',
    equipment: ['Step', 'Dumbbell'],
    targetMuscles: ['Calves'],
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=500&h=400&fit=crop',
    steps: [
      'Stand on edge of step on one foot',
      'Hold wall or something for balance',
      'Lower heel below step',
      'Rise up onto toes',
      'Switch legs after set'
    ],
    benefits: ['Unilateral training', 'Balance improvement', 'Focused work'],
    tips: ['Full range of motion', 'Hold at top', 'Control throughout']
  },

  // LUNGE VARIATIONS
  {
    id: 'lunges',
    name: 'Forward Lunges',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&h=400&fit=crop',
    steps: [
      'Stand tall with feet hip-width',
      'Step forward into lunge',
      'Lower until both knees at 90 degrees',
      'Push off front foot to return'
    ],
    benefits: ['Functional movement', 'Balance training', 'Unilateral strength'],
    tips: ['Keep front knee over ankle', 'Stay upright', 'Control the movement']
  },
  {
    id: 'reverse-lunges',
    name: 'Reverse Lunges',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None', 'Dumbbells'],
    targetMuscles: ['Glutes', 'Quadriceps', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&h=400&fit=crop',
    steps: [
      'Stand tall',
      'Step backward into lunge',
      'Lower until both knees at 90 degrees',
      'Push off back foot to return'
    ],
    benefits: ['Easier on knees', 'Glute emphasis', 'Balance friendly'],
    tips: ['Control the step back', 'Keep torso upright', 'Don\'t let knee touch ground']
  },
  {
    id: 'walking-lunges',
    name: 'Walking Lunges',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None', 'Dumbbells'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Step forward into lunge',
      'Lower until both knees at 90 degrees',
      'Step through with back leg',
      'Continue walking forward'
    ],
    benefits: ['Continuous movement', 'Cardio element', 'Functional strength'],
    tips: ['Keep steady pace', 'Stay upright', 'Control each step']
  },
  {
    id: 'lateral-lunges',
    name: 'Lateral Lunges',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 10-12 reps per side',
    equipment: ['None', 'Dumbbells'],
    targetMuscles: ['Adductors', 'Glutes', 'Quadriceps'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop',
    steps: [
      'Stand with feet together',
      'Step wide to one side',
      'Bend stepping knee, keep other straight',
      'Push back to start'
    ],
    benefits: ['Lateral strength', 'Hip mobility', 'Inner thigh work'],
    tips: ['Keep chest up', 'Toes point forward', 'Push through heel']
  },
  {
    id: 'curtsy-lunges',
    name: 'Curtsy Lunges',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None', 'Dumbbells'],
    targetMuscles: ['Glutes', 'Quadriceps', 'Adductors'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=400&fit=crop',
    steps: [
      'Stand with feet hip-width',
      'Step one leg behind and across',
      'Lower into a curtsy position',
      'Return to start'
    ],
    benefits: ['Glute medius targeting', 'Balance challenge', 'Hip stability'],
    tips: ['Don\'t twist too much', 'Keep weight on front leg', 'Control the movement']
  },
  {
    id: 'jump-lunges',
    name: 'Jump Lunges',
    category: 'lower-body',
    difficulty: 'advanced',
    duration: '3 sets of 10-12 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1601422407692-ec73548d8f34?w=500&h=400&fit=crop',
    steps: [
      'Start in lunge position',
      'Jump and switch legs mid-air',
      'Land softly in opposite lunge',
      'Continue alternating'
    ],
    benefits: ['Explosive power', 'Cardio conditioning', 'Athletic performance'],
    tips: ['Land softly', 'Keep core tight', 'Start slow for form']
  },

  // HIP EXERCISES
  {
    id: 'hip-abduction',
    name: 'Hip Abduction Machine',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['Hip abduction machine'],
    targetMuscles: ['Glute Medius', 'Hip Abductors'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with pads on outer thighs',
      'Push legs apart against resistance',
      'Pause at full extension',
      'Return with control'
    ],
    benefits: ['Hip stability', 'Glute medius isolation', 'Easy to use'],
    tips: ['Don\'t use momentum', 'Control the negative', 'Full range of motion']
  },
  {
    id: 'hip-adduction',
    name: 'Hip Adduction Machine',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['Hip adduction machine'],
    targetMuscles: ['Adductors', 'Inner Thighs'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Sit in machine with pads on inner thighs',
      'Squeeze legs together against resistance',
      'Pause at full contraction',
      'Return with control'
    ],
    benefits: ['Inner thigh strength', 'Hip stability', 'Easy isolation'],
    tips: ['Squeeze at the bottom', 'Control the movement', 'Don\'t use momentum']
  },
  {
    id: 'clamshells',
    name: 'Clamshells',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps per side',
    equipment: ['Resistance band (optional)'],
    targetMuscles: ['Glute Medius', 'Hip External Rotators'],
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=400&fit=crop',
    steps: [
      'Lie on side with knees bent at 90 degrees',
      'Keep feet together',
      'Rotate top knee up toward ceiling',
      'Lower with control'
    ],
    benefits: ['Hip stability', 'Glute activation', 'Physical therapy exercise'],
    tips: ['Don\'t rotate pelvis', 'Keep feet together', 'Control the movement']
  },
  {
    id: 'banded-walks',
    name: 'Banded Lateral Walks',
    category: 'lower-body',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 steps per direction',
    equipment: ['Resistance band'],
    targetMuscles: ['Glute Medius', 'Hip Abductors'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop',
    steps: [
      'Place band above knees or ankles',
      'Get into half squat position',
      'Step sideways maintaining tension',
      'Don\'t let knees cave in'
    ],
    benefits: ['Glute activation', 'Hip stability', 'Warm-up exercise'],
    tips: ['Stay low', 'Keep tension on band', 'Control each step']
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 8-10 reps',
    equipment: ['Plyo box'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Hamstrings'],
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&h=400&fit=crop',
    steps: [
      'Stand facing box',
      'Swing arms back and bend knees',
      'Jump onto box landing softly',
      'Stand up fully on box',
      'Step or jump down'
    ],
    benefits: ['Explosive power', 'Athletic performance', 'Lower body strength'],
    tips: ['Land softly', 'Start with lower box', 'Step down to reduce impact']
  },
  {
    id: 'jump-squats',
    name: 'Jump Squats',
    category: 'lower-body',
    difficulty: 'intermediate',
    duration: '3 sets of 10-15 reps',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves'],
    image: 'https://images.unsplash.com/photo-1601422407692-ec73548d8f34?w=500&h=400&fit=crop',
    steps: [
      'Start in squat position',
      'Explode up jumping high',
      'Land softly back into squat',
      'Repeat immediately'
    ],
    benefits: ['Explosive power', 'Cardio conditioning', 'No equipment needed'],
    tips: ['Land with soft knees', 'Keep core tight', 'Full squat depth']
  },
  {
    id: 'pistol-squats',
    name: 'Pistol Squats',
    category: 'lower-body',
    difficulty: 'advanced',
    duration: '3 sets of 5-8 reps per leg',
    equipment: ['None'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=400&fit=crop',
    steps: [
      'Stand on one leg',
      'Extend other leg in front',
      'Lower into deep single leg squat',
      'Push back up to standing'
    ],
    benefits: ['Ultimate leg strength', 'Balance mastery', 'Mobility demonstration'],
    tips: ['Start with assisted versions', 'Work on ankle mobility', 'Progress gradually']
  }
];
