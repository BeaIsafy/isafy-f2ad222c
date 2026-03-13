
CREATE TABLE public.calendar_event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  broker_id uuid NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, broker_id)
);

ALTER TABLE public.calendar_event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can view participants"
  ON public.calendar_event_participants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = calendar_event_participants.event_id
    AND ce.company_id = get_user_company_id(auth.uid())
  ));

CREATE POLICY "Company members can manage participants"
  ON public.calendar_event_participants FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.calendar_events ce
    WHERE ce.id = calendar_event_participants.event_id
    AND ce.company_id = get_user_company_id(auth.uid())
  ));
