import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, Search, Building2, DollarSign, Calendar, Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { ProposalDetailModal } from "@/components/leads/ProposalDetailModal";
import { useProposals } from "@/hooks/useSupabaseData";
import { format } from "date-fns";

const statusConfig: Record<string, { className: string; label: string }> = {
  "Em análise": { className: "bg-warning/10 text-warning border-warning/30", label: "Em análise" },
  "Aprovada": { className: "bg-success/10 text-success border-success/30", label: "Aprovada" },
  "Recusada": { className: "bg-destructive/10 text-destructive border-destructive/30", label: "Recusada" },
  "Em negociação": { className: "bg-info/10 text-info border-info/30", label: "Em negociação" },
  "Contraproposta": { className: "bg-info/10 text-info border-info/30", label: "Contraproposta" },
};

const statusOptions = ["Todos", "Em análise", "Aprovada", "Recusada", "Em negociação", "Contraproposta"];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const ProposalsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const { data: proposals = [], isLoading } = useProposals();

  const filtered = useMemo(() => {
    return (proposals as any[]).filter((p) => {
      const name = p.client_name || p.contact?.name || "";
      const prop = p.property?.title || "";
      const matchSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        prop.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [proposals, search, statusFilter]);

  const stats = {
    total: proposals.length,
    analysis: proposals.filter((p: any) => p.status === "Em análise").length,
    accepted: proposals.filter((p: any) => p.status === "Aprovada").length,
    rejected: proposals.filter((p: any) => p.status === "Recusada").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propostas</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as propostas enviadas</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} /> Nova Proposta
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Em análise", value: stats.analysis, color: "text-warning" },
          { label: "Aprovadas", value: stats.accepted, color: "text-success" },
          { label: "Recusadas", value: stats.rejected, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por cliente ou imóvel..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)} className="text-xs">
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="shadow-card border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">Nenhuma proposta encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((proposal: any, i: number) => {
            const config = statusConfig[proposal.status] || statusConfig["Em análise"];
            const clientName = proposal.client_name || proposal.contact?.name || "—";
            const propertyTitle = proposal.property?.title || "—";
            const dateStr = proposal.created_at ? format(new Date(proposal.created_at), "dd/MM/yyyy") : "";
            return (
              <motion.div key={proposal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="shadow-card border-border/50 hover:shadow-card-hover transition-all cursor-pointer"
                  onClick={() => setSelectedProposal({
                    id: proposal.id,
                    clientName,
                    property: propertyTitle,
                    value: Number(proposal.value),
                    status: proposal.status,
                    date: dateStr,
                    paymentType: proposal.payment_type,
                    conditions: proposal.notes,
                    counterValue: proposal.counter_value ? Number(proposal.counter_value) : undefined,
                  })}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {clientName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{clientName}</p>
                            <Badge variant="outline" className={cn("text-[10px]", config.className)}>{config.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 size={12} /> {propertyTitle}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={12} /> {dateStr}</span>
                            {proposal.payment_type && <span className="text-xs text-muted-foreground">{proposal.payment_type}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <p className="text-sm font-bold text-primary">{formatCurrency(Number(proposal.value))}</p>
                        {proposal.counter_value && <p className="text-xs text-info">Contra: {formatCurrency(Number(proposal.counter_value))}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <CreateProposalModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <ProposalDetailModal proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />
    </div>
  );
};

export default ProposalsPage;
