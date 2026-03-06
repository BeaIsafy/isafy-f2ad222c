import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Download, TrendingUp, Users, Target, Clock, MessageSquare,
  Sparkles, ChevronDown, Calendar, Loader2, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";

// ── Mock Data ──────────────────────────────────────────────
const monthlyData = [
  { name: "Jan", vendas: 4, leads: 32, atendimentos: 48, vgv: 1200000 },
  { name: "Fev", vendas: 6, leads: 45, atendimentos: 55, vgv: 1800000 },
  { name: "Mar", vendas: 3, leads: 28, atendimentos: 40, vgv: 950000 },
  { name: "Abr", vendas: 8, leads: 52, atendimentos: 62, vgv: 2400000 },
  { name: "Mai", vendas: 5, leads: 38, atendimentos: 50, vgv: 1500000 },
  { name: "Jun", vendas: 7, leads: 48, atendimentos: 58, vgv: 2100000 },
  { name: "Jul", vendas: 9, leads: 55, atendimentos: 70, vgv: 2850000 },
];

const conversionFunnel = [
  { name: "Leads", value: 320 },
  { name: "Qualificados", value: 180 },
  { name: "Visitas", value: 95 },
  { name: "Propostas", value: 42 },
  { name: "Vendas", value: 18 },
];

const teamPerformance = [
  { name: "Carlos Mendes", leads: 45, vendas: 8, conversao: 17.8, tempoResposta: "12min", tempoVenda: "32 dias" },
  { name: "Ana Costa", leads: 38, vendas: 6, conversao: 15.8, tempoResposta: "8min", tempoVenda: "28 dias" },
  { name: "Fernanda Lima", leads: 52, vendas: 10, conversao: 19.2, tempoResposta: "15min", tempoVenda: "35 dias" },
  { name: "Roberto Almeida", leads: 30, vendas: 4, conversao: 13.3, tempoResposta: "20min", tempoVenda: "40 dias" },
];

const slaData = [
  { name: "Seg", dentro: 85, fora: 15 },
  { name: "Ter", dentro: 90, fora: 10 },
  { name: "Qua", dentro: 78, fora: 22 },
  { name: "Qui", dentro: 92, fora: 8 },
  { name: "Sex", dentro: 88, fora: 12 },
  { name: "Sáb", dentro: 75, fora: 25 },
  { name: "Dom", dentro: 95, fora: 5 },
];

const pieColors = ["hsl(270,80%,60%)", "hsl(320,72%,55%)", "hsl(200,70%,50%)", "hsl(150,60%,45%)", "hsl(40,80%,55%)"];

