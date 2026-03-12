import { useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import type { PanelType } from "./AppSidebar";
import { useProperties, useContacts } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

interface PanelItem {
  label: string;
  sub: string;
  value: string;
  path: string | null;
}

function formatBRL(v: number) {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (v >= 1_000) return `R$${(v / 1_000).toFixed(0)}mil`;
  return `R$${v.toFixed(0)}`;
}

function useCurrentMonthGoal() {
  const { user, company } = useAuth();
  const month = new Date().toISOString().slice(0, 7) + "-01";
  return useQuery({
    queryKey: ["broker_goals", user?.id, month],
    queryFn: async () => {
      if (!user?.id || !company?.id) return null;
      const { data } = await supabase
        .from("broker_goals")
        .select("*")
        .eq("profile_id", user.id)
        .eq("month", month)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id && !!company?.id,
  });
}

export function SidebarSubPanel({
  panel,
  onClose,
}: {
  panel: Exclude<PanelType, null>;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { data: properties = [] } = useProperties();
  const { data: contacts = [] } = useContacts();
  const { data: goal } = useCurrentMonthGoal();

  const propertiesStats = useMemo(() => {
    const items = properties as any[];
    const total = items.length;
    const vgv = items.reduce((sum: number, p: any) => sum + (p.sale_price || 0), 0);
    const vgc = items.reduce((sum: number, p: any) => {
      const price = p.sale_price || 0;
      const comm = p.commission_direct || 6;
      return sum + (price * comm / 100);
    }, 0);
    return { total, vgv, vgc };
  }, [properties]);

  const contactsStats = useMemo(() => {
    const items = contacts as any[];
    return {
      leads: items.filter((c: any) => c.type === "Lead").length,
      clients: items.filter((c: any) => c.type === "Cliente").length,
      owners: items.filter((c: any) => c.type === "Proprietário").length,
    };
  }, [contacts]);

  const panelConfigs: Record<Exclude<PanelType, null>, { title: string; items: PanelItem[] }> = {
    pipeline: {
      title: "Visão Geral",
      items: [
        { label: "Funil Captação", sub: "Captação de Imóveis", value: "—", path: "/pipeline?type=captacao" },
        { label: "Funil Atendimento", sub: "Atendimento e Agenda", value: "—", path: "/pipeline?type=atendimento" },
        { label: "Funil Pós-Venda", sub: "Pós-Vendas", value: "—", path: "/pipeline?type=pos_venda" },
      ],
    },
    properties: {
      title: "Visão Geral",
      items: [
        { label: "Total", sub: "Carteira de Imóveis", value: String(propertiesStats.total), path: null },
        { label: "Total", sub: "Saldo em VGV", value: formatBRL(propertiesStats.vgv), path: null },
        { label: "Comissão", sub: "Saldo em VGC", value: formatBRL(propertiesStats.vgc), path: null },
      ],
    },
    contacts: {
      title: "Visão Geral",
      items: [
        { label: "Leads", sub: "Total de Leads", value: String(contactsStats.leads), path: "/contacts?type=lead" },
        { label: "Clientes", sub: "Total de Clientes", value: String(contactsStats.clients), path: "/contacts?type=cliente" },
        { label: "Proprietários", sub: "Total de Proprietários", value: String(contactsStats.owners), path: "/contacts?type=proprietario" },
      ],
    },
  };

  const config = panelConfigs[panel];

  const handleItemClick = (item: PanelItem) => {
    if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  // Goal progress
  const goalTarget = goal?.target_value || 0;
  const goalAchieved = goal?.achieved_value || 0;
  const goalPercent = goalTarget > 0 ? Math.min((goalAchieved / goalTarget) * 100, 100) : 0;

  return (
    <div className="fixed left-[60px] top-0 z-30 flex h-screen w-[220px] flex-col border-r border-sidebar-border bg-sidebar animate-in slide-in-from-left-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4">
        <p className="text-sm font-bold text-sidebar-foreground">{config.title}</p>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-1 px-3 pt-3 overflow-y-auto">
        {config.items.map((item, i) => (
          <button
            key={i}
            onClick={() => handleItemClick(item)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-sidebar-accent group text-left ${
              item.path ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.sub}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-sidebar-foreground">{item.value}</span>
              {item.path && <ChevronRight size={14} className="text-muted-foreground" />}
            </div>
          </button>
        ))}
      </div>

      {/* Meta mensal */}
      <div className="mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
        <p className="text-xs font-semibold text-sidebar-foreground">Minha Meta</p>
        <p className="text-[10px] text-muted-foreground">Meta Mensal de Comissões</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${goalPercent}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary">
              {goalAchieved > 0 ? formatBRL(goalAchieved) : "—"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">
              {goalTarget > 0 ? goalTarget.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "Sem meta"}
            </p>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
