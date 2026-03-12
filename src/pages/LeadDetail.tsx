import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, CheckSquare, FileText, XCircle,
  Flame, Thermometer, Snowflake, Send, BedDouble, Bath,
  Car, Maximize, MapPin, DollarSign, TrendingUp, Clock,
  Plus, User, Mail, Globe, Pencil, ExternalLink, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { EditContactModal } from "@/components/leads/EditContactModal";
import { EditInterestModal } from "@/components/leads/EditInterestModal";
import { ProposalDetailModal } from "@/components/leads/ProposalDetailModal";
import { CreateTaskModal } from "@/components/pipeline/CreateTaskModal";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { VisitScheduleModal } from "@/components/pipeline/VisitScheduleModal";
import { usePipelineLeadDetail, useTimelineEvents, useLeadProposals, useLeadMatchProperties, useUpdatePipelineLead, usePipelineStages } from "@/hooks/useSupabaseData";

const tempConfig = {
  hot: { icon: Flame, label: "Quente", className: "bg-hot/10 text-hot border-hot/20" },
  warm: { icon: Thermometer, label: "Morno", className: "bg-warning/10 text-warning border-warning/20" },
  cold: { icon: Snowflake, label: "Frio", className: "bg-cold/10 text-cold border-cold/20" },
};

