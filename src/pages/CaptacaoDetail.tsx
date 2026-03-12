import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MessageCircle, Phone, Send, Building2,
  MapPin, DollarSign, Clock, Camera, Ruler,
  User, Mail, Globe, Pencil, Home, Key, Star,
  Flame, Thermometer, Snowflake, TrendingUp,
  CheckCircle2, AlertCircle, ClipboardList, FileText,
  Briefcase, BarChart3
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
  { id: "ch6", label: "Agendar Sessão Fotográfica", done: false },
  { id: "ch7", label: "Inserir Imagens no Imóvel", done: false },
  { id: "ch8", label: "Publicar no Site", done: false },
  { id: "ch9", label: "Publicar nos Portais", done: false },
  { id: "ch10", label: "Concluir Captação", done: false },
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
  exclusivityStart: "2026-03-01",
  exclusivityEnd: "2026-06-01",
  exclusivityDays: 92,
  propertyCondition: "Bom estado",
  hasPhotos: true,
  photoCount: 24,
  daysInPipeline: 5,
  commissionDirect: 5,
  commissionPartner: 2.5,
  estimatedCommission: 41000,
  avgRegionPrice: 7800,
  avgRegionRent: 42,
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

// Pre-"Imóvel Captado" stage index
const imóvelCaptadoIndex = stages.indexOf("Imóvel Captado");

const CaptacaoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [checklist, setChecklist] = useState(captacaoChecklist);
  const [exclusivityModal, setExclusivityModal] = useState(false);
  const [activeTab, setActiveTab] = useState("resumo");
  const [data, setData] = useState(mockCaptacao);
  const TempIcon = tempConfig[data.temp].icon;

  // Edit modals
  const [editOwner, setEditOwner] = useState(false);
  const [editProperty, setEditProperty] = useState(false);
  const [editValuation, setEditValuation] = useState(false);
  const [editCommission, setEditCommission] = useState(false);

  const completedCount = checklist.filter(c => c.done).length;
  const progress = Math.round((completedCount / checklist.length) * 100);
  const isImóvelCaptado = data.stage === "Imóvel Captado";
  const currentStageIdx = stages.indexOf(data.stage);
  const isBeforeImovelCaptado = currentStageIdx < imóvelCaptadoIndex;

  const toggleCheckItem = (itemId: string) => {
    setChecklist(prev => {
      const updated = prev.map(c => c.id === itemId ? { ...c, done: !c.done } : c);
      // If all done including "Concluir Captação", conclude
      if (updated.every(c => c.done)) {
        toast.success("🎉 Captação concluída! Imóvel saiu do pipeline.");
        setTimeout(() => navigate("/pipeline?type=captacao"), 1500);
      }
      return updated;
    });
  };

  const phoneClean = data.phone.replace(/\D/g, "");

  const handleWhatsApp = () => {
    window.open(`https://wa.me/55${phoneClean}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:+55${phoneClean}`);
  };

  const handleExclusivity = () => {
    setExclusivityModal(true);
    setActiveTab("resumo");
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
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCall}><Phone size={14} /> Ligar</Button>
          <Button size="sm" className="gradient-primary text-primary-foreground gap-1.5" onClick={handleExclusivity}>
            <Key size={14} /> Exclusividade
          </Button>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleWhatsApp}><MessageCircle size={14} /> WhatsApp</Button>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={handleCall}><Phone size={14} /> Ligar</Button>
        <Button size="sm" className="gradient-primary text-primary-foreground gap-1 shrink-0" onClick={handleExclusivity}>
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
        <LeftColumn data={data} onEditOwner={() => setEditOwner(true)} onEditProperty={() => setEditProperty(true)} />
        <CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} />
        <RightColumn
          data={data}
          isImóvelCaptado={isImóvelCaptado}
          isBeforeImovelCaptado={isBeforeImovelCaptado}
          checklist={checklist}
          onToggle={toggleCheckItem}
          onEditValuation={() => setEditValuation(true)}
          onEditCommission={() => setEditCommission(true)}
        />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            <TabsTrigger value="imovel" className="flex-1">{isImóvelCaptado ? "Checklist" : "Imóvel"}</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo"><LeftColumn data={data} onEditOwner={() => setEditOwner(true)} onEditProperty={() => setEditProperty(true)} /></TabsContent>
          <TabsContent value="timeline"><CenterColumn timeline={mockTimeline} newNote={newNote} setNewNote={setNewNote} /></TabsContent>
          <TabsContent value="imovel">
            <RightColumn
              data={data}
              isImóvelCaptado={isImóvelCaptado}
              isBeforeImovelCaptado={isBeforeImovelCaptado}
              checklist={checklist}
              onToggle={toggleCheckItem}
              onEditValuation={() => setEditValuation(true)}
              onEditCommission={() => setEditCommission(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Exclusivity Modal */}
      <ExclusivityModal open={exclusivityModal} onClose={() => setExclusivityModal(false)} data={data} onSave={(s, e) => {
        setData(prev => ({ ...prev, exclusivityStart: s, exclusivityEnd: e, exclusivity: true }));
        toast.success("Exclusividade atualizada!");
      }} />

      {/* Edit Modals */}
      <EditOwnerModal open={editOwner} onClose={() => setEditOwner(false)} data={data} onSave={(d) => { setData(prev => ({ ...prev, ...d })); toast.success("Dados do proprietário atualizados!"); }} />
      <EditPropertyModal open={editProperty} onClose={() => setEditProperty(false)} data={data} onSave={(d) => { setData(prev => ({ ...prev, ...d })); toast.success("Dados do imóvel atualizados!"); }} />
      <EditValuationModal open={editValuation} onClose={() => setEditValuation(false)} data={data} onSave={(d) => { setData(prev => ({ ...prev, ...d })); toast.success("Avaliação atualizada!"); }} />
      <EditCommissionModal open={editCommission} onClose={() => setEditCommission(false)} data={data} onSave={(d) => { setData(prev => ({ ...prev, ...d })); toast.success("Comissão atualizada!"); }} />
    </div>
  );
};

