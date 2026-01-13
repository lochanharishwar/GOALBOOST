-- Drop insecure "allow all" policies from all tables
DROP POLICY IF EXISTS "Allow all operations on goals" ON public.goals;
DROP POLICY IF EXISTS "Allow all operations on habits" ON public.habits;
DROP POLICY IF EXISTS "Allow all operations on pomodoro_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "Allow all operations on exercise_logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Allow all operations on user_preferences" ON public.user_preferences;

-- =====================
-- GOALS TABLE POLICIES
-- =====================
CREATE POLICY "Users can view their own goals" 
ON public.goals 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can create their own goals" 
ON public.goals 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can update their own goals" 
ON public.goals 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can delete their own goals" 
ON public.goals 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- =====================
-- HABITS TABLE POLICIES
-- =====================
CREATE POLICY "Users can view their own habits" 
ON public.habits 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can create their own habits" 
ON public.habits 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can update their own habits" 
ON public.habits 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can delete their own habits" 
ON public.habits 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- =============================
-- POMODORO_SESSIONS TABLE POLICIES
-- =============================
CREATE POLICY "Users can view their own pomodoro_sessions" 
ON public.pomodoro_sessions 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can create their own pomodoro_sessions" 
ON public.pomodoro_sessions 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can update their own pomodoro_sessions" 
ON public.pomodoro_sessions 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can delete their own pomodoro_sessions" 
ON public.pomodoro_sessions 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- =============================
-- EXERCISE_LOGS TABLE POLICIES
-- =============================
CREATE POLICY "Users can view their own exercise_logs" 
ON public.exercise_logs 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can create their own exercise_logs" 
ON public.exercise_logs 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can update their own exercise_logs" 
ON public.exercise_logs 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can delete their own exercise_logs" 
ON public.exercise_logs 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- =============================
-- USER_PREFERENCES TABLE POLICIES
-- =============================
CREATE POLICY "Users can view their own user_preferences" 
ON public.user_preferences 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can create their own user_preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can update their own user_preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
)
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

CREATE POLICY "Users can delete their own user_preferences" 
ON public.user_preferences 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);