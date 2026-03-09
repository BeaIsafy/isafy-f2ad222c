import { motion } from "framer-motion";
import { Plus, Search, Pencil, Check, X, Filter, DollarSign, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { LeadKanbanCard, type LeadCard } from "@/components/pipeline/LeadKanbanCard";
import { LostReasonModal } from "@/components/pipeline/LostReasonModal";
import { VisitScheduleModal } from "@/components/pipeline/VisitScheduleModal";
import { NewLeadModal } from "@/components/pipeline/NewLeadModal";
import { NewCaptacaoModal } from "@/components/pipeline/NewCaptacaoModal";
import { NewPosVendaModal } from "@/components/pipeline/NewPosVendaModal";
import { CreateTaskModal } from "@/components/pipeline/CreateTaskModal";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { notifyStageChange } from "@/components/pipeline/StageChangeToast";
import { usePipelineLeads, usePipelineStages, useCreatePipelineLead, useUpdatePipelineLead } from "@/hooks/useSupabaseData";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";

type DbPipelineType = Database["public"]["Enums"]["pipeline_type"];

// UI keys map to DB enum values
const uiToDbPipeline: Record<string, DbPipelineType> = {
  captacao: "captacao",
  atendimento: "atendimento",
  "pos-venda": "pos-venda",
};

const pipelineKeys = ["captacao", "atendimento", "pos-venda"] as const;
type PipelineKey = typeof pipelineKeys[number];

const pipelineLabels: Record<PipelineKey, { label: string; actionLabel: string }> = {
  captacao: { label: "Captação", actionLabel: "Nova Captação" },
  atendimento: { label: "Atendimento", actionLabel: "Novo Lead" },
  "pos-venda": { label: "Pós-Vendas", actionLabel: "Novo Pós-Venda" },
};

function getDaysWithoutUpdate(lastInteraction: string | null): number {
  if (!lastInteraction) return 0;
  const diff = Date.now() - new Date(lastInteraction).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatLastInteraction(lastInteraction: string | null): string {
  if (!lastInteraction) return "—";
  try {
    return formatDistanceToNow(new Date(lastInteraction), { addSuffix: true, locale: ptBR });
  } catch {
    return "—";
  }
}

function dbLeadToCard(lead: any): LeadCard {
  const brokerName = lead.assigned_broker?.name || "—";
  const brokerInitials = lead.assigned_broker?.initials || brokerName.slice(0, 2).toUpperCase();
  return {
    id: lead.id,
    name: lead.name,
    temp: lead.temperature || "warm",
    purpose: lead.purpose || "Compra",
    minPrice: Number(lead.min_price) || 0,
    maxPrice: Number(lead.max_price) || 0,
    neighborhood: lead.neighborhood || "—",
    broker: brokerName,
    brokerInitials,
    lastInteraction: formatLastInteraction(lead.last_interaction),
    daysWithoutUpdate: getDaysWithoutUpdate(lead.last_interaction),
    hasPendingTask: lead.has_pending_task || false,
    hasActiveProposal: lead.has_active_proposal || false,
  };
}

const Pipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as PipelineKey | null;
  const [activeType, setActiveType] = useState<PipelineKey>(
    typeParam && pipelineKeys.includes(typeParam as PipelineKey) ? typeParam as PipelineKey : "atendimento"
  );
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Supabase data
  const dbPipeline = uiToDbPipeline[activeType];
  const { data: dbStages = [], isLoading: stagesLoading } = usePipelineStages(dbPipeline);
  const { data: dbLeads = [], isLoading: leadsLoading } = usePipelineLeads(dbPipeline);
  const updateLead = useUpdatePipelineLead();
  const createLead = useCreatePipelineLead();

  // Derive stage names from DB
  const stages = useMemo(() => dbStages.map(s => s.name), [dbStages]);

  // Map DB leads into a Record<stageName, LeadCard[]>
  const currentLeads = useMemo(() => {
    const map: Record<string, LeadCard[]> = {};
    for (const s of stages) map[s] = [];
    for (const lead of dbLeads) {
      const stageName = lead.stage_name || stages[0] || "Sem Etapa";
      if (!map[stageName]) map[stageName] = [];
      map[stageName].push(dbLeadToCard(lead));
    }
    return map;
  }, [dbLeads, stages]);

  // Editing stage names
  const [editingStageIdx, setEditingStageIdx] = useState<number | null>(null);
  const [editingStageName, setEditingStageName] = useState("");

  // Modal state
  const [lostModal, setLostModal] = useState<{ open: boolean; leadId: string; leadName: string; sourceStage: string } | null>(null);
  const [visitModal, setVisitModal] = useState<{ open: boolean; leadId: string; leadName: string; destStage: string } | null>(null);
  const [pendingMove, setPendingMove] = useState<{ leadId: string; destStage: string } | null>(null);

  // Creation modals
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newCaptacaoOpen, setNewCaptacaoOpen] = useState(false);
  const [newPosVendaOpen, setNewPosVendaOpen] = useState(false);

  // Card action modals
  const [taskModal, setTaskModal] = useState<{ open: boolean; leadName: string } | null>(null);
  const [proposalModal, setProposalModal] = useState<{ open: boolean; leadName: string } | null>(null);
  const [cardVisitModal, setCardVisitModal] = useState<{ open: boolean; leadId: string; leadName: string } | null>(null);

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterNeighborhood, setFilterNeighborhood] = useState("");

  const switchType = (type: PipelineKey) => {
    setActiveType(type);
    setSearchParams({ type });
    setEditingStageIdx(null);
  };

  const executeMove = async (leadId: string, destStage: string) => {
    try {
      await updateLead.mutateAsync({ id: leadId, stage_name: destStage, last_interaction: new Date().toISOString() });
    } catch (e: any) {
      toast.error("Erro ao mover lead: " + e.message);
    }
  };

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    const lead = currentLeads[sourceStage]?.[source.index];
    if (!lead) return;

    const perdidoStage = stages.find(s => s.toLowerCase().includes("perdido"));
    const visitaStage = stages.find(s => s.toLowerCase().includes("visita"));
    const fechadoStage = stages.find(s => s.toLowerCase().includes("fechado"));

    // "Perdido" requires reason
    if (perdidoStage && destStage === perdidoStage && sourceStage !== perdidoStage) {
      setPendingMove({ leadId: lead.id, destStage });
      setLostModal({ open: true, leadId: lead.id, leadName: lead.name, sourceStage });
      return;
    }

    // "Visita" shows schedule modal
    if (visitaStage && destStage === visitaStage && sourceStage !== visitaStage) {
      executeMove(lead.id, destStage);
      setVisitModal({ open: true, leadId: lead.id, leadName: lead.name, destStage });
      return;
    }

    // "Fechado" in Atendimento → auto-create Pós-Venda lead
    if (activeType === "atendimento" && fechadoStage && destStage === fechadoStage && sourceStage !== fechadoStage) {
      executeMove(lead.id, destStage);
      notifyStageChange(lead.name, destStage);
      // Auto-create in pos-venda pipeline
      createLead.mutate({
        pipeline: "pos-venda",
        stage_name: "Contrato Assinado",
        name: lead.name,
        temperature: lead.temp,
        purpose: lead.purpose,
        min_price: lead.minPrice,
        max_price: lead.maxPrice,
        neighborhood: lead.neighborhood,
      });
      notifyStageChange(lead.name, "Pós-Venda (automático)");
      return;
    }

    executeMove(lead.id, destStage);
    if (sourceStage !== destStage) notifyStageChange(lead.name, destStage);
  }, [currentLeads, stages, activeType, executeMove, createLead]);

  const handleLostConfirm = (reason: string, notes: string) => {
    if (pendingMove) {
      updateLead.mutate({
        id: pendingMove.leadId,
        stage_name: pendingMove.destStage,
        lost_reason: reason,
        lost_at: new Date().toISOString(),
        last_interaction: new Date().toISOString(),
      });
      notifyStageChange("Lead", "Perdido");
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

  const handleNewLead = (data: Record<string, string>) => {
    const firstStage = stages[0] || "Novo Lead";
    createLead.mutate({
      pipeline: dbPipeline,
      stage_name: firstStage,
      name: data.name,
      purpose: (data.purpose as "Compra" | "Locação" | "Temporada") || undefined,
      min_price: data.minPrice ? Number(data.minPrice) : undefined,
      max_price: data.maxPrice ? Number(data.maxPrice) : undefined,
      neighborhood: data.neighborhood || undefined,
    });
    toast.success("Lead criado com sucesso!");
  };

  const handleNewCaptacao = (data: Record<string, string>) => {
    const firstStage = stages[0] || "Novo Proprietário";
    createLead.mutate({
      pipeline: "captacao",
      stage_name: firstStage,
      name: data.name || data.ownerName || "Nova Captação",
      neighborhood: data.neighborhood || undefined,
    });
    toast.success("Captação criada com sucesso!");
  };

  const handleNewPosVenda = (data: Record<string, string>) => {
    const firstStage = stages[0] || "Contrato Assinado";
    createLead.mutate({
      pipeline: "pos-venda",
      stage_name: firstStage,
      name: data.name || data.clientName || "Novo Pós-Venda",
    });
    toast.success("Pós-venda criado com sucesso!");
  };

  // Card action handlers
  const handleCardWhatsApp = (lead: LeadCard) => {
    window.open(`https://wa.me/5511999999999`, "_blank");
  };

  const handleCardTask = (lead: LeadCard) => {
    setTaskModal({ open: true, leadName: lead.name });
  };

  const handleCardProposal = (lead: LeadCard) => {
    if (activeType === "captacao") return;
    setProposalModal({ open: true, leadName: lead.name });
  };

  const handleCardVisit = (lead: LeadCard) => {
    setCardVisitModal({ open: true, leadId: lead.id, leadName: lead.name });
  };

  // Filtering
  const filterCards = (cards: LeadCard[]) => {
    const q = search.toLowerCase();
    return cards.filter((c) => {
      const matchesText = !q || c.name.toLowerCase().includes(q) || c.neighborhood.toLowerCase().includes(q) || c.purpose.toLowerCase().includes(q);
      if (!matchesText) return false;
      if (filterMinPrice && c.maxPrice < Number(filterMinPrice)) return false;
      if (filterMaxPrice && c.minPrice > Number(filterMaxPrice)) return false;
      if (filterNeighborhood && !c.neighborhood.toLowerCase().includes(filterNeighborhood.toLowerCase())) return false;
      return true;
    });
  };

  const isLoading = stagesLoading || leadsLoading;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu funil de negócios</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={openCreateModal}>
          <Plus size={16} /> {pipelineLabels[activeType].actionLabel}
        </Button>
      </div>

      {/* Pipeline tabs */}
      <div className="flex gap-2">
        {pipelineKeys.map((type) => (
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
            {pipelineLabels[type].label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar cliente, imóvel, endereço..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className={cn(showFilters && "border-primary text-primary")}>
            <Filter size={16} />
          </Button>
        </div>
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-muted-foreground" />
              <Input placeholder="Preço mín." className="h-8 w-28 text-xs" type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(e.target.value)} />
              <span className="text-xs text-muted-foreground">–</span>
              <Input placeholder="Preço máx." className="h-8 w-28 text-xs" type="number" value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-muted-foreground" />
              <Input placeholder="Bairro" className="h-8 w-32 text-xs" value={filterNeighborhood} onChange={(e) => setFilterNeighborhood(e.target.value)} />
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setFilterMinPrice(""); setFilterMaxPrice(""); setFilterNeighborhood(""); }}>Limpar</Button>
          </div>
        )}
      </div>

      {/* Kanban */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : stages.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Nenhuma etapa configurada para este pipeline.</p>
          <p className="text-sm">Complete o onboarding para criar as etapas padrão.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: stages.length * 290 }}>
              {stages.map((stage, i) => {
                const cards = currentLeads[stage] || [];
                const filtered = filterCards(cards);
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
                          <div className="mb-3 flex items-center justify-between gap-1">
                            <h3 className="text-sm font-semibold text-foreground truncate">{stage}</h3>
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
                                    <LeadKanbanCard
                                      lead={lead}
                                      onClick={() => {
                                        const basePath = activeType === "captacao" ? "/captacao" : activeType === "pos-venda" ? "/pos-venda" : "/leads";
                                        navigate(`${basePath}/${lead.id}`);
                                      }}
                                      onWhatsApp={() => handleCardWhatsApp(lead)}
                                      onCreateTask={() => handleCardTask(lead)}
                                      onCreateProposal={activeType !== "captacao" ? () => handleCardProposal(lead) : undefined}
                                      onScheduleVisit={() => handleCardVisit(lead)}
                                      hideProposal={activeType === "captacao"}
                                    />
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
      )}

      {/* Modals */}
      {lostModal && <LostReasonModal open={lostModal.open} leadName={lostModal.leadName} onConfirm={handleLostConfirm} onCancel={handleLostCancel} />}
      {visitModal && <VisitScheduleModal open={visitModal.open} leadName={visitModal.leadName} onConfirm={handleVisitConfirm} onCancel={handleVisitCancel} />}
      {cardVisitModal && <VisitScheduleModal open={cardVisitModal.open} leadName={cardVisitModal.leadName} onConfirm={(d) => { toast.success("Visita agendada!"); setCardVisitModal(null); }} onCancel={() => setCardVisitModal(null)} />}
      <NewLeadModal open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onConfirm={handleNewLead} />
      <NewCaptacaoModal open={newCaptacaoOpen} onClose={() => setNewCaptacaoOpen(false)} onConfirm={handleNewCaptacao} />
      <NewPosVendaModal open={newPosVendaOpen} onClose={() => setNewPosVendaOpen(false)} onConfirm={handleNewPosVenda} />
      {taskModal && <CreateTaskModal open={taskModal.open} onClose={() => setTaskModal(null)} leadName={taskModal.leadName} />}
      {proposalModal && <CreateProposalModal open={proposalModal.open} onClose={() => setProposalModal(null)} leadName={proposalModal.leadName} />}
    </div>
  );
};

export default Pipeline;
