import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { LeadKanbanCard, type LeadCard } from "@/components/pipeline/LeadKanbanCard";
import { LostReasonModal } from "@/components/pipeline/LostReasonModal";
import { VisitScheduleModal } from "@/components/pipeline/VisitScheduleModal";
import { NewLeadModal } from "@/components/pipeline/NewLeadModal";
import { NewCaptacaoModal } from "@/components/pipeline/NewCaptacaoModal";
import { NewPosVendaModal } from "@/components/pipeline/NewPosVendaModal";
import { notifyStageChange } from "@/components/pipeline/StageChangeToast";

type PipelineType = "captacao" | "atendimento" | "pos_venda";

const pipelineConfigs: Record<PipelineType, { label: string; stages: string[]; actionLabel: string }> = {
  captacao: {
    label: "Captação",
    stages: ["Novo Proprietário", "Contato Inicial", "Avaliação Agendada", "Avaliação Realizada", "Proposta Captação", "Exclusividade", "Imóvel Captado"],
    actionLabel: "Nova Captação",
  },
  atendimento: {
    label: "Atendimento",
    stages: ["Novo Lead", "Contato Inicial", "Qualificação", "Envio de Imóveis", "Visita Agendada", "Proposta Enviada", "Negociação", "Fechado", "Perdido"],
    actionLabel: "Novo Lead",
  },
  pos_venda: {
    label: "Pós-Vendas",
    stages: ["Contrato Assinado", "Documentação", "Escritura", "Entrega Chaves", "Follow-up 30d", "Avaliação", "Fidelizado"],
    actionLabel: "Novo Pós-Venda",
  },
};

const pipelineOrder: PipelineType[] = ["captacao", "atendimento", "pos_venda"];

