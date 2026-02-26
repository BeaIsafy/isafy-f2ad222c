import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, Send, 
  Flame, Thermometer, Snowflake, Pencil,
  User, Mail, Globe, Building2, MapPin,
  FileCheck, ClipboardList, KeyRound, CalendarCheck,
  Star, TrendingUp, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

const stages = ["Contrato Assinado", "Documentação", "Escritura", "Entrega Chaves", "Follow-up 30d", "Avaliação", "Fidelizado"];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const mockPosVenda = {
  id: "p1",
  clientName: "Juliana Rocha",
  phone: "(11) 99123-4567",
  email: "juliana.rocha@email.com",
  broker: "Ana Costa",
  brokerInitials: "AC",
  temp: "hot" as const,
  stage: "Documentação",
  // Transaction data
  propertyTitle: "Apt 3q Vila Olímpia",
  propertyAddress: "Rua Funchal, 320 - Vila Olímpia",
  transactionType: "Compra",
  salePrice: 720000,
  commissionValue: 36000,
  contractDate: "15/02/2026",
  expectedClosing: "15/04/2026",
  // Checklist
  checklist: [
    { id: "ck1", label: "Contrato assinado", done: true },
    { id: "ck2", label: "Documentação do comprador", done: true },
    { id: "ck3", label: "Documentação do vendedor", done: false },
    { id: "ck4", label: "Certidões negativas", done: false },
    { id: "ck5", label: "Escritura lavrada", done: false },
    { id: "ck6", label: "Registro em cartório", done: false },
    { id: "ck7", label: "Entrega de chaves", done: false },
    { id: "ck8", label: "Vistoria final", done: false },
  ],
  satisfactionScore: null as number | null,
  referralGenerated: false,
  daysInPipeline: 11,
};

const mockTimeline = [
  { id: "t1", type: "note", date: "26/02/2026 10:00", user: "Ana Costa", description: "Documentação do comprador entregue. Falta vendedor." },
  { id: "t2", type: "whatsapp", date: "25/02/2026 14:30", user: "Ana Costa", description: "Solicitou docs do vendedor ao proprietário anterior" },
  { id: "t3", type: "stage_change", date: "24/02/2026 09:00", user: "Sistema", description: "Movido para 'Documentação'" },
  { id: "t4", type: "stage_change", date: "15/02/2026 16:00", user: "Ana Costa", description: "Contrato assinado. Início do pós-venda." },
];

const timelineIcons: Record<string, { icon: typeof MessageCircle; className: string }> = {
  whatsapp: { icon: MessageCircle, className: "bg-success/10 text-success" },
  note: { icon: Pencil, className: "bg-info/10 text-info" },
  stage_change: { icon: TrendingUp, className: "bg-primary/10 text-primary" },
};

const PosVendaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const data = mockPosVenda;
  const TempIcon = tempConfig[data.temp].icon;
  const completedCount = data.checklist.filter(c => c.done).length;
  const progress = Math.round((completedCount / data.checklist.length) * 100);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline?type=pos_venda")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{data.clientName}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[data.temp].className)}>
              <TempIcon size={12} /> {tempConfig[data.temp].label}
            </Badge>
            <Badge variant="secondary" className="text-xs">Pós-Venda</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{data.stage} · {data.propertyTitle}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5"><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Phone size={14} /> Ligar</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5"><FileCheck size={14} /> Docs</Button>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><Phone size={14} /> Ligar</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0"><FileCheck size={14} /> Docs</Button>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do Pós-Venda</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{completedCount} de {data.checklist.length} etapas concluídas</p>
        </CardContent>
      </Card>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4">
        <LeftColumn data={data} />
        <CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn data={data} />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="resumo">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="checklist" className="flex-1">Checklist</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn data={data} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="checklist"><RightColumn data={data} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function LeftColumn({ data }: { data: typeof mockPosVenda }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Cliente</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground shrink-0" /><span>{data.clientName}</span></div>
          <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground shrink-0" /><span>{data.phone}</span></div>
          <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground shrink-0" /><span className="truncate">{data.email}</span></div>
          <div className="flex items-center gap-2 text-sm">
            <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">{data.brokerInitials}</AvatarFallback></Avatar>
            <span>{data.broker}</span>
          </div>
          <div className="pt-1">
            <Label className="text-xs text-muted-foreground">Etapa</Label>
            <Select defaultValue={data.stage}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados da Transação</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Imóvel</span><span className="text-right text-xs max-w-[150px]">{data.propertyTitle}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Endereço</span><span className="text-right text-xs max-w-[150px]">{data.propertyAddress}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span>{data.transactionType}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Valor venda</span><span className="font-semibold">{formatCurrency(data.salePrice)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Comissão</span><span className="font-semibold text-primary">{formatCurrency(data.commissionValue)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Data contrato</span><span>{data.contractDate}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Previsão encerramento</span><span>{data.expectedClosing}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Indicadores</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Dias no pós-venda</span><span>{data.daysInPipeline} dias</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Satisfação</span><span className="text-muted-foreground">{data.satisfactionScore ? `${data.satisfactionScore}/5` : "Pendente"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Indicação gerada</span><span className={data.referralGenerated ? "text-success font-semibold" : "text-muted-foreground"}>{data.referralGenerated ? "Sim" : "Não"}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}

function CenterColumn({ timeline, newNote, setNewNote }: { timeline: typeof mockTimeline; newNote: string; setNewNote: (v: string) => void }) {
  return (
    <Card className="flex flex-col h-fit">
      <CardHeader className="pb-3"><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
      <CardContent className="flex-1 space-y-0">
        <div className="mb-4 flex gap-2">
          <Textarea placeholder="Adicionar nota..." className="min-h-[60px] text-sm resize-none" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
          <Button size="icon" className="gradient-primary text-primary-foreground shrink-0 self-end h-9 w-9"><Send size={14} /></Button>
        </div>
        <div className="relative space-y-0">
          {timeline.map((item, i) => {
            const config = timelineIcons[item.type] || timelineIcons.note;
            const Icon = config.icon;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex gap-3 pb-4">
                {i < timeline.length - 1 && <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />}
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.className)}><Icon size={14} /></div>
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

function RightColumn({ data }: { data: typeof mockPosVenda }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Checklist de Documentação</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.checklist.map((item) => (
            <div key={item.id} className={cn("flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors", item.done ? "border-success/20 bg-success/5" : "border-border/50")}>
              {item.done ? <CheckCircle2 size={16} className="text-success shrink-0" /> : <AlertCircle size={16} className="text-muted-foreground shrink-0" />}
              <span className={cn("text-sm", item.done ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Ações Rápidas</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><ClipboardList size={14} /> Solicitar Documentos</Button>
          <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><KeyRound size={14} /> Agendar Entrega de Chaves</Button>
          <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><CalendarCheck size={14} /> Agendar Vistoria</Button>
          <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Star size={14} /> Solicitar Avaliação</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default PosVendaDetail;
