import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Download, TrendingUp, Users, Target, Clock, MessageSquare,
  Sparkles, ChevronDown, Calendar, Loader2, FileText, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, subDays, subMonths, startOfDay, startOfWeek, startOfMonth, startOfQuarter, isAfter, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";

const pieColors = ["hsl(270,80%,60%)", "hsl(320,72%,55%)", "hsl(200,70%,50%)", "hsl(150,60%,45%)", "hsl(40,80%,55%)"];

const periods = [
  { value: "dia", label: "Hoje" },
  { value: "semana", label: "Esta semana" },
  { value: "quinzenal", label: "Quinzenal" },
  { value: "mensal", label: "Este mês" },
  { value: "trimestral", label: "Trimestral" },
  { value: "personalizado", label: "Personalizado" },
];

function getDateRange(period: string, dateFrom?: Date, dateTo?: Date) {
  const now = new Date();
  let from: Date;
  let to = now;
  switch (period) {
    case "dia": from = startOfDay(now); break;
    case "semana": from = startOfWeek(now, { weekStartsOn: 1 }); break;
    case "quinzenal": from = subDays(now, 14); break;
    case "mensal": from = startOfMonth(now); break;
    case "trimestral": from = startOfQuarter(now); break;
    case "personalizado":
      from = dateFrom || subMonths(now, 1);
      to = dateTo || now;
      break;
    default: from = startOfMonth(now);
  }
  return { from, to };
}

function inRange(dateStr: string | null | undefined, from: Date, to: Date) {
  if (!dateStr) return false;
  const d = parseISO(dateStr);
  return !isBefore(d, from) && !isAfter(d, to);
}

