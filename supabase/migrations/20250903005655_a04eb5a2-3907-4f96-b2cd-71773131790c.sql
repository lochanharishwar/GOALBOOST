-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  fitness_goal TEXT CHECK (fitness_goal IN ('build_muscle', 'lose_weight', 'improve_endurance', 'general_fitness')),
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workouts table for logging completed workouts
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_logs table for detailed exercise tracking
CREATE TABLE public.exercise_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL, -- References exercise from your existing data
  reps INTEGER,
  sets INTEGER,
  weight_kg NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for workouts
CREATE POLICY "Users can view their own workouts" 
ON public.workouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workouts" 
ON public.workouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts" 
ON public.workouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts" 
ON public.workouts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for exercise_logs
CREATE POLICY "Users can view their own exercise logs" 
ON public.exercise_logs 
FOR SELECT 
USING (workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid()));

CREATE POLICY "Users can create exercise logs for their workouts" 
ON public.exercise_logs 
FOR INSERT 
WITH CHECK (workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own exercise logs" 
ON public.exercise_logs 
FOR UPDATE 
USING (workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own exercise logs" 
ON public.exercise_logs 
FOR DELETE 
USING (workout_id IN (SELECT id FROM public.workouts WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_date ON public.workouts(date);
CREATE INDEX idx_exercise_logs_workout_id ON public.exercise_logs(workout_id);
CREATE INDEX idx_exercise_logs_exercise_id ON public.exercise_logs(exercise_id);