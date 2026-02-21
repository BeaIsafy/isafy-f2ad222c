import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const events = [
  { title: "Visita - Apt Vila Mariana", time: "09:00 - 10:00", type: "visit", color: "bg-primary/10 border-l-primary text-primary" },
  { title: "Follow-up Maria Santos", time: "11:00", type: "task", color: "bg-warning/10 border-l-warning text-warning" },
  { title: "Reunião equipe", time: "14:00 - 15:00", type: "meeting", color: "bg-info/10 border-l-info text-info" },
  { title: "Visita - Casa Morumbi", time: "16:00 - 17:00", type: "visit", color: "bg-primary/10 border-l-primary text-primary" },
];

const CalendarPage = () => {
  const [view, setView] = useState<"dia" | "semana" | "mes">("semana");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus compromissos</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2"><Plus size={16} /> Novo Evento</Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft size={16} /></Button>
          <span className="text-sm font-semibold text-foreground px-2">Fevereiro 2026</span>
          <Button variant="outline" size="icon"><ChevronRight size={16} /></Button>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all ${view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon size={18} className="text-primary" /> Compromissos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((event) => (
            <div key={event.title} className={`rounded-lg border-l-4 p-3 ${event.color} cursor-pointer transition-all hover:opacity-80`}>
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs opacity-70">{event.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