const fmtCurrency = (v: number) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`;
  return `R$ ${v.toFixed(0)}`;
};

const Reports = () => {
  const { toast } = useToast();
  const { company } = useAuth();
  const [period, setPeriod] = useState("mensal");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("visao-geral");

  const companyId = company?.id;

  // Fetch all data in parallel
  const { data: leads = [], isLoading: loadingLeads } = useQuery({
    queryKey: ["report_leads", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("pipeline_leads")
        .select("*, assigned_broker:brokers!pipeline_leads_assigned_broker_id_fkey(id, name)")
        .eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: proposals = [], isLoading: loadingProposals } = useQuery({
    queryKey: ["report_proposals", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("proposals").select("*").eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: contacts = [], isLoading: loadingContacts } = useQuery({
    queryKey: ["report_contacts", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("contacts").select("*").eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["report_properties", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("properties").select("id, sale_price, rent_price, status, created_at, assigned_broker_id, broker_id").eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: visits = [] } = useQuery({
    queryKey: ["report_visits", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("visits").select("*").eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: brokers = [] } = useQuery({
    queryKey: ["report_brokers", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("brokers").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ["report_goals", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("broker_goals").select("*").eq("company_id", companyId!);
      return data ?? [];
    },
    enabled: !!companyId,
  });

  const loading = loadingLeads || loadingProposals || loadingContacts;

  // Compute date range
  const { from: rangeFrom, to: rangeTo } = useMemo(() => getDateRange(period, dateFrom, dateTo), [period, dateFrom, dateTo]);

  // Filtered data by period
  const filteredLeads = useMemo(() => leads.filter(l => inRange(l.created_at, rangeFrom, rangeTo)), [leads, rangeFrom, rangeTo]);
  const filteredProposals = useMemo(() => proposals.filter(p => inRange(p.created_at, rangeFrom, rangeTo)), [proposals, rangeFrom, rangeTo]);
  const filteredContacts = useMemo(() => contacts.filter(c => inRange(c.created_at, rangeFrom, rangeTo)), [contacts, rangeFrom, rangeTo]);
  const filteredVisits = useMemo(() => visits.filter(v => inRange(v.created_at, rangeFrom, rangeTo)), [visits, rangeFrom, rangeTo]);

  // KPIs
  const wonLeads = useMemo(() => filteredLeads.filter(l => l.won_at), [filteredLeads]);
  const vgv = useMemo(() => {
    return filteredProposals
      .filter(p => p.status === "Aprovada")
      .reduce((sum, p) => sum + Number(p.value || 0), 0);
  }, [filteredProposals]);

  const conversionRate = useMemo(() => {
    if (filteredLeads.length === 0) return 0;
    return (wonLeads.length / filteredLeads.length) * 100;
  }, [filteredLeads, wonLeads]);

  const kpis = useMemo(() => [
    { label: "VGV Total", value: fmtCurrency(vgv), icon: TrendingUp },
    { label: "Vendas (Ganhos)", value: String(wonLeads.length), icon: BarChart3 },
    { label: "Novos Leads", value: String(filteredLeads.length), icon: Users },
    { label: "Taxa Conversão", value: `${conversionRate.toFixed(1)}%`, icon: Target },
    { label: "Visitas", value: String(filteredVisits.length), icon: Calendar },
    { label: "Propostas", value: String(filteredProposals.length), icon: FileText },
  ], [vgv, wonLeads, filteredLeads, conversionRate, filteredVisits, filteredProposals]);

  // Monthly chart data (last 6 months)
  const monthlyData = useMemo(() => {
    const months: { name: string; vendas: number; leads: number; propostas: number; vgv: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const mStart = startOfMonth(d);
      const mEnd = i === 0 ? new Date() : startOfMonth(subMonths(new Date(), i - 1));
      const mLabel = format(d, "MMM", { locale: ptBR });
      const mLeads = leads.filter(l => inRange(l.created_at, mStart, mEnd));
      const mWon = mLeads.filter(l => l.won_at);
      const mProposals = proposals.filter(p => inRange(p.created_at, mStart, mEnd));
      const mVgv = mProposals.filter(p => p.status === "Aprovada").reduce((s, p) => s + Number(p.value || 0), 0);
      months.push({ name: mLabel, vendas: mWon.length, leads: mLeads.length, propostas: mProposals.length, vgv: mVgv });
    }
    return months;
  }, [leads, proposals]);

  // Conversion funnel
  const funnelData = useMemo(() => {
    const totalLeads = filteredLeads.length;
    const qualified = filteredLeads.filter(l => l.temperature === "hot" || l.temperature === "warm").length;
    const visitCount = filteredVisits.length;
    const proposalCount = filteredProposals.length;
    const salesCount = wonLeads.length;
    return [
      { name: "Leads", value: totalLeads },
      { name: "Qualificados", value: qualified },
      { name: "Visitas", value: visitCount },
      { name: "Propostas", value: proposalCount },
      { name: "Vendas", value: salesCount },
    ];
  }, [filteredLeads, filteredVisits, filteredProposals, wonLeads]);

  // Broker performance
  const teamPerformance = useMemo(() => {
    return brokers.map(b => {
      const bLeads = filteredLeads.filter(l => l.assigned_broker_id === b.id);
      const bWon = bLeads.filter(l => l.won_at);
      const conv = bLeads.length > 0 ? (bWon.length / bLeads.length) * 100 : 0;
      return { name: b.name, leads: bLeads.length, vendas: bWon.length, conversao: conv };
    }).filter(b => b.leads > 0 || b.vendas > 0).sort((a, b) => b.vendas - a.vendas);
  }, [brokers, filteredLeads]);

  // Contact stats
  const contactStats = useMemo(() => {
    const total = contacts.length;
    const newThisPeriod = filteredContacts.length;
    const active = contacts.filter(c => c.status === "Ativo").length;
    const inactive = contacts.filter(c => c.status === "Inativo").length;
    return { total, newThisPeriod, active, inactive };
  }, [contacts, filteredContacts]);

  // Contact types pie
  const contactTypePie = useMemo(() => {
    const types: Record<string, number> = {};
    contacts.forEach(c => { types[c.type || "Lead"] = (types[c.type || "Lead"] || 0) + 1; });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [contacts]);

  // Goals data
  const currentMonthGoals = useMemo(() => {
    const currentMonth = format(new Date(), "yyyy-MM-01");
    return goals.filter(g => g.month === currentMonth);
  }, [goals]);

  const goalsSummary = useMemo(() => {
    const targetVgv = currentMonthGoals.reduce((s, g) => s + Number(g.target_value || 0), 0);
    const achievedVgv = currentMonthGoals.reduce((s, g) => s + Number(g.achieved_value || 0), 0);
    const targetSales = currentMonthGoals.reduce((s, g) => s + Number(g.sales_count || 0), 0);
    const targetLeads = currentMonthGoals.reduce((s, g) => s + Number(g.leads_count || 0), 0);
    return [
      { title: "VGV", atual: achievedVgv, meta: targetVgv || 1, unit: "", prefix: "" },
      { title: "Vendas (Ganhos)", atual: wonLeads.length, meta: targetSales || 1, unit: "vendas" },
      { title: "Novos Leads", atual: filteredLeads.length, meta: targetLeads || 1, unit: "leads" },
      { title: "Visitas", atual: filteredVisits.length, meta: Math.max(filteredVisits.length, 1), unit: "visitas" },
      { title: "Propostas", atual: filteredProposals.length, meta: Math.max(filteredProposals.length, 1), unit: "propostas" },
      { title: "Conversão", atual: conversionRate, meta: 10, unit: "%" },
    ];
  }, [currentMonthGoals, wonLeads, filteredLeads, filteredVisits, filteredProposals, conversionRate]);

  // Properties stats
  const propertyStats = useMemo(() => {
    const sold = properties.filter(p => p.status === "vendido").length;
    const rented = properties.filter(p => p.status === "alugado").length;
    const active = properties.filter(p => p.status === "ativo").length;
    return { total: properties.length, sold, rented, active };
  }, [properties]);

  const handleExport = (fmt: string) => {
    toast({ title: `Exportando ${fmt.toUpperCase()}`, description: "Relatório será gerado em instantes." });
  };

  const handleAIReport = () => {
    if (!aiPrompt.trim()) { toast({ title: "Digite uma solicitação", variant: "destructive" }); return; }
    setAiLoading(true);
    setTimeout(() => {
      setAiResult(
        `📊 **Análise Gerada**\n\n` +
        `Com base nos dados reais do período selecionado (${periods.find(p => p.value === period)?.label}):\n\n` +
        `• Total de leads no período: ${filteredLeads.length}\n` +
        `• Leads ganhos: ${wonLeads.length}\n` +
        `• VGV aprovado: ${fmtCurrency(vgv)}\n` +
        `• Taxa de conversão: ${conversionRate.toFixed(1)}%\n` +
        `• Visitas realizadas: ${filteredVisits.length}\n` +
        `• Propostas enviadas: ${filteredProposals.length}\n` +
        `• Contatos ativos: ${contactStats.active} de ${contactStats.total}\n` +
        `• Imóveis ativos: ${propertyStats.active} | Vendidos: ${propertyStats.sold} | Alugados: ${propertyStats.rented}\n\n` +
        `Solicitação original: "${aiPrompt}"`
      );
      setAiLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-[350px]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análise de desempenho e métricas</p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
          <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
        </TabsList>

        {/* ── Visão Geral ── */}
        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="shadow-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><BarChart3 size={16} className="text-primary" /> Vendas x Leads (últimos 6 meses)</CardTitle>
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
                    <Pie data={funnelData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {funnelData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
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
                  <YAxis fontSize={12} tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : String(v)} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                  <Area type="monotone" dataKey="vgv" stroke="hsl(270,80%,60%)" fill="hsl(270,80%,60%)" fillOpacity={0.15} name="VGV" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Metas ── */}
        <TabsContent value="metas" className="space-y-4">
          {currentMonthGoals.length === 0 && (
            <Card className="shadow-card border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground">
                <Target size={32} className="mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm">Nenhuma meta cadastrada para o mês atual.</p>
                <p className="text-xs mt-1">Cadastre metas na seção de configurações ou no perfil do corretor.</p>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goalsSummary.map((m) => {
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
                      {m.title === "VGV" ? fmtCurrency(m.atual) : m.atual}{m.unit === "%" ? "%" : ` ${m.unit}`} de {m.title === "VGV" ? fmtCurrency(m.meta) : m.meta}{m.unit === "%" ? "%" : ` ${m.unit}`}
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
            <CardHeader className="pb-2"><CardTitle className="text-sm">Evolução de Vendas (últimos 6 meses)</CardTitle></CardHeader>
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
              {teamPerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum dado de performance disponível no período.</p>
              ) : (
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
                          <td className="text-center"><Badge variant={t.conversao >= 15 ? "default" : "secondary"}>{t.conversao.toFixed(1)}%</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Clientes ── */}
        <TabsContent value="clientes" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Contatos", value: String(contactStats.total) },
              { label: "Novos (período)", value: String(contactStats.newThisPeriod) },
              { label: "Ativos", value: String(contactStats.active) },
              { label: "Inativos", value: String(contactStats.inactive) },
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
            <CardHeader className="pb-2"><CardTitle className="text-sm">Contatos por Tipo</CardTitle></CardHeader>
            <CardContent>
              {contactTypePie.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum contato cadastrado.</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={contactTypePie} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {contactTypePie.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Imóveis ── */}
        <TabsContent value="imoveis" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Imóveis", value: String(propertyStats.total), icon: Building2 },
              { label: "Ativos", value: String(propertyStats.active), icon: Building2 },
              { label: "Vendidos", value: String(propertyStats.sold), icon: TrendingUp },
              { label: "Alugados", value: String(propertyStats.rented), icon: Target },
            ].map((c) => (
              <Card key={c.label} className="shadow-card border-border/50">
                <CardContent className="p-4 text-center">
                  <c.icon size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </CardContent>
              </Card>
            ))}
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
                placeholder="Ex: Analise o desempenho de vendas do último trimestre e sugira ações..."
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
