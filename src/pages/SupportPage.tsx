import { HelpCircle, Plus, Search, MessageCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faqs = [
  { q: "Como cadastrar um novo imóvel?", a: "Acesse Imóveis > Novo Imóvel e preencha o formulário passo a passo." },
  { q: "Como funciona o pipeline?", a: "O pipeline é um Kanban visual onde você arrasta cards entre etapas do funil." },
  { q: "Como convidar corretores?", a: "Vá em Configurações > Equipe e adicione o e-mail do colaborador." },
];

const tickets = [
  { id: "#1024", subject: "Erro ao carregar imóveis", status: "Aberto", date: "20/02/2026" },
  { id: "#1023", subject: "Integração WhatsApp", status: "Em andamento", date: "18/02/2026" },
  { id: "#1022", subject: "Exportar relatório PDF", status: "Finalizado", date: "15/02/2026" },
];

const statusColor: Record<string, string> = {
  Aberto: "bg-destructive/10 text-destructive",
  "Em andamento": "bg-warning/10 text-warning",
  Finalizado: "bg-success/10 text-success",
};

const SupportPage = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Suporte</h1>
        <p className="text-sm text-muted-foreground">Central de ajuda e chamados</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><MessageCircle size={16} /> Chat Online</Button>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2"><Plus size={16} /> Novo Chamado</Button>
      </div>
    </div>

    {/* FAQ */}
    <Card className="shadow-card border-border/50">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><HelpCircle size={18} className="text-primary" /> Perguntas Frequentes</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-lg border border-border/50 p-3">
            <p className="text-sm font-semibold text-foreground">{faq.q}</p>
            <p className="mt-1 text-xs text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Tickets */}
    <Card className="shadow-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Meus Chamados</CardTitle>
        <div className="relative w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar..." className="h-8 pl-8 text-xs" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tickets.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-foreground">{t.subject}</p>
              <p className="text-xs text-muted-foreground">{t.id} · {t.date}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[t.status]}`}>{t.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default SupportPage;
