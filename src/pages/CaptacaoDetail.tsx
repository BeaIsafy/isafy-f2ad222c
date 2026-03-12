import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, Send, Building2,
  MapPin, DollarSign, Clock, Camera, Ruler,
  User, Mail, Globe, Pencil, Home, Key, Star,
  Flame, Thermometer, Snowflake, TrendingUp,
  CheckCircle2, AlertCircle, ClipboardList, FileText,
  Briefcase, BarChart3, Loader2
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
import { toast } from "sonner";
import { usePipelineLeadDetail, useTimelineEvents, useCaptacaoChecklist, useUpdateCaptacaoCheckItem, usePipelineStages, useUpdatePipelineLead } from "@/hooks/useSupabaseData";

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const timelineIcons: Record<string, { icon: typeof MessageCircle; className: string }> = {
  whatsapp: { icon: MessageCircle, className: "bg-success/10 text-success" },
  nota: { icon: Pencil, className: "bg-info/10 text-info" },
  status: { icon: TrendingUp, className: "bg-primary/10 text-primary" },
  visita: { icon: MapPin, className: "bg-warning/10 text-warning" },
  captacao: { icon: Building2, className: "bg-info/10 text-info" },
};

const CaptacaoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading } = usePipelineLeadDetail(id);
  const { data: timeline = [] } = useTimelineEvents({ pipeline_lead_id: id });
  const { data: checklist = [] } = useCaptacaoChecklist(id);
  const { data: stages = [] } = usePipelineStages("captacao");
  const updateCheckItem = useUpdateCaptacaoCheckItem();
  const updateLead = useUpdatePipelineLead();
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState("resumo");
  const [exclusivityModal, setExclusivityModal] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Registro não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/pipeline")}>Voltar</Button>
      </div>
    );
  }

  const contact = lead.contact as any;
  const broker = lead.assigned_broker as any;
  const property = lead.property as any;
  const temp = (lead.temperature || "warm") as keyof typeof tempConfig;
  const TempIcon = tempConfig[temp].icon;
  const phone = contact?.phone || "";

  const isImóvelCaptado = lead.stage_name === "Imóvel captado" || lead.stage_name === "Imóvel Captado";
  const completedCount = checklist.filter((c: any) => c.is_checked).length;
  const progress = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;
  const daysInPipeline = Math.floor((Date.now() - new Date(lead.created_at || "").getTime()) / (1000 * 60 * 60 * 24));

  const handleWhatsApp = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean) window.open(`https://wa.me/55${clean}`, "_blank");
  };

  const handleCall = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean) window.open(`tel:+55${clean}`);
  };

  const toggleCheckItem = (itemId: string, currentState: boolean) => {
    updateCheckItem.mutate({ id: itemId, is_checked: !currentState });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline?type=captacao")}><ArrowLeft size={20} /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">{lead.name}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[temp].className)}>
              <TempIcon size={12} /> {tempConfig[temp].label}
            </Badge>
            <Badge variant="secondary" className="text-xs">Captação</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.stage_name} · {lead.neighborhood || "—"}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCall}><Phone size={14} /> Ligar</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5" onClick={() => setExclusivityModal(true)}>
            <Key size={14} /> Exclusividade
          </Button>
        </div>
      </div>

      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleCall}><Phone size={14} /> Ligar</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0" onClick={() => setExclusivityModal(true)}>
          <Key size={14} /> Exclusividade
        </Button>
      </div>

      {/* Checklist progress */}
      {isImóvelCaptado && checklist.length > 0 && (
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
        <LeftColumn lead={lead} contact={contact} broker={broker} property={property} stages={stages} daysInPipeline={daysInPipeline} />
        <CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn isImóvelCaptado={isImóvelCaptado} checklist={checklist} onToggle={toggleCheckItem} lead={lead} />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="imovel" className="flex-1">{isImóvelCaptado ? "Checklist" : "Imóvel"}</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn lead={lead} contact={contact} broker={broker} property={property} stages={stages} daysInPipeline={daysInPipeline} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="imovel"><RightColumn isImóvelCaptado={isImóvelCaptado} checklist={checklist} onToggle={toggleCheckItem} lead={lead} /></TabsContent>
        </Tabs>
      </div>

      {/* Exclusivity Modal */}
      <ExclusivityModal open={exclusivityModal} onClose={() => setExclusivityModal(false)} lead={lead} />
    </div>
  );
};

