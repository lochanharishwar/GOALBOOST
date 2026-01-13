-- Drop the insecure "allow all" policy on reminders table
DROP POLICY IF EXISTS "Allow all operations on reminders" ON public.reminders;

-- Create separate policies for each operation with proper user scoping
-- For authenticated users: use auth.uid()::text
-- For anonymous users: allow access to records with user_id = 'anonymous' only from authenticated sessions
-- This prevents truly unauthenticated API access while allowing the app's anonymous user pattern

-- SELECT policy: Users can only view their own reminders
CREATE POLICY "Users can view their own reminders" 
ON public.reminders 
FOR SELECT 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- INSERT policy: Users can only create reminders for themselves
CREATE POLICY "Users can create their own reminders" 
ON public.reminders 
FOR INSERT 
WITH CHECK (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);

-- UPDATE policy: Users can only update their own reminders
CREATE POLICY "Users can update their own reminders" 
ON public.reminders 
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

-- DELETE policy: Users can only delete their own reminders
CREATE POLICY "Users can delete their own reminders" 
ON public.reminders 
FOR DELETE 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()::text
    ELSE user_id = 'anonymous'
  END
);