import { useState } from "react";
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

/* ───────── TABS ───────── */
const tabs = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "assinatura", label: "Assinatura", icon: CreditCard },
];

/* ───────── MOCK DATA ───────── */
const mockTeam = [
  { id: "1", name: "Carlos Silva", email: "carlos@imob.com", role: "admin", status: "active", avatar: "CS" },
  { id: "2", name: "Ana Oliveira", email: "ana@imob.com", role: "corretor", status: "active", avatar: "AO" },
  { id: "3", name: "Pedro Santos", email: "pedro@imob.com", role: "corretor", status: "active", avatar: "PS" },
  { id: "4", name: "Maria Costa", email: "maria@imob.com", role: "corretor", status: "pending", avatar: "MC" },
];

const mockInvoices = [
  { id: "INV-2024-012", date: "01/03/2026", amount: "R$ 297,00", status: "paid" },
  { id: "INV-2024-011", date: "01/02/2026", amount: "R$ 297,00", status: "paid" },
  { id: "INV-2024-010", date: "01/01/2026", amount: "R$ 297,00", status: "paid" },
  { id: "INV-2024-009", date: "01/12/2025", amount: "R$ 297,00", status: "overdue" },
];

// Plans imported from shared data
import { plans } from "@/data/plansData";

const integrations = [
  { id: "wordpress", name: "WordPress", desc: "Sincronize imóveis com seu site WordPress", icon: Globe, connected: true, category: "site" },
  { id: "facebook", name: "Facebook / Meta", desc: "Publique imóveis e gerencie leads do Facebook", icon: Facebook, connected: false, category: "social" },
  { id: "google", name: "Google Ads", desc: "Anúncios e rastreamento de conversões", icon: Chrome, connected: false, category: "social" },
  { id: "olx", name: "OLX", desc: "Publique automaticamente na OLX", icon: ShoppingBag, connected: true, category: "portal" },
  { id: "chavesnamao", name: "Chaves na Mão", desc: "Integração com portal Chaves na Mão", icon: ShoppingBag, connected: false, category: "portal" },
  { id: "canalpro", name: "CanalPro (Grupo ZAP)", desc: "Publique no ZAP Imóveis e Viva Real", icon: ShoppingBag, connected: false, category: "portal" },
  { id: "imovelweb", name: "Imóvel Web", desc: "Publique no portal Imóvel Web", icon: ShoppingBag, connected: false, category: "portal" },
];

/* ───────── EMPRESA TAB ───────── */
function EmpresaTab() {
  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Building2 size={18} className="text-primary" /> Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium text-foreground">Nome Fantasia</label><Input placeholder="Sua Imobiliária" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">Razão Social</label><Input placeholder="Imobiliária Ltda." className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">CNPJ</label><Input placeholder="00.000.000/0001-00" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">CRECI</label><Input placeholder="000000-J" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">Telefone</label><Input placeholder="(11) 99999-9999" className="mt-1" /></div>
          <div><label className="text-sm font-medium text-foreground">E-mail Principal</label><Input placeholder="contato@imob.com" className="mt-1" /></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium text-foreground">Endereço Completo</label><Input placeholder="Rua, número, complemento, bairro, cidade - UF" className="mt-1" /></div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => toast({ title: "Dados salvos com sucesso" })}>Salvar Alterações</Button>
      </div>
    </div>
  );
}

/* ───────── BRANDING TAB ───────── */
function BrandingTab() {
  return (
    <div className="space-y-6">
      {/* Logos */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Palette size={18} className="text-primary" /> Identidade Visual</CardTitle>
          <CardDescription>Logos da sua imobiliária usadas no sistema e site</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Logo Principal</label>
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-muted/50 cursor-pointer">
              <div className="text-center">
                <Upload size={24} className="mx-auto text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">Clique para enviar</p>
                <p className="text-[10px] text-muted-foreground">PNG, SVG — até 2 MB</p>
              </div>
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

      {/* Site */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Globe size={18} className="text-primary" /> Informações do Site</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div><label className="text-sm font-medium text-foreground">URL do Site</label><Input placeholder="https://www.suaimobiliaria.com.br" className="mt-1" /></div>
          <div className="sm:col-span-2"><label className="text-sm font-medium text-foreground">Descrição do Site (SEO)</label><Textarea placeholder="Uma breve descrição da sua imobiliária para buscadores..." className="mt-1" rows={3} /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => toast({ title: "Branding salvo com sucesso" })}>Salvar Alterações</Button>
      </div>
    </div>
  );
}

/* ───────── EQUIPE TAB ───────── */
function EquipeTab() {
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const maxMembers = 5;
  const usedMembers = mockTeam.length;
  const filtered = mockTeam.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header info */}
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
              <UserPlus size={14} className="mr-1" /> Convidar membro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search + Table */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="shadow-card border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(m => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{m.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={m.role === "admin" ? "default" : "secondary"} className={m.role === "admin" ? "gradient-primary text-primary-foreground" : ""}>
                    {m.role === "admin" ? "Administrador" : "Corretor"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={m.status === "active" ? "border-[hsl(var(--success))] text-[hsl(var(--success))]" : "border-[hsl(var(--warning))] text-[hsl(var(--warning))]"}>
                    {m.status === "active" ? "Ativo" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Invite Modal */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader><DialogTitle>Convidar novo membro</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground">Nome</label><Input placeholder="Nome completo" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">E-mail</label><Input placeholder="email@exemplo.com" className="mt-1" /></div>
            <div>
              <label className="text-sm font-medium text-foreground">Função</label>
              <Select defaultValue="corretor">
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="corretor">Corretor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => { setShowInvite(false); toast({ title: "Convite enviado!" }); }}>Enviar Convite</Button>
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

      {/* WordPress Config Modal */}
      <Dialog open={wpModal} onOpenChange={setWpModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Globe size={18} className="text-primary" /> Configurar WordPress</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground">URL do WordPress</label><Input placeholder="https://www.seusite.com.br" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Usuário (Application Password)</label><Input placeholder="admin" className="mt-1" /></div>
            <div><label className="text-sm font-medium text-foreground">Senha (Application Password)</label><Input type="password" placeholder="xxxx xxxx xxxx xxxx" className="mt-1" /></div>
            <p className="text-xs text-muted-foreground">Utilize senhas de aplicação do WordPress para autenticação Basic Auth. Gere em Usuários → Perfil → Senhas de Aplicação.</p>
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
  const [showPlans, setShowPlans] = useState(false);
  const currentPlan = plans[1]; // Performance
  const usedMembers = 4;
  const usedStorage = 12.4;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
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
            <p className="text-sm font-semibold text-foreground">01/04/2026</p>
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
              <Progress value={(usedStorage / 50) * 100} className="h-2 flex-1" />
              <span className="text-xs font-medium text-foreground">{usedStorage} GB / {currentPlan.storage}</span>
            </div>
          </div>
        </CardContent>
        <div className="border-t border-border px-6 py-3 flex justify-end">
          <Button className="gradient-primary text-primary-foreground shadow-primary" onClick={() => setShowPlans(true)}>
            <ArrowUpRight size={14} className="mr-1" /> Fazer Upgrade
          </Button>
        </div>
      </Card>

      {/* Invoices */}
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

      {/* Plans Modal */}
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
