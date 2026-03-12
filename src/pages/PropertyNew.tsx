import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Check, ChevronLeft, ChevronRight, Image, MapPin, DollarSign,
  Percent, FileCheck, Globe, User, Info, Upload, CheckCircle2, AlertCircle, ArrowLeft, X, Loader2
} from "lucide-react";
import { categoryTypes, type PropertyCategory, type PropertyPurpose } from "@/data/propertiesMockData";
import { toast } from "sonner";
import { useCreateProperty } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const PropertyNew = () => {
  const navigate = useNavigate();
  const createProperty = useCreateProperty();
  const { company } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    code: "",
    status: "rascunho",
    category: "residencial" as PropertyCategory,
    type: "",
    condition: "",
    occupation: "",
    purposes: [] as PropertyPurpose[],
    bedrooms: "",
    suites: "",
    bathrooms: "",
    parking_spaces: "",
    useful_area: "",
    total_area: "",
    // Address
    zip_code: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    // Values
    sale_price: "",
    rent_price: "",
    season_price: "",
    iptu: "",
    condo_fee: "",
    // Commission
    commission_direct: "5",
    commission_partner: "2.5",
    // Media
    images: [] as string[],
    video_url: "",
    tour_360_url: "",
    // Publication
    description: "",
    publish_website: false,
  });

  // Image upload state
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ url: string; path: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateForm = (updates: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...updates }));

  const types = categoryTypes[form.category];
  const salePriceNum = parseFloat(form.sale_price) || 0;
  const areaNum = parseFloat(form.total_area) || 0;
  const pricePerM2 = areaNum > 0 ? salePriceNum / areaNum : 0;
  const commDirectVal = salePriceNum * (parseFloat(form.commission_direct) || 0) / 100;
  const commPartnerVal = salePriceNum * (parseFloat(form.commission_partner) || 0) / 100;

  const togglePurpose = (p: PropertyPurpose) => {
    updateForm({
      purposes: form.purposes.includes(p) ? form.purposes.filter((x) => x !== p) : [...form.purposes, p],
    });
  };

  const [docs, setDocs] = useState([
    { id: "d1", label: "IPTU", status: "pendente" },
    { id: "d2", label: "Matrícula", status: "pendente" },
    { id: "d3", label: "Contrato", status: "pendente" },
    { id: "d4", label: "Certidões", status: "pendente" },
  ]);

  const toggleDocStatus = (id: string) => {
    setDocs((prev) => prev.map((d) => d.id === id ? { ...d, status: d.status === "pendente" ? "aprovado" : "pendente" } : d));
  };

  // Image upload handler
  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0 || !company?.id) return;
    setUploadingImages(true);
    const newImages: { url: string; path: string }[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} excede 10MB`);
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `${company.id}/properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("company-assets").upload(path, file);
      if (error) {
        toast.error(`Erro ao enviar ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("company-assets").getPublicUrl(path);
      newImages.push({ url: urlData.publicUrl, path });
    }

    setImageFiles((prev) => [...prev, ...newImages]);
    setUploadingImages(false);
    if (newImages.length > 0) toast.success(`${newImages.length} imagem(ns) enviada(s)`);
  }, [company?.id]);

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canNext = step < steps.length - 1;
  const canPrev = step > 0;

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Preencha o título do imóvel");
      setStep(0);
      return;
    }
    setSaving(true);
    try {
      const fullAddress = [form.address, form.number, form.complement].filter(Boolean).join(", ");
      await createProperty.mutateAsync({
        title: form.title,
        code: form.code || undefined,
        category: form.category,
        type: form.type || undefined,
        status: form.status,
        purpose: form.purposes.length > 0 ? form.purposes : undefined,
        condition: form.condition || undefined,
        occupation: form.occupation || undefined,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : 0,
        suites: form.suites ? parseInt(form.suites) : 0,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : 0,
        parking_spaces: form.parking_spaces ? parseInt(form.parking_spaces) : 0,
        useful_area: form.useful_area ? parseFloat(form.useful_area) : 0,
        total_area: form.total_area ? parseFloat(form.total_area) : 0,
        address: fullAddress || undefined,
        neighborhood: form.neighborhood || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zip_code: form.zip_code || undefined,
        sale_price: form.sale_price ? parseFloat(form.sale_price) : undefined,
        rent_price: form.rent_price ? parseFloat(form.rent_price) : undefined,
        season_price: form.season_price ? parseFloat(form.season_price) : undefined,
        iptu: form.iptu ? parseFloat(form.iptu) : undefined,
        condo_fee: form.condo_fee ? parseFloat(form.condo_fee) : undefined,
        commission_direct: form.commission_direct ? parseFloat(form.commission_direct) : 6,
        commission_partner: form.commission_partner ? parseFloat(form.commission_partner) : 3,
        description: form.description || undefined,
        images: imageFiles.map((f) => f.url),
        cover_image: imageFiles.length > 0 ? imageFiles[0].url : undefined,
        video_url: form.video_url || undefined,
        tour_360_url: form.tour_360_url || undefined,
        publish_website: form.publish_website,
      });
      toast.success("Imóvel criado com sucesso!");
      navigate("/properties");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao criar imóvel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/properties")} className="shrink-0">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Imóvel</h1>
          <p className="text-sm text-muted-foreground">Preencha as informações para cadastrar um novo imóvel</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isDone = i < step;
            const isActive = i === step;
            return (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={cn(
                  "flex items-center rounded-full px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap gap-[6px]",
                  isActive ? "gradient-primary text-primary-foreground shadow-primary" :
                  isDone ? "bg-success/10 text-success" :
                  "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {isDone ? <Check size={14} /> : <Icon size={14} />}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-border bg-card p-6 md:p-8 min-h-[400px]">
        <div className="space-y-5">
          {step === 0 && (
            <StepInfo form={form} updateForm={updateForm} types={types} togglePurpose={togglePurpose} />
          )}
          {step === 1 && (
            <StepMedia
              imageFiles={imageFiles}
              uploading={uploadingImages}
              fileInputRef={fileInputRef}
              onUpload={handleImageUpload}
              onRemove={removeImage}
              videoUrl={form.video_url}
              tourUrl={form.tour_360_url}
              onVideoChange={(v) => updateForm({ video_url: v })}
              onTourChange={(v) => updateForm({ tour_360_url: v })}
            />
          )}
          {step === 2 && <StepAddress form={form} updateForm={updateForm} />}
          {step === 3 && (
            <StepValues form={form} updateForm={updateForm} pricePerM2={pricePerM2} />
          )}
          {step === 4 && (
            <StepCommission form={form} updateForm={updateForm} commDirectVal={commDirectVal} commPartnerVal={commPartnerVal} />
          )}
          {step === 5 && <StepDocuments docs={docs} onToggle={toggleDocStatus} />}
          {step === 6 && <StepPublication form={form} updateForm={updateForm} />}
          {step === 7 && <StepOwner />}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
        <div className="text-sm text-muted-foreground">Etapa {step + 1} de {steps.length}</div>
        <div className="flex gap-2">
          {canPrev && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-1.5">
              <ChevronLeft size={16} /> Anterior
            </Button>
          )}
          {canNext ? (
            <Button onClick={() => setStep((s) => s + 1)} className="gradient-primary text-primary-foreground gap-1.5">
              Próximo <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground gap-1.5">
              {saving && <Loader2 size={16} className="animate-spin" />}
              Salvar Imóvel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyNew;

/* ─── Step sub-components ─── */

function StepInfo({ form, updateForm, types, togglePurpose }: {
  form: any;
  updateForm: (u: any) => void;
  types: string[];
  togglePurpose: (p: PropertyPurpose) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Título do anúncio *</Label><Input className="mt-1" placeholder="Ex: Apartamento 3q Vila Mariana" value={form.title} onChange={(e) => updateForm({ title: e.target.value })} /></div>
        <div><Label className="text-xs">Código do imóvel</Label><Input className="mt-1" placeholder="ISF-000" value={form.code} onChange={(e) => updateForm({ code: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={form.status} onValueChange={(v) => updateForm({ status: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["rascunho", "ativo", "inativo", "reservado", "pendente"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Categoria</Label>
          <Select value={form.category} onValueChange={(v) => updateForm({ category: v as PropertyCategory })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["residencial", "comercial", "industrial", "rural", "terreno"] as const).map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Tipo</Label>
          <Select value={form.type} onValueChange={(v) => updateForm({ type: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Estado do imóvel</Label>
          <Select value={form.condition} onValueChange={(v) => updateForm({ condition: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {["novo", "usado", "em construção", "reformado"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Ocupação</Label>
          <Select value={form.occupation} onValueChange={(v) => updateForm({ occupation: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              {["desocupado", "ocupado proprietário", "ocupado inquilino", "temporada"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs mb-2 block">Finalidade</Label>
        <div className="flex flex-wrap gap-3">
          {(["venda", "locação", "temporada", "lançamento", "exclusividade"] as PropertyPurpose[]).map((p) =>
            <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Checkbox checked={form.purposes.includes(p)} onCheckedChange={() => togglePurpose(p)} />{p}
            </label>
          )}
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <div><Label className="text-xs">Dormitórios</Label><Input inputMode="numeric" className="mt-1" value={form.bedrooms} onChange={(e) => updateForm({ bedrooms: e.target.value })} /></div>
        <div><Label className="text-xs">Suítes</Label><Input inputMode="numeric" className="mt-1" value={form.suites} onChange={(e) => updateForm({ suites: e.target.value })} /></div>
        <div><Label className="text-xs">Banheiros</Label><Input inputMode="numeric" className="mt-1" value={form.bathrooms} onChange={(e) => updateForm({ bathrooms: e.target.value })} /></div>
        <div><Label className="text-xs">Vagas</Label><Input inputMode="numeric" className="mt-1" value={form.parking_spaces} onChange={(e) => updateForm({ parking_spaces: e.target.value })} /></div>
        <div><Label className="text-xs">Área útil (m²)</Label><Input inputMode="decimal" className="mt-1" value={form.useful_area} onChange={(e) => updateForm({ useful_area: e.target.value })} /></div>
        <div><Label className="text-xs">Área total (m²)</Label><Input inputMode="decimal" className="mt-1" value={form.total_area} onChange={(e) => updateForm({ total_area: e.target.value })} /></div>
      </div>
    </div>
  );
}

function StepMedia({ imageFiles, uploading, fileInputRef, onUpload, onRemove, videoUrl, tourUrl, onVideoChange, onTourChange }: {
  imageFiles: { url: string; path: string }[];
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  videoUrl: string;
  tourUrl: string;
  onVideoChange: (v: string) => void;
  onTourChange: (v: string) => void;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onUpload(e.target.files)}
      />
      <div
        className="rounded-xl border-2 border-dashed border-border p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {uploading ? (
          <Loader2 size={40} className="mx-auto text-primary animate-spin mb-3" />
        ) : (
          <Upload size={40} className="mx-auto text-muted-foreground mb-3" />
        )}
        <p className="text-sm font-medium text-foreground">
          {uploading ? "Enviando imagens..." : "Arraste imagens ou clique para enviar"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Máx 50 imagens · 10MB cada</p>
      </div>

      {imageFiles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {imageFiles.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-muted">
              <img src={img.url} alt={`Imagem ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 rounded-full bg-destructive text-destructive-foreground p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">
                  Capa
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Link YouTube/Vimeo</Label><Input className="mt-1" placeholder="https://youtube.com/..." value={videoUrl} onChange={(e) => onVideoChange(e.target.value)} /></div>
        <div><Label className="text-xs">Link Tour 360</Label><Input className="mt-1" placeholder="https://..." value={tourUrl} onChange={(e) => onTourChange(e.target.value)} /></div>
      </div>
    </div>
  );
}

