import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Layers, Check, CalendarClock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
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

function EventContent({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const handleComplete = () => {
    toast.success("Evento concluído com sucesso!");
    onClose();
  };

  const handleReschedule = () => {
    toast.info("Funcionalidade de reagendamento em breve.");
    onClose();
  };

  const handleCancel = () => {
    toast("Evento cancelado.", { icon: <X size={14} /> });
    onClose();
  };

  return (
    <>
      <div className="space-y-3 py-2">
        <div className="flex items-center gap-2 flex-wrap">
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

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Calendar size={14} className="text-muted-foreground shrink-0" />
          <span>{event.date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock size={14} className="text-muted-foreground shrink-0" />
          <span>
            {String(event.startHour).padStart(2, "0")}:00 — {String(event.endHour).padStart(2, "0")}:00
          </span>
        </div>

        {event.contact && (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <User size={14} className="text-muted-foreground shrink-0" />
            <span>{event.contact}</span>
          </div>
        )}

        {event.address && (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={14} className="text-muted-foreground shrink-0" />
            <span>{event.address}</span>
          </div>
        )}

        {event.notes && (
          <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            {event.notes}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row pt-2">
        <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive w-full sm:w-auto" onClick={handleCancel}>
          <X size={14} /> Cancelar Evento
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto" onClick={handleReschedule}>
          <CalendarClock size={14} /> Reagendar
        </Button>
        <Button size="sm" className="gap-1.5 gradient-primary text-primary-foreground w-full sm:w-auto" onClick={handleComplete}>
          <Check size={14} /> Concluir
        </Button>
      </div>
    </>
  );
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const isMobile = useIsMobile();

  if (!event) return null;

  if (isMobile) {
    return (
      <Drawer open={!!event} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-base">{event.title}</DrawerTitle>
          </DrawerHeader>
          <EventContent event={event} onClose={onClose} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!event} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {event.title}
          </DialogTitle>
        </DialogHeader>
        <EventContent event={event} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
