import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, Send, Building2,
  MapPin, DollarSign, Clock, Camera, Ruler,
  User, Mail, Globe, Pencil, Home, Key, Star,
  Flame, Thermometer, Snowflake, TrendingUp,
  CheckCircle2, AlertCircle, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

const stages = ["Novo Proprietário", "Contato Inicial", "Avaliação Agendada", "Avaliação Realizada", "Proposta Captação", "Exclusividade", "Imóvel Captado"];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const captacaoChecklist = [
  { id: "ch1", label: "Solicitar Documentos", done: false },
  { id: "ch2", label: "Aprovar Documentação", done: false },
  { id: "ch3", label: "Cadastrar Imóvel Completo", done: false },
  { id: "ch4", label: "Configurar Comissões", done: false },
  { id: "ch5", label: "Configurar Parcerias", done: false },
  { id: "ch6", label: "Agendar Fotos", done: false },
  { id: "ch7", label: "Inserir Imagens", done: false },
  { id: "ch8", label: "Publicar Site", done: false },
  { id: "ch9", label: "Publicar Portais", done: false },
  { id: "ch10", label: "Concluir", done: false },
];

const mockCaptacao = {
  id: "c1",
  ownerName: "Helena Martins",
  phone: "(11) 98765-1234",
  email: "helena.martins@email.com",
  origin: "Indicação",
  broker: "Ana Costa",
  brokerInitials: "AC",
  temp: "hot" as const,
  stage: "Imóvel Captado",
  propertyType: "Apartamento",
  address: "Rua Harmonia, 450 - Vila Madalena",
  neighborhood: "Vila Madalena",
  city: "São Paulo",
  area: 120,
  bedrooms: 3,
  bathrooms: 2,
  parkingSpots: 2,
  ownerAskingPrice: 850000,
  suggestedPrice: 820000,
  evaluationDate: "28/02/2026",
  exclusivity: true,
  exclusivityStart: "01/03/2026",
  exclusivityEnd: "01/06/2026",
  exclusivityDays: 92,
  propertyCondition: "Bom estado",
  hasPhotos: true,
  photoCount: 24,
  daysInPipeline: 5,
  commissionDirect: 5,
  commissionPartner: 2.5,
  estimatedCommission: 41000,
};

const mockTimeline = [
  { id: "t1", type: "stage_change", date: "25/02/2026 09:00", user: "Ana Costa", description: "Imóvel captado - Iniciando checklist de publicação" },
  { id: "t2", type: "whatsapp", date: "24/02/2026 16:30", user: "Ana Costa", description: "Proprietária confirmou exclusividade de 90 dias" },
  { id: "t3", type: "note", date: "23/02/2026 11:00", user: "Ana Costa", description: "Proprietária interessada em vender rápido. Aceita negociação de preço." },
  { id: "t4", type: "stage_change", date: "22/02/2026 10:00", user: "Sistema", description: "Movido para 'Contato Inicial'" },
  { id: "t5", type: "stage_change", date: "21/02/2026 08:30", user: "Sistema", description: "Captação criada no pipeline" },
];

const timelineIcons: Record<string, { icon: typeof MessageCircle; className: string }> = {
  whatsapp: { icon: MessageCircle, className: "bg-success/10 text-success" },
  note: { icon: Pencil, className: "bg-info/10 text-info" },
  stage_change: { icon: TrendingUp, className: "bg-primary/10 text-primary" },
  visit: { icon: MapPin, className: "bg-warning/10 text-warning" },
};

const CaptacaoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [checklist, setChecklist] = useState(captacaoChecklist);
  const [exclusivityModal, setExclusivityModal] = useState(false);
  const data = mockCaptacao;
  const TempIcon = tempConfig[data.temp].icon;

  const completedCount = checklist.filter(c => c.done).length;
  const progress = Math.round((completedCount / checklist.length) * 100);
  const isImóvelCaptado = data.stage === "Imóvel Captado";

  const toggleCheckItem = (itemId: string) => {
    setChecklist(prev => prev.map(c => c.id === itemId ? { ...c, done: !c.done } : c));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline?type=captacao")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">{data.ownerName}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[data.temp].className)}>
              <TempIcon size={12} /> {tempConfig[data.temp].label}
            </Badge>
            <Badge variant="secondary" className="text-xs">Captação</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{data.stage} · {data.propertyType}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5"><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Phone size={14} /> Ligar</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5" onClick={() => setExclusivityModal(true)}>
            <Key size={14} /> Exclusividade
          </Button>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><Phone size={14} /> Ligar</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0" onClick={() => setExclusivityModal(true)}>
          <Key size={14} /> Exclusividade
        </Button>
      </div>

      {/* Checklist progress - only at "Imóvel Captado" */}
      {isImóvelCaptado && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" /> Checklist de Publicação
              </span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{completedCount} de {checklist.length} itens concluídos</p>
          </CardContent>
        </Card>
      )}

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4">
        <LeftColumn data={data} />
        <CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn data={data} isImóvelCaptado={isImóvelCaptado} checklist={checklist} onToggle={toggleCheckItem} />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="resumo">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="imovel" className="flex-1">{isImóvelCaptado ? "Checklist" : "Imóvel"}</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn data={data} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="imovel"><RightColumn data={data} isImóvelCaptado={isImóvelCaptado} checklist={checklist} onToggle={toggleCheckItem} /></TabsContent>
        </Tabs>
      </div>

      {/* Exclusivity Modal */}
      <ExclusivityModal open={exclusivityModal} onClose={() => setExclusivityModal(false)} data={data} />
    </div>
  );
};

function ExclusivityModal({ open, onClose, data }: { open: boolean; onClose: () => void; data: typeof mockCaptacao }) {
  const [startDate, setStartDate] = useState(data.exclusivityStart || "");
  const [endDate, setEndDate] = useState(data.exclusivityEnd || "");

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate.split("/").reverse().join("-"));
    const end = new Date(endDate.split("/").reverse().join("-"));
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exclusividade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Data Início</Label>
            <Input type="date" className="mt-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm">Data Fim</Label>
            <Input type="date" className="mt-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          {startDate && endDate && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-primary">{calcDays()}</p>
              <p className="text-xs text-muted-foreground">dias de exclusividade</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={onClose}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LeftColumn({ data }: { data: typeof mockCaptacao }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dados do Proprietário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground shrink-0" /><span>{data.ownerName}</span></div>
          <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground shrink-0" /><span>{data.phone}</span></div>
          <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground shrink-0" /><span className="truncate">{data.email}</span></div>
          <div className="flex items-center gap-2 text-sm"><Globe size={14} className="text-muted-foreground shrink-0" /><span>{data.origin}</span></div>
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
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Imóvel</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span>{data.propertyType}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Endereço</span><span className="text-right text-xs max-w-[160px]">{data.address}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Bairro</span><span>{data.neighborhood}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Área</span><span>{data.area}m²</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Quartos</span><span>{data.bedrooms}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Banheiros</span><span>{data.bathrooms}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Vagas</span><span>{data.parkingSpots}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><span>{data.propertyCondition}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Indicadores</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Dias no pipeline</span><span>{data.daysInPipeline} dias</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Exclusividade</span>
            <span className={data.exclusivity ? "text-success font-semibold" : "text-muted-foreground"}>
              {data.exclusivity ? `Sim (${data.exclusivityDays}d)` : "Não"}
            </span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Comissão direta</span><span>{data.commissionDirect}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Comissão parceria</span><span>{data.commissionPartner}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Comissão est.</span><span className="font-semibold text-primary">{formatCurrency(data.estimatedCommission)}</span></div>
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

function RightColumn({ data, isImóvelCaptado, checklist, onToggle }: { 
  data: typeof mockCaptacao; 
  isImóvelCaptado: boolean; 
  checklist: typeof captacaoChecklist;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {isImóvelCaptado ? (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Checklist de Publicação</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors cursor-pointer hover:bg-muted/50",
                  item.done ? "border-success/20 bg-success/5" : "border-border/50"
                )}
              >
                {item.done ? <CheckCircle2 size={16} className="text-success shrink-0" /> : <AlertCircle size={16} className="text-muted-foreground shrink-0" />}
                <span className={cn("text-sm", item.done ? "text-foreground line-through" : "text-muted-foreground")}>{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Avaliação & Preço</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Preço pedido</span><span className="font-semibold">{formatCurrency(data.ownerAskingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Preço sugerido</span><span className="font-semibold text-primary">{formatCurrency(data.suggestedPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data avaliação</span><span>{data.evaluationDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Fotos</span>
                <span className={cn("font-medium", data.hasPhotos ? "text-success" : "text-warning")}>{data.hasPhotos ? `${data.photoCount} fotos` : "Pendente"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Ações Rápidas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Camera size={14} /> Agendar Sessão de Fotos</Button>
              <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Ruler size={14} /> Solicitar Planta</Button>
              <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Star size={14} /> Destacar no Portfólio</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default CaptacaoDetail;
