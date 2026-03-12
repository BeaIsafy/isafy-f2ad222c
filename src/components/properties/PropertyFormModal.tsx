import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Check, ChevronLeft, ChevronRight, Image, MapPin, DollarSign,
  Percent, FileCheck, Globe, User, Info, Upload, CheckCircle2, AlertCircle
} from "lucide-react";
import { categoryTypes, type PropertyCategory, type PropertyPurpose } from "@/data/propertiesMockData";

interface Props {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { label: "Informações", icon: Info },
  { label: "Mídias", icon: Image },
  { label: "Endereço", icon: MapPin },
  { label: "Valores", icon: DollarSign },
  { label: "Comissão", icon: Percent },
  { label: "Documentos", icon: FileCheck },
  { label: "Divulgação", icon: Globe },
  { label: "Proprietário", icon: User },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function PropertyFormModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<PropertyCategory>("residencial");
  const [salePrice, setSalePrice] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [commDirect, setCommDirect] = useState("5");
  const [commPartner, setCommPartner] = useState("2.5");
  const [purposes, setPurposes] = useState<PropertyPurpose[]>([]);
  const [docs, setDocs] = useState([
    { id: "d1", label: "IPTU", status: "pendente" },
    { id: "d2", label: "Matrícula", status: "pendente" },
    { id: "d3", label: "Contrato", status: "pendente" },
    { id: "d4", label: "Certidões", status: "pendente" },
  ]);

  const types = categoryTypes[category];
  const salePriceNum = parseFloat(salePrice) || 0;
  const areaNum = parseFloat(totalArea) || 0;
  const pricePerM2 = areaNum > 0 ? salePriceNum / areaNum : 0;
  const commDirectVal = salePriceNum * (parseFloat(commDirect) || 0) / 100;
  const commPartnerVal = salePriceNum * (parseFloat(commPartner) || 0) / 100;

