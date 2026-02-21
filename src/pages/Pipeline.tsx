import { motion } from "framer-motion";
import { Plus, Search, GripVertical, Flame, Thermometer, Snowflake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type PipelineType = "atendimento" | "captacao" | "pos_venda";

const pipelineConfigs: Record<PipelineType, { label: string; stages: string[] }> = {
  atendimento: {
    label: "Atendimento",
    stages: ["Novo Lead", "Contato Inicial", "Qualificação", "Visita Agendada", "Proposta Enviada", "Negociação", "Fechado"],
  },
  captacao: {
    label: "Captação",
    stages: ["Novo Proprietário", "Contato Inicial", "Avaliação Agendada", "Avaliação Realizada", "Proposta Captação", "Exclusividade", "Imóvel Captado"],
  },
  pos_venda: {
    label: "Pós-Vendas",
    stages: ["Contrato Assinado", "Documentação", "Escritura", "Entrega Chaves", "Follow-up 30d", "Avaliação", "Fidelizado"],
  },
};

const mockCards: Record<string, { name: string; detail: string; temp: "hot" | "warm" | "cold" }[]> = {
  "Novo Lead": [
    { name: "Carlos Mendes", detail: "Apt 2q - Moema", temp: "warm" },
    { name: "Fernanda Lima", detail: "Casa 3q - Alphaville", temp: "hot" },
  ],
  "Contato Inicial": [{ name: "Roberto Silva", detail: "Studio - Vila Olímpia", temp: "cold" }],
  "Qualificação": [{ name: "Patrícia Souza", detail: "Cobertura - Itaim", temp: "hot" }],
  "Visita Agendada": [{ name: "Lucas Oliveira", detail: "Apt 4q - Jardins", temp: "warm" }],
};

const tempIcon = { hot: Flame, warm: Thermometer, cold: Snowflake };
const tempColor = {
  hot: "text-hot bg-hot/10",
  warm: "text-warning bg-warning/10",
  cold: "text-cold bg-cold/10",
};

const Pipeline = () => {
  const [activeType, setActiveType] = useState<PipelineType>("atendimento");
  const config = pipelineConfigs[activeType];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu funil de negócios</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2">
          <Plus size={16} /> Novo Card
        </Button>
      </div>

      {/* Pipeline tabs */}
      <div className="flex gap-2">
        {(Object.keys(pipelineConfigs) as PipelineType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeType === type
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {pipelineConfigs[type].label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar no pipeline..." className="pl-9" />
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: config.stages.length * 280 }}>
          {config.stages.map((stage, i) => {
            const cards = mockCards[stage] || [];
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-[270px] shrink-0"
              >
                <div className="rounded-xl border border-border/50 bg-card p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                      {cards.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {cards.map((card) => {
                      const TempIcon = tempIcon[card.temp];
                      return (
                        <div
                          key={card.name}
                          className="group cursor-grab rounded-lg border border-border/40 bg-background p-3 shadow-card transition-all hover:shadow-card-hover active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <GripVertical size={14} className="mt-0.5 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">{card.name}</p>
                              <p className="text-xs text-muted-foreground">{card.detail}</p>
                            </div>
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${tempColor[card.temp]}`}>
                              <TempIcon size={12} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