const initialLeads: Record<string, LeadCard[]> = {
  "Novo Lead": [
    { id: "1", name: "Carlos Mendes", temp: "warm", purpose: "Compra", minPrice: 400000, maxPrice: 600000, neighborhood: "Moema", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: false },
    { id: "2", name: "Fernanda Lima", temp: "hot", purpose: "Locação", minPrice: 3000, maxPrice: 5000, neighborhood: "Alphaville", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Contato Inicial": [
    { id: "3", name: "Roberto Silva", temp: "cold", purpose: "Compra", minPrice: 250000, maxPrice: 350000, neighborhood: "Vila Olímpia", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Há 3 dias", daysWithoutUpdate: 3, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Qualificação": [
    { id: "4", name: "Patrícia Souza", temp: "hot", purpose: "Compra", minPrice: 1200000, maxPrice: 2000000, neighborhood: "Itaim Bibi", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Há 6 dias", daysWithoutUpdate: 6, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Visita Agendada": [
    { id: "5", name: "Lucas Oliveira", temp: "warm", purpose: "Compra", minPrice: 800000, maxPrice: 1200000, neighborhood: "Jardins", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: true },
  ],
  "Proposta Enviada": [
    { id: "6", name: "Maria Eduarda", temp: "hot", purpose: "Locação", minPrice: 4000, maxPrice: 6000, neighborhood: "Pinheiros", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: false, hasActiveProposal: true },
  ],
};

const Pipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as PipelineType | null;
  const [activeType, setActiveType] = useState<PipelineType>(
    typeParam && pipelineOrder.includes(typeParam) ? typeParam : "atendimento"
  );
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Record<string, LeadCard[]>>(initialLeads);
  const navigate = useNavigate();
  const config = pipelineConfigs[activeType];

  // Modal state
  const [lostModal, setLostModal] = useState<{ open: boolean; leadId: string; leadName: string; sourceStage: string; sourceIndex: number } | null>(null);
  const [visitModal, setVisitModal] = useState<{ open: boolean; leadId: string; leadName: string; destStage: string } | null>(null);
  const [pendingMove, setPendingMove] = useState<{ lead: LeadCard; sourceStage: string; destStage: string; sourceIndex: number; destIndex: number } | null>(null);

  // Creation modals
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newCaptacaoOpen, setNewCaptacaoOpen] = useState(false);
  const [newPosVendaOpen, setNewPosVendaOpen] = useState(false);

  const switchType = (type: PipelineType) => {
    setActiveType(type);
    setSearchParams({ type });
  };

  const moveLead = useCallback((sourceStage: string, destStage: string, sourceIndex: number, destIndex: number) => {
    setLeads((prev) => {
      const next = { ...prev };
      const sourceList = [...(next[sourceStage] || [])];
      const destList = sourceStage === destStage ? sourceList : [...(next[destStage] || [])];
      const [moved] = sourceList.splice(sourceIndex, 1);
      if (!moved) return prev;
      destList.splice(destIndex, 0, moved);
      next[sourceStage] = sourceList;
      if (sourceStage !== destStage) next[destStage] = destList;
      return next;
    });
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    const lead = leads[sourceStage]?.[source.index];
    if (!lead) return;

    if (destStage === "Perdido" && sourceStage !== "Perdido") {
      setPendingMove({ lead, sourceStage, destStage, sourceIndex: source.index, destIndex: destination.index });
      setLostModal({ open: true, leadId: lead.id, leadName: lead.name, sourceStage, sourceIndex: source.index });
      return;
    }

    if (destStage === "Visita Agendada" && sourceStage !== "Visita Agendada") {
      moveLead(sourceStage, destStage, source.index, destination.index);
      setVisitModal({ open: true, leadId: lead.id, leadName: lead.name, destStage });
      return;
    }

    moveLead(sourceStage, destStage, source.index, destination.index);
    if (sourceStage !== destStage) notifyStageChange(lead.name, destStage);
  }, [leads, moveLead]);

  const handleLostConfirm = (reason: string, notes: string) => {
    if (pendingMove) {
      moveLead(pendingMove.sourceStage, pendingMove.destStage, pendingMove.sourceIndex, pendingMove.destIndex);
      notifyStageChange(pendingMove.lead.name, "Perdido");
    }
    setLostModal(null);
    setPendingMove(null);
  };

  const handleLostCancel = () => { setLostModal(null); setPendingMove(null); };

  const handleVisitConfirm = (data: { date: string; time: string; notes: string }) => {
    if (visitModal) notifyStageChange(visitModal.leadName, "Visita Agendada");
    setVisitModal(null);
  };

  const handleVisitCancel = () => setVisitModal(null);

  const openCreateModal = () => {
    if (activeType === "captacao") setNewCaptacaoOpen(true);
    else if (activeType === "atendimento") setNewLeadOpen(true);
    else setNewPosVendaOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu funil de negócios</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={openCreateModal}>
          <Plus size={16} /> {config.actionLabel}
        </Button>
      </div>

      {/* Pipeline tabs - order: Captação, Atendimento, Pós-Vendas */}
      <div className="flex gap-2">
        {pipelineOrder.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeType === type
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {pipelineConfigs[type].label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar no pipeline..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: config.stages.length * 290 }}>
            {config.stages.map((stage, i) => {
              const cards = (activeType === "atendimento" ? leads[stage] : undefined) || [];
              const filtered = cards.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
              return (
                <motion.div key={stage} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="w-[280px] shrink-0">
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "rounded-xl border border-border/50 bg-card p-3 transition-colors min-h-[120px]",
                          snapshot.isDraggingOver && "border-primary/40 bg-primary/5"
                        )}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                            {filtered.length}
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {filtered.map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(dragProvided, dragSnapshot) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className={cn("transition-shadow", dragSnapshot.isDragging && "shadow-lg ring-2 ring-primary/30 rounded-lg")}
                                >
                                  <LeadKanbanCard lead={lead} onClick={() => navigate(`/leads/${lead.id}`)} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* Modals */}
      {lostModal && <LostReasonModal open={lostModal.open} leadName={lostModal.leadName} onConfirm={handleLostConfirm} onCancel={handleLostCancel} />}
      {visitModal && <VisitScheduleModal open={visitModal.open} leadName={visitModal.leadName} onConfirm={handleVisitConfirm} onCancel={handleVisitCancel} />}
      <NewLeadModal open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onConfirm={(d) => console.log("Novo lead:", d)} />
      <NewCaptacaoModal open={newCaptacaoOpen} onClose={() => setNewCaptacaoOpen(false)} onConfirm={(d) => console.log("Nova captação:", d)} />
      <NewPosVendaModal open={newPosVendaOpen} onClose={() => setNewPosVendaOpen(false)} onConfirm={(d) => console.log("Novo pós-venda:", d)} />
    </div>
  );
};

export default Pipeline;
