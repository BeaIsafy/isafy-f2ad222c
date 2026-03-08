import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, startOfWeek, parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarFilters, type EventTypeFilter, type PipelineFilter } from "@/components/calendar/CalendarFilters";
import { DayView, WeekView, MonthView } from "@/components/calendar/CalendarViews";
import { NewEventModal } from "@/components/calendar/NewEventModal";
import { EventDetailModal } from "@/components/calendar/EventDetailModal";
import type { CalendarEvent } from "@/components/calendar/calendarTypes";
import { useCalendarEvents } from "@/hooks/useSupabaseData";

const today = new Date();

type ViewType = "dia" | "semana" | "mes";

const CalendarPage = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<ViewType>("semana");
  const [mobileInitialized, setMobileInitialized] = useState(false);
  const { data: dbEvents = [], isLoading } = useCalendarEvents();

  useEffect(() => {
    if (isMobile && !mobileInitialized) {
      setView("dia");
      setMobileInitialized(true);
    }
  }, [isMobile, mobileInitialized]);

  const [currentDate, setCurrentDate] = useState(today);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filters
  const [eventType, setEventType] = useState<EventTypeFilter>("all");
  const [pipeline, setPipeline] = useState<PipelineFilter>("all");
  const [selectedCorretor, setSelectedCorretor] = useState("all");
  const isAdmin = true;

  // Convert DB events to CalendarEvent format
  const events: CalendarEvent[] = useMemo(() => {
    return (dbEvents as any[]).map((e) => ({
      id: e.id,
      title: e.title,
      date: parseISO(e.date),
      startHour: e.start_hour,
      endHour: e.end_hour,
      type: (e.type || "task") as CalendarEvent["type"],
      pipeline: e.pipeline as CalendarEvent["pipeline"],
      contact: e.contact || undefined,
      address: e.address || undefined,
      notes: e.notes || undefined,
      corretorId: e.broker_id || undefined,
    }));
  }, [dbEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (eventType !== "all" && e.type !== eventType) return false;
      if (pipeline !== "all" && e.pipeline !== pipeline) return false;
      if (selectedCorretor !== "all" && e.corretorId && e.corretorId !== selectedCorretor) return false;
      return true;
    });
  }, [events, eventType, pipeline, selectedCorretor]);

  const navigate = (dir: -1 | 1) => {
    setCurrentDate((d) =>
      view === "dia" ? (dir === 1 ? addDays(d, 1) : subDays(d, 1)) :
      view === "semana" ? (dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1)) :
      dir === 1 ? addMonths(d, 1) : subMonths(d, 1)
    );
  };

  const headerLabel = useMemo(() => {
    if (view === "dia") return format(currentDate, "dd 'de' MMMM yyyy", { locale: ptBR });
    if (view === "semana") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addDays(start, 6);
      return `${format(start, "dd MMM", { locale: ptBR })} — ${format(end, "dd MMM yyyy", { locale: ptBR })}`;
    }
    return format(currentDate, "MMMM yyyy", { locale: ptBR });
  }, [currentDate, view]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus compromissos</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={() => setShowNewEvent(true)}>
          <Plus size={16} /> Novo Evento
        </Button>
      </div>

      <CalendarFilters
        eventType={eventType} setEventType={setEventType}
        pipeline={pipeline} setPipeline={setPipeline}
        isAdmin={isAdmin} selectedCorretor={selectedCorretor} setSelectedCorretor={setSelectedCorretor}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ChevronLeft size={16} /></Button>
          <span className="min-w-[180px] text-center text-sm font-semibold capitalize text-foreground">{headerLabel}</span>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}><ChevronRight size={16} /></Button>
          <Button variant="ghost" size="sm" className="ml-2 text-xs" onClick={() => setCurrentDate(today)}>Hoje</Button>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={cn("rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "mes" ? "mês" : v}
            </button>
          ))}
        </div>
      </div>

      {view === "dia" && <DayView date={currentDate} events={filteredEvents} onEventClick={setSelectedEvent} />}
      {view === "semana" && <WeekView currentDate={currentDate} events={filteredEvents} onEventClick={setSelectedEvent} />}
      {view === "mes" && <MonthView currentDate={currentDate} events={filteredEvents} onEventClick={setSelectedEvent} />}

      <NewEventModal open={showNewEvent} onClose={() => setShowNewEvent(false)} />
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

export default CalendarPage;
