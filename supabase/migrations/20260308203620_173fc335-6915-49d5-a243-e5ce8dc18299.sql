
-- Fix 1: Set search_path on update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix 2: Replace permissive INSERT policy on companies with proper check
DROP POLICY IF EXISTS "Owners can insert company" ON public.companies;
CREATE POLICY "Authenticated users can insert company" ON public.companies 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
