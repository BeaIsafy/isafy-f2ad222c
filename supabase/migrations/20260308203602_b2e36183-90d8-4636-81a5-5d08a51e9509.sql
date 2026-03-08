
-- ============================================
-- ISAFY - Schema Completo
-- ============================================

-- Enums
CREATE TYPE public.app_role AS ENUM ('superadmin', 'owner', 'broker');
CREATE TYPE public.property_status AS ENUM ('ativo', 'inativo', 'vendido', 'alugado', 'reservado', 'pendente', 'rascunho');
CREATE TYPE public.property_purpose AS ENUM ('venda', 'locação', 'temporada', 'lançamento', 'exclusividade');
CREATE TYPE public.property_category AS ENUM ('residencial', 'comercial', 'industrial', 'rural', 'terreno');
CREATE TYPE public.contact_type AS ENUM ('Lead', 'Cliente', 'Proprietário');
CREATE TYPE public.contact_status AS ENUM ('Ativo', 'Inativo');
CREATE TYPE public.pipeline_type AS ENUM ('captacao', 'atendimento', 'pos-venda');
CREATE TYPE public.lead_temperature AS ENUM ('hot', 'warm', 'cold');
CREATE TYPE public.lead_purpose AS ENUM ('Compra', 'Locação', 'Temporada');
CREATE TYPE public.proposal_status AS ENUM ('Em análise', 'Aprovada', 'Recusada', 'Em negociação', 'Contraproposta');
CREATE TYPE public.visit_status AS ENUM ('Agendada', 'Realizada', 'Cancelada', 'Não compareceu');
CREATE TYPE public.ticket_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
CREATE TYPE public.ticket_status AS ENUM ('aberto', 'em_andamento', 'resolvido', 'fechado');
CREATE TYPE public.ticket_category AS ENUM ('bug', 'feature', 'duvida', 'financeiro', 'outro');
CREATE TYPE public.timeline_event_type AS ENUM ('proposta', 'visita', 'status', 'edicao', 'publicacao', 'captacao', 'nota', 'whatsapp', 'ligacao', 'email');

-- ============================================
-- 1. COMPANIES (Multi-tenant root)
-- ============================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  creci TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#1e40af',
  plan_id TEXT DEFAULT 'start',
  is_active BOOLEAN DEFAULT true,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. PROFILES (linked to auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  creci TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 3. USER ROLES
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ============================================
-- 4. PROPERTIES
-- ============================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  code TEXT,
  title TEXT NOT NULL,
  category property_category DEFAULT 'residencial',
  type TEXT,
  status property_status DEFAULT 'rascunho',
  purpose property_purpose[] DEFAULT '{}',
  bedrooms INT DEFAULT 0,
  suites INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  parking_spaces INT DEFAULT 0,
  total_area NUMERIC DEFAULT 0,
  useful_area NUMERIC DEFAULT 0,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  sale_price NUMERIC,
  rent_price NUMERIC,
  season_price NUMERIC,
  price_per_m2 NUMERIC,
  iptu NUMERIC,
  condo_fee NUMERIC,
  commission_direct NUMERIC DEFAULT 6,
  commission_partner NUMERIC DEFAULT 3,
  owner_id UUID REFERENCES public.profiles(id),
  broker_id UUID REFERENCES public.profiles(id),
  images TEXT[] DEFAULT '{}',
  cover_image TEXT,
  description TEXT,
  occupation TEXT,
  condition TEXT,
  exclusivity BOOLEAN DEFAULT false,
  exclusivity_start DATE,
  exclusivity_end DATE,
  video_url TEXT,
  tour_360_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. CONTACTS
-- ============================================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type contact_type DEFAULT 'Lead',
  phone TEXT,
  email TEXT,
  cpf TEXT,
  address TEXT,
  notes TEXT,
  status contact_status DEFAULT 'Ativo',
  responsible_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. CONTACT PROPERTIES OF INTEREST
-- ============================================
CREATE TABLE public.contact_properties_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (contact_id, property_id)
);

