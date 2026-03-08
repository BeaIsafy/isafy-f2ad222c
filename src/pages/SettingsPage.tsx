import { useState, useEffect } from "react";
import {
  Building2, Palette, Users, Plug, CreditCard, Search, Plus, Upload,
  Globe, Facebook, Chrome, ShoppingBag, ExternalLink, Check, Crown,
  ArrowUpRight, Eye, Download, MoreHorizontal, Trash2, Mail, Phone,
  MapPin, FileText, UserPlus, ShieldCheck, Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBrokers } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { plans } from "@/data/plansData";

/* ───────── TABS ───────── */
const tabs = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "assinatura", label: "Assinatura", icon: CreditCard },
];

const integrations = [
  { id: "wordpress", name: "WordPress", desc: "Sincronize imóveis com seu site WordPress", icon: Globe, connected: true, category: "site" },
  { id: "facebook", name: "Facebook / Meta", desc: "Publique imóveis e gerencie leads do Facebook", icon: Facebook, connected: false, category: "social" },
  { id: "google", name: "Google Ads", desc: "Anúncios e rastreamento de conversões", icon: Chrome, connected: false, category: "social" },
  { id: "olx", name: "OLX", desc: "Publique automaticamente na OLX", icon: ShoppingBag, connected: true, category: "portal" },
  { id: "chavesnamao", name: "Chaves na Mão", desc: "Integração com portal Chaves na Mão", icon: ShoppingBag, connected: false, category: "portal" },
  { id: "canalpro", name: "CanalPro (Grupo ZAP)", desc: "Publique no ZAP Imóveis e Viva Real", icon: ShoppingBag, connected: false, category: "portal" },
  { id: "imovelweb", name: "Imóvel Web", desc: "Publique no portal Imóvel Web", icon: ShoppingBag, connected: false, category: "portal" },
];

const mockInvoices = [
  { id: "INV-2024-012", date: "01/03/2026", amount: "R$ 335,00", status: "paid" },
  { id: "INV-2024-011", date: "01/02/2026", amount: "R$ 335,00", status: "paid" },
  { id: "INV-2024-010", date: "01/01/2026", amount: "R$ 335,00", status: "paid" },
  { id: "INV-2024-009", date: "01/12/2025", amount: "R$ 335,00", status: "overdue" },
];

