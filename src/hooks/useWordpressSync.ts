import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type SyncAction = "publish" | "update" | "unpublish";

export function useWordpressSync() {
  const syncProperty = async (propertyId: string, action: SyncAction) => {
    try {
      const { data, error } = await supabase.functions.invoke("sync-wordpress", {
        body: { property_id: propertyId, action },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const messages: Record<SyncAction, string> = {
        publish: "Imóvel publicado no WordPress!",
        update: "Imóvel atualizado no WordPress!",
        unpublish: "Imóvel removido do WordPress!",
      };

      toast({ title: messages[action], description: data?.wp_url || undefined });
      return data;
    } catch (err: any) {
      console.error("WordPress sync error:", err);
      toast({
        title: "Erro ao sincronizar com WordPress",
        description: err.message || "Verifique as configurações de integração.",
        variant: "destructive",
      });
      throw err;
    }
  };

  return { syncProperty };
}
