import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, Send,
  Flame, Thermometer, Snowflake, Pencil,
  User, Mail, Globe, Building2, MapPin,
  FileCheck, ClipboardList, KeyRound, CalendarCheck,
  Star, TrendingUp, Clock, CheckCircle2, AlertCircle, Loader2
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
import { usePipelineLeadDetail, useTimelineEvents, usePipelineStages, useUpdatePipelineLead } from "@/hooks/useSupabaseData";

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
};

const PosVendaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading } = usePipelineLeadDetail(id);
  const { data: timeline = [] } = useTimelineEvents({ pipeline_lead_id: id });
  const { data: stages = [] } = usePipelineStages("pos-venda");
  const [newNote, setNewNote] = useState("");

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

  const daysInPipeline = Math.floor((Date.now() - new Date(lead.created_at || "").getTime()) / (1000 * 60 * 60 * 24));

  const handleWhatsApp = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean) window.open(`https://wa.me/55${clean}`, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline?type=pos_venda")}><ArrowLeft size={20} /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{lead.name}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[temp].className)}>
              <TempIcon size={12} /> {tempConfig[temp].label}
            </Badge>
            <Badge variant="secondary" className="text-xs">Pós-Venda</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.stage_name} · {property?.title || "—"}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Phone size={14} /> Ligar</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5"><FileCheck size={14} /> Docs</Button>
        </div>
      </div>

      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0"><Phone size={14} /> Ligar</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0"><FileCheck size={14} /> Docs</Button>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4">
        <LeftColumn lead={lead} contact={contact} broker={broker} property={property} stages={stages} daysInPipeline={daysInPipeline} />
        <CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="resumo">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="acoes" className="flex-1">Ações</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn lead={lead} contact={contact} broker={broker} property={property} stages={stages} daysInPipeline={daysInPipeline} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="acoes"><RightColumn /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function LeftColumn({ lead, contact, broker, property, stages, daysInPipeline }: any) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados do Cliente</CardTitle></CardHeader>
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

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados da Transação</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {property && (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Imóvel</span><span className="text-right text-xs max-w-[150px]">{property.title}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Endereço</span><span className="text-right text-xs max-w-[150px]">{property.address}, {property.neighborhood}</span></div>
              {property.sale_price && <div className="flex justify-between"><span className="text-muted-foreground">Valor venda</span><span className="font-semibold">{formatCurrency(Number(property.sale_price))}</span></div>}
            </>
          )}
          <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span>{lead.purpose || "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Data entrada</span><span>{new Date(lead.created_at || "").toLocaleDateString("pt-BR")}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Indicadores</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Dias no pós-venda</span><span>{daysInPipeline} dias</span></div>
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

function RightColumn() {
  return (
    <div className="space-y-4">
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