  const togglePurpose = (p: PropertyPurpose) => {
    setPurposes(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const toggleDocStatus = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "pendente" ? "aprovado" : "pendente" } : d));
  };

  const canNext = step < steps.length - 1;
  const canPrev = step > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Novo Imóvel</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="px-6 py-3 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isDone = i < step;
              const isActive = i === step;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                    isActive ? "gradient-primary text-primary-foreground shadow-primary" :
                    isDone ? "bg-success/10 text-success" :
                    "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {isDone ? <Check size={12} /> : <Icon size={12} />}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 px-6 pb-2">
          <div className="min-h-[300px] space-y-4 py-2">
            {step === 0 && <StepInfo category={category} setCategory={setCategory} types={types} purposes={purposes} togglePurpose={togglePurpose} />}
            {step === 1 && <StepMedia />}
            {step === 2 && <StepAddress />}
            {step === 3 && <StepValues salePrice={salePrice} setSalePrice={setSalePrice} totalArea={totalArea} setTotalArea={setTotalArea} pricePerM2={pricePerM2} />}
            {step === 4 && <StepCommission commDirect={commDirect} setCommDirect={setCommDirect} commPartner={commPartner} setCommPartner={setCommPartner} commDirectVal={commDirectVal} commPartnerVal={commPartnerVal} />}
            {step === 5 && <StepDocuments docs={docs} onToggle={toggleDocStatus} />}
            {step === 6 && <StepPublication />}
            {step === 7 && <StepOwner />}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="text-xs text-muted-foreground">Etapa {step + 1} de {steps.length}</div>
          <div className="flex gap-2">
            {canPrev && <Button variant="outline" size="sm" onClick={() => setStep(s => s - 1)} className="gap-1"><ChevronLeft size={14} /> Anterior</Button>}
            {canNext ? (
              <Button size="sm" onClick={() => setStep(s => s + 1)} className="gradient-primary text-primary-foreground gap-1">Próximo <ChevronRight size={14} /></Button>
            ) : (
              <Button size="sm" onClick={onClose} className="gradient-primary text-primary-foreground">Salvar Imóvel</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepInfo({ category, setCategory, types, purposes, togglePurpose }: {
  category: PropertyCategory; setCategory: (c: PropertyCategory) => void;
  types: string[]; purposes: PropertyPurpose[]; togglePurpose: (p: PropertyPurpose) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Título do anúncio</Label><Input className="mt-1" placeholder="Ex: Apartamento 3q Vila Mariana" /></div>
        <div><Label className="text-xs">Código do imóvel</Label><Input className="mt-1" placeholder="ISF-000" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Status</Label>
          <Select defaultValue="rascunho"><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["rascunho","ativo","inativo","reservado","pendente"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Categoria</Label>
          <Select value={category} onValueChange={v => setCategory(v as PropertyCategory)}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["residencial","comercial","industrial","rural","terreno"] as const).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Tipo</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Estado do imóvel</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {["novo","usado","em construção","reformado"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Ocupação</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {["desocupado","ocupado proprietário","ocupado inquilino","temporada"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs mb-2 block">Finalidade</Label>
        <div className="flex flex-wrap gap-2">
          {(["venda","locação","temporada","lançamento","exclusividade"] as PropertyPurpose[]).map(p => (
            <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Checkbox checked={purposes.includes(p)} onCheckedChange={() => togglePurpose(p)} />{p}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <div><Label className="text-xs">Dormitórios</Label><Input inputMode="numeric" min="0" className="mt-1" /></div>
        <div><Label className="text-xs">Suítes</Label><Input inputMode="numeric" min="0" className="mt-1" /></div>
        <div><Label className="text-xs">Banheiros</Label><Input inputMode="numeric" min="0" className="mt-1" /></div>
        <div><Label className="text-xs">Vagas</Label><Input inputMode="numeric" min="0" className="mt-1" /></div>
        <div><Label className="text-xs">Área útil (m²)</Label><Input inputMode="decimal" min="0" className="mt-1" /></div>
        <div><Label className="text-xs">Área total (m²)</Label><Input inputMode="decimal" min="0" className="mt-1" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Corretor responsável</Label><Input className="mt-1" placeholder="Nome do corretor" /></div>
        <div><Label className="text-xs">Ano de construção</Label><Input inputMode="numeric" className="mt-1" placeholder="Ex: 2020" /></div>
        <div><Label className="text-xs">Matrícula</Label><Input className="mt-1" placeholder="Nº matrícula" /></div>
      </div>
    </div>
  );
}

function StepMedia() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
        <Upload size={32} className="mx-auto text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">Arraste imagens ou clique para enviar</p>
        <p className="text-xs text-muted-foreground mt-1">Máx 50 imagens · 10MB cada</p>
        <Button variant="outline" size="sm" className="mt-3">Selecionar Imagens</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Link YouTube/Vimeo</Label><Input className="mt-1" placeholder="https://youtube.com/..." /></div>
        <div><Label className="text-xs">Link Tour 360</Label><Input className="mt-1" placeholder="https://..." /></div>
      </div>
    </div>
  );
}

function StepAddress() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">CEP</Label><Input className="mt-1" placeholder="00000-000" /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Logradouro</Label><Input className="mt-1" placeholder="Rua, Avenida..." /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Número</Label><Input className="mt-1" /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Complemento</Label><Input className="mt-1" placeholder="Apt, Bloco..." /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Bairro</Label><Input className="mt-1" /></div>
        <div><Label className="text-xs">Cidade</Label><Input className="mt-1" /></div>
        <div><Label className="text-xs">Estado</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="UF" /></SelectTrigger>
            <SelectContent>{["SP","RJ","MG","RS","PR","SC","BA","PE","CE","DF","GO","ES","PA","MA","MT","MS","PB","RN","AL","SE","PI","RO","TO","AC","AP","AM","RR"].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-xl bg-muted h-48 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapPin size={32} className="mx-auto mb-2" />
          <p className="text-sm">Mapa será exibido aqui</p>
          <p className="text-xs mt-1">Pin exato ou aproximado</p>
        </div>
      </div>
      <div><Label className="text-xs">Condomínio</Label><Input className="mt-1" placeholder="Buscar ou criar condomínio" /></div>
    </div>
  );
}

function StepValues({ salePrice, setSalePrice, totalArea, setTotalArea, pricePerM2 }: {
  salePrice: string; setSalePrice: (v: string) => void;
  totalArea: string; setTotalArea: (v: string) => void;
  pricePerM2: number;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Valor de Venda (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={salePrice} onChange={e => setSalePrice(e.target.value)} /></div>
        <div><Label className="text-xs">Valor de Locação (R$/mês)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" /></div>
        <div><Label className="text-xs">Valor Temporada (R$/dia)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Área Total (m²)</Label><Input inputMode="decimal" className="mt-1" value={totalArea} onChange={e => setTotalArea(e.target.value)} /></div>
        <div className="rounded-lg bg-muted p-3">
          <Label className="text-xs text-muted-foreground">Valor por m²</Label>
          <p className="text-lg font-bold text-primary mt-1">{pricePerM2 > 0 ? formatCurrency(pricePerM2) : "—"}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">IPTU (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" /></div>
        <div>
          <Label className="text-xs">Cobrança IPTU</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Condomínio (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" /></div>
      </div>
    </div>
  );
}

function StepCommission({ commDirect, setCommDirect, commPartner, setCommPartner, commDirectVal, commPartnerVal }: {
  commDirect: string; setCommDirect: (v: string) => void;
  commPartner: string; setCommPartner: (v: string) => void;
  commDirectVal: number; commPartnerVal: number;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">% Comissão Venda Direta</Label>
          <Input inputMode="decimal" step="0.5" className="mt-1" value={commDirect} onChange={e => setCommDirect(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">% Comissão Parceria</Label>
          <Input inputMode="decimal" step="0.5" className="mt-1" value={commPartner} onChange={e => setCommPartner(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">Comissão Direta</p>
          <p className="text-xl font-bold text-primary mt-1">{commDirectVal > 0 ? formatCurrency(commDirectVal) : "—"}</p>
        </div>
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">Comissão Parceria</p>
          <p className="text-xl font-bold text-accent mt-1">{commPartnerVal > 0 ? formatCurrency(commPartnerVal) : "—"}</p>
        </div>
        <div className="rounded-lg bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">Valor Líquido</p>
          <p className="text-xl font-bold text-success mt-1">{commDirectVal > 0 ? formatCurrency(commDirectVal - commPartnerVal) : "—"}</p>
        </div>
      </div>
    </div>
  );
}

function StepDocuments({ docs, onToggle }: { docs: { id: string; label: string; status: string }[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Gerencie os documentos obrigatórios do imóvel</p>
      <div className="space-y-2">
        {docs.map(d => (
          <div key={d.id} className={cn(
            "flex items-center justify-between rounded-lg border p-3 transition-colors cursor-pointer hover:bg-muted/50",
            d.status === "aprovado" ? "border-success/20 bg-success/5" : "border-border/50"
          )} onClick={() => onToggle(d.id)}>
            <div className="flex items-center gap-2.5">
              {d.status === "aprovado" ? <CheckCircle2 size={16} className="text-success" /> : <AlertCircle size={16} className="text-muted-foreground" />}
              <span className="text-sm">{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={d.status === "aprovado" ? "default" : "secondary"} className="text-[10px]">
                {d.status === "aprovado" ? "Aprovado" : "Pendente"}
              </Badge>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={e => e.stopPropagation()}>
                <Upload size={12} /> Upload
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPublication() {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs">Descrição completa</Label>
        <Textarea className="mt-1 min-h-[120px]" placeholder="Descreva o imóvel em detalhes..." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Título SEO</Label><Input className="mt-1" placeholder="Título para mecanismos de busca" /></div>
        <div><Label className="text-xs">Slug URL</Label><Input className="mt-1" placeholder="apartamento-3q-vila-mariana" /></div>
      </div>
      <div><Label className="text-xs">Meta Description</Label><Textarea className="mt-1 min-h-[60px]" placeholder="Descrição para resultados de busca (máx 160 caracteres)" /></div>
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox /> Publicar no Site</label>
        <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox /> Publicar no Mapa</label>
        <div>
          <Label className="text-xs mb-2 block">Publicar nos Portais</Label>
          <div className="flex flex-wrap gap-2">
            {["ZAP Imóveis", "OLX", "Viva Real", "Imovelweb", "Portal Particular"].map(p => (
              <label key={p} className="flex items-center gap-1.5 text-xs cursor-pointer"><Checkbox />{p}</label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepOwner() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Vincule o proprietário do imóvel</p>
      <div>
        <Label className="text-xs">Buscar proprietário existente</Label>
        <Input className="mt-1" placeholder="Nome, telefone ou e-mail..." />
      </div>
      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="rounded-xl border border-border/50 p-4 space-y-3">
        <p className="text-sm font-medium text-foreground">Cadastrar novo proprietário</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label className="text-xs">Nome</Label><Input className="mt-1" /></div>
          <div><Label className="text-xs">Telefone</Label><Input className="mt-1" placeholder="(00) 00000-0000" /></div>
          <div><Label className="text-xs">E-mail</Label><Input className="mt-1" type="email" /></div>
          <div><Label className="text-xs">CPF/CNPJ</Label><Input className="mt-1" /></div>
        </div>
      </div>
    </div>
  );
}
