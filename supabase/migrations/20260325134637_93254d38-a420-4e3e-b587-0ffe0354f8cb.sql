-- Drop orphaned tables that are unused in application code (reduce attack surface)
-- These were created in an earlier migration but no application code references them
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;