const periods = [
  { value: "dia", label: "Hoje" },
  { value: "semana", label: "Esta semana" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Este mês" },
  { value: "trimestral", label: "Trimestral" },
  { value: "personalizado", label: "Personalizado" },
];

// ── KPI Cards ──────────────────────────────────────────────
const kpis = [
  { label: "VGV Total", value: "R$ 12.8M", change: "+12%", icon: TrendingUp },
  { label: "Vendas", value: "42", change: "+8%", icon: BarChart3 },
  { label: "Novos Leads", value: "298", change: "+23%", icon: Users },
  { label: "Taxa Conversão", value: "8.2%", change: "+1.4%", icon: Target },
  { label: "Tempo de Resposta", value: "14min", change: "-3min", icon: Clock },
  { label: "SLA Cumprido", value: "87%", change: "+5%", icon: MessageSquare },
];

const Reports = () => {
  const { toast } = useToast();
  const [period, setPeriod] = useState("mensal");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("visao-geral");

  const handleExport = (format: string) => {
    toast({ title: `Exportando ${format.toUpperCase()}`, description: "Relatório será gerado em instantes." });
  };

  const handleAIReport = () => {
    if (!aiPrompt.trim()) {
      toast({ title: "Digite uma solicitação", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResult(
        `📊 **Análise Gerada por IA**\n\n` +
        `Com base nos dados do período selecionado (${periods.find(p => p.value === period)?.label}):\n\n` +
        `• O time apresentou crescimento de 12% no VGV comparado ao período anterior.\n` +
        `• Carlos Mendes e Fernanda Lima lideram em conversão, ambos acima de 15%.\n` +
        `• O tempo médio de resposta está em 14 minutos, dentro do SLA de 30 minutos em 87% dos casos.\n` +
        `• Recomendação: investir em leads da zona sul de SP, que representam 40% das conversões.\n` +
        `• Oportunidade: o segmento de coberturas tem ticket médio 3x maior, mas recebe apenas 8% dos leads.\n\n` +
        `⏱️ Tempo médio de venda: 34 dias (meta: 30 dias) — sugere-se revisar o follow-up pós-visita.\n\n` +
        `Solicitação original: "${aiPrompt}"`
      );
      setAiLoading(false);
    }, 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise de desempenho e métricas</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Period selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar size={14} className="mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom date range */}
          {period === "personalizado" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    {dateFrom ? format(dateFrom, "dd/MM/yy") : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    {dateTo ? format(dateTo, "dd/MM/yy") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button variant="outline" className="gap-2" onClick={() => setShowAIModal(true)}>
            <Sparkles size={16} className="text-primary" /> Relatório IA
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2"><Download size={16} /> Exportar <ChevronDown size={14} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2"><FileText size={16} /> Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2"><FileText size={16} /> PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <k.icon size={16} className="text-primary" />
                  <span className="text-xs font-medium text-emerald-600">{k.change}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
          <TabsTrigger value="tempo">Tempo</TabsTrigger>
        </TabsList>

        {/* ── Visão Geral ── */}
        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><BarChart3 size={16} className="text-primary" /> Vendas x Leads por mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,90%)" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="leads" fill="hsl(270,80%,60%)" name="Leads" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="vendas" fill="hsl(320,72%,55%)" name="Vendas" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> Funil de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={conversionFunnel} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {conversionFunnel.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp size={16} className="text-primary" /> VGV Mensal (R$)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,90%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}K`} />
                  <Area type="monotone" dataKey="vgv" stroke="hsl(270,80%,60%)" fill="hsl(270,80%,60%)" fillOpacity={0.15} name="VGV" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Metas ── */}
        <TabsContent value="metas" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Vendas", atual: 42, meta: 50, unit: "imóveis" },
              { title: "VGV", atual: 12.8, meta: 15, unit: "M", prefix: "R$ " },
              { title: "Novos Leads", atual: 298, meta: 350, unit: "leads" },
              { title: "Visitas", atual: 95, meta: 120, unit: "visitas" },
              { title: "Propostas", atual: 42, meta: 60, unit: "propostas" },
              { title: "Conversão", atual: 8.2, meta: 10, unit: "%" },
            ].map((m) => {
              const pct = Math.min(100, (m.atual / m.meta) * 100);
              return (
                <Card key={m.title} className="shadow-card border-border/50">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground text-sm">{m.title}</h4>
                      <Badge variant={pct >= 80 ? "default" : "secondary"}>{pct.toFixed(0)}%</Badge>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {m.prefix || ""}{m.atual}{m.unit === "%" ? "%" : ` ${m.unit}`} de {m.prefix || ""}{m.meta}{m.unit === "%" ? "%" : ` ${m.unit}`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Vendas ── */}
        <TabsContent value="vendas" className="space-y-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Evolução de Vendas</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,90%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="vendas" stroke="hsl(270,80%,60%)" strokeWidth={2} dot={{ r: 4 }} name="Vendas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Performance por Corretor</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium text-muted-foreground">Corretor</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Leads</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Vendas</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Conversão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPerformance.map((t) => (
                      <tr key={t.name} className="border-b border-border/50">
                        <td className="py-2.5 font-medium text-foreground">{t.name}</td>
                        <td className="text-center text-muted-foreground">{t.leads}</td>
                        <td className="text-center font-semibold text-foreground">{t.vendas}</td>
                        <td className="text-center"><Badge variant={t.conversao >= 15 ? "default" : "secondary"}>{t.conversao}%</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Clientes ── */}
        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Clientes", value: "186" },
              { label: "Novos (mês)", value: "23" },
              { label: "Ativos", value: "142" },
              { label: "Inativos", value: "44" },
            ].map((c) => (
              <Card key={c.label} className="shadow-card border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Leads por Origem</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={[
                    { name: "Site", value: 120 },
                    { name: "Portais", value: 85 },
                    { name: "Indicação", value: 55 },
                    { name: "Redes Sociais", value: 40 },
                    { name: "Outros", value: 18 },
                  ]} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {[0, 1, 2, 3, 4].map((i) => <Cell key={i} fill={pieColors[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Atendimento ── */}
        <TabsContent value="atendimento" className="space-y-4">
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Atendimentos por Mês</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,90%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill="hsl(200,70%,50%)" name="Atendimentos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SLA ── */}
        <TabsContent value="sla" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-foreground">87%</p>
                <p className="text-xs text-muted-foreground mt-1">SLA Cumprido</p>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-foreground">30min</p>
                <p className="text-xs text-muted-foreground mt-1">Meta de Resposta</p>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-foreground">14min</p>
                <p className="text-xs text-muted-foreground mt-1">Média Atual</p>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-2"><CardTitle className="text-sm">SLA por Dia da Semana (%)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={slaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260,15%,90%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="dentro" fill="hsl(150,60%,45%)" name="Dentro do SLA" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="fora" fill="hsl(0,84%,60%)" name="Fora do SLA" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tempo ── */}
        <TabsContent value="tempo" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Tempo Médio de Resposta</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamPerformance.map((t) => (
                    <div key={t.name} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{t.name}</span>
                      <Badge variant={parseInt(t.tempoResposta) <= 15 ? "default" : "secondary"}>{t.tempoResposta}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Tempo Médio de Venda</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamPerformance.map((t) => (
                    <div key={t.name} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{t.name}</span>
                      <Badge variant={parseInt(t.tempoVenda) <= 30 ? "default" : "secondary"}>{t.tempoVenda}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Report Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles size={18} className="text-primary" /> Relatório por IA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>O que você quer analisar?</Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Analise o desempenho de vendas do último trimestre e sugira ações para melhorar a conversão..."
                rows={3}
              />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground gap-2" onClick={handleAIReport} disabled={aiLoading}>
              {aiLoading ? <><Loader2 size={16} className="animate-spin" /> Gerando análise...</> : <><Sparkles size={16} /> Gerar Relatório</>}
            </Button>
            {aiResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{aiResult}</pre>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAIModal(false); setAiResult(""); setAiPrompt(""); }}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
