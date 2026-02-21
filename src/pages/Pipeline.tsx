import { motion } from "framer-motion";
import { Plus, Search, Flame, Thermometer, Snowflake, MessageCircle, CheckSquare, FileText, AlertTriangle, Clock, MoreHorizontal, Phone, CalendarPlus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type PipelineType = "atendimento" | "captacao" | "pos_venda";

const pipelineConfigs: Record<PipelineType, { label: string; stages: string[] }> = {
  atendimento: {
    label: "Atendimento",
    stages: ["Novo Lead", "Contato Inicial", "Qualificação", "Envio de Imóveis", "Visita Agendada", "Proposta Enviada", "Negociação", "Fechado", "Perdido"],
  },
  captacao: {
    label: "Captação",
    stages: ["Novo Proprietário", "Contato Inicial", "Avaliação Agendada", "Avaliação Realizada", "Proposta Captação", "Exclusividade", "Imóvel Captado"],
  },
  pos_venda: {
    label: "Pós-Vendas",
    stages: ["Contrato Assinado", "Documentação", "Escritura", "Entrega Chaves", "Follow-up 30d", "Avaliação", "Fidelizado"],
  },
};

export interface LeadCard {
  id: string;
  name: string;
  temp: "hot" | "warm" | "cold";
  purpose: "Compra" | "Locação" | "Temporada";
  minPrice: number;
  maxPrice: number;
  neighborhood: string;
  broker: string;
  brokerInitials: string;
  lastInteraction: string;
  daysWithoutUpdate: number;
  hasPendingTask: boolean;
  hasActiveProposal: boolean;
}

const mockLeads: Record<string, LeadCard[]> = {
  "Novo Lead": [
    { id: "1", name: "Carlos Mendes", temp: "warm", purpose: "Compra", minPrice: 400000, maxPrice: 600000, neighborhood: "Moema", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: false },
    { id: "2", name: "Fernanda Lima", temp: "hot", purpose: "Locação", minPrice: 3000, maxPrice: 5000, neighborhood: "Alphaville", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Contato Inicial": [
    { id: "3", name: "Roberto Silva", temp: "cold", purpose: "Compra", minPrice: 250000, maxPrice: 350000, neighborhood: "Vila Olímpia", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Há 3 dias", daysWithoutUpdate: 3, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Qualificação": [
    { id: "4", name: "Patrícia Souza", temp: "hot", purpose: "Compra", minPrice: 1200000, maxPrice: 2000000, neighborhood: "Itaim Bibi", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Há 6 dias", daysWithoutUpdate: 6, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Visita Agendada": [
    { id: "5", name: "Lucas Oliveira", temp: "warm", purpose: "Compra", minPrice: 800000, maxPrice: 1200000, neighborhood: "Jardins", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: true },
  ],
  "Proposta Enviada": [
    { id: "6", name: "Maria Eduarda", temp: "hot", purpose: "Locação", minPrice: 4000, maxPrice: 6000, neighborhood: "Pinheiros", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: false, hasActiveProposal: true },
  ],
};

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function getSLAClass(days: number) {
  if (days >= 5) return "border-l-destructive";
  if (days > 2) return "border-l-warning";
  return "border-l-transparent";
}

const Pipeline = () => {
  const [activeType, setActiveType] = useState<PipelineType>("atendimento");
  const [search, setSearch] = useState("");
  const config = pipelineConfigs[activeType];
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu funil de negócios</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2">
          <Plus size={16} /> Novo Lead
        </Button>
      </div>

      {/* Pipeline tabs */}
      <div className="flex gap-2">
        {(Object.keys(pipelineConfigs) as PipelineType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeType === type
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {pipelineConfigs[type].label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar no pipeline..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: config.stages.length * 290 }}>
          {config.stages.map((stage, i) => {
            const cards = (activeType === "atendimento" ? mockLeads[stage] : undefined) || [];
            const filtered = cards.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="w-[280px] shrink-0"
              >
                <div className="rounded-xl border border-border/50 bg-card p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                      {filtered.length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {filtered.map((lead) => (
                      <LeadKanbanCard key={lead.id} lead={lead} onClick={() => navigate(`/leads/${lead.id}`)} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function LeadKanbanCard({ lead, onClick }: { lead: LeadCard; onClick: () => void }) {
  const TempIcon = tempConfig[lead.temp].icon;
  const slaClass = getSLAClass(lead.daysWithoutUpdate);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border border-border/40 border-l-[3px] bg-background p-3 shadow-card transition-all hover:shadow-card-hover",
        slaClass
      )}
    >
      {/* Top: Name + Temp badge */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{lead.name}</p>
        <Badge variant="outline" className={cn("shrink-0 gap-1 text-[10px] px-1.5 py-0.5", tempConfig[lead.temp].className)}>
          <TempIcon size={10} />
          {tempConfig[lead.temp].label}
        </Badge>
      </div>

      {/* Center: Purpose, Price, Neighborhood */}
      <div className="mb-2.5 space-y-0.5">
        <p className="text-xs text-muted-foreground">{lead.purpose} · {lead.neighborhood}</p>
        <p className="text-xs font-medium text-foreground">
          {formatPrice(lead.minPrice)} – {formatPrice(lead.maxPrice)}
        </p>
      </div>

      {/* Bottom icons row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); }} className="rounded p-1 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors" title="WhatsApp">
            <MessageCircle size={14} />
          </button>
          {lead.hasPendingTask && (
            <span className="flex items-center gap-0.5 rounded bg-warning/10 px-1 py-0.5 text-[10px] font-medium text-warning">
              <CheckSquare size={10} /> Tarefa
            </span>
          )}
          {lead.hasActiveProposal && (
            <span className="flex items-center gap-0.5 rounded bg-info/10 px-1 py-0.5 text-[10px] font-medium text-info">
              <FileText size={10} /> Proposta
            </span>
          )}
          {lead.daysWithoutUpdate >= 5 && (
            <span className="flex items-center gap-0.5 rounded bg-destructive/10 px-1 py-0.5 text-[10px] font-medium text-destructive">
              <AlertTriangle size={10} /> Risco
            </span>
          )}
        </div>

        {/* Quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted group-hover:opacity-100">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem><MessageCircle size={14} className="mr-2" /> Abrir WhatsApp</DropdownMenuItem>
            <DropdownMenuItem><CheckSquare size={14} className="mr-2" /> Criar Tarefa</DropdownMenuItem>
            <DropdownMenuItem><FileText size={14} className="mr-2" /> Criar Proposta</DropdownMenuItem>
            <DropdownMenuItem><CalendarPlus size={14} className="mr-2" /> Agendar Visita</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><XCircle size={14} className="mr-2" /> Marcar Perdido</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Footer: avatar + date */}
      <div className="mt-2.5 flex items-center justify-between border-t border-border/30 pt-2">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">{lead.brokerInitials}</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">{lead.broker}</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock size={10} /> {lead.lastInteraction}
        </span>
      </div>
    </div>
  );
}

export default Pipeline;