function ExclusivityModal({ open, onClose, lead }: { open: boolean; onClose: () => void; lead: any }) {
  const property = lead.property as any;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Exclusividade</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {property ? `Imóvel: ${property.title}` : "Nenhum imóvel vinculado"}
          </p>
          <div><Label className="text-sm">Data Início</Label><Input type="date" className="mt-1" /></div>
          <div><Label className="text-sm">Data Fim</Label><Input type="date" className="mt-1" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Exclusividade salva!"); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LeftColumn({ lead, contact, broker, property, stages, daysInPipeline }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Proprietário</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground shrink-0" /><span>{lead.name}</span></div>
          <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground shrink-0" /><span>{contact?.phone || "—"}</span></div>
          <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground shrink-0" /><span className="truncate">{contact?.email || "—"}</span></div>
          {broker && (
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">{broker.initials || "?"}</AvatarFallback></Avatar>
              <span>{broker.name}</span>
            </div>
          )}
          <div className="pt-1">
            <Label className="text-xs text-muted-foreground">Etapa</Label>
            <Select defaultValue={lead.stage_name || ""}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {property && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Imóvel</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Título</span><span>{property.title}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Endereço</span><span className="text-right text-xs max-w-[160px]">{property.address}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bairro</span><span>{property.neighborhood || lead.neighborhood || "—"}</span></div>
            {property.total_area > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Área</span><span>{property.total_area}m²</span></div>}
            {property.bedrooms > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Quartos</span><span>{property.bedrooms}</span></div>}
            {property.sale_price && <div className="flex justify-between"><span className="text-muted-foreground">Preço</span><span className="font-semibold text-primary">{formatCurrency(Number(property.sale_price))}</span></div>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Indicadores</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Dias no pipeline</span><span>{daysInPipeline} dias</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Bairro</span><span>{lead.neighborhood || "—"}</span></div>
          {Number(lead.min_price) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Faixa</span><span>{formatCurrency(Number(lead.min_price))} – {formatCurrency(Number(lead.max_price))}</span></div>}
        </CardContent>
      </Card>
    </div>
  );
}

function CenterColumn({ timeline, newNote, setNewNote }: { timeline: any[]; newNote: string; setNewNote: (v: string) => void }) {
  return (
    <Card className="flex flex-col h-fit">
      <CardHeader className="pb-3"><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
      <CardContent className="flex-1 space-y-0">
        <div className="mb-4 flex gap-2">
          <Textarea placeholder="Adicionar nota..." className="min-h-[60px] text-sm resize-none" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
          <Button size="icon" className="gradient-primary text-primary-foreground shrink-0 self-end h-9 w-9"><Send size={14} /></Button>
        </div>
        <div className="relative space-y-0">
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento registrado.</p>
          ) : (
            timeline.map((item: any, i: number) => {
              const config = timelineIcons[item.type] || timelineIcons.nota;
              const Icon = config.icon;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex gap-3 pb-4">
                  {i < timeline.length - 1 && <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />}
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.className)}><Icon size={14} /></div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm text-foreground">{item.description}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.actor_name || "Sistema"} · {new Date(item.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RightColumn({ isImóvelCaptado, checklist, onToggle, lead }: any) {
  return (
    <div className="space-y-4">
      {isImóvelCaptado && checklist.length > 0 ? (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Checklist de Publicação</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item: any) => (
              <div
                key={item.id}
                onClick={() => onToggle(item.id, item.is_checked)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors cursor-pointer hover:bg-muted/50",
                  item.is_checked ? "border-success/20 bg-success/5" : "border-border/50"
                )}
              >
                {item.is_checked ? <CheckCircle2 size={16} className="text-success shrink-0" /> : <AlertCircle size={16} className="text-muted-foreground shrink-0" />}
                <span className={cn("text-sm", item.is_checked ? "text-foreground line-through" : "text-muted-foreground")}>{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Ações Rápidas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Star size={14} /> Destacar no Portfólio</Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><FileText size={14} /> Solicitar Documentação</Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Ruler size={14} /> Solicitar Planta</Button>
            <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Camera size={14} /> Agendar Sessão de Fotos</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CaptacaoDetail;
