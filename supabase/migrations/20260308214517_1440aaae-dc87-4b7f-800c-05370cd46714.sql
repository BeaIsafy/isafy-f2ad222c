
-- Table to store WordPress credentials per company
CREATE TABLE public.wordpress_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  wp_url text NOT NULL,
  wp_user text NOT NULL,
  wp_app_password text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id)
);

ALTER TABLE public.wordpress_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage WP config"
  ON public.wordpress_configs FOR ALL TO authenticated
  USING (company_id = get_user_company_id(auth.uid()) AND has_role(auth.uid(), 'owner'::app_role))
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND has_role(auth.uid(), 'owner'::app_role));

CREATE POLICY "Company members can view WP config"
  ON public.wordpress_configs FOR SELECT TO authenticated
  USING (company_id = get_user_company_id(auth.uid()));

-- Add wp_post_id and publish_website to properties
ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS wp_post_id bigint,
  ADD COLUMN IF NOT EXISTS publish_website boolean DEFAULT false;

-- Trigger for updated_at
CREATE TRIGGER update_wordpress_configs_updated_at
  BEFORE UPDATE ON public.wordpress_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
