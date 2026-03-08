import { Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EventTypeFilter = "all" | "visit" | "task" | "meeting";
export type PipelineFilter = "all" | "captacao" | "atendimento" | "pos-venda";

interface CalendarFiltersProps {
  eventType: EventTypeFilter;
  setEventType: (v: EventTypeFilter) => void;
  pipeline: PipelineFilter;
  setPipeline: (v: PipelineFilter) => void;
  isAdmin?: boolean;
  selectedCorretor: string;
  setSelectedCorretor: (v: string) => void;
}

const corretores = [
  { id: "all", name: "Todos os Corretores" },
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Carlos Oliveira" },
];

const eventTypes: { value: EventTypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "visit", label: "Visitas" },
  { value: "task", label: "Tarefas" },
  { value: "meeting", label: "Reuniões" },
];

const pipelines: { value: PipelineFilter; label: string }[] = [
  { value: "all", label: "Todos os Funis" },
  { value: "captacao", label: "Captação" },
  { value: "atendimento", label: "Atendimento" },
  { value: "pos-venda", label: "Pós-Venda" },
];

export function CalendarFilters({
  eventType,
  setEventType,
  pipeline,
  setPipeline,
  isAdmin = false,
  selectedCorretor,
  setSelectedCorretor,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter size={14} className="text-muted-foreground" />

      {/* Event type pills */}
      <div className="flex gap-1 rounded-lg bg-muted p-0.5">
        {eventTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setEventType(t.value)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              eventType === t.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pipeline filter */}
      <select
        value={pipeline}
        onChange={(e) => setPipeline(e.target.value as PipelineFilter)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {pipelines.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {/* Admin: corretor filter */}
      {isAdmin && (
        <div className="flex items-center gap-1.5 ml-auto">
          <Users size={14} className="text-muted-foreground" />
          <select
            value={selectedCorretor}
            onChange={(e) => setSelectedCorretor(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {corretores.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
