import { Exercise } from '@/types/exercise';

export const coreExercises: Exercise[] = [
  // PLANK VARIATIONS
  {
    id: 'plank',
    name: 'Forearm Plank',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-60 seconds',
    equipment: ['None'],
    targetMuscles: ['Core', 'Shoulders', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&h=400&fit=crop',
    steps: [
      'Start on forearms and toes',
      'Keep body in straight line',
      'Engage core and squeeze glutes',
      'Hold position without sagging',
      'Breathe steadily throughout'
    ],
    benefits: ['Core stability', 'Full body engagement', 'No equipment needed'],
    tips: ['Don\'t let hips sag', 'Keep neck neutral', 'Squeeze everything tight']
  },
  {
    id: 'high-plank',
    name: 'High Plank',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-60 seconds',
    equipment: ['None'],
    targetMuscles: ['Core', 'Shoulders', 'Triceps'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in push-up position',
      'Arms straight, hands under shoulders',
      'Keep body in straight line',
      'Hold position',
      'Breathe steadily'
    ],
    benefits: ['Core strength', 'Arm endurance', 'Foundation for push-ups'],
    tips: ['Hands directly under shoulders', 'Don\'t lock elbows aggressively', 'Engage core']
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 30-45 seconds per side',
    equipment: ['None'],
    targetMuscles: ['Obliques', 'Core', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    steps: [
      'Lie on side with forearm on ground',
      'Stack feet or stagger them',
      'Lift hips off ground',
      'Keep body in straight line',
      'Hold position'
    ],
    benefits: ['Oblique strength', 'Hip stability', 'Balance improvement'],
    tips: ['Keep hips lifted', 'Don\'t rotate forward', 'Stack or stagger feet']
  },
  {
    id: 'plank-shoulder-taps',
    name: 'Plank Shoulder Taps',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-30 reps',
    equipment: ['None'],
    targetMuscles: ['Core', 'Shoulders', 'Anti-rotation'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in high plank position',
      'Tap right hand to left shoulder',
      'Return and tap left to right',
      'Keep hips still throughout',
      'Alternate sides'
    ],
    benefits: ['Anti-rotation strength', 'Shoulder stability', 'Core challenge'],
    tips: ['Minimize hip rotation', 'Go slow', 'Wider feet for more stability']
  },
  {
    id: 'plank-to-push-up',
    name: 'Plank to Push-up',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 10-15 reps',
    equipment: ['None'],
    targetMuscles: ['Core', 'Triceps', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500&h=400&fit=crop',
    steps: [
      'Start in forearm plank',
      'Place right hand, then left hand',
      'Push up to high plank',
      'Lower back to forearms',
      'Alternate leading hand'
    ],
    benefits: ['Dynamic core work', 'Tricep strength', 'Coordination'],
    tips: ['Keep hips stable', 'Alternate leading arm', 'Controlled tempo']
  },
  {
    id: 'plank-jacks',
    name: 'Plank Jacks',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-30 reps',
    equipment: ['None'],
    targetMuscles: ['Core', 'Hip Abductors', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in high plank position',
      'Jump feet out wide',
      'Jump feet back together',
      'Keep hips stable',
      'Continue at steady pace'
    ],
    benefits: ['Cardio core work', 'Hip strength', 'Coordination'],
    tips: ['Keep hips level', 'Land softly', 'Maintain plank form']
  },
  {
    id: 'plank-hip-dips',
    name: 'Plank Hip Dips',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-30 reps',
    equipment: ['None'],
    targetMuscles: ['Obliques', 'Core'],
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&h=400&fit=crop',
    steps: [
      'Start in forearm plank',
      'Rotate hips to one side',
      'Dip hip toward ground',
      'Return to center',
      'Repeat other side'
    ],
    benefits: ['Oblique targeting', 'Spinal mobility', 'Core endurance'],
    tips: ['Control the rotation', 'Don\'t touch ground', 'Keep shoulders stable']
  },

  // CRUNCH VARIATIONS
  {
    id: 'crunches',
    name: 'Basic Crunches',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Upper Abs'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with knees bent',
      'Place hands behind head',
      'Lift shoulders off ground',
      'Squeeze abs at top',
      'Lower with control'
    ],
    benefits: ['Ab isolation', 'Simple movement', 'Good for beginners'],
    tips: ['Don\'t pull on neck', 'Exhale on the way up', 'Control the descent']
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-30 reps',
    equipment: ['None'],
    targetMuscles: ['Obliques', 'Rectus Abdominis'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with hands behind head',
      'Lift legs with knees bent at 90 degrees',
      'Bring right elbow to left knee',
      'Extend right leg',
      'Alternate sides in pedaling motion'
    ],
    benefits: ['Targets obliques', 'Dynamic movement', 'Full ab engagement'],
    tips: ['Don\'t rush', 'Full rotation', 'Keep lower back pressed down']
  },
  {
    id: 'reverse-crunches',
    name: 'Reverse Crunches',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Lower Abs'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with legs raised',
      'Knees bent at 90 degrees',
      'Curl hips off the ground',
      'Bring knees toward chest',
      'Lower with control'
    ],
    benefits: ['Lower ab focus', 'Easy on neck', 'Good form foundation'],
    tips: ['Don\'t use momentum', 'Keep movement controlled', 'Focus on lower abs']
  },
  {
    id: 'cable-crunches',
    name: 'Cable Crunches',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 15-20 reps',
    equipment: ['Cable machine', 'Rope attachment'],
    targetMuscles: ['Rectus Abdominis'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Kneel facing cable with rope behind head',
      'Crunch down bringing elbows to thighs',
      'Keep hips stationary',
      'Squeeze abs at bottom',
      'Return with control'
    ],
    benefits: ['Progressive overload', 'Great contraction', 'Adjustable resistance'],
    tips: ['Keep hips still', 'Curl spine', 'Don\'t pull with arms']
  },
  {
    id: 'decline-crunches',
    name: 'Decline Crunches',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 15-20 reps',
    equipment: ['Decline bench'],
    targetMuscles: ['Upper Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Secure feet at top of decline bench',
      'Cross arms over chest or behind head',
      'Lower back down with control',
      'Crunch up squeezing abs',
      'Control the descent'
    ],
    benefits: ['Increased difficulty', 'Greater range of motion', 'Ab development'],
    tips: ['Don\'t go all the way down', 'Control throughout', 'Don\'t use momentum']
  },

  // LEG RAISE VARIATIONS
  {
    id: 'leg-raises',
    name: 'Lying Leg Raises',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 12-15 reps',
    equipment: ['None'],
    targetMuscles: ['Lower Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    steps: [
      'Lie flat on back',
      'Place hands under lower back for support',
      'Lift legs up to 90 degrees',
      'Lower slowly without touching ground',
      'Repeat'
    ],
    benefits: ['Lower ab targeting', 'Hip flexor strength', 'Simple movement'],
    tips: ['Keep lower back pressed down', 'Control the descent', 'Don\'t swing legs']
  },
  {
    id: 'hanging-leg-raises',
    name: 'Hanging Leg Raises',
    category: 'core',
    difficulty: 'advanced',
    duration: '3 sets of 10-15 reps',
    equipment: ['Pull-up bar'],
    targetMuscles: ['Lower Abs', 'Hip Flexors', 'Grip'],
    image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500&h=400&fit=crop',
    steps: [
      'Hang from bar with overhand grip',
      'Keep legs straight or slightly bent',
      'Raise legs to 90 degrees',
      'Lower with control',
      'Avoid swinging'
    ],
    benefits: ['Advanced ab exercise', 'Grip strength', 'Full core engagement'],
    tips: ['Don\'t swing', 'Control throughout', 'Bend knees to make easier']
  },
  {
    id: 'hanging-knee-raises',
    name: 'Hanging Knee Raises',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 12-15 reps',
    equipment: ['Pull-up bar'],
    targetMuscles: ['Lower Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500&h=400&fit=crop',
    steps: [
      'Hang from bar with overhand grip',
      'Bring knees up toward chest',
      'Curl pelvis slightly at top',
      'Lower with control',
      'Avoid swinging'
    ],
    benefits: ['Easier than straight leg version', 'Lower ab targeting', 'Grip training'],
    tips: ['Curl pelvis for ab engagement', 'Control the movement', 'Don\'t swing']
  },
  {
    id: 'flutter-kicks',
    name: 'Flutter Kicks',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Lower Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with hands under hips',
      'Lift both legs slightly off ground',
      'Alternate kicking legs up and down',
      'Keep legs relatively straight',
      'Continue for set duration'
    ],
    benefits: ['Cardio element', 'Lower ab endurance', 'Hip flexor work'],
    tips: ['Keep lower back pressed down', 'Small controlled kicks', 'Breathe steadily']
  },
  {
    id: 'scissor-kicks',
    name: 'Scissor Kicks',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Lower Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with hands under hips',
      'Lift both legs off ground',
      'Cross legs over each other alternating',
      'Keep movement controlled',
      'Continue for set duration'
    ],
    benefits: ['Inner thigh engagement', 'Lower ab work', 'Coordination'],
    tips: ['Keep legs straight', 'Control the crosses', 'Don\'t let legs drop']
  },

  // TWISTING/ROTATION EXERCISES
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-30 reps',
    equipment: ['Weight plate', 'Dumbbell', 'Medicine ball'],
    targetMuscles: ['Obliques', 'Rectus Abdominis'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop',
    steps: [
      'Sit with knees bent, feet off ground',
      'Lean back at 45 degree angle',
      'Hold weight at chest',
      'Rotate torso side to side',
      'Touch weight to ground each side'
    ],
    benefits: ['Oblique development', 'Rotational strength', 'Core stability'],
    tips: ['Keep feet elevated', 'Full rotation', 'Control the twist']
  },
  {
    id: 'woodchoppers',
    name: 'Cable Woodchoppers',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 12-15 reps per side',
    equipment: ['Cable machine'],
    targetMuscles: ['Obliques', 'Core', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Set cable at high or low position',
      'Stand sideways to machine',
      'Pull cable diagonally across body',
      'Rotate through core',
      'Return with control'
    ],
    benefits: ['Functional rotation', 'Athletic movement', 'Oblique strength'],
    tips: ['Keep arms relatively straight', 'Rotate through hips and core', 'Control the return']
  },
  {
    id: 'pallof-press',
    name: 'Pallof Press',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 10-12 reps per side',
    equipment: ['Cable machine', 'Resistance band'],
    targetMuscles: ['Core', 'Anti-rotation'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&h=400&fit=crop',
    steps: [
      'Stand sideways to cable',
      'Hold handle at chest',
      'Press handle straight out',
      'Resist rotation',
      'Return to chest'
    ],
    benefits: ['Anti-rotation strength', 'Core stability', 'Functional training'],
    tips: ['Don\'t let body rotate', 'Brace core hard', 'Slow controlled reps']
  },
  {
    id: 'medicine-ball-slams',
    name: 'Medicine Ball Slams',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 10-15 reps',
    equipment: ['Slam ball'],
    targetMuscles: ['Core', 'Shoulders', 'Full Body'],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=400&fit=crop',
    steps: [
      'Hold ball overhead',
      'Slam ball down to ground with force',
      'Use full body power',
      'Catch on bounce or pick up',
      'Repeat'
    ],
    benefits: ['Power development', 'Full body exercise', 'Stress relief'],
    tips: ['Use your whole body', 'Slam with intent', 'Catch and repeat quickly']
  },

  // MOUNTAIN CLIMBER VARIATIONS
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 30-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Core', 'Hip Flexors', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in high plank position',
      'Drive one knee toward chest',
      'Quickly switch legs',
      'Keep hips level',
      'Continue at steady pace'
    ],
    benefits: ['Cardio and core', 'Full body workout', 'No equipment needed'],
    tips: ['Keep hips down', 'Drive knees forward', 'Maintain steady pace']
  },
  {
    id: 'cross-body-mountain-climbers',
    name: 'Cross Body Mountain Climbers',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 30-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Obliques', 'Core', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in high plank position',
      'Drive right knee toward left elbow',
      'Return and switch sides',
      'Keep hips relatively level',
      'Continue alternating'
    ],
    benefits: ['Oblique engagement', 'Core rotation', 'Cardio element'],
    tips: ['Touch knee to opposite elbow', 'Keep controlled', 'Don\'t rotate too much']
  },
  {
    id: 'slow-mountain-climbers',
    name: 'Slow Mountain Climbers',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 10-15 reps per side',
    equipment: ['None'],
    targetMuscles: ['Core', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop',
    steps: [
      'Start in high plank position',
      'Slowly bring knee to chest',
      'Hold briefly',
      'Slowly return',
      'Alternate sides'
    ],
    benefits: ['Focused core work', 'Hip flexibility', 'Controlled movement'],
    tips: ['Very slow and controlled', 'Feel the ab contraction', 'Full range of motion']
  },

  // OTHER CORE EXERCISES
  {
    id: 'dead-bugs',
    name: 'Dead Bugs',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 10-15 reps per side',
    equipment: ['None'],
    targetMuscles: ['Core', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with arms up and knees at 90 degrees',
      'Lower opposite arm and leg toward ground',
      'Keep lower back pressed to floor',
      'Return and switch sides',
      'Alternate in controlled manner'
    ],
    benefits: ['Core stability', 'Coordination', 'Low impact'],
    tips: ['Keep lower back flat', 'Move slowly', 'Breathe out on extension']
  },
  {
    id: 'bird-dogs',
    name: 'Bird Dogs',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 10-15 reps per side',
    equipment: ['None'],
    targetMuscles: ['Core', 'Lower Back', 'Glutes'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=400&fit=crop',
    steps: [
      'Start on hands and knees',
      'Extend opposite arm and leg',
      'Keep back flat and hips level',
      'Hold briefly at top',
      'Return and switch sides'
    ],
    benefits: ['Core stability', 'Back health', 'Balance improvement'],
    tips: ['Move slowly', 'Keep hips level', 'Full extension']
  },
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    difficulty: 'intermediate',
    duration: '3 sets of 20-45 seconds',
    equipment: ['None'],
    targetMuscles: ['Full Core'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with arms overhead',
      'Lift legs and shoulders off ground',
      'Press lower back into floor',
      'Hold banana shape position',
      'Maintain steady breathing'
    ],
    benefits: ['Gymnastics fundamental', 'Full core engagement', 'Posture improvement'],
    tips: ['Press back flat', 'Tuck chin slightly', 'Start with bent knees if needed']
  },
  {
    id: 'v-ups',
    name: 'V-Ups',
    category: 'core',
    difficulty: 'advanced',
    duration: '3 sets of 10-15 reps',
    equipment: ['None'],
    targetMuscles: ['Upper Abs', 'Lower Abs', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie flat with arms overhead',
      'Simultaneously lift legs and torso',
      'Touch hands to feet at top',
      'Lower back down with control',
      'Repeat'
    ],
    benefits: ['Full ab contraction', 'Challenging exercise', 'Coordination'],
    tips: ['Keep legs straight', 'Reach for feet', 'Control the descent']
  },
  {
    id: 'toe-touches',
    name: 'Toe Touches',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Upper Abs'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with legs vertical',
      'Reach hands toward toes',
      'Lift shoulders off ground',
      'Touch toes if possible',
      'Lower with control'
    ],
    benefits: ['Upper ab focus', 'Simple movement', 'Good for beginners'],
    tips: ['Keep legs vertical', 'Exhale on the way up', 'Controlled reps']
  },
  {
    id: 'ab-wheel-rollouts',
    name: 'Ab Wheel Rollouts',
    category: 'core',
    difficulty: 'advanced',
    duration: '3 sets of 8-12 reps',
    equipment: ['Ab wheel'],
    targetMuscles: ['Full Core', 'Lats', 'Shoulders'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Kneel holding ab wheel',
      'Roll wheel forward extending body',
      'Keep core tight throughout',
      'Roll back to starting position',
      'Maintain control'
    ],
    benefits: ['Extreme core challenge', 'Full body exercise', 'Strength building'],
    tips: ['Start with small range', 'Keep hips tucked', 'Don\'t collapse at end']
  },
  {
    id: 'sit-ups',
    name: 'Sit-Ups',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 15-20 reps',
    equipment: ['None'],
    targetMuscles: ['Rectus Abdominis', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Lie on back with knees bent',
      'Feet flat or secured',
      'Sit all the way up',
      'Lower back down with control',
      'Repeat'
    ],
    benefits: ['Classic ab exercise', 'Full range of motion', 'Simple movement'],
    tips: ['Don\'t pull on neck', 'Control the descent', 'Engage core throughout']
  },
  {
    id: 'dragon-flags',
    name: 'Dragon Flags',
    category: 'core',
    difficulty: 'advanced',
    duration: '3 sets of 5-10 reps',
    equipment: ['Bench'],
    targetMuscles: ['Full Core', 'Hip Flexors'],
    image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500&h=400&fit=crop',
    steps: [
      'Lie on bench holding behind head',
      'Lift entire body off bench',
      'Lower body as one unit toward bench',
      'Don\'t let body touch bench',
      'Raise back up'
    ],
    benefits: ['Ultimate core exercise', 'Full body control', 'Strength demonstration'],
    tips: ['Start with bent knee version', 'Keep body straight', 'Progress slowly']
  },
  {
    id: 'l-sit',
    name: 'L-Sit Hold',
    category: 'core',
    difficulty: 'advanced',
    duration: '3 sets of 15-30 seconds',
    equipment: ['Parallettes', 'Dip bars'],
    targetMuscles: ['Core', 'Hip Flexors', 'Triceps'],
    image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=500&h=400&fit=crop',
    steps: [
      'Support body on parallettes or bars',
      'Lift legs straight in front',
      'Hold legs parallel to ground',
      'Keep core and legs tight',
      'Hold position'
    ],
    benefits: ['Gymnastics skill', 'Hip flexor strength', 'Core control'],
    tips: ['Start with tucked version', 'Press shoulders down', 'Keep legs straight']
  },
  {
    id: 'stomach-vacuums',
    name: 'Stomach Vacuums',
    category: 'core',
    difficulty: 'beginner',
    duration: '3 sets of 15-30 seconds',
    equipment: ['None'],
    targetMuscles: ['Transverse Abdominis'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop',
    steps: [
      'Stand, kneel, or lie down',
      'Exhale all air',
      'Pull belly button toward spine',
      'Hold position',
      'Release and repeat'
    ],
    benefits: ['Waist tightening', 'Deep core activation', 'Posture improvement'],
    tips: ['Empty lungs completely', 'Pull in as hard as possible', 'Progress hold time']
  }
];