const timelineIcons: Record<string, { icon: typeof MessageCircle; className: string }> = {
  whatsapp: { icon: MessageCircle, className: "bg-success/10 text-success" },
  nota: { icon: Pencil, className: "bg-info/10 text-info" },
  status: { icon: TrendingUp, className: "bg-primary/10 text-primary" },
  visita: { icon: MapPin, className: "bg-warning/10 text-warning" },
  proposta: { icon: FileText, className: "bg-info/10 text-info" },
  ligacao: { icon: Phone, className: "bg-accent/10 text-accent" },
  email: { icon: Mail, className: "bg-muted text-muted-foreground" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading } = usePipelineLeadDetail(id);
  const { data: timeline = [] } = useTimelineEvents({ pipeline_lead_id: id });
  const { data: proposals = [] } = useLeadProposals(id);
  const { data: matchProperties = [] } = useLeadMatchProperties(id);
  const { data: stages = [] } = usePipelineStages("atendimento");
  const updateLead = useUpdatePipelineLead();
  const [newNote, setNewNote] = useState("");
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editInterestOpen, setEditInterestOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Lead não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/pipeline")}>Voltar</Button>
      </div>
    );
  }

  const contact = lead.contact as any;
  const broker = lead.assigned_broker as any;
  const temp = (lead.temperature || "warm") as keyof typeof tempConfig;
  const TempIcon = tempConfig[temp].icon;
  const phone = contact?.phone || "";
  const email = contact?.email || "";

  const handleWhatsApp = () => {
    const clean = phone.replace(/\D/g, "");
    if (clean) window.open(`https://wa.me/55${clean}`, "_blank");
  };

  const handleCall = () => {
    if (phone) window.open(`tel:${phone}`, "_self");
  };

  const handleStageChange = (stageName: string) => {
    const stage = stages.find(s => s.name === stageName);
    updateLead.mutate({ id: lead.id, stage_name: stageName, stage_id: stage?.id });
  };

  const handleTempChange = (t: string) => {
    updateLead.mutate({ id: lead.id, temperature: t as any });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/pipeline")}><ArrowLeft size={20} /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{lead.name}</h1>
            <Badge variant="outline" className={cn("gap-1 text-xs", tempConfig[temp].className)}>
              <TempIcon size={12} /> {tempConfig[temp].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{lead.stage_name} · {lead.purpose || "—"}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCall}><Phone size={14} /> Ligar</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setTaskModalOpen(true)}><CheckSquare size={14} /> Tarefa</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setVisitModalOpen(true)}><MapPin size={14} /> Visita</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5" onClick={() => setProposalModalOpen(true)}><FileText size={14} /> Proposta</Button>
        </div>
      </div>

      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleCall}><Phone size={14} /> Ligar</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => setTaskModalOpen(true)}><CheckSquare size={14} /> Tarefa</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => setVisitModalOpen(true)}><MapPin size={14} /> Visita</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0" onClick={() => setProposalModalOpen(true)}><FileText size={14} /> Proposta</Button>
      </div>

      {/* Desktop: 3-column layout */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_300px] gap-4">
        <LeftColumn lead={lead} contact={contact} broker={broker} stages={stages} onStageChange={handleStageChange} onTempChange={handleTempChange} onEditContact={() => setEditContactOpen(true)} onEditInterest={() => setEditInterestOpen(true)} />
        <CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn properties={matchProperties} proposals={proposals} leadId={lead.id} onProposalClick={setSelectedProposal} onNewProposal={() => setProposalModalOpen(true)} />
      </div>

      {/* Mobile: tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="resumo">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="negocios" className="flex-1">Negócios</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn lead={lead} contact={contact} broker={broker} stages={stages} onStageChange={handleStageChange} onTempChange={handleTempChange} onEditContact={() => setEditContactOpen(true)} onEditInterest={() => setEditInterestOpen(true)} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={timeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="negocios"><RightColumn properties={matchProperties} proposals={proposals} leadId={lead.id} onProposalClick={setSelectedProposal} onNewProposal={() => setProposalModalOpen(true)} /></TabsContent>
        </Tabs>
      </div>

      <EditContactModal
        open={editContactOpen}
        onClose={() => setEditContactOpen(false)}
        data={{ name: lead.name, phone, email, origin: "", broker: broker?.name || "" }}
        onSave={(d) => { toast.success("Dados atualizados!"); setEditContactOpen(false); }}
      />
      <EditInterestModal
        open={editInterestOpen}
        onClose={() => setEditInterestOpen(false)}
        data={{ propertyType: "", purpose: lead.purpose || "Compra", minPrice: Number(lead.min_price) || 0, maxPrice: Number(lead.max_price) || 0, bedrooms: 0, bathrooms: 0, parkingSpots: 0, minArea: 0, neighborhoods: lead.neighborhood ? [lead.neighborhood] : [] }}
        onSave={(d) => { updateLead.mutate({ id: lead.id, min_price: d.minPrice, max_price: d.maxPrice, neighborhood: d.neighborhoods?.[0], purpose: d.purpose as any }); toast.success("Perfil atualizado!"); setEditInterestOpen(false); }}
      />
      <ProposalDetailModal proposal={selectedProposal ? { id: selectedProposal.id, property: (selectedProposal.property as any)?.title || "—", value: selectedProposal.value, status: selectedProposal.status, date: new Date(selectedProposal.created_at).toLocaleDateString("pt-BR"), paymentType: selectedProposal.payment_type || "—", validity: "—", conditions: selectedProposal.notes || "" } : null} onClose={() => setSelectedProposal(null)} />
      <CreateTaskModal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} leadName={lead.name} />
      <CreateProposalModal open={proposalModalOpen} onClose={() => setProposalModalOpen(false)} leadName={lead.name} />
      {visitModalOpen && <VisitScheduleModal open={visitModalOpen} leadName={lead.name} onConfirm={() => { toast.success("Visita agendada!"); setVisitModalOpen(false); }} onCancel={() => setVisitModalOpen(false)} />}
    </div>
  );
};

function LeftColumn({ lead, contact, broker, stages, onStageChange, onTempChange, onEditContact, onEditInterest }: any) {
  const temp = (lead.temperature || "warm") as keyof typeof tempConfig;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Dados do Contato</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={onEditContact}><Pencil size={12} /> Editar</Button>
        </CardHeader>
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
            <Select value={lead.stage_name || ""} onValueChange={onStageChange}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {stages.map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-1">
            <Label className="text-xs text-muted-foreground">Temperatura</Label>
            <Select value={temp} onValueChange={onTempChange}>
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

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Perfil de Interesse</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={onEditInterest}><Pencil size={12} /> Editar</Button>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Finalidade</span><span>{lead.purpose || "—"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Faixa</span><span>{Number(lead.min_price) > 0 ? `${formatCurrency(Number(lead.min_price))} – ${formatCurrency(Number(lead.max_price))}` : "—"}</span></div>
          {lead.neighborhood && (
            <div>
              <span className="text-muted-foreground text-xs">Bairro</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary" className="text-[10px]">{lead.neighborhood}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
        <XCircle size={16} /> Marcar como Perdido
      </Button>
    </div>
  );
}

function CenterColumn({ timeline, newNote, setNewNote }: { timeline: any[]; newNote: string; setNewNote: (v: string) => void }) {
  return (
    <Card className="flex flex-col h-fit">
      <CardHeader className="pb-3"><CardTitle className="text-sm">Timeline 360</CardTitle></CardHeader>
      <CardContent className="flex-1 space-y-0">
        <div className="mb-4 flex gap-2">
          <Textarea placeholder="Adicionar nota..." className="min-h-[60px] text-sm resize-none" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
          <Button size="icon" className="gradient-primary text-primary-foreground shrink-0 self-end h-9 w-9"><Send size={14} /></Button>
        </div>
        <div className="relative space-y-0">
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento registrado ainda.</p>
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
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{item.actor_name || "Sistema"} · {new Date(item.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
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

function RightColumn({ properties, proposals, leadId, onProposalClick, onNewProposal }: any) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Match de Imóveis</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => navigate(`/match/${leadId}`)}>
            <ExternalLink size={12} /> Ver Página
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {properties.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum imóvel compatível encontrado</p>
          ) : (
            properties.slice(0, 3).map((p: any) => (
              <div key={p.id} className="rounded-lg border border-border/50 p-2.5 space-y-2">
                <div className="flex gap-2">
                  <div className="h-14 w-14 rounded-md bg-muted shrink-0 overflow-hidden">
                    {p.cover_image ? <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-muted-foreground"><MapPin size={16} /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-xs font-semibold text-primary">{p.sale_price ? formatCurrency(Number(p.sale_price)) : p.rent_price ? `${formatCurrency(Number(p.rent_price))}/mês` : "—"}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      {p.total_area > 0 && <span>{p.total_area}m²</span>}
                      {p.bedrooms > 0 && <span>{p.bedrooms}q</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1"><Send size={10} /> Enviar</Button>
                  <Button size="sm" className="flex-1 h-7 text-xs gap-1 gradient-primary text-primary-foreground" onClick={onNewProposal}><FileText size={10} /> Proposta</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Propostas</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={onNewProposal}><Plus size={12} /> Nova</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {proposals.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhuma proposta ainda</p>
          ) : (
            proposals.map((pr: any) => (
              <div key={pr.id} className="rounded-lg border border-border/50 p-2.5 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onProposalClick(pr)}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{(pr.property as any)?.title || "—"}</p>
                  <Badge variant="secondary" className="text-[10px]">{pr.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-semibold text-primary">{formatCurrency(pr.value)}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(pr.created_at).toLocaleDateString("pt-BR")}</span>
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