-- ============================================
-- 7. PIPELINE STAGES (customizable names)
-- ============================================
CREATE TABLE public.pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  pipeline pipeline_type NOT NULL,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 8. PIPELINE LEADS (kanban cards)
-- ============================================
CREATE TABLE public.pipeline_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  pipeline pipeline_type NOT NULL,
  stage_id UUID REFERENCES public.pipeline_stages(id) ON DELETE SET NULL,
  stage_name TEXT,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  temperature lead_temperature DEFAULT 'warm',
  purpose lead_purpose DEFAULT 'Compra',
  min_price NUMERIC DEFAULT 0,
  max_price NUMERIC DEFAULT 0,
  neighborhood TEXT,
  broker_id UUID REFERENCES public.profiles(id),
  last_interaction TIMESTAMPTZ DEFAULT now(),
  has_pending_task BOOLEAN DEFAULT false,
  has_active_proposal BOOLEAN DEFAULT false,
  lost_reason TEXT,
  lost_at TIMESTAMPTZ,
  won_at TIMESTAMPTZ,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 9. PROPOSALS
-- ============================================
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  pipeline_lead_id UUID REFERENCES public.pipeline_leads(id) ON DELETE SET NULL,
  client_name TEXT,
  client_phone TEXT,
  value NUMERIC NOT NULL,
  payment_type TEXT,
  status proposal_status DEFAULT 'Em análise',
  notes TEXT,
  public_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  counter_value NUMERIC,
  counter_notes TEXT,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 10. VISITS
-- ============================================
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  pipeline_lead_id UUID REFERENCES public.pipeline_leads(id) ON DELETE SET NULL,
  client_name TEXT,
  client_phone TEXT,
  date DATE NOT NULL,
  time TEXT,
  status visit_status DEFAULT 'Agendada',
  broker_id UUID REFERENCES public.profiles(id),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 11. CALENDAR EVENTS
-- ============================================
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_hour INT NOT NULL,
  end_hour INT NOT NULL,
  type TEXT DEFAULT 'task',
  pipeline pipeline_type,
  contact TEXT,
  address TEXT,
  notes TEXT,
  broker_id UUID REFERENCES public.profiles(id),
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 12. TASKS
-- ============================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  pipeline_lead_id UUID REFERENCES public.pipeline_leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  due_time TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 13. TIMELINE EVENTS (property & contact history)
-- ============================================
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  pipeline_lead_id UUID REFERENCES public.pipeline_leads(id) ON DELETE CASCADE,
  type timeline_event_type NOT NULL,
  description TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id),
  actor_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 14. SUPPORT TICKETS
-- ============================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category ticket_category DEFAULT 'duvida',
  priority ticket_priority DEFAULT 'media',
  status ticket_status DEFAULT 'aberto',
  description TEXT,
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 15. CAPTACAO CHECKLIST
-- ============================================
CREATE TABLE public.captacao_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_lead_id UUID REFERENCES public.pipeline_leads(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT false,
  position INT DEFAULT 0,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

-- Check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = _user_id
$$;

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  );
  -- Default role: broker
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'broker');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- TRIGGER: updated_at auto-update
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_pipeline_leads_updated_at BEFORE UPDATE ON public.pipeline_leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_properties_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captacao_checklist ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can view company profiles" ON public.profiles FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- USER ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- COMPANIES
CREATE POLICY "Users can view own company" ON public.companies FOR SELECT USING (id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Owners can update company" ON public.companies FOR UPDATE USING (id = public.get_user_company_id(auth.uid()) AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can insert company" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Superadmins can view all companies" ON public.companies FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmins can update all companies" ON public.companies FOR UPDATE USING (public.has_role(auth.uid(), 'superadmin'));

-- Company-scoped policies helper macro (applied to most tables)
-- PROPERTIES
CREATE POLICY "Company members can view properties" ON public.properties FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert properties" ON public.properties FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update properties" ON public.properties FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete properties" ON public.properties FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- CONTACTS
CREATE POLICY "Company members can view contacts" ON public.contacts FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert contacts" ON public.contacts FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update contacts" ON public.contacts FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete contacts" ON public.contacts FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- CONTACT PROPERTIES INTEREST
CREATE POLICY "Company members can view interest" ON public.contact_properties_interest FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.contacts c WHERE c.id = contact_id AND c.company_id = public.get_user_company_id(auth.uid()))
);
CREATE POLICY "Company members can manage interest" ON public.contact_properties_interest FOR ALL USING (
  EXISTS (SELECT 1 FROM public.contacts c WHERE c.id = contact_id AND c.company_id = public.get_user_company_id(auth.uid()))
);

-- PIPELINE STAGES
CREATE POLICY "Company members can view stages" ON public.pipeline_stages FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can manage stages" ON public.pipeline_stages FOR ALL USING (company_id = public.get_user_company_id(auth.uid()));

