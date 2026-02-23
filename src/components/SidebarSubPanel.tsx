import { useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import type { PanelType } from "./AppSidebar";

interface PanelItem {
  label: string;
  sub: string;
  value: string;
  path: string | null; // null = no navigation
}

const panelConfigs: Record<
  Exclude<PanelType, null>,
  { title: string; items: PanelItem[] }
> = {
  pipeline: {
    title: "Visão Geral",
    items: [
      { label: "Funil Captação", sub: "Captação de Imóveis", value: "0", path: "/pipeline?type=captacao" },
      { label: "Funil Atendimento", sub: "Atendimento e Agenda", value: "6", path: "/pipeline?type=atendimento" },
      { label: "Funil Pós-Venda", sub: "Pós-Vendas", value: "0", path: "/pipeline?type=pos_venda" },
    ],
  },
  properties: {
    title: "Visão Geral",
    items: [
      { label: "Total", sub: "Carteira de Imóveis", value: "7", path: null },
      { label: "Total", sub: "Saldo em VGV", value: "R$9.200.000", path: null },
      { label: "Comissão", sub: "Saldo em VGC", value: "R$552.000", path: null },
    ],
  },
  contacts: {
    title: "Visão Geral",
    items: [
      { label: "Leads", sub: "Total de Leads", value: "3", path: "/contacts?type=lead" },
      { label: "Clientes", sub: "Total de Clientes", value: "1", path: "/contacts?type=cliente" },
      { label: "Proprietários", sub: "Total de Proprietários", value: "1", path: "/contacts?type=proprietario" },
    ],
  },
};

export function SidebarSubPanel({
  panel,
  onClose,
}: {
  panel: Exclude<PanelType, null>;
  onClose: () => void;
}) {
  const config = panelConfigs[panel];
  const navigate = useNavigate();

  const handleItemClick = (item: PanelItem) => {
    if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

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
                strokeDasharray="57, 100"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary">
              R$6.884
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">12.000,00</p>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
