import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startHour: number;
  endHour: number;
  type: "visit" | "task" | "meeting";
}

const typeStyles: Record<string, string> = {
  visit: "bg-primary/10 border-l-primary text-primary",
  task: "bg-warning/10 border-l-warning text-warning",
  meeting: "bg-info/10 border-l-info text-info",
};

const today = new Date();

const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Visita - Apt Vila Mariana", date: today, startHour: 9, endHour: 10, type: "visit" },
  { id: "2", title: "Follow-up Maria Santos", date: today, startHour: 11, endHour: 12, type: "task" },
  { id: "3", title: "Reunião equipe", date: today, startHour: 14, endHour: 15, type: "meeting" },
  { id: "4", title: "Visita - Casa Morumbi", date: today, startHour: 16, endHour: 17, type: "visit" },
  { id: "5", title: "Avaliação Imóvel", date: addDays(today, 1), startHour: 10, endHour: 11, type: "visit" },
  { id: "6", title: "Proposta Cliente", date: addDays(today, 2), startHour: 14, endHour: 15, type: "task" },
  { id: "7", title: "Reunião Captação", date: addDays(today, 3), startHour: 9, endHour: 10, type: "meeting" },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7h - 19h

type ViewType = "dia" | "semana" | "mes";

const CalendarPage = () => {
  const [view, setView] = useState<ViewType>("semana");
  const [currentDate, setCurrentDate] = useState(today);

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

  const eventsForDay = (day: Date) => mockEvents.filter((e) => isSameDay(e.date, day));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus compromissos</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2">
          <Plus size={16} /> Novo Evento
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} />
          </Button>
          <span className="min-w-[180px] text-center text-sm font-semibold capitalize text-foreground">
            {headerLabel}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigate(1)}>
            <ChevronRight size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="ml-2 text-xs" onClick={() => setCurrentDate(today)}>
            Hoje
          </Button>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                view === v
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v === "mes" ? "mês" : v}
            </button>
          ))}
        </div>
      </div>

      {/* Views */}
      {view === "dia" && <DayView date={currentDate} events={eventsForDay(currentDate)} />}
      {view === "semana" && <WeekView currentDate={currentDate} events={mockEvents} />}
      {view === "mes" && <MonthView currentDate={currentDate} events={mockEvents} />}
    </div>
  );
};

/* ─── Day View ─── */
function DayView({ date, events }: { date: Date; events: CalendarEvent[] }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="border-b border-border/50 px-4 py-2">
        <p className="text-sm font-semibold capitalize text-foreground">
          {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
      <div className="relative">
        {HOURS.map((hour) => {
          const hourEvents = events.filter((e) => e.startHour === hour);
          return (
            <div key={hour} className="flex min-h-[56px] border-b border-border/30">
              <div className="w-16 shrink-0 py-2 text-right pr-3 text-xs text-muted-foreground">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div className="flex-1 py-1 px-2 space-y-1">
                {hourEvents.map((ev) => (
                  <EventChip key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Week View ─── */
function WeekView({ currentDate, events }: { currentDate: Date; events: CalendarEvent[] }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden overflow-x-auto">
      {/* Day headers */}
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/50">
        <div />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "py-2 text-center border-l border-border/30",
              isToday(day) && "bg-primary/5"
            )}
          >
            <p className="text-[10px] uppercase text-muted-foreground">
              {format(day, "EEE", { locale: ptBR })}
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                isToday(day)
                  ? "text-primary"
                  : "text-foreground"
              )}
            >
              {format(day, "dd")}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      {HOURS.map((hour) => (
        <div key={hour} className="grid grid-cols-[56px_repeat(7,1fr)] min-h-[52px] border-b border-border/30">
          <div className="py-1 pr-2 text-right text-xs text-muted-foreground">
            {String(hour).padStart(2, "0")}:00
          </div>
          {days.map((day) => {
            const dayEvents = events.filter(
              (e) => isSameDay(e.date, day) && e.startHour === hour
            );
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-l border-border/30 px-1 py-0.5",
                  isToday(day) && "bg-primary/[0.02]"
                )}
              >
                {dayEvents.map((ev) => (
                  <EventChip key={ev.id} event={ev} compact />
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Month View ─── */
function MonthView({ currentDate, events }: { currentDate: Date; events: CalendarEvent[] }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = addDays(startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 1 }), -1);
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd >= monthEnd ? calEnd : addDays(calEnd, 7) });

  // Ensure we have complete weeks (multiple of 7)
  const weeks: Date[][] = [];
  const gridDays = eachDayOfInterval({
    start: calStart,
    end: addDays(calStart, Math.ceil(allDays.length / 7) * 7 - 1),
  });
  for (let i = 0; i < gridDays.length; i += 7) {
    weeks.push(gridDays.slice(i, i + 7));
  }

  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-medium uppercase text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-border/30 last:border-b-0">
          {week.map((day) => {
            const dayEvs = events.filter((e) => isSameDay(e.date, day));
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[80px] border-l border-border/30 first:border-l-0 p-1.5",
                  !isSameMonth(day, currentDate) && "bg-muted/30",
                  isToday(day) && "bg-primary/5"
                )}
              >
                <p
                  className={cn(
                    "mb-1 text-xs font-medium",
                    isToday(day)
                      ? "flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-primary-foreground"
                      : !isSameMonth(day, currentDate)
                      ? "text-muted-foreground/50"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </p>
                <div className="space-y-0.5">
                  {dayEvs.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className={cn(
                        "truncate rounded px-1.5 py-0.5 text-[10px] font-medium border-l-2",
                        typeStyles[ev.type]
                      )}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvs.length > 2 && (
                    <p className="text-[10px] text-muted-foreground pl-1">+{dayEvs.length - 2} mais</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── Event Chip ─── */
function EventChip({ event, compact }: { event: CalendarEvent; compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md border-l-[3px] px-2 py-1 cursor-pointer transition-opacity hover:opacity-80",
        typeStyles[event.type]
      )}
    >
      <p className={cn("font-semibold truncate", compact ? "text-[10px]" : "text-xs")}>
        {event.title}
      </p>
      <p className={cn("opacity-70", compact ? "text-[9px]" : "text-[11px]")}>
        {String(event.startHour).padStart(2, "0")}:00 — {String(event.endHour).padStart(2, "0")}:00
      </p>
    </div>
  );
}

export default CalendarPage;
