import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Building2,
  Palette,
  CreditCard,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Mail,
  Check,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { plans } from "@/data/plansData";
import logoIsafy from "@/assets/logo-isafy.png";

// ── Step definitions ──────────────────────────────────────
const steps = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "identidade", label: "Identidade", icon: Palette },
  { id: "plano", label: "Plano", icon: CreditCard },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "concluir", label: "Concluir", icon: CheckCircle2 },
];

// ── Step: Empresa ─────────────────────────────────────────
const StepEmpresa = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-bold text-foreground">Dados da Empresa</h2>
      <p className="text-sm text-muted-foreground mt-1">Informações básicas da sua imobiliária</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-foreground">Nome Fantasia *</label>
        <Input className="mt-1" placeholder="Sua Imobiliária" value={data.name || ""} onChange={(e) => onChange({ ...data, name: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">CNPJ</label>
        <Input className="mt-1" placeholder="00.000.000/0001-00" value={data.cnpj || ""} onChange={(e) => onChange({ ...data, cnpj: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">CRECI</label>
        <Input className="mt-1" placeholder="000000-J" value={data.creci || ""} onChange={(e) => onChange({ ...data, creci: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Telefone</label>
        <Input className="mt-1" placeholder="(11) 99999-0000" value={data.phone || ""} onChange={(e) => onChange({ ...data, phone: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">E-mail comercial</label>
        <Input className="mt-1" placeholder="contato@imobiliaria.com" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} />
      </div>
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-foreground">Endereço</label>
        <Input className="mt-1" placeholder="Rua, número, bairro - Cidade/UF" value={data.address || ""} onChange={(e) => onChange({ ...data, address: e.target.value })} />
      </div>
    </div>
  </div>
);

// ── Step: Identidade (com upload de logo) ─────────────────
const StepIdentidade = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("company-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("company-assets")
        .getPublicUrl(filePath);

      onChange({ ...data, logo: urlData.publicUrl, logoPath: filePath });
      toast.success("Logo enviado com sucesso!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar logo");
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (data.logoPath) {
      await supabase.storage.from("company-assets").remove([data.logoPath]);
    }
    onChange({ ...data, logo: null, logoPath: null });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Identidade Visual</h2>
        <p className="text-sm text-muted-foreground mt-1">Personalize a aparência do seu site e sistema</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-foreground">Logo da Empresa</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 overflow-hidden">
              {data.logo ? (
                <>
                  <img src={data.logo} alt="Logo" className="h-full w-full rounded-xl object-cover" />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <Upload size={24} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} /> {uploading ? "Enviando..." : "Enviar Logo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG ou WebP. Máx 2MB</p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Cor Primária</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={data.primaryColor || "#7c3aed"}
              onChange={(e) => onChange({ ...data, primaryColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-lg border border-border"
            />
            <Input className="flex-1" value={data.primaryColor || "#7c3aed"} onChange={(e) => onChange({ ...data, primaryColor: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Cor Secundária</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={data.secondaryColor || "#ec4899"}
              onChange={(e) => onChange({ ...data, secondaryColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-lg border border-border"
            />
            <Input className="flex-1" value={data.secondaryColor || "#ec4899"} onChange={(e) => onChange({ ...data, secondaryColor: e.target.value })} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-foreground">Domínio do Site</label>
          <Input className="mt-1" placeholder="www.suaimobiliaria.com.br" value={data.domain || ""} onChange={(e) => onChange({ ...data, domain: e.target.value })} />
        </div>
      </div>
    </div>
  );
};

// ── Step: Plano ───────────────────────────────────────────
const StepPlano = ({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) => (
  <div className="space-y-5">
    <div>
      <h2 className="text-xl font-bold text-foreground">Escolha seu Plano</h2>
      <p className="text-sm text-muted-foreground mt-1">Selecione o plano ideal para sua operação. Todos incluem 3 dias de teste grátis.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          className={`relative cursor-pointer p-5 transition-all duration-200 hover:shadow-card-hover ${
            selected === plan.id ? "ring-2 ring-primary shadow-primary " + plan.color : "border-border/50 hover:border-primary/30"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-2.5 right-4 rounded-full gradient-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
              POPULAR
            </span>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected === plan.id ? "gradient-primary" : "bg-muted"}`}>
              <plan.icon size={20} className={selected === plan.id ? "text-primary-foreground" : "text-muted-foreground"} />
            </div>
            <div>
              <p className="font-bold text-foreground">{plan.name}</p>
              <p className="text-lg font-extrabold text-gradient">R$ {plan.price}<span className="text-xs font-normal text-muted-foreground">{plan.period}</span></p>
            </div>
          </div>
          <Separator className="mb-3" />
          <ul className="space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check size={14} className={`mt-0.5 shrink-0 ${selected === plan.id ? "text-primary" : "text-muted-foreground/50"}`} />
                {f}
              </li>
            ))}
          </ul>
          <Badge variant="outline" className="w-full justify-center py-1.5 text-xs border-border mt-4">
            <Clock size={12} className="mr-1" /> 3 dias grátis para testar
          </Badge>
        </Card>
      ))}
    </div>
  </div>
);

// ── Step: Equipe ──────────────────────────────────────────
const StepEquipe = ({ members, onChange }: { members: { email: string; role: string }[]; onChange: (m: any[]) => void }) => {
  const addMember = () => onChange([...members, { email: "", role: "corretor" }]);
  const removeMember = (i: number) => onChange(members.filter((_, idx) => idx !== i));
  const updateMember = (i: number, field: string, value: string) => {
    const next = [...members];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Convide sua Equipe</h2>
        <p className="text-sm text-muted-foreground mt-1">Adicione corretores e gestores ao sistema</p>
      </div>
      <div className="space-y-3">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail size={16} className="text-primary" />
            </div>
            <Input
              className="flex-1"
              placeholder="email@exemplo.com"
              value={m.email}
              onChange={(e) => updateMember(i, "email", e.target.value)}
            />
            <select
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              value={m.role}
              onChange={(e) => updateMember(i, "role", e.target.value)}
            >
              <option value="corretor">Corretor</option>
              <option value="gestor">Gestor</option>
            </select>
            <Button variant="ghost" size="icon" onClick={() => removeMember(i)} className="text-muted-foreground hover:text-destructive">
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" className="gap-2" onClick={addMember}>
        <Plus size={16} /> Adicionar membro
      </Button>
    </div>
  );
};

// ── Step: Concluir ────────────────────────────────────────
const StepConcluir = ({ data, plan }: { data: any; plan: string }) => {
  const selectedPlan = plans.find((p) => p.id === plan);
  return (
    <div className="space-y-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-primary shadow-primary">
          <CheckCircle2 size={40} className="text-primary-foreground" />
        </div>
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tudo pronto!</h2>
        <p className="text-muted-foreground mt-1">Sua imobiliária está configurada e pronta para operar</p>
      </div>
      <Card className="mx-auto max-w-sm p-5 text-left border-border/50">
        <div className="space-y-3">
          {data.identidade?.logo && (
            <div className="flex justify-center mb-2">
              <img src={data.identidade.logo} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-border" />
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Empresa</span>
            <span className="font-medium text-foreground">{data.empresa?.name || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CRECI</span>
            <span className="font-medium text-foreground">{data.empresa?.creci || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plano</span>
            <span className="font-semibold text-gradient">{selectedPlan?.name || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Equipe</span>
            <span className="font-medium text-foreground">{data.equipe?.filter((m: any) => m.email.trim()).length || 0} membro(s)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ── Main OnboardingPage ───────────────────────────────────
const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("performance");
  const [empresa, setEmpresa] = useState<any>({});
  const [identidade, setIdentidade] = useState<any>({});
  const [equipe, setEquipe] = useState<{ email: string; role: string }[]>([{ email: "", role: "corretor" }]);
  const [saving, setSaving] = useState(false);

  const planObj = plans.find((p) => p.id === selectedPlan);
  const teamEnabled = planObj?.teamEnabled ?? false;

  // Skip team step if plan doesn't support it
  const visibleSteps = teamEnabled ? steps : steps.filter((s) => s.id !== "equipe");
  const currentStep = visibleSteps[current];

  const canNext = () => {
    if (currentStep.id === "empresa") return !!empresa.name;
    return true;
  };

  const finishOnboarding = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Promote user to owner (via security definer function)
      await supabase.rpc("promote_to_owner", { _user_id: user.id });

      // 2. Create company
      const { data: companyData, error: companyErr } = await supabase.from("companies").insert({
        name: empresa.name,
        cnpj: empresa.cnpj || null,
        creci: empresa.creci || null,
        phone: empresa.phone || null,
        email: empresa.email || null,
        logo_url: identidade.logo || null,
        primary_color: identidade.primaryColor || "#7c3aed",
        secondary_color: identidade.secondaryColor || "#ec4899",
        plan_id: selectedPlan,
      }).select().single();
      if (companyErr) throw companyErr;

      // 3. Update profile with company_id and mark onboarding complete
      const { error: profileErr } = await supabase.from("profiles").update({
        company_id: companyData.id,
        onboarding_completed: true,
      }).eq("id", user.id);
      if (profileErr) throw profileErr;

      // 4. Create default pipeline stages
      await supabase.rpc("create_default_pipeline_stages", { _company_id: companyData.id });

      // 5. Create broker record for the owner/admin
      const fullName = user.user_metadata?.full_name || user.email || "Administrador";
      const initials = fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
      await supabase.from("brokers").insert({
        company_id: companyData.id,
        profile_id: user.id,
        name: fullName,
        email: user.email,
        initials,
      });

      // 6. Create broker records for invited team members
      const validMembers = equipe.filter((m) => m.email.trim());
      if (validMembers.length > 0) {
        const brokerInserts = validMembers.map((member) => ({
          company_id: companyData.id,
          name: member.email.split("@")[0],
          email: member.email,
          initials: member.email.slice(0, 2).toUpperCase(),
        }));
        await supabase.from("brokers").insert(brokerInserts);
      }

      toast.success("Empresa configurada com sucesso!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    if (current < visibleSteps.length - 1) setCurrent(current + 1);
    else finishOnboarding();
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <img src={logoIsafy} alt="ISAFY" className="h-8" />
          <span className="text-sm text-muted-foreground">
            Etapa {current + 1} de {visibleSteps.length}
          </span>
        </div>
      </div>

      {/* Stepper */}
      <div className="border-b border-border/50 bg-card/50 px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2 sm:gap-4 overflow-x-auto">
          {visibleSteps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={step.id} className="flex items-center gap-2">
                {i > 0 && <div className={`hidden sm:block h-px w-6 ${done ? "bg-primary" : "bg-border"}`} />}
                <button
                  onClick={() => i <= current && setCurrent(i)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-primary"
                      : done
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon size={14} />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep.id === "empresa" && <StepEmpresa data={empresa} onChange={setEmpresa} />}
              {currentStep.id === "identidade" && <StepIdentidade data={identidade} onChange={setIdentidade} />}
              {currentStep.id === "plano" && <StepPlano selected={selectedPlan} onSelect={setSelectedPlan} />}
              {currentStep.id === "equipe" && <StepEquipe members={equipe} onChange={setEquipe} />}
              {currentStep.id === "concluir" && <StepConcluir data={{ empresa, identidade, equipe }} plan={selectedPlan} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={current === 0} className="gap-2">
            <ArrowLeft size={16} /> Voltar
          </Button>
          <Button
            onClick={next}
            disabled={!canNext() || saving}
            className="gap-2 gradient-primary text-primary-foreground shadow-primary"
          >
            {saving ? "Salvando..." : currentStep.id === "concluir" ? "Acessar Dashboard" : "Próximo"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
