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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { plans } from "@/data/plansData";
import logoIsafy from "@/assets/logo-isafy.png";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason") || "trial"; // "trial" | "overdue"
  const [selectedPlan, setSelectedPlan] = useState("performance");
  const [showCheckout, setShowCheckout] = useState(false);

  const chosen = plans.find((p) => p.id === selectedPlan)!;

  const isOverdue = reason === "overdue";

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
            {isOverdue ? (
              <AlertTriangle size={12} />
            ) : (
              <Clock size={12} />
            )}
            {isOverdue
              ? "Pagamento em atraso"
              : "Período de teste encerrado"}
          </Badge>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {isOverdue ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle size={28} className="text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Sua assinatura está vencida
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Seu plano está com pagamento em atraso há mais de 3 dias.
                  Escolha um plano abaixo para reativar seu acesso
                  imediatamente.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Seu período de teste acabou
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Esperamos que tenha aproveitado os 3 dias de teste grátis!
                  Escolha o plano ideal para continuar usando o ISAFY.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Plans */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          {!showCheckout ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-3">
                {plans.map((plan) => {
                  const active = selectedPlan === plan.id;
                  return (
                    <Card
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                        active
                          ? "ring-2 ring-primary shadow-primary " +
                            plan.color
                          : "border-border/50 hover:border-primary/30"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 right-4 rounded-full gradient-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
                          POPULAR
                        </span>
                      )}
                      <CardContent className="pt-6 space-y-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              active ? "gradient-primary" : "bg-muted"
                            }`}
                          >
                            <plan.icon
                              size={22}
                              className={
                                active
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-lg">
                              {plan.name}
                            </p>
                            <p className="text-2xl font-extrabold text-gradient">
                              R$ {plan.price}
                              <span className="text-xs font-normal text-muted-foreground">
                                {plan.period}
                              </span>
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <ul className="space-y-2.5">
                          {plan.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check
                                size={14}
                                className={`mt-0.5 shrink-0 ${
                                  active
                                    ? "text-primary"
                                    : "text-muted-foreground/50"
                                }`}
                              />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2">
                          <Badge
                            variant="outline"
                            className="w-full justify-center py-1.5 text-xs border-border"
                          >
                            <Clock size={12} className="mr-1" /> 3 dias
                            grátis para testar
                          </Badge>
                        </div>

                        <Button
                          className={`w-full ${
                            active
                              ? "gradient-primary text-primary-foreground shadow-primary"
                              : ""
                          }`}
                          variant={active ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(plan.id);
                            setShowCheckout(true);
                          }}
                        >
                          Escolher {plan.name}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p className="text-center text-xs text-muted-foreground">
                Todos os planos incluem 3 dias de teste grátis. Cancele a
                qualquer momento.
              </p>
            </motion.div>
          ) : (
            /* Checkout */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mx-auto max-w-lg space-y-6"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCheckout(false)}
                className="text-muted-foreground"
              >
                ← Voltar aos planos
              </Button>

              <Card className="shadow-card border-border/50 overflow-hidden">
                <div className="gradient-primary p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <chosen.icon
                      size={22}
                      className="text-primary-foreground"
                    />
                    <div>
                      <p className="font-bold text-primary-foreground">
                        Plano {chosen.name}
                      </p>
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
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-primary" />
                      Dados do Cartão
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground">
                          Nome no cartão
                        </label>
                        <Input
                          className="mt-1"
                          placeholder="Como aparece no cartão"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground">
                          Número do cartão
                        </label>
                        <Input
                          className="mt-1"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-foreground">
                            Validade
                          </label>
                          <Input className="mt-1" placeholder="MM/AA" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-foreground">
                            CVV
                          </label>
                          <Input className="mt-1" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Plano {chosen.name}
                      </span>
                      <span className="text-foreground font-medium">
                        R$ {chosen.price}/mês
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Teste grátis
                      </span>
                      <span className="text-[hsl(var(--success))] font-medium">
                        3 dias
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-foreground">Hoje</span>
                      <span className="text-foreground">R$ 0,00</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      A cobrança de R$ {chosen.price} será realizada após o
                      período de teste.
                    </p>
                  </div>

                  <Button
                    className="w-full gradient-primary text-primary-foreground shadow-primary gap-2"
                    onClick={() => {
                      toast({
                        title: "Assinatura ativada!",
                        description: `Plano ${chosen.name} ativado com sucesso.`,
                      });
                      navigate("/dashboard");
                    }}
                  >
                    <Shield size={16} /> Assinar Plano {chosen.name}
                    <ArrowRight size={16} />
                  </Button>

                  <p className="text-center text-[10px] text-muted-foreground">
                    Pagamento seguro · Cancele a qualquer momento
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
