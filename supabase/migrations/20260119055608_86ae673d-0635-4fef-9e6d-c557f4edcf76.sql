-- Fix permissive RLS policy on usage_logs
DROP POLICY IF EXISTS "Anyone can insert usage logs" ON public.usage_logs;

-- Create more restrictive policy - only authenticated users can insert their own logs
CREATE POLICY "Users can insert own usage logs" ON public.usage_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);