import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./calendarTypes";

const typeLabels: Record<string, string> = {
  visit: "Visita",
  task: "Tarefa",
  meeting: "Reunião",
};

const typeColors: Record<string, string> = {
  visit: "bg-primary/10 text-primary border-primary/30",
  task: "bg-warning/10 text-warning border-warning/30",
  meeting: "bg-info/10 text-info border-info/30",
};

const pipelineLabels: Record<string, string> = {
  captacao: "Funil de Captação",
  atendimento: "Funil de Atendimento",
  "pos-venda": "Funil de Pós-Venda",
};

interface EventDetailModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Type badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", typeColors[event.type])}>
              {typeLabels[event.type]}
            </Badge>
            {event.pipeline && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                <Layers size={10} className="mr-1" />
                {pipelineLabels[event.pipeline] || event.pipeline}
              </Badge>
            )}
          </div>

          {/* Date & time */}
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar size={14} className="text-muted-foreground" />
            <span>{event.date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock size={14} className="text-muted-foreground" />
            <span>
              {String(event.startHour).padStart(2, "0")}:00 — {String(event.endHour).padStart(2, "0")}:00
            </span>
          </div>

          {/* Contact */}
          {event.contact && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <User size={14} className="text-muted-foreground" />
              <span>{event.contact}</span>
            </div>
          )}

          {/* Address */}
          {event.address && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin size={14} className="text-muted-foreground" />
              <span>{event.address}</span>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
              {event.notes}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