-- PIPELINE LEADS
CREATE POLICY "Company members can view leads" ON public.pipeline_leads FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert leads" ON public.pipeline_leads FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update leads" ON public.pipeline_leads FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete leads" ON public.pipeline_leads FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- PROPOSALS
CREATE POLICY "Company members can view proposals" ON public.proposals FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert proposals" ON public.proposals FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update proposals" ON public.proposals FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Public proposal view by token" ON public.proposals FOR SELECT USING (public_token IS NOT NULL);

-- VISITS
CREATE POLICY "Company members can view visits" ON public.visits FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert visits" ON public.visits FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update visits" ON public.visits FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete visits" ON public.visits FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- CALENDAR EVENTS
CREATE POLICY "Company members can view events" ON public.calendar_events FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert events" ON public.calendar_events FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update events" ON public.calendar_events FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete events" ON public.calendar_events FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- TASKS
CREATE POLICY "Company members can view tasks" ON public.tasks FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert tasks" ON public.tasks FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can update tasks" ON public.tasks FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can delete tasks" ON public.tasks FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- TIMELINE EVENTS
CREATE POLICY "Company members can view timeline" ON public.timeline_events FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company members can insert timeline" ON public.timeline_events FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));

-- SUPPORT TICKETS
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Superadmins can view all tickets" ON public.support_tickets FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));

-- CAPTACAO CHECKLIST
CREATE POLICY "Company members can view checklist" ON public.captacao_checklist FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pipeline_leads pl WHERE pl.id = pipeline_lead_id AND pl.company_id = public.get_user_company_id(auth.uid()))
);
CREATE POLICY "Company members can manage checklist" ON public.captacao_checklist FOR ALL USING (
  EXISTS (SELECT 1 FROM public.pipeline_leads pl WHERE pl.id = pipeline_lead_id AND pl.company_id = public.get_user_company_id(auth.uid()))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_company ON public.profiles(company_id);
CREATE INDEX idx_properties_company ON public.properties(company_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_contacts_company ON public.contacts(company_id);
CREATE INDEX idx_contacts_type ON public.contacts(type);
CREATE INDEX idx_pipeline_leads_company ON public.pipeline_leads(company_id);
CREATE INDEX idx_pipeline_leads_pipeline ON public.pipeline_leads(pipeline);
CREATE INDEX idx_pipeline_leads_stage ON public.pipeline_leads(stage_id);
CREATE INDEX idx_proposals_company ON public.proposals(company_id);
CREATE INDEX idx_proposals_property ON public.proposals(property_id);
CREATE INDEX idx_proposals_token ON public.proposals(public_token);
CREATE INDEX idx_visits_company ON public.visits(company_id);
CREATE INDEX idx_visits_date ON public.visits(date);
CREATE INDEX idx_calendar_events_company ON public.calendar_events(company_id);
CREATE INDEX idx_calendar_events_date ON public.calendar_events(date);
CREATE INDEX idx_tasks_company ON public.tasks(company_id);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_timeline_events_property ON public.timeline_events(property_id);
CREATE INDEX idx_timeline_events_contact ON public.timeline_events(contact_id);
CREATE INDEX idx_timeline_events_lead ON public.timeline_events(pipeline_lead_id);

-- ============================================
-- DEFAULT PIPELINE STAGES (inserted per company via function)
-- ============================================
CREATE OR REPLACE FUNCTION public.create_default_pipeline_stages(_company_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Atendimento
  INSERT INTO pipeline_stages (company_id, pipeline, name, position) VALUES
    (_company_id, 'atendimento', 'Novo Lead', 0),
    (_company_id, 'atendimento', 'Contato Inicial', 1),
    (_company_id, 'atendimento', 'Qualificação', 2),
    (_company_id, 'atendimento', 'Visita Agendada', 3),
    (_company_id, 'atendimento', 'Proposta Enviada', 4);
  -- Captação
  INSERT INTO pipeline_stages (company_id, pipeline, name, position) VALUES
    (_company_id, 'captacao', 'Novo Proprietário', 0),
    (_company_id, 'captacao', 'Contato Inicial', 1),
    (_company_id, 'captacao', 'Avaliação Agendada', 2),
    (_company_id, 'captacao', 'Avaliação Realizada', 3),
    (_company_id, 'captacao', 'Proposta Captação', 4);
  -- Pós-Venda
  INSERT INTO pipeline_stages (company_id, pipeline, name, position) VALUES
    (_company_id, 'pos-venda', 'Contrato Assinado', 0),
    (_company_id, 'pos-venda', 'Documentação', 1),
    (_company_id, 'pos-venda', 'Escritura', 2),
    (_company_id, 'pos-venda', 'Follow-up 30d', 3);
END;
$$;
