
-- ============================================
-- BROKERS TABLE (team members per company)
-- ============================================
CREATE TABLE public.brokers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  creci TEXT,
  initials TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_brokers_updated_at BEFORE UPDATE ON public.brokers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes
CREATE INDEX idx_brokers_company ON public.brokers(company_id);
CREATE INDEX idx_brokers_profile ON public.brokers(profile_id);

-- RLS
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view brokers" ON public.brokers 
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));

CREATE POLICY "Owners can manage brokers" ON public.brokers 
  FOR ALL USING (company_id = public.get_user_company_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Brokers can view themselves" ON public.brokers 
  FOR SELECT USING (profile_id = auth.uid());

-- ============================================
-- Add broker_id FK to relevant tables (nullable, references brokers)
-- ============================================
ALTER TABLE public.contacts ADD COLUMN broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL;
ALTER TABLE public.contacts ADD COLUMN created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.pipeline_leads ADD COLUMN assigned_broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL;
ALTER TABLE public.pipeline_leads ADD COLUMN created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.properties ADD COLUMN assigned_broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL;

-- ============================================
-- Helper: get broker_id for current user
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_broker_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.brokers 
  WHERE profile_id = _user_id 
  LIMIT 1
$$;

-- ============================================
-- Update RLS: brokers only see their own data
-- ============================================

-- Contacts: brokers see only their assigned or created contacts
DROP POLICY IF EXISTS "Company members can view contacts" ON public.contacts;
CREATE POLICY "Company members can view contacts" ON public.contacts 
  FOR SELECT USING (
    company_id = public.get_user_company_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'owner')
      OR public.has_role(auth.uid(), 'superadmin')
      OR broker_id = public.get_user_broker_id(auth.uid())
      OR responsible_id = auth.uid()
      OR created_by = auth.uid()
    )
  );

-- Pipeline leads: brokers see only their assigned or created leads
DROP POLICY IF EXISTS "Company members can view leads" ON public.pipeline_leads;
CREATE POLICY "Company members can view leads" ON public.pipeline_leads 
  FOR SELECT USING (
    company_id = public.get_user_company_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'owner')
      OR public.has_role(auth.uid(), 'superadmin')
      OR assigned_broker_id = public.get_user_broker_id(auth.uid())
      OR broker_id = auth.uid()
      OR created_by = auth.uid()
    )
  );

-- Properties: brokers see only their assigned properties
DROP POLICY IF EXISTS "Company members can view properties" ON public.properties;
CREATE POLICY "Company members can view properties" ON public.properties 
  FOR SELECT USING (
    company_id = public.get_user_company_id(auth.uid())
    AND (
      public.has_role(auth.uid(), 'owner')
      OR public.has_role(auth.uid(), 'superadmin')
      OR assigned_broker_id = public.get_user_broker_id(auth.uid())
      OR broker_id = auth.uid()
    )
  );
