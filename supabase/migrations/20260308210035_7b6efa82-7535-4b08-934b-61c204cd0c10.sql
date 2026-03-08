
-- ============================================
-- BROKER GOALS (metas mensais)
-- ============================================
CREATE TABLE public.broker_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  broker_id uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  month date NOT NULL, -- first day of month (e.g. 2026-03-01)
  target_value numeric NOT NULL DEFAULT 0,
  achieved_value numeric NOT NULL DEFAULT 0,
  sales_count integer NOT NULL DEFAULT 0,
  leads_count integer NOT NULL DEFAULT 0,
  conversions_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(broker_id, month)
);

ALTER TABLE public.broker_goals ENABLE ROW LEVEL SECURITY;

-- Users can view goals from their company
CREATE POLICY "Company members can view goals"
  ON public.broker_goals FOR SELECT
  USING (company_id = public.get_user_company_id(auth.uid()));

-- Users can manage their own goals
CREATE POLICY "Users can manage own goals"
  ON public.broker_goals FOR ALL
  USING (
    company_id = public.get_user_company_id(auth.uid())
    AND (
      profile_id = auth.uid()
      OR public.has_role(auth.uid(), 'owner')
      OR public.has_role(auth.uid(), 'superadmin')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER broker_goals_updated_at
  BEFORE UPDATE ON public.broker_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- USER SESSIONS (dispositivos logados)
-- ============================================
CREATE TABLE public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_name text NOT NULL DEFAULT '',
  device_type text NOT NULL DEFAULT 'desktop', -- desktop, mobile, tablet
  ip_address text,
  location text,
  user_agent text,
  is_current boolean DEFAULT false,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON public.user_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON public.user_sessions FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON public.user_sessions FOR DELETE
  USING (user_id = auth.uid());
