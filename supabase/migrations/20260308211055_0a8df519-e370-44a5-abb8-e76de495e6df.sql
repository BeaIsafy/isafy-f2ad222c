
-- Function to promote user to owner (called during onboarding)
CREATE OR REPLACE FUNCTION public.promote_to_owner(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_roles 
  SET role = 'owner' 
  WHERE user_id = _user_id;
END;
$$;

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-assets',
  'company-assets',
  true,
  2097152, -- 2MB
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
);

-- Storage policies: authenticated users can upload
CREATE POLICY "Authenticated users can upload company assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

-- Anyone can view (public bucket)
CREATE POLICY "Public can view company assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-assets');

-- Owners can update/delete their assets
CREATE POLICY "Authenticated users can update company assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated users can delete company assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets');
