import { Plus, Search, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NewTicketModal } from "@/components/support/NewTicketModal";
import { TicketDetailModal } from "@/components/support/TicketDetailModal";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  date: string;
}

const tickets: Ticket[] = [
  { id: "#1024", subject: "Erro ao carregar imóveis", status: "Aberto", date: "20/02/2026" },
  { id: "#1023", subject: "Integração WhatsApp", status: "Em andamento", date: "18/02/2026" },
  { id: "#1022", subject: "Exportar relatório PDF", status: "Finalizado", date: "15/02/2026" },
];

const statusColor: Record<string, string> = {
  Aberto: "bg-destructive/10 text-destructive",
  "Em andamento": "bg-warning/10 text-warning",
  Finalizado: "bg-success/10 text-success",
};

const SupportPage = () => {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Suporte</h1>
          <p className="text-sm text-muted-foreground">Central de ajuda e chamados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><MessageCircle size={16} /> Chat Online</Button>
          <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={() => setShowNewTicket(true)}>
            <Plus size={16} /> Novo Chamado
          </Button>
        </div>
      </div>

      {/* Quick links: FAQ & Manual */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 flex-1 sm:flex-none" asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <HelpCircle size={16} className="text-primary" /> FAQ
          </a>
        </Button>
        <Button variant="outline" className="gap-2 flex-1 sm:flex-none" asChild>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <BookOpen size={16} className="text-primary" /> Manual
          </a>
        </Button>
      </div>

      {/* Tickets */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Meus Chamados</CardTitle>
          <div className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="h-8 pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredTickets.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum chamado encontrado.</p>
          )}
          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="flex items-center justify-between rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{t.subject}</p>
                <p className="text-xs text-muted-foreground">{t.id} · {t.date}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor[t.status])}>
                {t.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <NewTicketModal open={showNewTicket} onClose={() => setShowNewTicket(false)} />
      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>
  );
};

export default SupportPage;
