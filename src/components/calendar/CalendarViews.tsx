import { cn } from "@/lib/utils";
import {
  format,
  addDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CalendarEvent } from "./calendarTypes";

const typeStyles: Record<string, string> = {
  visit: "bg-primary/10 border-l-primary text-primary",
  task: "bg-warning/10 border-l-warning text-warning",
  meeting: "bg-info/10 border-l-info text-info",
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);

/* ─── Event Chip ─── */
function EventChip({
  event,
  compact,
  onClick,
}: {
  event: CalendarEvent;
  compact?: boolean;
  onClick: (e: CalendarEvent) => void;
}) {
  return (
    <div
      onClick={() => onClick(event)}
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

/* ─── Day View ─── */
export function DayView({
  date,
  events,
  onEventClick,
}: {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
}) {
  const dayEvents = events.filter((e) => isSameDay(e.date, date));
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <div className="border-b border-border/50 px-4 py-2">
        <p className="text-sm font-semibold capitalize text-foreground">
          {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
      <div className="relative">
        {HOURS.map((hour) => {
          const hourEvents = dayEvents.filter((e) => e.startHour === hour);
          return (
            <div key={hour} className="flex min-h-[56px] border-b border-border/30">
              <div className="w-16 shrink-0 py-2 text-right pr-3 text-xs text-muted-foreground">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div className="flex-1 py-1 px-2 space-y-1">
                {hourEvents.map((ev) => (
                  <EventChip key={ev.id} event={ev} onClick={onEventClick} />
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
export function WeekView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
}) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden overflow-x-auto">
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/50">
        <div />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn("py-2 text-center border-l border-border/30", isToday(day) && "bg-primary/5")}
          >
            <p className="text-[10px] uppercase text-muted-foreground">{format(day, "EEE", { locale: ptBR })}</p>
            <p className={cn("text-sm font-bold", isToday(day) ? "text-primary" : "text-foreground")}>
              {format(day, "dd")}
            </p>
          </div>
        ))}
      </div>
      {HOURS.map((hour) => (
        <div key={hour} className="grid grid-cols-[56px_repeat(7,1fr)] min-h-[52px] border-b border-border/30">
          <div className="py-1 pr-2 text-right text-xs text-muted-foreground">
            {String(hour).padStart(2, "0")}:00
          </div>
          {days.map((day) => {
            const dayEvents = events.filter((e) => isSameDay(e.date, day) && e.startHour === hour);
            return (
              <div
                key={day.toISOString()}
                className={cn("border-l border-border/30 px-1 py-0.5", isToday(day) && "bg-primary/[0.02]")}
              >
                {dayEvents.map((ev) => (
                  <EventChip key={ev.id} event={ev} compact onClick={onEventClick} />
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
export function MonthView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (e: CalendarEvent) => void;
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = addDays(startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 1 }), -1);
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd >= monthEnd ? calEnd : addDays(calEnd, 7) });

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
      <div className="grid grid-cols-7 border-b border-border/50">
        {dayNames.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-medium uppercase text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
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
                      onClick={() => onEventClick(ev)}
                      className={cn(
                        "truncate rounded px-1.5 py-0.5 text-[10px] font-medium border-l-2 cursor-pointer hover:opacity-80",
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
