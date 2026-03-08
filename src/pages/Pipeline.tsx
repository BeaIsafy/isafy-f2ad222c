import { motion } from "framer-motion";
import { Plus, Search, Pencil, Check, X, Filter, BedDouble, DollarSign, MapPin } from "lucide-react";
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
import { CreateTaskModal } from "@/components/pipeline/CreateTaskModal";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { notifyStageChange } from "@/components/pipeline/StageChangeToast";
import { atendimentoLeads, captacaoLeads, posVendaLeads } from "@/data/pipelineMockData";
import { toast } from "sonner";

type PipelineType = "captacao" | "atendimento" | "pos_venda";

const defaultStages: Record<PipelineType, string[]> = {
  captacao: ["Novo Proprietário", "Contato Inicial", "Avaliação Agendada", "Avaliação Realizada", "Proposta Captação", "Exclusividade", "Imóvel Captado"],
  atendimento: ["Novo Lead", "Contato Inicial", "Qualificação", "Envio de Imóveis", "Visita Agendada", "Proposta Enviada", "Negociação", "Fechado", "Perdido"],
  pos_venda: ["Contrato Assinado", "Documentação", "Escritura", "Entrega Chaves", "Follow-up 30d", "Avaliação", "Fidelizado"],
};

const pipelineLabels: Record<PipelineType, { label: string; actionLabel: string }> = {
  captacao: { label: "Captação", actionLabel: "Nova Captação" },
  atendimento: { label: "Atendimento", actionLabel: "Novo Lead" },
  pos_venda: { label: "Pós-Vendas", actionLabel: "Novo Pós-Venda" },
};

const pipelineOrder: PipelineType[] = ["captacao", "atendimento", "pos_venda"];

const initialLeads: Record<PipelineType, Record<string, LeadCard[]>> = {
  atendimento: atendimentoLeads,
  captacao: captacaoLeads,
  pos_venda: posVendaLeads,
};

