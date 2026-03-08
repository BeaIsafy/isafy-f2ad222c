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

/* ── Mock data (goals/devices - will be real later) ── */
const mockGoalsHistory = [
  { month: "Fev 2025", target: 3000000, achieved: 2700000, pct: 90, sales: 5, leads: 42, conversions: 12 },
  { month: "Jan 2025", target: 2500000, achieved: 1875000, pct: 75, sales: 4, leads: 38, conversions: 10 },
  { month: "Dez 2024", target: 3000000, achieved: 3300000, pct: 110, sales: 7, leads: 55, conversions: 15 },
  { month: "Nov 2024", target: 2800000, achieved: 2240000, pct: 80, sales: 3, leads: 30, conversions: 8 },
  { month: "Out 2024", target: 2500000, achieved: 2000000, pct: 80, sales: 4, leads: 35, conversions: 9 },
  { month: "Set 2024", target: 2000000, achieved: 1800000, pct: 90, sales: 3, leads: 28, conversions: 7 },
];

const mockDevices = [
  { id: "1", name: "Chrome — Windows 11", type: "desktop", ip: "189.45.xxx.xx", lastActive: "Agora (sessão atual)", current: true, location: "São Paulo, SP" },
  { id: "2", name: "Safari — iPhone 15 Pro", type: "mobile", ip: "189.45.xxx.xx", lastActive: "Há 2 horas", current: false, location: "São Paulo, SP" },
];

/* ── Sub-page: Goals History ── */
function GoalsHistoryView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Button variant="ghost" className="gap-2 mb-4 text-muted-foreground" onClick={onBack}>
        <ArrowLeft size={16} /> Voltar ao Perfil
      </Button>
      <h2 className="text-xl font-bold text-foreground mb-1">Histórico de Metas</h2>
      <p className="text-sm text-muted-foreground mb-6">Acompanhe seu desempenho mês a mês</p>

      <div className="space-y-4">
        {mockGoalsHistory.map((g) => (
          <Card key={g.month} className="shadow-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{g.month}</h3>
                  <TrendIcon pct={g.pct} />
                </div>
                <Badge variant={g.pct >= 100 ? "default" : "secondary"} className={g.pct >= 100 ? "gradient-primary text-primary-foreground" : ""}>
                  {g.pct}% atingida
                </Badge>
              </div>
              <Progress value={Math.min(g.pct, 100)} className="h-2 mb-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Alcançado: <strong className="text-foreground">{fmt(g.achieved)}</strong></span>
                <span>Meta: {fmt(g.target)}</span>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{g.sales}</p>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{g.leads}</p>
                  <p className="text-xs text-muted-foreground">Leads</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{g.conversions}</p>
                  <p className="text-xs text-muted-foreground">Conversões</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main Profile Page ── */
const ProfilePage = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const [showGoalsHistory, setShowGoalsHistory] = useState(false);

  // Profile form - populated from Supabase
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

  // Password
  const [showPwDialog, setShowPwDialog] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  // Goal
  const [currentGoal, setCurrentGoal] = useState(3000000);
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("3000000");
  const achieved = 1800000;
  const goalPct = Math.round((achieved / currentGoal) * 100);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: name,
      phone,
      creci,
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
    if (v > 0) { setCurrentGoal(v); setEditGoal(false); toast({ title: "Meta atualizada" }); }
  };

  const handleLogoutDevice = (id: string) => {
    toast({ title: "Dispositivo desconectado", description: "A sessão foi encerrada." });
  };

  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  if (showGoalsHistory) {
    return (
      <AnimatePresence mode="wait">
        <GoalsHistoryView onBack={() => setShowGoalsHistory(false)} />
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
                  {/* Avatar */}
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

                  {/* Fields */}
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
                        <DialogHeader>
                          <DialogTitle>Alterar Senha</DialogTitle>
                        </DialogHeader>
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

            {/* Danger zone */}
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
                {editGoal ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Valor da Meta (R$)</label>
                    <Input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)} />
                    <Button className="gradient-primary text-primary-foreground w-full gap-2" onClick={handleSaveGoal}>
                      <Check size={16} /> Salvar Meta
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-gradient">{fmt(achieved)}</p>
                      <p className="text-sm text-muted-foreground">de {fmt(currentGoal)}</p>
                    </div>
                    <Progress value={Math.min(goalPct, 100)} className="h-3" />
                    <p className="text-center text-xs text-muted-foreground">{goalPct}% atingida</p>
                  </>
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
                <p className="text-sm text-muted-foreground">{mockDevices.length} sessões ativas</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => { signOut(); navigate("/auth"); }}>
                <LogOut size={14} /> Sair de todas
              </Button>
            </div>

            {mockDevices.map((d) => (
              <Card key={d.id} className={`shadow-card border-border/50 ${d.current ? "ring-1 ring-primary/30" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <DeviceIcon type={d.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{d.name}</p>
                      {d.current && <Badge className="gradient-primary text-primary-foreground text-[10px] h-5">Atual</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Globe size={10} /> {d.location}</span>
                      <span className="text-xs text-muted-foreground">IP: {d.ip}</span>
                      <span className="text-xs text-muted-foreground">{d.lastActive}</span>
                    </div>
                  </div>
                  {!d.current && (
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
