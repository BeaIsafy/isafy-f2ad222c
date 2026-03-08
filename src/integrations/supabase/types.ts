export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      broker_goals: {
        Row: {
          achieved_value: number
          broker_id: string
          company_id: string
          conversions_count: number
          created_at: string | null
          id: string
          leads_count: number
          month: string
          profile_id: string | null
          sales_count: number
          target_value: number
          updated_at: string | null
        }
        Insert: {
          achieved_value?: number
          broker_id: string
          company_id: string
          conversions_count?: number
          created_at?: string | null
          id?: string
          leads_count?: number
          month: string
          profile_id?: string | null
          sales_count?: number
          target_value?: number
          updated_at?: string | null
        }
        Update: {
          achieved_value?: number
          broker_id?: string
          company_id?: string
          conversions_count?: number
          created_at?: string | null
          id?: string
          leads_count?: number
          month?: string
          profile_id?: string | null
          sales_count?: number
          target_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_goals_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broker_goals_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brokers: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string | null
          creci: string | null
          email: string | null
          id: string
          initials: string | null
          is_active: boolean | null
          name: string
          phone: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id: string
          created_at?: string | null
          creci?: string | null
          email?: string | null
          id?: string
          initials?: string | null
          is_active?: boolean | null
          name: string
          phone?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string | null
          creci?: string | null
          email?: string | null
          id?: string
          initials?: string | null
          is_active?: boolean | null
          name?: string
          phone?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brokers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brokers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          address: string | null
          broker_id: string | null
          company_id: string
          contact: string | null
          created_at: string | null
          date: string
          end_hour: number
          id: string
          notes: string | null
          pipeline: Database["public"]["Enums"]["pipeline_type"] | null
          start_hour: number
          title: string
          type: string | null
          updated_at: string | null
          visit_id: string | null
        }
        Insert: {
          address?: string | null
          broker_id?: string | null
          company_id: string
          contact?: string | null
          created_at?: string | null
          date: string
          end_hour: number
          id?: string
          notes?: string | null
          pipeline?: Database["public"]["Enums"]["pipeline_type"] | null
          start_hour: number
          title: string
          type?: string | null
          updated_at?: string | null
          visit_id?: string | null
        }
        Update: {
          address?: string | null
          broker_id?: string | null
          company_id?: string
          contact?: string | null
          created_at?: string | null
          date?: string
          end_hour?: number
          id?: string
          notes?: string | null
          pipeline?: Database["public"]["Enums"]["pipeline_type"] | null
          start_hour?: number
          title?: string
          type?: string | null
          updated_at?: string | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      captacao_checklist: {
        Row: {
          checked_at: string | null
          created_at: string | null
          id: string
          is_checked: boolean | null
          label: string
          pipeline_lead_id: string
          position: number | null
        }
        Insert: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          is_checked?: boolean | null
          label: string
          pipeline_lead_id: string
          position?: number | null
        }
        Update: {
          checked_at?: string | null
          created_at?: string | null
          id?: string
          is_checked?: boolean | null
          label?: string
          pipeline_lead_id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "captacao_checklist_pipeline_lead_id_fkey"
            columns: ["pipeline_lead_id"]
            isOneToOne: false
            referencedRelation: "pipeline_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          blocked_at: string | null
          cnpj: string | null
          created_at: string | null
          creci: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          plan_id: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          blocked_at?: string | null
          cnpj?: string | null
          created_at?: string | null
          creci?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          plan_id?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          blocked_at?: string | null
          cnpj?: string | null
          created_at?: string | null
          creci?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          plan_id?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_properties_interest: {
        Row: {
          contact_id: string
          created_at: string | null
          id: string
          property_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          id?: string
          property_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_properties_interest_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_properties_interest_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          address: string | null
          broker_id: string | null
          company_id: string
          cpf: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          responsible_id: string | null
          status: Database["public"]["Enums"]["contact_status"] | null
          type: Database["public"]["Enums"]["contact_type"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          broker_id?: string | null
          company_id: string
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          type?: Database["public"]["Enums"]["contact_type"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          broker_id?: string | null
          company_id?: string
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          responsible_id?: string | null
          status?: Database["public"]["Enums"]["contact_status"] | null
          type?: Database["public"]["Enums"]["contact_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          asaas_invoice_url: string | null
          asaas_payment_id: string | null
          company_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          paid_at: string | null
          status: string
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number
          asaas_invoice_url?: string | null
          asaas_payment_id?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          asaas_invoice_url?: string | null
          asaas_payment_id?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_leads: {
        Row: {
          assigned_broker_id: string | null
          broker_id: string | null
          company_id: string
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          has_active_proposal: boolean | null
          has_pending_task: boolean | null
          id: string
          last_interaction: string | null
          lost_at: string | null
          lost_reason: string | null
          max_price: number | null
          min_price: number | null
          name: string
          neighborhood: string | null
          pipeline: Database["public"]["Enums"]["pipeline_type"]
          property_id: string | null
          purpose: Database["public"]["Enums"]["lead_purpose"] | null
          stage_id: string | null
          stage_name: string | null
          temperature: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at: string | null
          won_at: string | null
        }
        Insert: {
          assigned_broker_id?: string | null
          broker_id?: string | null
          company_id: string
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          has_active_proposal?: boolean | null
          has_pending_task?: boolean | null
          id?: string
          last_interaction?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          max_price?: number | null
          min_price?: number | null
          name: string
          neighborhood?: string | null
          pipeline: Database["public"]["Enums"]["pipeline_type"]
          property_id?: string | null
          purpose?: Database["public"]["Enums"]["lead_purpose"] | null
          stage_id?: string | null
          stage_name?: string | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at?: string | null
          won_at?: string | null
        }
        Update: {
          assigned_broker_id?: string | null
          broker_id?: string | null
          company_id?: string
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          has_active_proposal?: boolean | null
          has_pending_task?: boolean | null
          id?: string
          last_interaction?: string | null
          lost_at?: string | null
          lost_reason?: string | null
          max_price?: number | null
          min_price?: number | null
          name?: string
          neighborhood?: string | null
          pipeline?: Database["public"]["Enums"]["pipeline_type"]
          property_id?: string | null
          purpose?: Database["public"]["Enums"]["lead_purpose"] | null
          stage_id?: string | null
          stage_name?: string | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at?: string | null
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_leads_assigned_broker_id_fkey"
            columns: ["assigned_broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_leads_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
          pipeline: Database["public"]["Enums"]["pipeline_type"]
          position: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          pipeline: Database["public"]["Enums"]["pipeline_type"]
          position?: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          pipeline?: Database["public"]["Enums"]["pipeline_type"]
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          creci: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          onboarding_completed: boolean | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          creci?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          creci?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          assigned_broker_id: string | null
          bathrooms: number | null
          bedrooms: number | null
          broker_id: string | null
          category: Database["public"]["Enums"]["property_category"] | null
          city: string | null
          code: string | null
          commission_direct: number | null
          commission_partner: number | null
          company_id: string
          condition: string | null
          condo_fee: number | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          exclusivity: boolean | null
          exclusivity_end: string | null
          exclusivity_start: string | null
          id: string
          images: string[] | null
          iptu: number | null
          latitude: number | null
          longitude: number | null
          neighborhood: string | null
          occupation: string | null
          owner_id: string | null
          parking_spaces: number | null
          price_per_m2: number | null
          purpose: Database["public"]["Enums"]["property_purpose"][] | null
          rent_price: number | null
          sale_price: number | null
          season_price: number | null
          state: string | null
          status: Database["public"]["Enums"]["property_status"] | null
          suites: number | null
          title: string
          total_area: number | null
          tour_360_url: string | null
          type: string | null
          updated_at: string | null
          useful_area: number | null
          video_url: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          assigned_broker_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_id?: string | null
          category?: Database["public"]["Enums"]["property_category"] | null
          city?: string | null
          code?: string | null
          commission_direct?: number | null
          commission_partner?: number | null
          company_id: string
          condition?: string | null
          condo_fee?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          exclusivity?: boolean | null
          exclusivity_end?: string | null
          exclusivity_start?: string | null
          id?: string
          images?: string[] | null
          iptu?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          occupation?: string | null
          owner_id?: string | null
          parking_spaces?: number | null
          price_per_m2?: number | null
          purpose?: Database["public"]["Enums"]["property_purpose"][] | null
          rent_price?: number | null
          sale_price?: number | null
          season_price?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["property_status"] | null
          suites?: number | null
          title: string
          total_area?: number | null
          tour_360_url?: string | null
          type?: string | null
          updated_at?: string | null
          useful_area?: number | null
          video_url?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          assigned_broker_id?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          broker_id?: string | null
          category?: Database["public"]["Enums"]["property_category"] | null
          city?: string | null
          code?: string | null
          commission_direct?: number | null
          commission_partner?: number | null
          company_id?: string
          condition?: string | null
          condo_fee?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          exclusivity?: boolean | null
          exclusivity_end?: string | null
          exclusivity_start?: string | null
          id?: string
          images?: string[] | null
          iptu?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood?: string | null
          occupation?: string | null
          owner_id?: string | null
          parking_spaces?: number | null
          price_per_m2?: number | null
          purpose?: Database["public"]["Enums"]["property_purpose"][] | null
          rent_price?: number | null
          sale_price?: number | null
          season_price?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["property_status"] | null
          suites?: number | null
          title?: string
          total_area?: number | null
          tour_360_url?: string | null
          type?: string | null
          updated_at?: string | null
          useful_area?: number | null
          video_url?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_assigned_broker_id_fkey"
            columns: ["assigned_broker_id"]
            isOneToOne: false
            referencedRelation: "brokers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          client_name: string | null
          client_phone: string | null
          company_id: string
          contact_id: string | null
          counter_notes: string | null
          counter_value: number | null
          created_at: string | null
          id: string
          notes: string | null
          payment_type: string | null
          pipeline_lead_id: string | null
          property_id: string | null
          public_token: string | null
          status: Database["public"]["Enums"]["proposal_status"] | null
          updated_at: string | null
          value: number
          version: number | null
        }
        Insert: {
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          contact_id?: string | null
          counter_notes?: string | null
          counter_value?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string | null
          value: number
          version?: number | null
        }
        Update: {
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          contact_id?: string | null
          counter_notes?: string | null
          counter_value?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_type?: string | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["proposal_status"] | null
          updated_at?: string | null
          value?: number
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_pipeline_lead_id_fkey"
            columns: ["pipeline_lead_id"]
            isOneToOne: false
            referencedRelation: "pipeline_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          asaas_customer_id: string | null
          asaas_subscription_id: string | null
          company_id: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_method: string | null
          plan_id: string
          status: string
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          company_id: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          asaas_customer_id?: string | null
          asaas_subscription_id?: string | null
          company_id?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_method?: string | null
          plan_id?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: Database["public"]["Enums"]["ticket_category"] | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          responded_at: string | null
          response: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["ticket_category"] | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["ticket_category"] | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          responded_at?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          company_id: string
          completed_at: string | null
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          is_completed: boolean | null
          pipeline_lead_id: string | null
          property_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_completed?: boolean | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_completed?: boolean | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_pipeline_lead_id_fkey"
            columns: ["pipeline_lead_id"]
            isOneToOne: false
            referencedRelation: "pipeline_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          company_id: string
          contact_id: string | null
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          pipeline_lead_id: string | null
          property_id: string | null
          type: Database["public"]["Enums"]["timeline_event_type"]
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          company_id: string
          contact_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          type: Database["public"]["Enums"]["timeline_event_type"]
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          company_id?: string
          contact_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          pipeline_lead_id?: string | null
          property_id?: string | null
          type?: Database["public"]["Enums"]["timeline_event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_pipeline_lead_id_fkey"
            columns: ["pipeline_lead_id"]
            isOneToOne: false
            referencedRelation: "pipeline_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_name: string
          device_type: string
          id: string
          ip_address: string | null
          is_current: boolean | null
          last_active_at: string | null
          location: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_name?: string
          device_type?: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active_at?: string | null
          location?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_name?: string
          device_type?: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active_at?: string | null
          location?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          broker_id: string | null
          client_name: string | null
          client_phone: string | null
          company_id: string
          contact_id: string | null
          created_at: string | null
          date: string
          feedback: string | null
          id: string
          pipeline_lead_id: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["visit_status"] | null
          time: string | null
          updated_at: string | null
        }
        Insert: {
          broker_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id: string
          contact_id?: string | null
          created_at?: string | null
          date: string
          feedback?: string | null
          id?: string
          pipeline_lead_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["visit_status"] | null
          time?: string | null
          updated_at?: string | null
        }
        Update: {
          broker_id?: string | null
          client_name?: string | null
          client_phone?: string | null
          company_id?: string
          contact_id?: string | null
          created_at?: string | null
          date?: string
          feedback?: string | null
          id?: string
          pipeline_lead_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["visit_status"] | null
          time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_broker_id_fkey"
            columns: ["broker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_pipeline_lead_id_fkey"
            columns: ["pipeline_lead_id"]
            isOneToOne: false
            referencedRelation: "pipeline_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_pipeline_stages: {
        Args: { _company_id: string }
        Returns: undefined
      }
      get_user_broker_id: { Args: { _user_id: string }; Returns: string }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_to_owner: { Args: { _user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "superadmin" | "owner" | "broker"
      contact_status: "Ativo" | "Inativo"
      contact_type: "Lead" | "Cliente" | "Proprietário"
      lead_purpose: "Compra" | "Locação" | "Temporada"
      lead_temperature: "hot" | "warm" | "cold"
      pipeline_type: "captacao" | "atendimento" | "pos-venda"
      property_category:
        | "residencial"
        | "comercial"
        | "industrial"
        | "rural"
        | "terreno"
      property_purpose:
        | "venda"
        | "locação"
        | "temporada"
        | "lançamento"
        | "exclusividade"
      property_status:
        | "ativo"
        | "inativo"
        | "vendido"
        | "alugado"
        | "reservado"
        | "pendente"
        | "rascunho"
      proposal_status:
        | "Em análise"
        | "Aprovada"
        | "Recusada"
        | "Em negociação"
        | "Contraproposta"
      ticket_category: "bug" | "feature" | "duvida" | "financeiro" | "outro"
      ticket_priority: "baixa" | "media" | "alta" | "urgente"
      ticket_status: "aberto" | "em_andamento" | "resolvido" | "fechado"
      timeline_event_type:
        | "proposta"
        | "visita"
        | "status"
        | "edicao"
        | "publicacao"
        | "captacao"
        | "nota"
        | "whatsapp"
        | "ligacao"
        | "email"
      visit_status: "Agendada" | "Realizada" | "Cancelada" | "Não compareceu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "owner", "broker"],
      contact_status: ["Ativo", "Inativo"],
      contact_type: ["Lead", "Cliente", "Proprietário"],
      lead_purpose: ["Compra", "Locação", "Temporada"],
      lead_temperature: ["hot", "warm", "cold"],
      pipeline_type: ["captacao", "atendimento", "pos-venda"],
      property_category: [
        "residencial",
        "comercial",
        "industrial",
        "rural",
        "terreno",
      ],
      property_purpose: [
        "venda",
        "locação",
        "temporada",
        "lançamento",
        "exclusividade",
      ],
      property_status: [
        "ativo",
        "inativo",
        "vendido",
        "alugado",
        "reservado",
        "pendente",
        "rascunho",
      ],
      proposal_status: [
        "Em análise",
        "Aprovada",
        "Recusada",
        "Em negociação",
        "Contraproposta",
      ],
      ticket_category: ["bug", "feature", "duvida", "financeiro", "outro"],
      ticket_priority: ["baixa", "media", "alta", "urgente"],
      ticket_status: ["aberto", "em_andamento", "resolvido", "fechado"],
      timeline_event_type: [
        "proposta",
        "visita",
        "status",
        "edicao",
        "publicacao",
        "captacao",
        "nota",
        "whatsapp",
        "ligacao",
        "email",
      ],
      visit_status: ["Agendada", "Realizada", "Cancelada", "Não compareceu"],
    },
  },
} as const
