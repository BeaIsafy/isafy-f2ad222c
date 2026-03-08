import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageCircle, Building2, DollarSign, Calendar, User, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoIsafy from "@/assets/logo-isafy.png";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const mockProposal = {
  id: "PR-001",
  property: "Apt 2q Moema",
  address: "Rua dos Lírios, 240 - Moema, São Paulo",
  area: 68,
  bedrooms: 2,
  bathrooms: 2,
  value: 510000,
  paymentType: "Financiamento",
  downPayment: 100000,
  buyerName: "Carlos Mendes",
  brokerName: "Ana Costa",
  brokerPhone: "(11) 99999-0000",
  date: "20/02/2026",
  validity: "7 dias",
  conditions: "Proposta condicionada à aprovação de crédito.",
  companyName: "Imobiliária ISAFY",
};

const ProposalView = () => {
  const { token } = useParams();
  const [action, setAction] = useState<"none" | "counter">("none");
  const [counterValue, setCounterValue] = useState("");
  const [counterNotes, setCounterNotes] = useState("");
  const [responded, setResponded] = useState(false);
  const [responseType, setResponseType] = useState<string>("");

  const handleAccept = () => {
    setResponded(true);
    setResponseType("accepted");
    toast.success("Proposta aceita! O corretor será notificado.");
  };

  const handleReject = () => {
    setResponded(true);
    setResponseType("rejected");
    toast("Proposta recusada. O corretor será notificado.");
  };

  const handleCounter = () => {
    if (!counterValue) return;
    setResponded(true);
    setResponseType("counter");
    toast.success("Contraproposta enviada! O corretor será notificado.");
  };

  const p = mockProposal;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center gap-3">
          <img src={logoIsafy} alt="Logo" className="h-8" />
          <div>
            <p className="text-sm font-semibold text-foreground">{p.companyName}</p>
            <p className="text-xs text-muted-foreground">Proposta {p.id}</p>
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
            <h1 className="text-2xl font-bold text-foreground">Proposta de Compra</h1>

            {/* Property */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2"><Building2 size={16} className="text-primary" /> Imóvel</h2>
                <p className="text-sm font-medium">{p.property}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} />{p.address}</div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{p.area}m²</span><span>{p.bedrooms} quartos</span><span>{p.bathrooms} banheiros</span>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h2 className="font-semibold text-foreground flex items-center gap-2"><DollarSign size={16} className="text-primary" /> Valores</h2>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Valor proposto</span><span className="text-lg font-bold text-primary">{formatCurrency(p.value)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pagamento</span><span>{p.paymentType}</span></div>
                {p.downPayment > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Entrada</span><span>{formatCurrency(p.downPayment)}</span></div>}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Comprador</span><span>{p.buyerName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Corretor</span><span>{p.brokerName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Validade</span><span>{p.validity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Data</span><span>{p.date}</span></div>
                {p.conditions && <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">{p.conditions}</div>}
              </CardContent>
            </Card>

            {/* Actions */}
            {action === "none" ? (
              <div className="flex flex-col gap-3">
                <Button size="lg" className="gap-2 gradient-primary text-primary-foreground w-full" onClick={handleAccept}>
                  <CheckCircle size={18} /> Aceitar Proposta
                </Button>
                <Button size="lg" variant="outline" className="gap-2 w-full" onClick={() => setAction("counter")}>
                  <MessageCircle size={18} /> Fazer Contraproposta
                </Button>
                <Button size="lg" variant="outline" className="gap-2 w-full text-destructive hover:text-destructive" onClick={handleReject}>
                  <XCircle size={18} /> Recusar Proposta
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h2 className="font-semibold text-foreground">Contraproposta</h2>
                  <div className="space-y-2">
                    <Label>Valor desejado (R$) *</Label>
                    <Input type="number" value={counterValue} onChange={(e) => setCounterValue(e.target.value)} placeholder="550000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea value={counterNotes} onChange={(e) => setCounterNotes(e.target.value)} placeholder="Condições da contraproposta..." rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setAction("none")}>Voltar</Button>
                    <Button className="gradient-primary text-primary-foreground flex-1" onClick={handleCounter} disabled={!counterValue}>Enviar Contraproposta</Button>
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