/* ───────── EMPRESA TAB ───────── */
function EmpresaTab() {
  const { company } = useAuth();
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [creci, setCreci] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setCnpj(company.cnpj || "");
      setCreci(company.creci || "");
      setPhone(company.phone || "");
      setEmail(company.email || "");
    }
  }, [company]);

  const handleSave = async () => {
    if (!company?.id) return;
    setSaving(true);
    const { error } = await supabase.from("companies").update({
      name, cnpj, creci, phone, email,
    }).eq("id", company.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Dados salvos com sucesso" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Building2 size={18} className="text-primary" /> Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium text-foreground">Nome Fantasia</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Sua Imobiliária" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">CNPJ</label><Input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">CRECI</label><Input value={creci} onChange={e => setCreci(e.target.value)} placeholder="000000-J" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">Telefone</label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">E-mail Principal</label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@imob.com" className="mt-1" /></div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}

/* ───────── BRANDING TAB ───────── */
function BrandingTab() {
  const { company } = useAuth();
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setPrimaryColor(company.primary_color || "#2563eb");
      setSecondaryColor(company.secondary_color || "#1e40af");
    }
  }, [company]);

  const handleSave = async () => {
    if (!company?.id) return;
    setSaving(true);
    const { error } = await supabase.from("companies").update({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
    }).eq("id", company.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Branding salvo com sucesso" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Palette size={18} className="text-primary" /> Identidade Visual</CardTitle>
          <CardDescription>Logos da sua imobiliária usadas no sistema e site</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Logo Principal</label>
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-muted/50 cursor-pointer">
              {company?.logo_url ? (
                <img src={company.logo_url} alt="Logo" className="max-h-28 object-contain" />
              ) : (
                <div className="text-center">
                  <Upload size={24} className="mx-auto text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Clique para enviar</p>
                  <p className="text-[10px] text-muted-foreground">PNG, SVG — até 2 MB</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Logo Secundária (Monocromática)</label>
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-muted/50 cursor-pointer">
              <div className="text-center">
                <Upload size={24} className="mx-auto text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Clique para enviar</p>
                <p className="text-[10px] text-muted-foreground">PNG, SVG — até 2 MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Palette size={18} className="text-primary" /> Cores</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Cor Primária</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-10 w-10 rounded border-0 cursor-pointer" />
              <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Cor Secundária</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="h-10 w-10 rounded border-0 cursor-pointer" />
              <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="flex-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}

/* ───────── EQUIPE TAB ───────── */
function EquipeTab() {
  const { company } = useAuth();
  const { data: brokers = [], isLoading, refetch } = useBrokers();
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState("corretor");
  const [saving, setSaving] = useState(false);

  const planId = company?.plan_id || "start";
  const currentPlan = plans.find(p => p.id === planId) || plans[0];
  const maxMembers = currentPlan.members;
  const usedMembers = brokers.length;
  const filtered = brokers.filter((m: any) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = async () => {
    if (!company?.id || !inviteName.trim()) return;
    setSaving(true);
    const initials = inviteName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
    const { error } = await supabase.from("brokers").insert({
      company_id: company.id,
      name: inviteName,
      email: inviteEmail || null,
      phone: invitePhone || null,
      initials,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membro adicionado!" });
      setShowInvite(false);
      setInviteName(""); setInviteEmail(""); setInvitePhone("");
      refetch();
    }
  };

  const handleDeactivate = async (id: string) => {
    const { error } = await supabase.from("brokers").update({ is_active: false }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Membro desativado" });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Membros da equipe</p>
              <p className="text-xs text-muted-foreground">{usedMembers} de {maxMembers} cadeiras utilizadas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={(usedMembers / maxMembers) * 100} className="h-2 w-32" />
            <span className="text-xs font-medium text-foreground">{usedMembers}/{maxMembers}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Redirecionando para upgrade..." })}>
              <Crown size={14} className="mr-1" /> Comprar cadeiras
            </Button>
            <Button size="sm" className="gradient-primary text-primary-foreground shadow-primary" onClick={() => setShowInvite(true)}>
              <UserPlus size={14} className="mr-1" /> Adicionar membro
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="shadow-card border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum membro encontrado</TableCell></TableRow>
            ) : filtered.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {m.initials || m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      {m.creci && <p className="text-xs text-muted-foreground">CRECI: {m.creci}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    {m.email && <p className="text-xs text-muted-foreground">{m.email}</p>}
                    {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={m.is_active !== false ? "border-[hsl(var(--success))] text-[hsl(var(--success))]" : "border-destructive text-destructive"}>
                    {m.is_active !== false ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDeactivate(m.id)}>
                    <Trash2 size={16} className="text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar novo membro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground">Nome</label><Input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Nome completo" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">E-mail</label><Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@exemplo.com" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Telefone</label><Input value={invitePhone} onChange={e => setInvitePhone(e.target.value)} placeholder="(11) 99999-9999" className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={handleInvite} disabled={saving}>
              {saving ? "Salvando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────── INTEGRAÇÕES TAB ───────── */
function IntegracoesTab() {
  const [wpModal, setWpModal] = useState(false);

  const categories = [
    { key: "site", title: "Site" },
    { key: "social", title: "Redes Sociais & Ads" },
    { key: "portal", title: "Portais Imobiliários" },
  ];

  return (
    <div className="space-y-6">
      {categories.map(cat => (
        <div key={cat.key} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {integrations.filter(i => i.category === cat.key).map(integ => (
              <Card key={integ.id} className="shadow-card border-border/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <integ.icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{integ.name}</p>
                      {integ.connected && <Badge variant="outline" className="border-[hsl(var(--success))] text-[hsl(var(--success))] text-[10px] px-1.5">Conectado</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{integ.desc}</p>
                  </div>
                  <Button
                    variant={integ.connected ? "outline" : "default"}
                    size="sm"
                    className={!integ.connected ? "gradient-primary text-primary-foreground shadow-primary" : ""}
                    onClick={() => {
                      if (integ.id === "wordpress") setWpModal(true);
                      else toast({ title: integ.connected ? "Configurações abertas" : "Conectar " + integ.name });
                    }}
                  >
                    {integ.connected ? "Configurar" : "Conectar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={wpModal} onOpenChange={setWpModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe size={18} className="text-primary" /> Configurar WordPress</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground">URL do WordPress</label><Input placeholder="https://www.seusite.com.br" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Usuário (Application Password)</label><Input placeholder="admin" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Senha (Application Password)</label><Input type="password" placeholder="xxxx xxxx xxxx xxxx" className="mt-1" /></div>
            <p className="text-xs text-muted-foreground">Utilize senhas de aplicação do WordPress para autenticação Basic Auth.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWpModal(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => { setWpModal(false); toast({ title: "WordPress conectado!" }); }}>Salvar Conexão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────── ASSINATURA TAB ───────── */
function AssinaturaTab() {
  const { company } = useAuth();
  const { data: brokers = [] } = useBrokers();
  const [showPlans, setShowPlans] = useState(false);

  const planId = company?.plan_id || "start";
  const currentPlan = plans.find(p => p.id === planId) || plans[0];
  const usedMembers = brokers.length;
  const usedStorage = 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50 overflow-hidden">
        <div className="gradient-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown size={22} className="text-primary-foreground" />
              <div>
                <p className="text-lg font-bold text-primary-foreground">{currentPlan.name}</p>
                <p className="text-xs text-primary-foreground/80">Plano ativo</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-foreground">R$ {currentPlan.price}<span className="text-sm font-normal">/mês</span></p>
            </div>
          </div>
        </div>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Próxima cobrança</p>
            <p className="text-sm font-semibold text-foreground">—</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Membros</p>
            <div className="flex items-center gap-2">
              <Progress value={(usedMembers / currentPlan.members) * 100} className="h-2 flex-1" />
              <span className="text-xs font-medium text-foreground">{usedMembers}/{currentPlan.members}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Armazenamento</p>
            <div className="flex items-center gap-2">
              <Progress value={0} className="h-2 flex-1" />
              <span className="text-xs font-medium text-foreground">0 GB / {currentPlan.storage}</span>
            </div>
          </div>
        </CardContent>
        <div className="border-t border-border px-6 py-3 flex justify-end">
          <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => setShowPlans(true)}>
            <ArrowUpRight size={14} className="mr-1" /> Fazer Upgrade
          </Button>
        </div>
      </Card>

      <Card className="shadow-card border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><FileText size={18} className="text-primary" /> Faturas</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="text-sm font-medium text-foreground">{inv.id}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                <TableCell className="text-sm text-foreground">{inv.amount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={inv.status === "paid" ? "border-[hsl(var(--success))] text-[hsl(var(--success))]" : "border-destructive text-destructive"}>
                    {inv.status === "paid" ? "Pago" : "Vencida"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm"><ExternalLink size={14} className="mr-1" /> Ver</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showPlans} onOpenChange={setShowPlans}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader><DialogTitle>Escolha seu plano</DialogTitle></DialogHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map(plan => {
              const isCurrent = plan.id === currentPlan.id;
              return (
                <Card key={plan.id} className={`relative overflow-hidden ${isCurrent ? "ring-2 ring-primary" : "border-border/50"}`}>
                  {isCurrent && (
                    <div className="gradient-primary px-3 py-1 text-center text-[10px] font-bold text-primary-foreground">PLANO ATUAL</div>
                  )}
                  <CardContent className="pt-5 space-y-4">
                    <div>
                      <p className="text-lg font-bold text-foreground">{plan.name}</p>
                      <p className="text-2xl font-extrabold text-foreground">R$ {plan.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    </div>
                    <Separator />
                    <ul className="space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                          <Check size={14} className="text-primary shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={isCurrent ? "" : "gradient-primary text-primary-foreground shadow-primary w-full"}
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Plano Atual" : plan.price > currentPlan.price ? "Fazer Upgrade" : "Downgrade"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ───────── MAIN PAGE ───────── */
const SettingsPage = () => {
  const [active, setActive] = useState("empresa");

  const renderTab = () => {
    switch (active) {
      case "empresa": return <EmpresaTab />;
      case "branding": return <BrandingTab />;
      case "equipe": return <EquipeTab />;
      case "integracoes": return <IntegracoesTab />;
      case "assinatura": return <AssinaturaTab />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua empresa, branding, equipe e integrações</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === tab.id
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
};

export default SettingsPage;
