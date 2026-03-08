import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Camera, Save, Target, Trash2, Lock, Eye, EyeOff,
  Sun, Moon, Monitor, Smartphone, Tablet, Globe, History,
  Edit3, ChevronRight, Shield, Bell, Palette, LogOut, Check,
  TrendingUp, TrendingDown, Minus, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  useBrokers, useBrokerGoals, useCurrentMonthGoal, useUpsertBrokerGoal,
  useUserSessions, useUpsertSession, useDeleteSession
} from "@/hooks/useSupabaseData";

const fmt = (v: number) => `R$ ${(v / 1_000_000).toFixed(1)}M`;

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === "mobile") return <Smartphone size={20} className="text-primary" />;
  if (type === "tablet") return <Tablet size={20} className="text-primary" />;
  return <Monitor size={20} className="text-primary" />;
};

const TrendIcon = ({ pct }: { pct: number }) => {
  if (pct >= 100) return <TrendingUp size={14} className="text-emerald-500" />;
  if (pct >= 80) return <Minus size={14} className="text-amber-500" />;
  return <TrendingDown size={14} className="text-destructive" />;
};

/* ── Sub-page: Goals History ── */
function GoalsHistoryView({ goals, onBack }: { goals: any[]; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Button variant="ghost" className="gap-2 mb-4 text-muted-foreground" onClick={onBack}>
        <ArrowLeft size={16} /> Voltar ao Perfil
      </Button>
      <h2 className="text-xl font-bold text-foreground mb-1">Histórico de Metas</h2>
      <p className="text-sm text-muted-foreground mb-6">Acompanhe seu desempenho mês a mês</p>

      {goals.length === 0 ? (
        <Card className="shadow-card border-border/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum histórico de metas encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((g: any) => {
            const pct = g.target_value > 0 ? Math.round((g.achieved_value / g.target_value) * 100) : 0;
            const monthDate = new Date(g.month + "T12:00:00");
            const monthLabel = monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
            return (
              <Card key={g.id} className="shadow-card border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground capitalize">{monthLabel}</h3>
                      <TrendIcon pct={pct} />
                    </div>
                    <Badge variant={pct >= 100 ? "default" : "secondary"} className={pct >= 100 ? "gradient-primary text-primary-foreground" : ""}>
                      {pct}% atingida
                    </Badge>
                  </div>
                  <Progress value={Math.min(pct, 100)} className="h-2 mb-3" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Alcançado: <strong className="text-foreground">{fmt(g.achieved_value)}</strong></span>
                    <span>Meta: {fmt(g.target_value)}</span>
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-foreground">{g.sales_count}</p>
                      <p className="text-xs text-muted-foreground">Vendas</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{g.leads_count}</p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{g.conversions_count}</p>
                      <p className="text-xs text-muted-foreground">Conversões</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ── Helper: detect device info from user agent ── */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceName = "Navegador desconhecido";
  let deviceType = "desktop";

  if (/iPhone|iPad|iPod/.test(ua)) {
    deviceType = /iPad/.test(ua) ? "tablet" : "mobile";
    deviceName = `Safari — ${/iPad/.test(ua) ? "iPad" : "iPhone"}`;
  } else if (/Android/.test(ua)) {
    deviceType = /Mobile/.test(ua) ? "mobile" : "tablet";
    deviceName = `Chrome — Android`;
  } else if (/Chrome/.test(ua)) {
    deviceName = `Chrome — ${/Mac/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : "Linux"}`;
  } else if (/Firefox/.test(ua)) {
    deviceName = `Firefox — ${/Mac/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : "Linux"}`;
  } else if (/Safari/.test(ua)) {
    deviceName = `Safari — macOS`;
  }

  return { deviceName, deviceType, userAgent: ua };
}

/* ── Main Profile Page ── */
const ProfilePage = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  // Brokers - to find current user's broker_id
  const { data: brokers = [] } = useBrokers();
  const myBroker = brokers.find((b: any) => b.profile_id === user?.id);

  // Goals
  const { data: allGoals = [] } = useBrokerGoals(myBroker?.id);
  const { data: currentGoalData } = useCurrentMonthGoal(myBroker?.id);
  const upsertGoal = useUpsertBrokerGoal();

  // Sessions
  const { data: sessions = [], refetch: refetchSessions } = useUserSessions();
  const upsertSession = useUpsertSession();
  const deleteSession = useDeleteSession();

  const [showGoalsHistory, setShowGoalsHistory] = useState(false);

  // Profile form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creci, setCreci] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      setPhone(profile.phone || "");
      setCreci(profile.creci || "");
    }
  }, [profile, user]);

  // Register current session on mount
  useEffect(() => {
    if (!user?.id || !sessions) return;
    const hasCurrentSession = sessions.some((s: any) => s.is_current);
    if (!hasCurrentSession && user?.id) {
      const { deviceName, deviceType, userAgent } = getDeviceInfo();
      upsertSession.mutate({
        device_name: deviceName,
        device_type: deviceType,
        user_agent: userAgent,
        is_current: true,
      });
    }
  }, [user?.id, sessions?.length]);

  // Password
  const [showPwDialog, setShowPwDialog] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  // Goal editing
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("3000000");

  const currentTarget = currentGoalData?.target_value ?? 0;
  const currentAchieved = currentGoalData?.achieved_value ?? 0;
  const goalPct = currentTarget > 0 ? Math.round((currentAchieved / currentTarget) * 100) : 0;

  useEffect(() => {
    if (currentGoalData) {
      setGoalInput(String(currentGoalData.target_value));
    }
  }, [currentGoalData]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name, phone, creci,
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado", description: "Suas informações foram salvas com sucesso." });
    }
  };

  const handleSavePassword = async () => {
    if (newPw !== confirmPw) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (newPw.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter no mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setShowPwDialog(false);
      setNewPw(""); setConfirmPw("");
      toast({ title: "Senha alterada", description: "Sua senha foi atualizada com sucesso." });
    }
  };

  const handleSaveGoal = () => {
    const v = Number(goalInput);
    if (v > 0 && myBroker?.id) {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const monthStr = currentMonth.toISOString().split("T")[0];
      upsertGoal.mutate({
        broker_id: myBroker.id,
        month: monthStr,
        target_value: v,
        achieved_value: currentAchieved,
        sales_count: currentGoalData?.sales_count ?? 0,
        leads_count: currentGoalData?.leads_count ?? 0,
        conversions_count: currentGoalData?.conversions_count ?? 0,
      });
      setEditGoal(false);
      toast({ title: "Meta atualizada" });
    }
  };

  const handleLogoutDevice = (id: string) => {
    deleteSession.mutate(id, {
      onSuccess: () => {
        toast({ title: "Dispositivo desconectado", description: "A sessão foi encerrada." });
        refetchSessions();
      },
    });
  };

  const handleLogoutAll = async () => {
    // Delete all non-current sessions
    for (const s of sessions.filter((s: any) => !s.is_current)) {
      await supabase.from("user_sessions").delete().eq("id", s.id);
    }
    toast({ title: "Todas as outras sessões foram encerradas" });
    refetchSessions();
  };

  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  if (showGoalsHistory) {
    return (
      <AnimatePresence mode="wait">
        <GoalsHistoryView goals={allGoals} onBack={() => setShowGoalsHistory(false)} />
      </AnimatePresence>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
      </div>

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="dados" className="gap-1.5 text-xs sm:text-sm"><User size={14} /> Dados</TabsTrigger>
          <TabsTrigger value="metas" className="gap-1.5 text-xs sm:text-sm"><Target size={14} /> Metas</TabsTrigger>
          <TabsTrigger value="preferencias" className="gap-1.5 text-xs sm:text-sm"><Palette size={14} /> Tema</TabsTrigger>
          <TabsTrigger value="dispositivos" className="gap-1.5 text-xs sm:text-sm"><Shield size={14} /> Sessões</TabsTrigger>
        </TabsList>

        {/* ─── TAB: Dados Pessoais ─── */}
        <TabsContent value="dados">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><User size={18} className="text-primary" /> Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground">
                          {initials || "?"}
                        </div>
                      )}
                      <button className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={20} className="text-primary-foreground" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{name || "Sem nome"}</p>
                      <p className="text-sm text-muted-foreground">{email}</p>
                      <Button variant="ghost" size="sm" className="text-xs text-primary mt-1 h-7 px-2 gap-1">
                        <Camera size={12} /> Alterar foto
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-foreground">Nome Completo</label>
                      <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">E-mail</label>
                      <Input value={email} disabled className="mt-1 opacity-60" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Telefone</label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">CRECI</label>
                      <Input value={creci} onChange={e => setCreci(e.target.value)} className="mt-1" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={handleSaveProfile} disabled={saving}>
                      <Save size={16} /> {saving ? "Salvando..." : "Salvar"}
                    </Button>
                    <Dialog open={showPwDialog} onOpenChange={setShowPwDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2"><Lock size={14} /> Alterar Senha</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Alterar Senha</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-2">
                          <div>
                            <label className="text-sm font-medium text-foreground">Nova Senha</label>
                            <div className="relative mt-1">
                              <Input type={showNewPw ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} />
                              <button className="absolute right-2 top-2.5 text-muted-foreground" onClick={() => setShowNewPw(!showNewPw)}>
                                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
                            <Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="mt-1" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowPwDialog(false)}>Cancelar</Button>
                          <Button className="gradient-primary text-primary-foreground" onClick={handleSavePassword}>Salvar Senha</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-card border-destructive/20">
                <CardContent className="p-5 space-y-3">
                  <p className="text-sm font-medium text-foreground">Zona de perigo</p>
                  <p className="text-xs text-muted-foreground">Esta ação é irreversível e apagará todos os seus dados.</p>
                  <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
                    <Trash2 size={16} /> Cancelar Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB: Metas ─── */}
        <TabsContent value="metas">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base"><Target size={18} className="text-primary" /> Meta Mensal</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setEditGoal(!editGoal)}>
                    <Edit3 size={14} /> {editGoal ? "Cancelar" : "Editar"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!myBroker ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum broker vinculado ao seu perfil.</p>
                ) : editGoal ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Valor da Meta (R$)</label>
                    <Input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)} />
                    <Button className="gradient-primary text-primary-foreground w-full gap-2" onClick={handleSaveGoal}>
                      <Check size={16} /> Salvar Meta
                    </Button>
                  </div>
                ) : currentTarget > 0 ? (
                  <>
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-gradient">{fmt(currentAchieved)}</p>
                      <p className="text-sm text-muted-foreground">de {fmt(currentTarget)}</p>
                    </div>
                    <Progress value={Math.min(goalPct, 100)} className="h-3" />
                    <p className="text-center text-xs text-muted-foreground">{goalPct}% atingida</p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Nenhuma meta definida para este mês.</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setEditGoal(true)}>
                      Definir meta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50 flex flex-col justify-center">
              <CardContent className="p-6 text-center space-y-4">
                <History size={32} className="mx-auto text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Metas Anteriores</p>
                  <p className="text-sm text-muted-foreground mt-1">Veja o histórico completo de metas e desempenho por mês</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={() => setShowGoalsHistory(true)}>
                  <History size={16} /> Ver metas anteriores <ChevronRight size={14} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: Preferências ─── */}
        <TabsContent value="preferencias">
          <div className="max-w-lg space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Palette size={18} className="text-primary" /> Aparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "light" ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-indigo-400" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">Modo {theme === "light" ? "Claro" : "Escuro"}</p>
                      <p className="text-xs text-muted-foreground">Alterne entre tema claro e escuro</p>
                    </div>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => theme === "dark" && toggleTheme()}
                    className={`relative rounded-xl border-2 p-4 transition-all ${theme === "light" ? "border-primary shadow-md" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="rounded-lg bg-white border border-border/60 p-3 space-y-2">
                      <div className="h-2 w-12 rounded bg-gray-200" />
                      <div className="h-2 w-8 rounded bg-gray-300" />
                      <div className="h-2 w-16 rounded bg-purple-200" />
                    </div>
                    <p className="text-xs font-medium text-foreground mt-2">Claro</p>
                    {theme === "light" && <Check size={14} className="absolute top-2 right-2 text-primary" />}
                  </button>
                  <button
                    onClick={() => theme === "light" && toggleTheme()}
                    className={`relative rounded-xl border-2 p-4 transition-all ${theme === "dark" ? "border-primary shadow-md" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="rounded-lg bg-gray-900 border border-gray-700 p-3 space-y-2">
                      <div className="h-2 w-12 rounded bg-gray-700" />
                      <div className="h-2 w-8 rounded bg-gray-600" />
                      <div className="h-2 w-16 rounded bg-purple-800" />
                    </div>
                    <p className="text-xs font-medium text-foreground mt-2">Escuro</p>
                    {theme === "dark" && <Check size={14} className="absolute top-2 right-2 text-primary" />}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Bell size={18} className="text-primary" /> Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Novos leads", desc: "Receba alertas de novos leads", default: true },
                  { label: "Visitas agendadas", desc: "Lembrete antes de visitas", default: true },
                  { label: "Propostas", desc: "Notificações de novas propostas", default: true },
                  { label: "Relatórios semanais", desc: "Resumo semanal por e-mail", default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: Dispositivos ─── */}
        <TabsContent value="dispositivos">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Dispositivos Conectados</h3>
                <p className="text-sm text-muted-foreground">{sessions.length} sessão(ões) ativa(s)</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={handleLogoutAll}>
                <LogOut size={14} /> Encerrar outras
              </Button>
            </div>

            {sessions.length === 0 ? (
              <Card className="shadow-card border-border/50">
                <CardContent className="p-8 text-center text-muted-foreground">
                  Nenhuma sessão registrada.
                </CardContent>
              </Card>
            ) : sessions.map((d: any) => (
              <Card key={d.id} className={`shadow-card border-border/50 ${d.is_current ? "ring-1 ring-primary/30" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <DeviceIcon type={d.device_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{d.device_name}</p>
                      {d.is_current && <Badge className="gradient-primary text-primary-foreground text-[10px] h-5">Atual</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {d.location && <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe size={10} /> {d.location}</span>}
                      {d.ip_address && <span className="text-xs text-muted-foreground">IP: {d.ip_address}</span>}
                      <span className="text-xs text-muted-foreground">
                        {d.is_current ? "Agora (sessão atual)" : new Date(d.last_active_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  {!d.is_current && (
                    <Button variant="ghost" size="sm" className="text-destructive text-xs shrink-0" onClick={() => handleLogoutDevice(d.id)}>
                      <LogOut size={14} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
