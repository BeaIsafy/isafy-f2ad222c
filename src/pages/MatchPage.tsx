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
  Phone, DollarSign, Heart, Eye, Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logoIsafy from "@/assets/logo-isafy.png";
import { useLeadMatchProperties } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const MatchPage = () => {
  const { leadId } = useParams();
  const { data: properties = [], isLoading } = useLeadMatchProperties(leadId);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [visitProperty, setVisitProperty] = useState<any>(null);
  const [proposalProperty, setProposalProperty] = useState<any>(null);
  const [discarded, setDiscarded] = useState<string[]>([]);

  const visibleProperties = properties.filter((p: any) => !discarded.includes(p.id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
            {visibleProperties.length > 0 ? `${visibleProperties.length} imóveis compatíveis com seu perfil` : "Nenhum imóvel disponível no momento"}
          </p>
        </div>

        {visibleProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum imóvel disponível no momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((p: any) => {
              const price = Number(p.sale_price) || Number(p.rent_price) || Number(p.season_price) || 0;
              return (
                <Card key={p.id} className="overflow-hidden border-border/50 hover:shadow-card-hover transition-shadow">
                  <div className="relative h-40 bg-muted cursor-pointer" onClick={() => setSelectedProperty(p)}>
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground/20"><MapPin size={48} /></div>
                    )}
                  </div>
                  <CardContent className="pt-4 space-y-3">
                    <div className="cursor-pointer" onClick={() => setSelectedProperty(p)}>
                      <p className="font-semibold text-foreground">{p.title}</p>
                      <p className="text-lg font-bold text-primary">{price > 0 ? formatCurrency(price) : "Consulte"}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={12} /> {p.address}, {p.neighborhood} - {p.city}
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {p.total_area > 0 && <span className="flex items-center gap-1"><Maximize size={12} />{p.total_area}m²</span>}
                      {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble size={12} />{p.bedrooms}q</span>}
                      {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms}b</span>}
                      {p.parking_spaces > 0 && <span className="flex items-center gap-1"><Car size={12} />{p.parking_spaces}v</span>}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => setVisitProperty(p)}>
                        <Calendar size={12} /> Agendar Visita
                      </Button>
                      <Button size="sm" className="flex-1 text-xs gap-1 gradient-primary text-primary-foreground" onClick={() => setProposalProperty(p)}>
                        <FileText size={12} /> Proposta
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => { setDiscarded(prev => [...prev, p.id]); toast("Imóvel removido da lista"); }}>
                      <X size={12} className="mr-1" /> Não tenho interesse
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <PropertyDetailDialog property={selectedProperty} onClose={() => setSelectedProperty(null)} onVisit={(p: any) => { setSelectedProperty(null); setVisitProperty(p); }} onProposal={(p: any) => { setSelectedProperty(null); setProposalProperty(p); }} />
      <VisitRequestDialog property={visitProperty} onClose={() => setVisitProperty(null)} leadId={leadId} />
      <ClientProposalDialog property={proposalProperty} onClose={() => setProposalProperty(null)} leadId={leadId} />
    </div>
  );
};

