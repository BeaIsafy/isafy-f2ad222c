
-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert company" ON public.companies;

-- Recreate as PERMISSIVE
CREATE POLICY "Authenticated users can insert company"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