/* ========== EDIT MODALS ========== */

function EditOwnerModal({ open, onClose, data, onSave }: { open: boolean; onClose: () => void; data: typeof mockCaptacao; onSave: (d: Partial<typeof mockCaptacao>) => void }) {
  const [form, setForm] = useState({ ownerName: data.ownerName, phone: data.phone, email: data.email, origin: data.origin });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Dados do Proprietário</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nome</Label><Input className="mt-1" value={form.ownerName} onChange={e => set("ownerName", e.target.value)} /></div>
          <div><Label>Telefone</Label><Input className="mt-1" value={form.phone} onChange={e => set("phone", e.target.value)} /></div>
          <div><Label>E-mail</Label><Input className="mt-1" value={form.email} onChange={e => set("email", e.target.value)} /></div>
          <div><Label>Origem</Label><Input className="mt-1" value={form.origin} onChange={e => set("origin", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { onSave(form); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditPropertyModal({ open, onClose, data, onSave }: { open: boolean; onClose: () => void; data: typeof mockCaptacao; onSave: (d: Partial<typeof mockCaptacao>) => void }) {
  const [form, setForm] = useState({ propertyType: data.propertyType, address: data.address, neighborhood: data.neighborhood, city: data.city, area: data.area, bedrooms: data.bedrooms, bathrooms: data.bathrooms, parkingSpots: data.parkingSpots, propertyCondition: data.propertyCondition });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Editar Dados do Imóvel</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Tipo</Label>
            <Select value={form.propertyType} onValueChange={v => set("propertyType", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartamento">Apartamento</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Terreno">Terreno</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Endereço</Label><Input className="mt-1" value={form.address} onChange={e => set("address", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Bairro</Label><Input className="mt-1" value={form.neighborhood} onChange={e => set("neighborhood", e.target.value)} /></div>
            <div><Label>Cidade</Label><Input className="mt-1" value={form.city} onChange={e => set("city", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Área (m²)</Label><Input inputMode="decimal" className="mt-1" value={form.area} onChange={e => set("area", Number(e.target.value))} /></div>
            <div><Label>Quartos</Label><Input inputMode="numeric" className="mt-1" value={form.bedrooms} onChange={e => set("bedrooms", Number(e.target.value))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Banheiros</Label><Input inputMode="numeric" className="mt-1" value={form.bathrooms} onChange={e => set("bathrooms", Number(e.target.value))} /></div>
            <div><Label>Vagas</Label><Input inputMode="numeric" className="mt-1" value={form.parkingSpots} onChange={e => set("parkingSpots", Number(e.target.value))} /></div>
          </div>
          <div><Label>Estado</Label><Input className="mt-1" value={form.propertyCondition} onChange={e => set("propertyCondition", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { onSave(form); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditValuationModal({ open, onClose, data, onSave }: { open: boolean; onClose: () => void; data: typeof mockCaptacao; onSave: (d: Partial<typeof mockCaptacao>) => void }) {
  const [form, setForm] = useState({ ownerAskingPrice: data.ownerAskingPrice, suggestedPrice: data.suggestedPrice, evaluationDate: data.evaluationDate });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Avaliação & Preço</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Preço Pedido pelo Proprietário</Label><Input type="number" className="mt-1" value={form.ownerAskingPrice} onChange={e => set("ownerAskingPrice", Number(e.target.value))} /></div>
          <div><Label>Preço Sugerido</Label><Input type="number" className="mt-1" value={form.suggestedPrice} onChange={e => set("suggestedPrice", Number(e.target.value))} /></div>
          <div><Label>Data da Avaliação</Label><Input className="mt-1" value={form.evaluationDate} onChange={e => set("evaluationDate", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { onSave(form); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditCommissionModal({ open, onClose, data, onSave }: { open: boolean; onClose: () => void; data: typeof mockCaptacao; onSave: (d: Partial<typeof mockCaptacao>) => void }) {
  const [form, setForm] = useState({ commissionDirect: data.commissionDirect, commissionPartner: data.commissionPartner });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const estimated = (data.suggestedPrice * form.commissionDirect) / 100;

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Editar Comissão</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Comissão Direta (%)</Label><Input type="number" step="0.5" className="mt-1" value={form.commissionDirect} onChange={e => set("commissionDirect", Number(e.target.value))} /></div>
          <div><Label>Comissão Parceria (%)</Label><Input type="number" step="0.5" className="mt-1" value={form.commissionPartner} onChange={e => set("commissionPartner", Number(e.target.value))} /></div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-lg font-bold text-primary">{formatCurrency(estimated)}</p>
            <p className="text-xs text-muted-foreground">Comissão estimada</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { onSave({ ...form, estimatedCommission: estimated }); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ========== EXCLUSIVITY MODAL ========== */

function ExclusivityModal({ open, onClose, data, onSave }: { open: boolean; onClose: () => void; data: typeof mockCaptacao; onSave: (start: string, end: string) => void }) {
  const [startDate, setStartDate] = useState(data.exclusivityStart || "");
  const [endDate, setEndDate] = useState(data.exclusivityEnd || "");

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Exclusividade</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label className="text-sm">Data Início</Label><Input type="date" className="mt-1" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
          <div><Label className="text-sm">Data Fim</Label><Input type="date" className="mt-1" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          {startDate && endDate && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-primary">{calcDays()}</p>
              <p className="text-xs text-muted-foreground">dias de exclusividade</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => { onSave(startDate, endDate); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ========== COLUMNS ========== */

function LeftColumn({ data, onEditOwner, onEditProperty }: { data: typeof mockCaptacao; onEditOwner: () => void; onEditProperty: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Dados do Proprietário</CardTitle>
          <button onClick={onEditOwner} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil size={12} /></button>
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
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Dados do Imóvel</CardTitle>
          <button onClick={onEditProperty} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil size={12} /></button>
        </CardHeader>
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
              {data.exclusivity ? `Sim` : "Não"}
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

function RightColumn({ data, isImóvelCaptado, isBeforeImovelCaptado, checklist, onToggle, onEditValuation, onEditCommission }: {
  data: typeof mockCaptacao;
  isImóvelCaptado: boolean;
  isBeforeImovelCaptado: boolean;
  checklist: typeof captacaoChecklist;
  onToggle: (id: string) => void;
  onEditValuation: () => void;
  onEditCommission: () => void;
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
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Avaliação & Preço</CardTitle>
              <button onClick={onEditValuation} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil size={12} /></button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Preço pedido</span><span className="font-semibold">{formatCurrency(data.ownerAskingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Preço sugerido</span><span className="font-semibold text-primary">{formatCurrency(data.suggestedPrice)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data avaliação</span><span>{data.evaluationDate}</span></div>
              <div className="border-t border-border/40 pt-2 mt-2">
                <p className="text-xs font-medium text-foreground flex items-center gap-1 mb-1.5"><BarChart3 size={12} className="text-primary" /> Valores Médios da Região</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Preço/m² médio</span><span className="font-medium">{formatCurrency(data.avgRegionPrice)}/m²</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Aluguel/m² médio</span><span className="font-medium">R$ {data.avgRegionRent}/m²</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Valor estimado região</span><span className="font-semibold text-primary">{formatCurrency(data.avgRegionPrice * data.area)}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Comissão Estimada</CardTitle>
              <button onClick={onEditCommission} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil size={12} /></button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Direta</span><span>{data.commissionDirect}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Parceria</span><span>{data.commissionPartner}%</span></div>
              <div className="flex justify-between font-semibold"><span className="text-muted-foreground">Estimada</span><span className="text-primary">{formatCurrency(data.estimatedCommission)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Ações Rápidas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {isBeforeImovelCaptado ? (
                <>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Star size={14} /> Destacar no Portfólio</Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><FileText size={14} /> Solicitar Documentação</Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Ruler size={14} /> Solicitar Planta</Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start text-primary border-primary/30 hover:bg-primary/5"><Briefcase size={14} /> Imóvel Captado</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Camera size={14} /> Agendar Sessão de Fotos</Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Ruler size={14} /> Solicitar Planta</Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start"><Star size={14} /> Destacar no Portfólio</Button>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default CaptacaoDetail;
