-- Create habits table
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    color TEXT NOT NULL DEFAULT '#3b82f6',
    icon TEXT NOT NULL DEFAULT '📌',
    streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    completed_dates TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reminders table
CREATE TABLE public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    has_device_alarm BOOLEAN NOT NULL DEFAULT false,
    repeat_days TEXT[] DEFAULT '{}',
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'personal',
    target_value INTEGER NOT NULL DEFAULT 100,
    current_value INTEGER NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'percent',
    deadline TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pomodoro_sessions table
CREATE TABLE public.pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    session_type TEXT NOT NULL DEFAULT 'work',
    duration_minutes INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    was_completed BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_logs table
CREATE TABLE public.exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    duration_minutes INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE DEFAULT 'anonymous',
    theme TEXT NOT NULL DEFAULT 'dark',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    notification_enabled BOOLEAN NOT NULL DEFAULT true,
    work_duration INTEGER NOT NULL DEFAULT 25,
    break_duration INTEGER NOT NULL DEFAULT 5,
    long_break_duration INTEGER NOT NULL DEFAULT 15,
    daily_goal_hours INTEGER DEFAULT 8,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is implemented yet)
-- Habits policies
CREATE POLICY "Allow all operations on habits" ON public.habits FOR ALL USING (true) WITH CHECK (true);

-- Reminders policies
CREATE POLICY "Allow all operations on reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);

-- Goals policies
CREATE POLICY "Allow all operations on goals" ON public.goals FOR ALL USING (true) WITH CHECK (true);

-- Pomodoro sessions policies
CREATE POLICY "Allow all operations on pomodoro_sessions" ON public.pomodoro_sessions FOR ALL USING (true) WITH CHECK (true);

-- Exercise logs policies
CREATE POLICY "Allow all operations on exercise_logs" ON public.exercise_logs FOR ALL USING (true) WITH CHECK (true);

-- User preferences policies
CREATE POLICY "Allow all operations on user_preferences" ON public.user_preferences FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();