function PropertyDetailDialog({ property, onClose, onVisit, onProposal }: any) {
  if (!property) return null;
  const price = Number(property.sale_price) || Number(property.rent_price) || 0;
  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <div className="relative h-48 bg-muted shrink-0">
          {property.cover_image ? <img src={property.cover_image} alt={property.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-muted-foreground/20"><MapPin size={48} /></div>}
        </div>
        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{property.title}</h2>
              <p className="text-2xl font-bold text-primary mt-1">{price > 0 ? formatCurrency(price) : "Consulte"}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} /> {property.address}, {property.neighborhood}</div>
            <div className="flex gap-4 text-sm">
              {property.total_area > 0 && <span className="flex items-center gap-1.5"><Maximize size={14} className="text-muted-foreground" /> {property.total_area}m²</span>}
              {property.bedrooms > 0 && <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-muted-foreground" /> {property.bedrooms} quartos</span>}
              {property.bathrooms > 0 && <span className="flex items-center gap-1.5"><Bath size={14} className="text-muted-foreground" /> {property.bathrooms} banheiros</span>}
            </div>
            {property.description && <p className="text-sm text-foreground leading-relaxed">{property.description}</p>}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
              {property.condo_fee && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Condomínio</span><span className="font-medium">{formatCurrency(Number(property.condo_fee))}/mês</span></div>}
              {property.iptu && <div className="flex justify-between text-sm"><span className="text-muted-foreground">IPTU</span><span className="font-medium">{formatCurrency(Number(property.iptu))}/mês</span></div>}
            </div>
          </div>
        </ScrollArea>
        <div className="px-6 pb-6 pt-2 flex gap-2">
          <Button variant="outline" className="flex-1 gap-1.5" onClick={() => onVisit(property)}><Calendar size={14} /> Agendar Visita</Button>
          <Button className="flex-1 gap-1.5 gradient-primary text-primary-foreground" onClick={() => onProposal(property)}><FileText size={14} /> Fazer Proposta</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VisitRequestDialog({ property, onClose, leadId }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => { setName(""); setPhone(""); setPreferredDate(""); setPreferredTime(""); setNotes(""); setSent(false); };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !preferredDate || !property) return;
    // Create visit in Supabase
    const { data: lead } = await supabase.from("pipeline_leads").select("company_id").eq("id", leadId).single();
    if (lead) {
      await supabase.from("visits").insert({
        company_id: lead.company_id,
        property_id: property.id,
        pipeline_lead_id: leadId,
        client_name: name,
        client_phone: phone,
        date: preferredDate,
        time: preferredTime,
        status: "Agendada" as any,
      });
    }
    setSent(true);
    toast.success("Solicitação de visita enviada ao corretor!");
  };

  const handleClose = () => { reset(); onClose(); };

  if (!property) return null;
  const price = Number(property.sale_price) || Number(property.rent_price) || 0;

  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> Solicitar Visita</DialogTitle>
          <DialogDescription>Agende uma visita para <span className="font-semibold text-foreground">{property.title}</span></DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="px-6 py-12 text-center space-y-3">
            <Calendar size={48} className="text-success mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Visita Solicitada!</h3>
            <p className="text-sm text-muted-foreground">O corretor entrará em contato para confirmar.</p>
            <Button className="mt-4" onClick={handleClose}>Voltar aos Imóveis</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Seu Nome *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" /></div>
                <div className="space-y-2"><Label>Telefone / WhatsApp *</Label><Input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Data preferencial *</Label><Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Horário</Label><Input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>Observações</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alguma preferência?" rows={2} /></div>
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 pb-6 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!name.trim() || !phone.trim() || !preferredDate}>Solicitar Visita</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClientProposalDialog({ property, onClose, leadId }: any) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [value, setValue] = useState("");
  const [paymentType, setPaymentType] = useState("financiamento");
  const [conditions, setConditions] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => { setName(""); setPhone(""); setValue(""); setPaymentType("financiamento"); setConditions(""); setSent(false); };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !value || !property) return;
    const { data: lead } = await supabase.from("pipeline_leads").select("company_id").eq("id", leadId).single();
    if (lead) {
      await supabase.from("proposals").insert({
        company_id: lead.company_id,
        property_id: property.id,
        pipeline_lead_id: leadId,
        client_name: name,
        client_phone: phone,
        value: Number(value),
        payment_type: paymentType,
        notes: conditions,
      });
    }
    setSent(true);
    toast.success("Proposta enviada ao corretor!");
  };

  const handleClose = () => { reset(); onClose(); };

  if (!property) return null;

  return (
    <Dialog open={!!property} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2"><FileText size={18} className="text-primary" /> Fazer Proposta</DialogTitle>
          <DialogDescription>Envie sua proposta para <span className="font-semibold text-foreground">{property.title}</span></DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="px-6 py-12 text-center space-y-3">
            <FileText size={48} className="text-success mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Proposta Enviada!</h3>
            <p className="text-sm text-muted-foreground">O corretor analisará sua proposta e retornará em breve.</p>
            <Button className="mt-4" onClick={handleClose}>Voltar aos Imóveis</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 overflow-y-auto">
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Seu Nome *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" /></div>
                <div className="space-y-2"><Label>Telefone *</Label><Input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" /></div>
                <div className="space-y-2"><Label>Valor da Proposta (R$) *</Label><Input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="500000" /></div>
                <div className="space-y-2"><Label>Condições</Label><Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Condições de pagamento, observações..." rows={3} /></div>
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 pb-6 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancelar</Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!name.trim() || !phone.trim() || !value}>Enviar Proposta</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MatchPage;
