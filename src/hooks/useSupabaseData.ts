import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type PipelineType = Database["public"]["Enums"]["pipeline_type"];

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
        .select("*, broker:brokers(id, name, initials)")
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
      name: string; type?: "Lead" | "Cliente" | "Proprietário"; phone?: string; email?: string;
      cpf?: string; address?: string; notes?: string; status?: "Ativo" | "Inativo";
      broker_id?: string; responsible_id?: string;
    }) => {
      const { data, error } = await supabase.from("contacts").insert({
        name: contact.name,
        type: contact.type,
        phone: contact.phone,
        email: contact.email,
        cpf: contact.cpf,
        address: contact.address,
        notes: contact.notes,
        status: contact.status,
        broker_id: contact.broker_id,
        responsible_id: contact.responsible_id,
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
      const insert = {
        title: property.title as string,
        company_id: company!.id,
        broker_id: user!.id,
        code: property.code,
        category: property.category,
        type: property.type,
        status: property.status,
        purpose: property.purpose,
        bedrooms: property.bedrooms,
        suites: property.suites,
        bathrooms: property.bathrooms,
        parking_spaces: property.parking_spaces,
        total_area: property.total_area,
        useful_area: property.useful_area,
        address: property.address,
        neighborhood: property.neighborhood,
        city: property.city,
        state: property.state,
        sale_price: property.sale_price,
        rent_price: property.rent_price,
        season_price: property.season_price,
        iptu: property.iptu,
        condo_fee: property.condo_fee,
        description: property.description,
        images: property.images,
        cover_image: property.cover_image,
        assigned_broker_id: property.assigned_broker_id,
      };
      const { data, error } = await supabase.from("properties").insert(insert).select().single();
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
export function usePipelineStages(pipeline?: PipelineType) {
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
export function usePipelineLeads(pipeline?: PipelineType) {
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
    mutationFn: async (lead: {
      pipeline: PipelineType; stage_name: string; name: string;
      temperature?: "hot" | "warm" | "cold"; purpose?: "Compra" | "Locação" | "Temporada";
      min_price?: number; max_price?: number; neighborhood?: string;
      assigned_broker_id?: string; contact_id?: string; stage_id?: string;
    }) => {
      const { data, error } = await supabase.from("pipeline_leads").insert({
        pipeline: lead.pipeline,
        stage_name: lead.stage_name,
        name: lead.name,
        temperature: lead.temperature,
        purpose: lead.purpose,
        min_price: lead.min_price,
        max_price: lead.max_price,
        neighborhood: lead.neighborhood,
        assigned_broker_id: lead.assigned_broker_id,
        contact_id: lead.contact_id,
        stage_id: lead.stage_id,
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
    mutationFn: async (proposal: {
      value: number; property_id?: string; contact_id?: string;
      client_name?: string; client_phone?: string; payment_type?: string;
      notes?: string; pipeline_lead_id?: string;
    }) => {
      const { data, error } = await supabase.from("proposals").insert({
        value: proposal.value,
        property_id: proposal.property_id,
        contact_id: proposal.contact_id,
        client_name: proposal.client_name,
        client_phone: proposal.client_phone,
        payment_type: proposal.payment_type,
        notes: proposal.notes,
        pipeline_lead_id: proposal.pipeline_lead_id,
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
    mutationFn: async (event: {
      title: string; date: string; start_hour: number; end_hour: number;
      type?: string; pipeline?: PipelineType; contact?: string; address?: string; notes?: string;
    }) => {
      const { data, error } = await supabase.from("calendar_events").insert({
        title: event.title,
        date: event.date,
        start_hour: event.start_hour,
        end_hour: event.end_hour,
        type: event.type,
        pipeline: event.pipeline,
        contact: event.contact,
        address: event.address,
        notes: event.notes,
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
    mutationFn: async (task: {
      title: string; description?: string; due_date?: string; due_time?: string;
      pipeline_lead_id?: string; property_id?: string; contact_id?: string; assigned_to?: string;
    }) => {
      const { data, error } = await supabase.from("tasks").insert({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        due_time: task.due_time,
        pipeline_lead_id: task.pipeline_lead_id,
        property_id: task.property_id,
        contact_id: task.contact_id,
        assigned_to: task.assigned_to,
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
    mutationFn: async (ticket: {
      subject: string; category?: "bug" | "feature" | "duvida" | "financeiro" | "outro";
      priority?: "baixa" | "media" | "alta" | "urgente"; description?: string;
    }) => {
      const { data, error } = await supabase.from("support_tickets").insert({
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        description: ticket.description,
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
    mutationFn: async (event: {
      type: "proposta" | "visita" | "status" | "edicao" | "publicacao" | "captacao" | "nota" | "whatsapp" | "ligacao" | "email";
      description: string; property_id?: string; contact_id?: string; pipeline_lead_id?: string;
    }) => {
      const { data, error } = await supabase.from("timeline_events").insert({
        type: event.type,
        description: event.description,
        property_id: event.property_id,
        contact_id: event.contact_id,
        pipeline_lead_id: event.pipeline_lead_id,
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
// ============================================
// BROKER GOALS
// ============================================
export function useBrokerGoals(brokerId?: string) {
  const { company } = useAuth();
  return useQuery({
    queryKey: ["broker_goals", company?.id, brokerId],
    queryFn: async () => {
      if (!company?.id) return [];
      let query = supabase
        .from("broker_goals")
        .select("*")
        .eq("company_id", company.id)
        .order("month", { ascending: false });
      if (brokerId) query = query.eq("broker_id", brokerId);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!company?.id,
  });
}

export function useCurrentMonthGoal(brokerId?: string) {
  const { company } = useAuth();
  const currentMonth = new Date();
  currentMonth.setDate(1);
  const monthStr = currentMonth.toISOString().split("T")[0];
  return useQuery({
    queryKey: ["broker_goals_current", company?.id, brokerId, monthStr],
    queryFn: async () => {
      if (!company?.id || !brokerId) return null;
      const { data, error } = await supabase
        .from("broker_goals")
        .select("*")
        .eq("company_id", company.id)
        .eq("broker_id", brokerId)
        .eq("month", monthStr)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id && !!brokerId,
  });
}

export function useUpsertBrokerGoal() {
  const qc = useQueryClient();
  const { company, user } = useAuth();
  return useMutation({
    mutationFn: async (goal: {
      broker_id: string; month: string; target_value: number;
      achieved_value?: number; sales_count?: number; leads_count?: number; conversions_count?: number;
    }) => {
      const { data, error } = await supabase.from("broker_goals").upsert({
        company_id: company!.id,
        profile_id: user!.id,
        broker_id: goal.broker_id,
        month: goal.month,
        target_value: goal.target_value,
        achieved_value: goal.achieved_value ?? 0,
        sales_count: goal.sales_count ?? 0,
        leads_count: goal.leads_count ?? 0,
        conversions_count: goal.conversions_count ?? 0,
      }, { onConflict: "broker_id,month" }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["broker_goals"] }),
  });
}

// ============================================
// USER SESSIONS
// ============================================
export function useUserSessions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("last_active_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });
}

export function useUpsertSession() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (session: {
      device_name: string; device_type: string; ip_address?: string;
      location?: string; user_agent?: string; is_current?: boolean;
    }) => {
      const { data, error } = await supabase.from("user_sessions").insert({
        user_id: user!.id,
        device_name: session.device_name,
        device_type: session.device_type,
        ip_address: session.ip_address,
        location: session.location,
        user_agent: session.user_agent,
        is_current: session.is_current ?? false,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user_sessions"] }),
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user_sessions"] }),
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
        supabase.from("pipeline_leads").select("id", { count: "exact", head: true }).eq("company_id", company.id).eq("pipeline", "atendimento" as PipelineType),
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
