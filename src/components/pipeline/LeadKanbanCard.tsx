import { Flame, Thermometer, Snowflake, MessageCircle, CheckSquare, FileText, AlertTriangle, Clock, MoreHorizontal, CalendarPlus, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

interface LeadKanbanCardProps {
  lead: LeadCard;
  onClick: () => void;
  onWhatsApp?: () => void;
  onCreateTask?: () => void;
  onCreateProposal?: () => void;
  onScheduleVisit?: () => void;
  hideProposal?: boolean;
}

export function LeadKanbanCard({ lead, onClick, onWhatsApp, onCreateTask, onCreateProposal, onScheduleVisit, hideProposal }: LeadKanbanCardProps) {
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
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground leading-tight">{lead.name}</p>
        <Badge variant="outline" className={cn("shrink-0 gap-1 text-[10px] px-1.5 py-0.5", tempConfig[lead.temp].className)}>
          <TempIcon size={10} />
          {tempConfig[lead.temp].label}
        </Badge>
      </div>

      <div className="mb-2.5 space-y-0.5">
        <p className="text-xs text-muted-foreground">{lead.purpose} · {lead.neighborhood}</p>
        <p className="text-xs font-medium text-foreground">
          {formatPrice(lead.minPrice)} – {formatPrice(lead.maxPrice)}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); onWhatsApp?.(); }} className="rounded p-1 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors" title="WhatsApp">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted group-hover:opacity-100">
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onWhatsApp?.(); }}><MessageCircle size={14} className="mr-2" /> Abrir WhatsApp</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreateTask?.(); }}><CheckSquare size={14} className="mr-2" /> Criar Tarefa</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCreateProposal?.(); }}><FileText size={14} className="mr-2" /> Criar Proposta</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onScheduleVisit?.(); }}><CalendarPlus size={14} className="mr-2" /> Agendar Visita</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