function StepAddress({ form, updateForm }: { form: any; updateForm: (u: any) => void }) {
  const addressQuery = [form.address, form.number, form.neighborhood, form.city, form.state]
    .filter(Boolean)
    .join(", ");
  const hasAddress = addressQuery.length > 5;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">CEP</Label><Input inputMode="numeric" className="mt-1" placeholder="00000-000" value={form.zip_code} onChange={(e) => updateForm({ zip_code: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Logradouro</Label><Input className="mt-1" placeholder="Rua, Avenida..." value={form.address} onChange={(e) => updateForm({ address: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Número</Label><Input inputMode="numeric" className="mt-1" value={form.number} onChange={(e) => updateForm({ number: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label className="text-xs">Complemento</Label><Input className="mt-1" placeholder="Apt, Bloco..." value={form.complement} onChange={(e) => updateForm({ complement: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Bairro</Label><Input className="mt-1" value={form.neighborhood} onChange={(e) => updateForm({ neighborhood: e.target.value })} /></div>
        <div><Label className="text-xs">Cidade</Label><Input className="mt-1" value={form.city} onChange={(e) => updateForm({ city: e.target.value })} /></div>
        <div>
          <Label className="text-xs">Estado</Label>
          <Select value={form.state} onValueChange={(v) => updateForm({ state: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="UF" /></SelectTrigger>
            <SelectContent>{["SP", "RJ", "MG", "RS", "PR", "SC", "BA", "PE", "CE", "DF", "GO", "ES", "PA", "MA", "MT", "MS", "PB", "RN", "AL", "SE", "PI", "RO", "TO", "AC", "AP", "AM", "RR"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Google Maps embed */}
      <div className="rounded-xl overflow-hidden h-56">
        {hasAddress ? (
          <iframe
            title="Mapa"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&output=embed`}
          />
        ) : (
          <div className="bg-muted h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin size={36} className="mx-auto mb-2" />
              <p className="text-sm">Preencha o endereço para visualizar o mapa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepValues({ form, updateForm, pricePerM2 }: { form: any; updateForm: (u: any) => void; pricePerM2: number }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">Valor de Venda (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={form.sale_price} onChange={(e) => updateForm({ sale_price: e.target.value })} /></div>
        <div><Label className="text-xs">Valor de Locação (R$/mês)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={form.rent_price} onChange={(e) => updateForm({ rent_price: e.target.value })} /></div>
        <div><Label className="text-xs">Valor Temporada (R$/dia)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={form.season_price} onChange={(e) => updateForm({ season_price: e.target.value })} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label className="text-xs">Área Total (m²)</Label><Input inputMode="decimal" className="mt-1" value={form.total_area} onChange={(e) => updateForm({ total_area: e.target.value })} /></div>
        <div className="rounded-lg bg-muted p-4">
          <Label className="text-xs text-muted-foreground">Valor por m²</Label>
          <p className="text-xl font-bold text-primary mt-1">{pricePerM2 > 0 ? formatCurrency(pricePerM2) : "—"}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label className="text-xs">IPTU (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={form.iptu} onChange={(e) => updateForm({ iptu: e.target.value })} /></div>
        <div>
          <Label className="text-xs">Cobrança IPTU</Label>
          <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Condomínio (R$)</Label><Input inputMode="numeric" className="mt-1" placeholder="0" value={form.condo_fee} onChange={(e) => updateForm({ condo_fee: e.target.value })} /></div>
      </div>
    </div>
  );
}

function StepCommission({ form, updateForm, commDirectVal, commPartnerVal }: {
  form: any; updateForm: (u: any) => void; commDirectVal: number; commPartnerVal: number;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-xs">% Comissão Venda Direta</Label>
          <Input inputMode="decimal" className="mt-1" value={form.commission_direct} onChange={(e) => updateForm({ commission_direct: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">% Comissão Parceria</Label>
          <Input inputMode="decimal" className="mt-1" value={form.commission_partner} onChange={(e) => updateForm({ commission_partner: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-muted p-5 text-center">
          <p className="text-xs text-muted-foreground">Comissão Direta</p>
          <p className="text-2xl font-bold text-primary mt-1">{commDirectVal > 0 ? formatCurrency(commDirectVal) : "—"}</p>
        </div>
        <div className="rounded-lg bg-muted p-5 text-center">
          <p className="text-xs text-muted-foreground">Comissão Parceria</p>
          <p className="text-2xl font-bold text-accent mt-1">{commPartnerVal > 0 ? formatCurrency(commPartnerVal) : "—"}</p>
        </div>
        <div className="rounded-lg bg-muted p-5 text-center">
          <p className="text-xs text-muted-foreground">Valor Líquido</p>
          <p className="text-2xl font-bold text-success mt-1">{commDirectVal > 0 ? formatCurrency(commDirectVal - commPartnerVal) : "—"}</p>
        </div>
      </div>
    </div>
  );
}

function StepDocuments({ docs, onToggle }: { docs: { id: string; label: string; status: string }[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">Gerencie os documentos obrigatórios do imóvel</p>
      <div className="space-y-2">
        {docs.map((d) =>
          <div key={d.id} className={cn(
            "flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer hover:bg-muted/50",
            d.status === "aprovado" ? "border-success/20 bg-success/5" : "border-border/50"
          )} onClick={() => onToggle(d.id)}>
            <div className="flex items-center gap-3">
              {d.status === "aprovado" ? <CheckCircle2 size={18} className="text-success" /> : <AlertCircle size={18} className="text-muted-foreground" />}
              <span className="text-sm font-medium">{d.label}</span>
            </div>
            <Badge variant={d.status === "aprovado" ? "default" : "secondary"} className="text-xs">
              {d.status === "aprovado" ? "Aprovado" : "Pendente"}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

function StepPublication({ form, updateForm }: { form: any; updateForm: (u: any) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs">Descrição completa</Label>
        <Textarea className="mt-1 min-h-[150px]" placeholder="Descreva o imóvel em detalhes..." value={form.description} onChange={(e) => updateForm({ description: e.target.value })} />
      </div>
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={form.publish_website} onCheckedChange={(v) => updateForm({ publish_website: !!v })} /> Publicar no Site
        </label>
      </div>
    </div>
  );
}

function StepOwner() {
  return (
    <div className="space-y-5">
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
      <div className="rounded-xl border border-border/50 p-5 space-y-4">
        <p className="text-sm font-medium text-foreground">Cadastrar novo proprietário</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label className="text-xs">Nome</Label><Input className="mt-1" /></div>
          <div><Label className="text-xs">Telefone</Label><Input inputMode="tel" className="mt-1" placeholder="(00) 00000-0000" /></div>
          <div><Label className="text-xs">E-mail</Label><Input className="mt-1" type="email" /></div>
          <div><Label className="text-xs">CPF/CNPJ</Label><Input inputMode="numeric" className="mt-1" /></div>
        </div>
      </div>
    </div>
  );
}
