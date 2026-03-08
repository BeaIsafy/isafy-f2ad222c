import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWordpressSync } from "./useWordpressSync";
import { toast } from "@/hooks/use-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export function useProperties() {
  const { company } = useAuth();
  const { syncProperty } = useWordpressSync();
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ["properties", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id,
  });

  const createProperty = useMutation({
    mutationFn: async (property: Record<string, any>) => {
      if (!company?.id) throw new Error("Company not found");
      const { data, error } = await supabase
        .from("properties")
        .insert({ ...property, company_id: company.id } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Imóvel criado com sucesso!" });

      // Auto-sync to WordPress if publish_website is true
      if (data.publish_website) {
        try {
          await syncProperty(data.id, "publish");
        } catch {
          // Toast already shown by hook
        }
      }
    },
    onError: (err: any) => {
      toast({ title: "Erro ao criar imóvel", description: err.message, variant: "destructive" });
    },
  });

  const updateProperty = useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, any> & { id: string }) => {
      const { data, error } = await supabase
        .from("properties")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Imóvel atualizado!" });

      // WordPress sync logic
      const wasPublished = data.wp_post_id;
      const shouldPublish = data.publish_website;

      if (shouldPublish && wasPublished) {
        // Update existing WP post
        try { await syncProperty(data.id, "update"); } catch {}
      } else if (shouldPublish && !wasPublished) {
        // Publish new WP post
        try { await syncProperty(data.id, "publish"); } catch {}
      } else if (!shouldPublish && wasPublished) {
        // Unpublish from WP
        try { await syncProperty(data.id, "unpublish"); } catch {}
      }
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar imóvel", description: err.message, variant: "destructive" });
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      // Unpublish from WP first if needed
      const { data: prop } = await supabase.from("properties").select("wp_post_id, publish_website").eq("id", id).single();
      if (prop?.wp_post_id) {
        try { await syncProperty(id, "unpublish"); } catch {}
      }

      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Imóvel excluído" });
    },
    onError: (err: any) => {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    },
  });

  return {
    properties: propertiesQuery.data || [],
    isLoading: propertiesQuery.isLoading,
    createProperty,
    updateProperty,
    deleteProperty,
    syncProperty,
  };
}
