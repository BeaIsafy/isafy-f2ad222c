import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BedDouble, Bath, Car, Maximize, MapPin, Calendar, X, FileText,
  ChevronRight, Phone, User, DollarSign, Heart, Eye
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoIsafy from "@/assets/logo-isafy.png";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

interface MatchProperty {
  id: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  address: string;
  image: string;
  match: number;
  description: string;
  features: string[];
  condominio: number;
  iptu: number;
}

const mockMatchProperties: MatchProperty[] = [
  { id: "p1", title: "Apt 2q Moema", price: 520000, area: 68, bedrooms: 2, bathrooms: 2, parking: 1, address: "Rua dos Lírios, 240 - Moema, São Paulo", image: "/placeholder.svg", match: 95, description: "Apartamento reformado com excelente acabamento, próximo ao metrô e comércios.", features: ["Varanda gourmet", "Armários planejados", "Piso porcelanato", "2 vagas"], condominio: 850, iptu: 280 },
  { id: "p2", title: "Apt 2q Vila Mariana", price: 480000, area: 62, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Domingos de Morais, 800 - Vila Mariana", image: "/placeholder.svg", match: 88, description: "Bem localizado, próximo ao Parque Ibirapuera e metrô Ana Rosa.", features: ["Piscina", "Churrasqueira", "Salão de festas"], condominio: 720, iptu: 230 },
  { id: "p3", title: "Apt 3q Moema", price: 590000, area: 75, bedrooms: 3, bathrooms: 2, parking: 2, address: "Al. dos Anapurus, 100 - Moema", image: "/placeholder.svg", match: 82, description: "Amplo apartamento com 3 quartos, suíte máster e lazer completo.", features: ["Suíte máster", "Lazer completo", "Portaria 24h"], condominio: 1100, iptu: 350 },
  { id: "p4", title: "Apt 2q Vila Clementino", price: 450000, area: 58, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Pedro de Toledo, 500 - Vila Clementino", image: "/placeholder.svg", match: 78, description: "Apartamento funcional em região com ótima infraestrutura hospitalar e comercial.", features: ["Academia", "Brinquedoteca"], condominio: 600, iptu: 200 },
  { id: "p5", title: "Apt 2q Saúde", price: 420000, area: 60, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Loefgren, 300 - Saúde", image: "/placeholder.svg", match: 72, description: "Ótimo custo-benefício, próximo ao metrô Saúde e Parque do Estado.", features: ["Salão de festas", "Playground"], condominio: 550, iptu: 180 },
];

const MatchPage = () => {
  const { leadId } = useParams();
  const [selectedProperty, setSelectedProperty] = useState<MatchProperty | null>(null);
  const [visitProperty, setVisitProperty] = useState<MatchProperty | null>(null);
  const [proposalProperty, setProposalProperty] = useState<MatchProperty | null>(null);
  const [discarded, setDiscarded] = useState<string[]>([]);

  const visibleProperties = mockMatchProperties.filter((p) => !discarded.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <img src={logoIsafy} alt="Logo" className="h-8" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Imóveis Selecionados para Você</p>
            <p className="text-xs text-muted-foreground">Confira as melhores opções de acordo com seu perfil</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Seus Imóveis em Destaque</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selecionamos {visibleProperties.length} imóveis compatíveis com seu perfil
          </p>
        </div>

        {visibleProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Você descartou todos os imóveis.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((p) => (
              <Card key={p.id} className="overflow-hidden border-border/50 hover:shadow-card-hover transition-shadow">
                <div
                  className="relative h-40 bg-muted cursor-pointer"
                  onClick={() => setSelectedProperty(p)}
                >
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  <Badge className="absolute top-2 right-2 gradient-primary text-primary-foreground text-xs">
                    {p.match}% match
                  </Badge>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Eye size={24} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <CardContent className="pt-4 space-y-3">
                  <div className="cursor-pointer" onClick={() => setSelectedProperty(p)}>
                    <p className="font-semibold text-foreground">{p.title}</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={12} /> {p.address}
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Maximize size={12} />{p.area}m²</span>
                    <span className="flex items-center gap-1"><BedDouble size={12} />{p.bedrooms}q</span>
                    <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms}b</span>
                    <span className="flex items-center gap-1"><Car size={12} />{p.parking}v</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => setVisitProperty(p)}>
                      <Calendar size={12} /> Agendar Visita
                    </Button>
                    <Button size="sm" className="flex-1 text-xs gap-1 gradient-primary text-primary-foreground" onClick={() => setProposalProperty(p)}>
                      <FileText size={12} /> Proposta
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => {
                      setDiscarded((prev) => [...prev, p.id]);
                      toast("Imóvel removido da lista");
                    }}
                  >
                    <X size={12} className="mr-1" /> Não tenho interesse
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Property Detail Popup */}
      <PropertyDetailDialog
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onVisit={(p) => { setSelectedProperty(null); setVisitProperty(p); }}
        onProposal={(p) => { setSelectedProperty(null); setProposalProperty(p); }}
      />

      {/* Visit Request Popup */}
      <VisitRequestDialog
        property={visitProperty}
        onClose={() => setVisitProperty(null)}
      />

      {/* Client Proposal Popup */}
      <ClientProposalDialog
        property={proposalProperty}
        onClose={() => setProposalProperty(null)}
      />
    </div>
  );
};

/* ─── Property Detail ─── */
function PropertyDetailDialog({
  property,
  onClose,
  onVisit,
  onProposal,
}: {
  property: MatchProperty | null;
  onClose: () => void;
  onVisit: (p: MatchProperty) => void;
  onProposal: (p: MatchProperty) => void;
}) {
  if (!property) return null;
  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <div className="relative h-48 bg-muted shrink-0">
          <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
          <Badge className="absolute top-3 right-3 gradient-primary text-primary-foreground">{property.match}% match</Badge>
        </div>
        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{property.title}</h2>
              <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(property.price)}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> {property.address}
            </div>

            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Maximize size={14} className="text-muted-foreground" /> {property.area}m²</span>
              <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-muted-foreground" /> {property.bedrooms} quartos</span>
              <span className="flex items-center gap-1.5"><Bath size={14} className="text-muted-foreground" /> {property.bathrooms} banheiros</span>
              <span className="flex items-center gap-1.5"><Car size={14} className="text-muted-foreground" /> {property.parking} vagas</span>
            </div>

            <p className="text-sm text-foreground leading-relaxed">{property.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {property.features.map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
              ))}
            </div>

            {/* Costs */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Condomínio</span>
                <span className="font-medium">{formatCurrency(property.condominio)}/mês</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IPTU</span>
                <span className="font-medium">{formatCurrency(property.iptu)}/mês</span>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="px-6 pb-6 pt-2 flex gap-2">
          <Button variant="outline" className="flex-1 gap-1.5" onClick={() => onVisit(property)}>
            <Calendar size={14} /> Agendar Visita
          </Button>
          <Button className="flex-1 gap-1.5 gradient-primary text-primary-foreground" onClick={() => onProposal(property)}>
            <FileText size={14} /> Fazer Proposta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Visit Request ─── */
function VisitRequestDialog({ property, onClose }: { property: MatchProperty | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => { setName(""); setPhone(""); setPreferredDate(""); setPreferredTime(""); setNotes(""); setSent(false); };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !preferredDate) return;
    setSent(true);
    toast.success("Solicitação de visita enviada ao corretor!");
  };

  const handleClose = () => { reset(); onClose(); };

  if (!property) return null;

  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" /> Solicitar Visita
          </DialogTitle>
          <DialogDescription>
            Agende uma visita para <span className="font-semibold text-foreground">{property.title}</span>
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="px-6 py-12 text-center space-y-3">
            <Calendar size={48} className="text-success mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Visita Solicitada!</h3>
            <p className="text-sm text-muted-foreground">O corretor entrará em contato para confirmar a visita ao imóvel <strong>{property.title}</strong>.</p>
            <Button className="mt-4" onClick={handleClose}>Voltar aos Imóveis</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted/50 p-3 flex gap-3">
                  <div className="h-12 w-12 rounded-md bg-muted shrink-0 overflow-hidden">
                    <img src={property.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{property.title}</p>
                    <p className="text-xs text-primary font-semibold">{formatCurrency(property.price)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Seu Nome *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone / WhatsApp *</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" maxLength={20} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Data preferencial *</Label>
                    <Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário preferencial</Label>
                    <Input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguma preferência ou dúvida?" rows={2} maxLength={500} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 pb-6 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!name.trim() || !phone.trim() || !preferredDate}>
                Solicitar Visita
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Client Proposal ─── */
function ClientProposalDialog({ property, onClose }: { property: MatchProperty | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState("");
  const [paymentType, setPaymentType] = useState("financiamento");
  const [conditions, setConditions] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => { setName(""); setPhone(""); setEmail(""); setValue(""); setPaymentType("financiamento"); setConditions(""); setSent(false); };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !value) return;
    setSent(true);
    toast.success("Proposta enviada ao corretor! Você será notificado sobre a resposta.");
  };

  const handleClose = () => { reset(); onClose(); };

  if (!property) return null;

  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} className="text-primary" /> Fazer Proposta
          </DialogTitle>
          <DialogDescription>
            Envie sua proposta para <span className="font-semibold text-foreground">{property.title}</span>
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="px-6 py-12 text-center space-y-3">
            <FileText size={48} className="text-success mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Proposta Enviada!</h3>
            <p className="text-sm text-muted-foreground">
              Sua proposta de <strong>{formatCurrency(Number(value))}</strong> para o imóvel <strong>{property.title}</strong> foi enviada ao corretor.
              Você receberá uma notificação quando houver resposta.
            </p>
            <Button className="mt-4" onClick={handleClose}>Voltar aos Imóveis</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-muted/50 p-3 flex gap-3">
                  <div className="h-12 w-12 rounded-md bg-muted shrink-0 overflow-hidden">
                    <img src={property.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{property.title}</p>
                    <p className="text-xs text-primary font-semibold">{formatCurrency(property.price)}</p>
                    <p className="text-[10px] text-muted-foreground">{property.address}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Seu Nome *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" maxLength={100} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Telefone *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" maxLength={100} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Valor da Proposta (R$) *</Label>
                  <Input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={String(property.price)} />
                  <p className="text-[11px] text-muted-foreground">Valor anunciado: {formatCurrency(property.price)}</p>
                </div>
                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="avista">À Vista</option>
                    <option value="financiamento">Financiamento</option>
                    <option value="fgts">FGTS + Financiamento</option>
                    <option value="parcelado">Parcelado Direto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Condições / Observações</Label>
                  <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Detalhes da sua proposta, condições especiais..." rows={3} maxLength={1000} />
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 pb-6 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!name.trim() || !phone.trim() || !value}>
                Enviar Proposta
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MatchPage;