const Pipeline = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as PipelineType | null;
  const [activeType, setActiveType] = useState<PipelineType>(
    typeParam && pipelineOrder.includes(typeParam) ? typeParam : "atendimento"
  );
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Record<PipelineType, Record<string, LeadCard[]>>>(initialLeads);
  const [stageNames, setStageNames] = useState<Record<PipelineType, string[]>>({ ...defaultStages });
  const navigate = useNavigate();

  // Editing stage names
  const [editingStageIdx, setEditingStageIdx] = useState<number | null>(null);
  const [editingStageName, setEditingStageName] = useState("");

  // Modal state
  const [lostModal, setLostModal] = useState<{ open: boolean; leadId: string; leadName: string; sourceStage: string; sourceIndex: number } | null>(null);
  const [visitModal, setVisitModal] = useState<{ open: boolean; leadId: string; leadName: string; destStage: string } | null>(null);
  const [pendingMove, setPendingMove] = useState<{ lead: LeadCard; sourceStage: string; destStage: string; sourceIndex: number; destIndex: number } | null>(null);

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
  const [filterBedrooms, setFilterBedrooms] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterNeighborhood, setFilterNeighborhood] = useState("");

  const stages = stageNames[activeType];

  const switchType = (type: PipelineType) => {
    setActiveType(type);
    setSearchParams({ type });
    setEditingStageIdx(null);
  };

  const currentLeads = leads[activeType];

  const startEditStage = (idx: number) => {
    setEditingStageIdx(idx);
    setEditingStageName(stages[idx]);
  };

  const saveStageEdit = () => {
    if (editingStageIdx === null || !editingStageName.trim()) return;
    const oldName = stages[editingStageIdx];
    const newName = editingStageName.trim();
    if (oldName === newName) { setEditingStageIdx(null); return; }
    // Update stage names
    setStageNames((prev) => {
      const next = { ...prev };
      const arr = [...next[activeType]];
      arr[editingStageIdx] = newName;
      next[activeType] = arr;
      return next;
    });
    // Update leads keys
    setLeads((prev) => {
      const next = { ...prev };
      const pipelineData = { ...next[activeType] };
      if (pipelineData[oldName]) {
        pipelineData[newName] = pipelineData[oldName];
        delete pipelineData[oldName];
      }
      next[activeType] = pipelineData;
      return next;
    });
    setEditingStageIdx(null);
    toast.success(`Etapa renomeada para "${newName}"`);
  };

  const moveLead = useCallback((sourceStage: string, destStage: string, sourceIndex: number, destIndex: number) => {
    setLeads((prev) => {
      const next = { ...prev };
      const pipelineData = { ...next[activeType] };
      const sourceList = [...(pipelineData[sourceStage] || [])];
      const destList = sourceStage === destStage ? sourceList : [...(pipelineData[destStage] || [])];
      const [moved] = sourceList.splice(sourceIndex, 1);
      if (!moved) return prev;
      destList.splice(destIndex, 0, moved);
      pipelineData[sourceStage] = sourceList;
      if (sourceStage !== destStage) pipelineData[destStage] = destList;
      next[activeType] = pipelineData;
      return next;
    });
  }, [activeType]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;
    const lead = currentLeads[sourceStage]?.[source.index];
    if (!lead) return;

    // Check for "Perdido" (could be renamed)
    const perdidoStage = stages.find(s => s.toLowerCase().includes("perdido")) || "Perdido";
    const visitaStage = stages.find(s => s.toLowerCase().includes("visita")) || "Visita Agendada";
    const fechadoStage = stages.find(s => s.toLowerCase().includes("fechado")) || "Fechado";

    if (destStage === perdidoStage && sourceStage !== perdidoStage) {
      setPendingMove({ lead, sourceStage, destStage, sourceIndex: source.index, destIndex: destination.index });
      setLostModal({ open: true, leadId: lead.id, leadName: lead.name, sourceStage, sourceIndex: source.index });
      return;
    }

    if (destStage === visitaStage && sourceStage !== visitaStage) {
      moveLead(sourceStage, destStage, source.index, destination.index);
      setVisitModal({ open: true, leadId: lead.id, leadName: lead.name, destStage });
      return;
    }

    // Auto-transition: Fechado in Atendimento → create in Pós-Venda
    if (activeType === "atendimento" && destStage === fechadoStage && sourceStage !== fechadoStage) {
      moveLead(sourceStage, destStage, source.index, destination.index);
      notifyStageChange(lead.name, destStage);
      const pvFirstStage = stageNames.pos_venda[0];
      const newPosVendaLead: LeadCard = {
        ...lead,
        id: `pv-${lead.id}-${Date.now()}`,
        lastInteraction: "Agora",
        daysWithoutUpdate: 0,
        hasPendingTask: true,
        hasActiveProposal: false,
      };
      setLeads(prev => {
        const next = { ...prev };
        const pvData = { ...next.pos_venda };
        pvData[pvFirstStage] = [...(pvData[pvFirstStage] || []), newPosVendaLead];
        next.pos_venda = pvData;
        return next;
      });
      notifyStageChange(lead.name, "Pós-Venda (automático)");
      return;
    }

    // Pós-Venda: last stage = conclude
    const pvLastStage = stageNames.pos_venda[stageNames.pos_venda.length - 1];
    if (activeType === "pos_venda" && destStage === pvLastStage && sourceStage !== pvLastStage) {
      moveLead(sourceStage, destStage, source.index, destination.index);
      notifyStageChange(lead.name, `${destStage} — Processo concluído!`);
      return;
    }

    moveLead(sourceStage, destStage, source.index, destination.index);
    if (sourceStage !== destStage) notifyStageChange(lead.name, destStage);
  }, [currentLeads, moveLead, activeType, stages, stageNames]);

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

  // Card action handlers
  const handleCardWhatsApp = (lead: LeadCard) => {
    const phone = "5511999999999"; // mock
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const handleCardTask = (lead: LeadCard) => {
    setTaskModal({ open: true, leadName: lead.name });
  };

  const handleCardProposal = (lead: LeadCard) => {
    if (activeType === "captacao") return; // No proposals in captação pipeline
    setProposalModal({ open: true, leadName: lead.name });
  };

  const handleCardVisit = (lead: LeadCard) => {
    setCardVisitModal({ open: true, leadId: lead.id, leadName: lead.name });
  };

  // Filtering
  const filterCards = (cards: LeadCard[]) => {
    const q = search.toLowerCase();
    return cards.filter((c) => {
      // Text search
      const matchesText = !q || c.name.toLowerCase().includes(q) || c.neighborhood.toLowerCase().includes(q) || c.purpose.toLowerCase().includes(q) || `${c.minPrice} ${c.maxPrice}`.includes(q);
      if (!matchesText) return false;
      // Advanced filters
      if (filterBedrooms && c.minPrice) { /* bedrooms not on card type, skip */ }
      if (filterMinPrice && c.maxPrice < Number(filterMinPrice)) return false;
      if (filterMaxPrice && c.minPrice > Number(filterMaxPrice)) return false;
      if (filterNeighborhood && !c.neighborhood.toLowerCase().includes(filterNeighborhood.toLowerCase())) return false;
      return true;
    });
  };

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
                          {editingStageIdx === i ? (
                            <div className="flex items-center gap-1 flex-1">
                              <Input
                                value={editingStageName}
                                onChange={(e) => setEditingStageName(e.target.value)}
                                className="h-7 text-xs"
                                onKeyDown={(e) => { if (e.key === "Enter") saveStageEdit(); if (e.key === "Escape") setEditingStageIdx(null); }}
                                autoFocus
                              />
                              <button onClick={saveStageEdit} className="p-1 text-success hover:bg-success/10 rounded"><Check size={12} /></button>
                              <button onClick={() => setEditingStageIdx(null)} className="p-1 text-muted-foreground hover:bg-muted rounded"><X size={12} /></button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-sm font-semibold text-foreground truncate">{stage}</h3>
                              <div className="flex items-center gap-1">
                                <button onClick={() => startEditStage(i)} className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-all" title="Editar nome">
                                  <Pencil size={10} />
                                </button>
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                                  {filtered.length}
                                </span>
                              </div>
                            </>
                          )}
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
                                      const basePath = activeType === "captacao" ? "/captacao" : activeType === "pos_venda" ? "/pos-venda" : "/leads";
                                      navigate(`${basePath}/${lead.id}`);
                                    }}
                                    onWhatsApp={() => handleCardWhatsApp(lead)}
                                    onCreateTask={() => handleCardTask(lead)}
                                    onCreateProposal={() => handleCardProposal(lead)}
                                    onScheduleVisit={() => handleCardVisit(lead)}
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

      {/* Modals */}
      {lostModal && <LostReasonModal open={lostModal.open} leadName={lostModal.leadName} onConfirm={handleLostConfirm} onCancel={handleLostCancel} />}
      {visitModal && <VisitScheduleModal open={visitModal.open} leadName={visitModal.leadName} onConfirm={handleVisitConfirm} onCancel={handleVisitCancel} />}
      {cardVisitModal && <VisitScheduleModal open={cardVisitModal.open} leadName={cardVisitModal.leadName} onConfirm={(d) => { toast.success("Visita agendada!"); setCardVisitModal(null); }} onCancel={() => setCardVisitModal(null)} />}
      <NewLeadModal open={newLeadOpen} onClose={() => setNewLeadOpen(false)} onConfirm={(d) => console.log("Novo lead:", d)} />
      <NewCaptacaoModal open={newCaptacaoOpen} onClose={() => setNewCaptacaoOpen(false)} onConfirm={(d) => console.log("Nova captação:", d)} />
      <NewPosVendaModal open={newPosVendaOpen} onClose={() => setNewPosVendaOpen(false)} onConfirm={(d) => console.log("Novo pós-venda:", d)} />
      {taskModal && <CreateTaskModal open={taskModal.open} onClose={() => setTaskModal(null)} leadName={taskModal.leadName} />}
      {proposalModal && <CreateProposalModal open={proposalModal.open} onClose={() => setProposalModal(null)} leadName={proposalModal.leadName} />}
    </div>
  );
};

export default Pipeline;
