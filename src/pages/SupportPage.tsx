import { Plus, Search, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NewTicketModal } from "@/components/support/NewTicketModal";
import { TicketDetailModal } from "@/components/support/TicketDetailModal";
import { useSupportTickets } from "@/hooks/useSupabaseData";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  aberto: "bg-destructive/10 text-destructive",
  em_andamento: "bg-warning/10 text-warning",
  resolvido: "bg-success/10 text-success",
  fechado: "bg-muted text-muted-foreground"
};

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
  fechado: "Fechado"
};

const SupportPage = () => {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState("");
  const { data: tickets = [], isLoading } = useSupportTickets();

  const filteredTickets = (tickets as any[]).filter((t) =>
  (t.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>);

  }

  return (
    <div className="space-y-6">
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

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 flex-1 sm:flex-none" asChild>
          
        </Button>
        <Button variant="outline" className="gap-2 flex-1 sm:flex-none" asChild>
          <a href="#" onClick={(e) => e.preventDefault()}><BookOpen size={16} className="text-primary" /> Manual</a>
        </Button>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Meus Chamados</CardTitle>
          <div className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="h-8 pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredTickets.length === 0 &&
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum chamado encontrado.</p>
          }
          {filteredTickets.map((t: any) =>
          <div
            key={t.id}
            onClick={() => setSelectedTicket({
              id: `#${t.id.slice(0, 4)}`,
              subject: t.subject,
              status: statusLabels[t.status] || t.status,
              date: t.created_at ? format(new Date(t.created_at), "dd/MM/yyyy") : ""
            })}
            className="flex items-center justify-between rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            
              <div>
                <p className="text-sm font-semibold text-foreground">{t.subject}</p>
                <p className="text-xs text-muted-foreground">
                  {t.created_at ? format(new Date(t.created_at), "dd/MM/yyyy") : ""}
                </p>
              </div>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor[t.status] || "bg-muted text-muted-foreground")}>
                {statusLabels[t.status] || t.status}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <NewTicketModal open={showNewTicket} onClose={() => setShowNewTicket(false)} />
      <TicketDetailModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </div>);

};

export default SupportPage;