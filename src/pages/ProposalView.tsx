import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageCircle, Building2, DollarSign, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logoIsafy from "@/assets/logo-isafy.png";
import { supabase } from "@/integrations/supabase/client";
import { useProposalByToken } from "@/hooks/useSupabaseData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const ProposalView = () => {
  const { token } = useParams();
  const { data: proposalData, isLoading } = useProposalByToken(token);
  const [action, setAction] = useState<"none" | "counter">("none");
  const [counterValue, setCounterValue] = useState("");
  const [counterNotes, setCounterNotes] = useState("");
  const [responded, setResponded] = useState(false);
  const [responseType, setResponseType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!proposalData) return;
    setSubmitting(true);
    await supabase.from("proposals").update({ status: "Aprovada" as any }).eq("id", proposalData.id);
    setResponded(true);
    setResponseType("accepted");
    setSubmitting(false);
    toast.success("Proposta aceita! O corretor será notificado.");
  };

  const handleReject = async () => {
    if (!proposalData) return;
    setSubmitting(true);
    await supabase.from("proposals").update({ status: "Recusada" as any }).eq("id", proposalData.id);
    setResponded(true);
    setResponseType("rejected");
    setSubmitting(false);
    toast("Proposta recusada. O corretor será notificado.");
  };

  const handleCounter = async () => {
    if (!counterValue || !proposalData) return;
    setSubmitting(true);
    await supabase.from("proposals").update({
      status: "Contraproposta" as any,
      counter_value: Number(counterValue),
      counter_notes: counterNotes,
    }).eq("id", proposalData.id);
    setResponded(true);
    setResponseType("counter");
    setSubmitting(false);
    toast.success("Contraproposta enviada! O corretor será notificado.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Proposta não encontrada ou link inválido.</p></CardContent></Card>
      </div>
    );
  }

  const p = proposalData;
  const property = p.property as any;
  const contact = p.contact as any;
  const company = (p as any).company;
  const companyName = company?.name || "Imobiliária";
  const logoUrl = company?.logo_url;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <img src={logoUrl || logoIsafy} alt="Logo" className="h-8 object-contain" />
          <div>
            <p className="text-sm font-semibold text-foreground">{companyName}</p>
            <p className="text-xs text-muted-foreground">Proposta</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {responded ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              {responseType === "accepted" && (
                <>
                  <CheckCircle size={48} className="text-success mx-auto" />
                  <h2 className="text-xl font-bold text-foreground">Proposta Aceita!</h2>
                  <p className="text-sm text-muted-foreground">O corretor entrará em contato para os próximos passos.</p>
                </>
              )}
              {responseType === "rejected" && (
                <>
                  <XCircle size={48} className="text-destructive mx-auto" />
                  <h2 className="text-xl font-bold text-foreground">Proposta Recusada</h2>
                  <p className="text-sm text-muted-foreground">O corretor foi notificado da sua decisão.</p>
                </>
              )}
              {responseType === "counter" && (
                <>
                  <MessageCircle size={48} className="text-info mx-auto" />
                  <h2 className="text-xl font-bold text-foreground">Contraproposta Enviada!</h2>
                  <p className="text-sm text-muted-foreground">Valor: {formatCurrency(Number(counterValue))}. O corretor analisará sua contraproposta.</p>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground">Proposta de {p.payment_type === "Locação" ? "Locação" : "Compra"}</h1>

            {property && (
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-semibold text-foreground flex items-center gap-2"><Building2 size={16} className="text-primary" /> Imóvel</h2>
                  <p className="text-sm font-medium">{property.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} />{property.address}, {property.neighborhood} - {property.city}</div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {property.total_area && <span>{property.total_area}m²</span>}
                    {property.bedrooms > 0 && <span>{property.bedrooms} quartos</span>}
                    {property.bathrooms > 0 && <span>{property.bathrooms} banheiros</span>}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2"><DollarSign size={16} className="text-primary" /> Valores</h2>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Valor proposto</span><span className="text-lg font-bold text-primary">{formatCurrency(p.value)}</span></div>
                {p.payment_type && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pagamento</span><span>{p.payment_type}</span></div>}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                {(p.client_name || contact?.name) && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Comprador</span><span>{p.client_name || contact?.name}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Data</span><span>{new Date(p.created_at || "").toLocaleDateString("pt-BR")}</span></div>
                {p.notes && <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">{p.notes}</div>}
              </CardContent>
            </Card>

            {action === "none" ? (
              <div className="flex flex-col gap-3">
                <Button size="lg" className="gap-2 gradient-primary text-primary-foreground w-full" onClick={handleAccept} disabled={submitting}>
                  <CheckCircle size={18} /> Aceitar Proposta
                </Button>
                <Button size="lg" variant="outline" className="gap-2 w-full" onClick={() => setAction("counter")}>
                  <MessageCircle size={18} /> Fazer Contraproposta
                </Button>
                <Button size="lg" variant="outline" className="gap-2 w-full text-destructive hover:text-destructive" onClick={handleReject} disabled={submitting}>
                  <XCircle size={18} /> Recusar Proposta
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h2 className="font-semibold text-foreground">Contraproposta</h2>
                  <div className="space-y-2">
                    <Label>Valor desejado (R$) *</Label>
                    <Input inputMode="numeric" value={counterValue} onChange={(e) => setCounterValue(e.target.value)} placeholder="550000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea value={counterNotes} onChange={(e) => setCounterNotes(e.target.value)} placeholder="Condições da contraproposta..." rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setAction("none")}>Voltar</Button>
                    <Button className="gradient-primary text-primary-foreground flex-1" onClick={handleCounter} disabled={!counterValue || submitting}>Enviar Contraproposta</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalView;
