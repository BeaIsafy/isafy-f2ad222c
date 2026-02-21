import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const metrics = [
  { label: "Leads Ativos", value: "127", change: "+12%", up: true, icon: Users },
  { label: "Imóveis", value: "84", change: "+5%", up: true, icon: Building2 },
  { label: "VGV Mensal", value: "R$ 2.4M", change: "+18%", up: true, icon: DollarSign },
  { label: "Conversão", value: "8.2%", change: "-1.3%", up: false, icon: Target },
];

const hotLeads = [
  { name: "Maria Santos", interest: "Apt 3 quartos - Vila Mariana", temp: "hot" as const, time: "2h" },
  { name: "João Oliveira", interest: "Casa 4 quartos - Morumbi", temp: "warm" as const, time: "5h" },
  { name: "Ana Costa", interest: "Studio - Pinheiros", temp: "hot" as const, time: "1h" },
];

const tasks = [
  { title: "Visita - Apt 302 Consolação", time: "10:00", done: false },
  { title: "Follow-up Maria Santos", time: "11:30", done: false },
  { title: "Enviar proposta João Oliveira", time: "14:00", done: false },
  { title: "Reunião equipe semanal", time: "16:00", done: true },
];

const tempColors = {
  hot: "bg-hot text-primary-foreground",
  warm: "bg-warning text-primary-foreground",
  cold: "bg-cold text-primary-foreground",
};

const tempLabels = { hot: "Quente", warm: "Morno", cold: "Frio" };

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral do seu desempenho</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="shadow-card shadow-card-hover transition-all duration-300 border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary">
                  <m.icon size={22} className="text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${m.up ? "text-success" : "text-destructive"}`}>
                  {m.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {m.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meta mensal */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target size={18} className="text-primary" /> Meta Mensal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-gradient">R$ 1.8M</p>
                <p className="text-sm text-muted-foreground">de R$ 3.0M</p>
              </div>
              <Progress value={60} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">60% da meta atingida</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-lg font-bold text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">Vendas</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-lg font-bold text-foreground">R$ 95K</p>
                  <p className="text-xs text-muted-foreground">Comissões</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads quentes */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Flame size={18} className="text-accent" /> Leads Quentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotLeads.map((lead) => (
                <div
                  key={lead.name}
                  className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{lead.interest}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tempColors[lead.temp]}`}>
                      {tempLabels[lead.temp]}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{lead.time} atrás</span>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full gap-2 text-primary hover:text-primary"
                onClick={() => navigate("/pipeline")}
              >
                Ver Funil Completo <ArrowRight size={16} />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarefas */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow-card border-border/50 h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar size={18} className="text-info" /> Tarefas de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors ${task.done ? "opacity-50" : "hover:bg-muted/50"}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${task.done ? "bg-success/20" : "bg-muted"}`}>
                    {task.done ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : (
                      <Clock size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
