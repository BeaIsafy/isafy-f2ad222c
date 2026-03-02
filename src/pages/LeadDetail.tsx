import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, CheckSquare, FileText, XCircle,
  Flame, Thermometer, Snowflake, Send, Building2, BedDouble, Bath,
  Car, Maximize, MapPin, DollarSign, TrendingUp, Clock, AlertTriangle,
  Plus, User, Mail, Globe, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

// Mock data for a single lead
const mockLead = {
  id: "1",
  name: "Carlos Mendes",
  phone: "(11) 99876-5432",
  email: "carlos.mendes@email.com",
  origin: "Portal ZAP",
  broker: "Ana Costa",
  brokerInitials: "AC",
  temp: "warm" as const,
  stage: "Qualificação",
  purpose: "Compra",
  propertyType: "Apartamento",
  minPrice: 400000,
  maxPrice: 600000,
  bedrooms: 2,
  bathrooms: 2,
  parkingSpots: 1,
  minArea: 60,
  neighborhoods: ["Moema", "Vila Mariana"],
  cities: ["São Paulo"],
  closingProbability: 65,
  avgTimeInStage: "4 dias",
  slaRemaining: "1 dia",
  estimatedVGV: 550000,
  estimatedCommission: 16500,
  daysWithoutUpdate: 2,
};

const mockTimeline = [
  { id: "t1", type: "stage_change", date: "21/02/2026 10:30", user: "Ana Costa", description: "Movido de 'Contato Inicial' para 'Qualificação'" },
  { id: "t2", type: "whatsapp", date: "20/02/2026 15:45", user: "Ana Costa", description: "Enviou mensagem: 'Olá Carlos, temos ótimas opções em Moema...'" },
  { id: "t3", type: "note", date: "19/02/2026 09:00", user: "Ana Costa", description: "Cliente prefere andares altos. Não aceita térreo." },
  { id: "t4", type: "ai", date: "18/02/2026 08:00", user: "IA ISAFY", description: "Follow-up automático enviado após 48h sem interação." },
  { id: "t5", type: "visit", date: "17/02/2026 14:00", user: "Ana Costa", description: "Visita agendada: Apt 2q Moema - Rua dos Lírios, 240" },
  { id: "t6", type: "stage_change", date: "15/02/2026 11:20", user: "Sistema", description: "Lead criado no pipeline de Atendimento" },
];

const mockMatchProperties = [
  { id: "p1", title: "Apt 2q Moema", price: 520000, area: 68, bedrooms: 2, status: "Disponível", image: "/placeholder.svg" },
  { id: "p2", title: "Apt 2q Vila Mariana", price: 480000, area: 62, bedrooms: 2, status: "Disponível", image: "/placeholder.svg" },
  { id: "p3", title: "Apt 3q Moema", price: 590000, area: 75, bedrooms: 3, status: "Reservado", image: "/placeholder.svg" },
];

const mockProposals = [
  { id: "pr1", property: "Apt 2q Moema", value: 510000, status: "Em análise", date: "20/02/2026" },
];

