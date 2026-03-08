import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// BROKERS
// ============================================
export function useBrokers() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["brokers", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("brokers")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

// ============================================
// CONTACTS
// ============================================
export function useContacts() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["contacts", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("contacts")
        .select("*, broker:brokers(id, name, initials), responsible:profiles!contacts_responsible_id_fkey(id, full_name)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (contact: {
      name: string; type?: string; phone?: string; email?: string;
      cpf?: string; address?: string; notes?: string; status?: string;
      broker_id?: string; responsible_id?: string;
    }) => {
      const { data, error } = await supabase.from("contacts").insert({
        ...contact,
        company_id: company!.id,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("contacts").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

// ============================================
// PROPERTIES
// ============================================
export function useProperties() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["properties", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("properties")
        .select("*, assigned_broker:brokers!properties_assigned_broker_id_fkey(id, name, initials)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (property: Record<string, any>) => {
      const { data, error } = await supabase.from("properties").insert({
        ...property,
        company_id: company!.id,
        broker_id: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("properties").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

// ============================================
// PIPELINE STAGES
// ============================================
export function usePipelineStages(pipeline?: string) {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["pipeline_stages", company?.id, pipeline],
    queryFn: async () => {
      if (!company?.id) return [];
      let query = supabase
        .from("pipeline_stages")
        .select("*")
        .eq("company_id", company.id)
        .order("position");
      if (pipeline) query = query.eq("pipeline", pipeline);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

// ============================================
// PIPELINE LEADS
// ============================================
export function usePipelineLeads(pipeline?: string) {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["pipeline_leads", company?.id, pipeline],
    queryFn: async () => {
      if (!company?.id) return [];
      let query = supabase
        .from("pipeline_leads")
        .select("*, contact:contacts(id, name, phone, email), assigned_broker:brokers!pipeline_leads_assigned_broker_id_fkey(id, name, initials)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (pipeline) query = query.eq("pipeline", pipeline);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreatePipelineLead() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (lead: Record<string, any>) => {
      const { data, error } = await supabase.from("pipeline_leads").insert({
        ...lead,
        company_id: company!.id,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipeline_leads"] }),
  });
}

export function useUpdatePipelineLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("pipeline_leads").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipeline_leads"] }),
  });
}

// ============================================
// PROPOSALS
// ============================================
export function useProposals() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["proposals", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("proposals")
        .select("*, property:properties(id, title, code), contact:contacts(id, name, phone)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateProposal() {
  const qc = useQueryClient();
  const { company } = useAuth();
  return useMutation({
    mutationFn: async (proposal: Record<string, any>) => {
      const { data, error } = await supabase.from("proposals").insert({
        ...proposal,
        company_id: company!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

export function useUpdateProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("proposals").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["proposals"] }),
  });
}

// ============================================
// VISITS
// ============================================
export function useVisits() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["visits", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("visits")
        .select("*, property:properties(id, title), contact:contacts(id, name)")
        .eq("company_id", company.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

// ============================================
// CALENDAR EVENTS
// ============================================
export function useCalendarEvents() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["calendar_events", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("company_id", company.id)
        .order("date");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateCalendarEvent() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (event: Record<string, any>) => {
      const { data, error } = await supabase.from("calendar_events").insert({
        ...event,
        company_id: company!.id,
        broker_id: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["calendar_events"] }),
  });
}

// ============================================
// TASKS
// ============================================
export function useTasks() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["tasks", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("company_id", company.id)
        .order("due_date");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (task: Record<string, any>) => {
      const { data, error } = await supabase.from("tasks").insert({
        ...task,
        company_id: company!.id,
        created_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

// ============================================
// SUPPORT TICKETS
// ============================================
export function useSupportTickets() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["support_tickets", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });
}

export function useCreateSupportTicket() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (ticket: { subject: string; category?: string; priority?: string; description?: string }) => {
      const { data, error } = await supabase.from("support_tickets").insert({
        ...ticket,
        company_id: company!.id,
        user_id: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["support_tickets"] }),
  });
}

// ============================================
// TIMELINE EVENTS
// ============================================
export function useTimelineEvents(opts?: { property_id?: string; contact_id?: string; pipeline_lead_id?: string }) {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["timeline_events", company?.id, opts],
    queryFn: async () => {
      if (!company?.id) return [];
      let query = supabase
        .from("timeline_events")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (opts?.property_id) query = query.eq("property_id", opts.property_id);
      if (opts?.contact_id) query = query.eq("contact_id", opts.contact_id);
      if (opts?.pipeline_lead_id) query = query.eq("pipeline_lead_id", opts.pipeline_lead_id);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCreateTimelineEvent() {
  const qc = useQueryClient();
  const { company, user, profile } = useAuth();
  return useMutation({
    mutationFn: async (event: Record<string, any>) => {
      const { data, error } = await supabase.from("timeline_events").insert({
        ...event,
        company_id: company!.id,
        actor_id: user!.id,
        actor_name: profile?.full_name || "",
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["timeline_events"] }),
  });
}

// ============================================
// DASHBOARD STATS
// ============================================
export function useDashboardStats() {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["dashboard_stats", company?.id],
    queryFn: async () => {
      if (!company?.id) return null;
      const [contactsRes, propertiesRes, leadsRes, proposalsRes, tasksRes] = await Promise.all([
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("company_id", company.id),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("company_id", company.id),
        supabase.from("pipeline_leads").select("id", { count: "exact", head: true }).eq("company_id", company.id).eq("pipeline", "atendimento"),
        supabase.from("proposals").select("id, value, status").eq("company_id", company.id),
        supabase.from("tasks").select("id, is_completed, due_date, title").eq("company_id", company.id).eq("is_completed", false).order("due_date").limit(10),
      ]);
      
      const proposals = proposalsRes.data ?? [];
      const vgv = proposals.filter(p => p.status === "Aprovada").reduce((sum, p) => sum + (Number(p.value) || 0), 0);
      
      return {
        contacts: contactsRes.count ?? 0,
        properties: propertiesRes.count ?? 0,
        activeLeads: leadsRes.count ?? 0,
        totalProposals: proposals.length,
        vgv,
        pendingTasks: tasksRes.data ?? [],
      };
    },
    enabled: !!company?.id,
  });
}
