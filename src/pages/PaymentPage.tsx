import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Check,
  CreditCard,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  QrCode,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { plans } from "@/data/plansData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logoIsafy from "@/assets/logo-isafy.png";

type PaymentResult = {
  paymentMethod: "CREDIT_CARD" | "PIX";
  invoiceUrl?: string | null;
  pixQrCodeUrl?: string | null;
  creditCardStatus?: string | null;
  isPaid?: boolean;
} | null;

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "trial";
  const { user, company, profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(company?.plan_id || "performance");
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CREDIT_CARD" | "PIX">("CREDIT_CARD");
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult>(null);

  // Form fields
  const [cpfCnpj, setCpfCnpj] = useState(company?.cnpj || "");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const chosen = plans.find((p) => p.id === selectedPlan)!;
  const isOverdue = reason === "overdue";

  const handleSubscribe = async () => {
    if (!user || !company) {
      toast({ title: "Erro", description: "Sessão inválida. Faça login novamente.", variant: "destructive" });
      return;
    }

    if (!cpfCnpj.trim()) {
      toast({ title: "Atenção", description: "Informe o CPF ou CNPJ.", variant: "destructive" });
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast({ title: "Atenção", description: "Preencha todos os dados do cartão.", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    setPaymentResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("create-asaas-subscription", {
        body: {
          planId: selectedPlan,
          paymentMethod,
          companyName: company.name,
          email: profile?.email || user.email,
          cpfCnpj: cpfCnpj.replace(/\D/g, ""),
          phone: company.phone || profile?.phone || "",
          // Credit card fields
          cardName,
          cardNumber: cardNumber.replace(/\s/g, ""),
          cardExpiry,
          cardCvv,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Erro ao criar assinatura");

      if (paymentMethod === "PIX") {
        // Show PIX result with invoice link
        setPaymentResult({
          paymentMethod: "PIX",
          invoiceUrl: data.invoiceUrl,
          pixQrCodeUrl: data.pixQrCodeUrl,
        });

        if (data.invoiceUrl) {
          window.open(data.invoiceUrl, "_blank");
        }

        toast({
          title: "Assinatura criada!",
          description: "Abra a fatura para efetuar o pagamento via PIX.",
        });
      } else {
        // Credit card
        setPaymentResult({
          paymentMethod: "CREDIT_CARD",
          creditCardStatus: data.creditCardStatus,
          isPaid: data.isPaid,
        });

        if (data.isPaid) {
          toast({
            title: "Pagamento confirmado!",
            description: `Plano ${chosen.name} ativado com sucesso.`,
          });
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast({
            title: "Pagamento em processamento",
            description: "Seu pagamento está sendo processado. Você será notificado quando for confirmado.",
          });
        }
      }
    } catch (err: any) {
      console.error("Subscription error:", err);
      toast({
        title: "Erro ao processar pagamento",
        description: err.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <img src={logoIsafy} alt="ISAFY" className="h-8" />
          <Badge
            variant="outline"
            className={
              isOverdue
                ? "border-destructive text-destructive gap-1"
                : "border-[hsl(var(--warning))] text-[hsl(var(--warning))] gap-1"
            }
          >
            {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
            {isOverdue ? "Pagamento em atraso" : "Período de teste encerrado"}
          </Badge>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {isOverdue ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle size={28} className="text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Sua assinatura está vencida</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Seu plano está com pagamento em atraso há mais de 3 dias. Escolha um plano abaixo para reativar seu acesso imediatamente.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Seu período de teste acabou</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Esperamos que tenha aproveitado os 3 dias de teste grátis! Escolha o plano ideal para continuar usando o ISAFY.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Plans / Checkout */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {paymentResult ? (
            <PaymentResultView
              result={paymentResult}
              chosenName={chosen.name}
              onGoToDashboard={() => navigate("/dashboard")}
            />
          ) : !showCheckout ? (
            <PlanSelector
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onCheckout={(planId) => {
                setSelectedPlan(planId);
                setShowCheckout(true);
              }}
            />
          ) : (
            <CheckoutForm
              chosen={chosen}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              cpfCnpj={cpfCnpj}
              setCpfCnpj={setCpfCnpj}
              cardName={cardName}
              setCardName={setCardName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvv={cardCvv}
              setCardCvv={setCardCvv}
              loading={loading}
              onBack={() => setShowCheckout(false)}
              onSubmit={handleSubscribe}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* ───── Payment Result View ───── */
function PaymentResultView({
  result,
  chosenName,
  onGoToDashboard,
}: {
  result: NonNullable<PaymentResult>;
  chosenName: string;
  onGoToDashboard: () => void;
}) {
  if (result.paymentMethod === "PIX") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg space-y-6">
        <Card className="shadow-card border-border/50 overflow-hidden">
          <CardContent className="pt-8 pb-8 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <QrCode size={32} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">Assinatura criada com sucesso!</h2>
              <p className="text-muted-foreground text-sm">
                Sua assinatura do plano <strong>{chosenName}</strong> foi criada. Efetue o pagamento via PIX para ativar seu acesso.
              </p>
            </div>

            {result.invoiceUrl && (
              <Button
                className="w-full gradient-primary text-primary-foreground shadow-primary gap-2"
                onClick={() => window.open(result.invoiceUrl!, "_blank")}
              >
                <ExternalLink size={16} /> Abrir Fatura para Pagamento
              </Button>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>Após o pagamento, seu acesso será liberado automaticamente.</span>
              </div>
              <p className="text-xs text-muted-foreground">
                O webhook do Asaas confirmará o pagamento e ativará sua conta.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Credit Card result
  const isPaid = result.isPaid;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg space-y-6">
      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardContent className="pt-8 pb-8 space-y-6 text-center">
          {isPaid ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Pagamento confirmado!</h2>
                <p className="text-muted-foreground text-sm">
                  Seu plano <strong>{chosenName}</strong> foi ativado com sucesso. Você será redirecionado para o dashboard.
                </p>
              </div>
              <Button
                className="w-full gradient-primary text-primary-foreground shadow-primary gap-2"
                onClick={onGoToDashboard}
              >
                <ArrowRight size={16} /> Ir para o Dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                <Loader2 size={32} className="text-amber-500 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Pagamento em processamento</h2>
                <p className="text-muted-foreground text-sm">
                  Seu pagamento do plano <strong>{chosenName}</strong> está sendo processado. Você será notificado quando for confirmado.
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: <Badge variant="outline" className="text-amber-500 border-amber-500/50">{result.creditCardStatus || "Processando"}</Badge>
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ───── Plan Selector ───── */
function PlanSelector({
  selectedPlan,
  onSelectPlan,
  onCheckout,
}: {
  selectedPlan: string;
  onSelectPlan: (id: string) => void;
  onCheckout: (id: string) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const active = selectedPlan === plan.id;
          return (
            <Card
              key={plan.id}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                active ? "ring-2 ring-primary shadow-primary " + plan.color : "border-border/50 hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-4 rounded-full gradient-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
                  POPULAR
                </span>
              )}
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "gradient-primary" : "bg-muted"}`}>
                    <plan.icon size={22} className={active ? "text-primary-foreground" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-lg">{plan.name}</p>
                    <p className="text-2xl font-extrabold text-gradient">
                      R$ {plan.price}
                      <span className="text-xs font-normal text-muted-foreground">{plan.period}</span>
                    </p>
                  </div>
                </div>
                <Separator />
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className={`mt-0.5 shrink-0 ${active ? "text-primary" : "text-muted-foreground/50"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${active ? "gradient-primary text-primary-foreground shadow-primary" : ""}`}
                  variant={active ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckout(plan.id);
                  }}
                >
                  Escolher {plan.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground">Todos os planos incluem 3 dias de teste grátis. Cancele a qualquer momento.</p>
    </motion.div>
  );
}

/* ───── Checkout Form ───── */
function CheckoutForm({
  chosen,
  paymentMethod,
  setPaymentMethod,
  cpfCnpj,
  setCpfCnpj,
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  loading,
  onBack,
  onSubmit,
}: {
  chosen: (typeof plans)[number];
  paymentMethod: "CREDIT_CARD" | "PIX";
  setPaymentMethod: (m: "CREDIT_CARD" | "PIX") => void;
  cpfCnpj: string;
  setCpfCnpj: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mx-auto max-w-lg space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
        ← Voltar aos planos
      </Button>

      <Card className="shadow-card border-border/50 overflow-hidden">
        <div className="gradient-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <chosen.icon size={22} className="text-primary-foreground" />
            <div>
              <p className="font-bold text-primary-foreground">Plano {chosen.name}</p>
              <p className="text-xs text-primary-foreground/80">
                {chosen.members} usuário(s) · {chosen.storage}
              </p>
            </div>
          </div>
          <p className="text-xl font-bold text-primary-foreground">
            R$ {chosen.price}
            <span className="text-xs font-normal">/mês</span>
          </p>
        </div>

        <CardContent className="space-y-5 pt-6">
          {/* Payment method toggle */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Forma de pagamento</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <CreditCard size={16} /> Cartão de Crédito
              </button>
              <button
                onClick={() => setPaymentMethod("PIX")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                  paymentMethod === "PIX"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <QrCode size={16} /> PIX
              </button>
            </div>
          </div>

          <Separator />

          {/* CPF/CNPJ always required */}
          <div>
            <label className="text-xs font-medium text-foreground">CPF ou CNPJ</label>
            <Input className="mt-1" inputMode="numeric" placeholder="000.000.000-00" value={cpfCnpj} onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))} />
          </div>

          {/* Card fields only for credit card */}
          {paymentMethod === "CREDIT_CARD" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CreditCard size={16} className="text-primary" />
                Dados do Cartão
              </h3>
              <div>
                <label className="text-xs font-medium text-foreground">Nome no cartão</label>
                <Input className="mt-1" placeholder="Como aparece no cartão" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Número do cartão</label>
                <Input className="mt-1" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground">Validade</label>
                  <Input className="mt-1" placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">CVV</label>
                  <Input className="mt-1" placeholder="123" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "PIX" && (
            <div className="rounded-lg bg-muted/50 p-4 text-center space-y-2">
              <QrCode size={32} className="mx-auto text-primary" />
              <p className="text-sm text-foreground font-medium">Pagamento via PIX</p>
              <p className="text-xs text-muted-foreground">
                Após confirmar, a fatura será aberta para pagamento via PIX.
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plano {chosen.name}</span>
              <span className="text-foreground font-medium">R$ {chosen.price}/mês</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">R$ {chosen.price}/mês</span>
            </div>
          </div>

          <Button
            className="w-full gradient-primary text-primary-foreground shadow-primary gap-2"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processando...
              </>
            ) : (
              <>
                <Shield size={16} /> Assinar Plano {chosen.name}
                <ArrowRight size={16} />
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">Pagamento seguro · Cancele a qualquer momento</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PaymentPage;