const timelineIcons: Record<string, { icon: typeof MessageCircle; className: string }> = {
  whatsapp: { icon: MessageCircle, className: "bg-success/10 text-success" },
  note: { icon: Pencil, className: "bg-info/10 text-info" },
  stage_change: { icon: TrendingUp, className: "bg-primary/10 text-primary" },
  ai: { icon: Flame, className: "bg-accent/10 text-accent" },
  visit: { icon: MapPin, className: "bg-warning/10 text-warning" },
  proposal: { icon: FileText, className: "bg-info/10 text-info" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const lead = mockLead;
  const TempIcon = tempConfig[lead.temp].icon;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{lead.name}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[lead.temp].className)}>
              <TempIcon size={12} /> {tempConfig[lead.temp].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.stage} · {lead.purpose}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5"><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Phone size={14} /> Ligar</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><CheckSquare size={14} /> Tarefa</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><MapPin size={14} /> Visita</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5"><FileText size={14} /> Proposta</Button>
        </div>
      </div>

      {/* Mobile: quick action buttons */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><Phone size={14} /> Ligar</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><CheckSquare size={14} /> Tarefa</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><MapPin size={14} /> Visita</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0"><FileText size={14} /> Proposta</Button>
      </div>

      {/* Desktop: 3-column layout | Mobile: tabs */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4">
        <LeftColumn lead={lead} />
        <CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn properties={mockMatchProperties} proposals={mockProposals} />
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="resumo">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="negocios" className="flex-1">Negócios</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn lead={lead} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="negocios"><RightColumn properties={mockMatchProperties} proposals={mockProposals} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function LeftColumn({ lead }: { lead: typeof mockLead }) {
  return (
    <div className="space-y-4">
      {/* Contact info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dados do Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-muted-foreground shrink-0" />
            <span>{lead.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-muted-foreground shrink-0" />
            <span>{lead.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-muted-foreground shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe size={14} className="text-muted-foreground shrink-0" />
            <span>{lead.origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">{lead.brokerInitials}</AvatarFallback>
            </Avatar>
            <span>{lead.broker}</span>
          </div>
          <div className="pt-1">
            <Label className="text-xs text-muted-foreground">Etapa</Label>
            <Select defaultValue={lead.stage}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Novo Lead","Contato Inicial","Qualificação","Envio de Imóveis","Visita Agendada","Proposta Enviada","Negociação","Fechado","Perdido"].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-1">
            <Label className="text-xs text-muted-foreground">Temperatura</Label>
            <Select defaultValue={lead.temp}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">🔥 Quente</SelectItem>
                <SelectItem value="warm">🌡️ Morno</SelectItem>
                <SelectItem value="cold">❄️ Frio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interest profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Perfil de Interesse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span>{lead.propertyType}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Finalidade</span><span>{lead.purpose}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Faixa</span><span>{formatCurrency(lead.minPrice)} – {formatCurrency(lead.maxPrice)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quartos</span><span>{lead.bedrooms}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Banheiros</span><span>{lead.bathrooms}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Vagas</span><span>{lead.parkingSpots}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Área mín.</span><span>{lead.minArea}m²</span></div>
          <div>
            <span className="text-muted-foreground text-xs">Bairros</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {lead.neighborhoods.map(n => <Badge key={n} variant="secondary" className="text-[10px]">{n}</Badge>)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Indicadores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Prob. Fechamento</span><span className="font-semibold text-success">{lead.closingProbability}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tempo na etapa</span><span>{lead.avgTimeInStage}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">SLA restante</span><span className={cn(lead.daysWithoutUpdate > 2 ? "text-warning" : "")}>{lead.slaRemaining}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">VGV estimado</span><span className="font-semibold">{formatCurrency(lead.estimatedVGV)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Comissão est.</span><span className="font-semibold text-primary">{formatCurrency(lead.estimatedCommission)}</span></div>
        </CardContent>
      </Card>

      {/* Lost button */}
      <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
        <XCircle size={16} /> Marcar como Perdido
      </Button>
    </div>
  );
}

function CenterColumn({ timeline, newNote, setNewNote }: { timeline: typeof mockTimeline; newNote: string; setNewNote: (v: string) => void }) {
  return (
    <Card className="flex flex-col h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Timeline 360</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-0">
        {/* Add note */}
        <div className="mb-4 flex gap-2">
          <Textarea
            placeholder="Adicionar nota..."
            className="min-h-[60px] text-sm resize-none"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button size="icon" className="gradient-primary text-primary-foreground shrink-0 self-end h-9 w-9">
            <Send size={14} />
          </Button>
        </div>

        {/* Timeline entries */}
        <div className="relative space-y-0">
          {timeline.map((item, i) => {
            const config = timelineIcons[item.type] || timelineIcons.note;
            const Icon = config.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex gap-3 pb-4"
              >
                {/* Vertical line */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                )}
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.className)}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{item.user} · {item.date}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RightColumn({ properties, proposals }: { properties: typeof mockMatchProperties; proposals: typeof mockProposals }) {
  return (
    <div className="space-y-4">
      {/* Match de Imóveis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Match de Imóveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.map((p) => (
            <div key={p.id} className="rounded-lg border border-border/50 p-2.5 space-y-2">
              <div className="flex gap-2">
                <div className="h-14 w-14 rounded-md bg-muted shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-xs font-semibold text-primary">{formatCurrency(p.price)}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><Maximize size={9} />{p.area}m²</span>
                    <span className="flex items-center gap-0.5"><BedDouble size={9} />{p.bedrooms}q</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1"><Send size={10} /> Enviar</Button>
                <Button size="sm" className="flex-1 h-7 text-xs gap-1 gradient-primary text-primary-foreground"><FileText size={10} /> Proposta</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Propostas */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Propostas</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"><Plus size={12} /> Nova</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {proposals.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma proposta ainda</p>
          ) : (
            proposals.map((pr) => (
              <div key={pr.id} className="rounded-lg border border-border/50 p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{pr.property}</p>
                  <Badge variant="secondary" className="text-[10px]">{pr.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-primary">{formatCurrency(pr.value)}</span>
                  <span className="text-[10px] text-muted-foreground">{pr.date}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LeadDetail;
