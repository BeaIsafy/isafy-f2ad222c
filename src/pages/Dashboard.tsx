import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Target,
  UserPlus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { atendimentoLeads } from "@/data/pipelineMockData";
import { toast } from "sonner";

const metrics = [
  { label: "Leads Ativos", value: "127", change: "+12%", up: true, icon: Users },
  { label: "Imóveis", value: "84", change: "+5%", up: true, icon: Building2 },
  { label: "VGV Mensal", value: "R$ 2.4M", change: "+18%", up: true, icon: DollarSign },
  { label: "Conversão", value: "8.2%", change: "-1.3%", up: false, icon: Target },
];

// New leads from atendimento pipeline with IDs
const newLeadsRaw = atendimentoLeads["Novo Lead"] || [];
const newLeads = newLeadsRaw.map((lead) => ({
  id: lead.id,
  name: lead.name,
  neighborhood: lead.neighborhood,
  purpose: lead.purpose,
  temp: lead.temp,
  time: lead.lastInteraction,
  broker: lead.broker,
}));

const tempColors = {
  hot: "bg-hot text-primary-foreground",
  warm: "bg-warning text-primary-foreground",
  cold: "bg-cold text-primary-foreground",
};
const tempLabels = { hot: "Quente", warm: "Morno", cold: "Frio" };

type PipelineType = "captacao" | "atendimento" | "pos-venda" | null;

interface TaskItem {
  id: string;
  title: string;
  time: string;
  done: boolean;
  pipeline: PipelineType;
  description?: string;
  leadName?: string;
}

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Visita - Apt 302 Consolação", time: "10:00", done: false, pipeline: "atendimento", description: "Visita agendada no apartamento 302, Rua da Consolação. Cliente interessado em compra.", leadName: "Lucas Oliveira" },
  { id: "t2", title: "Follow-up Maria Santos", time: "11:30", done: false, pipeline: "captacao", description: "Retornar contato sobre avaliação do imóvel na Vila Madalena.", leadName: "Maria Santos" },
  { id: "t3", title: "Enviar proposta João Oliveira", time: "14:00", done: false, pipeline: "atendimento", description: "Preparar e enviar proposta formal para casa no Morumbi.", leadName: "João Oliveira" },
  { id: "t4", title: "Reunião equipe semanal", time: "16:00", done: true, pipeline: null, description: "Reunião de alinhamento semanal com a equipe de corretores." },
];

const pipelineLabels: Record<string, string> = {
  captacao: "Funil de Captação",
  atendimento: "Funil de Atendimento",
  "pos-venda": "Funil de Pós-venda",
};

/* ---- Sub-components ---- */

function MetricsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m, i) => (
        <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
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
  );
}

function MonthlyGoalCard() {
  return (
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
  );
}

function NewLeadsCard({ navigate }: { navigate: (p: string) => void }) {
  return (
    <Card className="shadow-card border-border/50 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus size={18} className="text-accent" /> Novos Leads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {newLeads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => navigate(`/leads/${lead.id}`)}
            className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {lead.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
              <p className="text-xs text-muted-foreground truncate">{lead.purpose} · {lead.neighborhood}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tempColors[lead.temp]}`}>
                {tempLabels[lead.temp]}
              </span>
              <span className="text-[10px] text-muted-foreground">{lead.time}</span>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full gap-2 text-primary hover:text-primary" onClick={() => navigate("/pipeline")}>
          Ver Funil Completo <ArrowRight size={16} />
        </Button>
      </CardContent>
    </Card>
  );
}

function TodayTasksCard({ tasks, onTaskClick }: { tasks: TaskItem[]; onTaskClick: (t: TaskItem) => void }) {
  return (
    <Card className="shadow-card border-border/50 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar size={18} className="text-info" /> Tarefas de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors cursor-pointer ${task.done ? "opacity-50" : "hover:bg-muted/50"}`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${task.done ? "bg-success/20" : "bg-muted"}`}>
              {task.done ? <CheckCircle2 size={16} className="text-success" /> : <Clock size={14} className="text-muted-foreground" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </p>
              {task.pipeline && (
                <Badge variant="outline" className="mt-0.5 text-[10px] px-1.5 py-0 font-normal text-muted-foreground border-border/50">
                  {pipelineLabels[task.pipeline]}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{task.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TaskDetailDialog({
  task,
  open,
  onClose,
  onComplete,
  onReschedule,
  onCancel,
}: {
  task: TaskItem | null;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onReschedule: () => void;
  onCancel: () => void;
}) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{task.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Horário: <span className="font-semibold">{task.time}</span></span>
          </div>
          {task.pipeline && (
            <div className="flex items-center gap-3">
              <Target size={16} className="text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {pipelineLabels[task.pipeline]}
              </Badge>
            </div>
          )}
          {task.leadName && (
            <div className="flex items-center gap-3">
              <Users size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Contato: <span className="font-semibold">{task.leadName}</span></span>
            </div>
          )}
          {task.description && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {task.done ? (
              <Badge className="bg-success/10 text-success border-success/20">Concluída</Badge>
            ) : (
              <Badge className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>
            )}
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {!task.done && (
            <>
              <Button onClick={onComplete} className="gap-2 w-full sm:w-auto">
                <CheckCircle2 size={16} /> Concluir
              </Button>
              <Button variant="outline" onClick={onReschedule} className="gap-2 w-full sm:w-auto">
                <CalendarClock size={16} /> Reagendar
              </Button>
              <Button variant="outline" onClick={onCancel} className="gap-2 text-destructive hover:text-destructive w-full sm:w-auto">
                <XCircle size={16} /> Cancelar
              </Button>
            </>
          )}
          {task.done && (
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---- Main ---- */

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const handleComplete = () => {
    if (!selectedTask) return;
    setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, done: true } : t)));
    setSelectedTask(null);
    toast.success("Tarefa concluída!");
  };

  const handleReschedule = () => {
    setSelectedTask(null);
    toast.info("Reagendamento em breve — funcionalidade será conectada ao calendário.");
  };

  const handleCancelTask = () => {
    if (!selectedTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
    setSelectedTask(null);
    toast("Tarefa cancelada.");
  };

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

      {isMobile ? (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <TodayTasksCard tasks={tasks} onTaskClick={setSelectedTask} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <NewLeadsCard navigate={navigate} />
          </motion.div>
          <MetricsGrid />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <MonthlyGoalCard />
          </motion.div>
        </div>
      ) : (
        <>
          <MetricsGrid />
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <MonthlyGoalCard />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <NewLeadsCard navigate={navigate} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <TodayTasksCard tasks={tasks} onTaskClick={setSelectedTask} />
            </motion.div>
          </div>
        </>
      )}

      <TaskDetailDialog
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onComplete={handleComplete}
        onReschedule={handleReschedule}
        onCancel={handleCancelTask}
      />
    </div>
  );
};

export default Dashboard;
