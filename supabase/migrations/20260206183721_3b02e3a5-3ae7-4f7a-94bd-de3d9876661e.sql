
-- Fix: Remove anonymous user data sharing vulnerability across all tables
-- All tables currently allow user_id = 'anonymous' for unauthenticated users,
-- meaning all anonymous users can see/modify each other's data.
-- Fix: Only allow authenticated users to access data via their auth.uid().

-- =====================
-- REMINDERS TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can view their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can update their own reminders" ON public.reminders;
DROP POLICY IF EXISTS "Users can delete their own reminders" ON public.reminders;

CREATE POLICY "Authenticated users can create their own reminders"
ON public.reminders FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own reminders"
ON public.reminders FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own reminders"
ON public.reminders FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own reminders"
ON public.reminders FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);

-- =====================
-- GOALS TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;

CREATE POLICY "Authenticated users can create their own goals"
ON public.goals FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own goals"
ON public.goals FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own goals"
ON public.goals FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own goals"
ON public.goals FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);

-- =====================
-- HABITS TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

CREATE POLICY "Authenticated users can create their own habits"
ON public.habits FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own habits"
ON public.habits FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own habits"
ON public.habits FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own habits"
ON public.habits FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);

-- =====================
-- EXERCISE_LOGS TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own exercise_logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can view their own exercise_logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can update their own exercise_logs" ON public.exercise_logs;
DROP POLICY IF EXISTS "Users can delete their own exercise_logs" ON public.exercise_logs;

CREATE POLICY "Authenticated users can create their own exercise_logs"
ON public.exercise_logs FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own exercise_logs"
ON public.exercise_logs FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own exercise_logs"
ON public.exercise_logs FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own exercise_logs"
ON public.exercise_logs FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);

-- =====================
-- POMODORO_SESSIONS TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own pomodoro_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "Users can view their own pomodoro_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "Users can update their own pomodoro_sessions" ON public.pomodoro_sessions;
DROP POLICY IF EXISTS "Users can delete their own pomodoro_sessions" ON public.pomodoro_sessions;

CREATE POLICY "Authenticated users can create their own pomodoro_sessions"
ON public.pomodoro_sessions FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own pomodoro_sessions"
ON public.pomodoro_sessions FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own pomodoro_sessions"
ON public.pomodoro_sessions FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own pomodoro_sessions"
ON public.pomodoro_sessions FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);

-- =====================
-- USER_PREFERENCES TABLE
-- =====================
DROP POLICY IF EXISTS "Users can create their own user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can view their own user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can delete their own user_preferences" ON public.user_preferences;

CREATE POLICY "Authenticated users can create their own user_preferences"
ON public.user_preferences FOR INSERT TO authenticated
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can view their own user_preferences"
ON public.user_preferences FOR SELECT TO authenticated
USING (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update their own user_preferences"
ON public.user_preferences FOR UPDATE TO authenticated
USING (user_id = (auth.uid())::text)
WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete their own user_preferences"
ON public.user_preferences FOR DELETE TO authenticated
USING (user_id = (auth.uid())::text);
