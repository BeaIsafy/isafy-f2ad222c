import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Building2,
  DollarSign,
  Calendar,
  User,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { ProposalDetailModal } from "@/components/leads/ProposalDetailModal";

interface Proposal {
  id: string;
  clientName: string;
  property: string;
  value: number;
  status: string;
  date: string;
  paymentType?: string;
  validity?: string;
  conditions?: string;
  ownerResponse?: string;
  counterValue?: number;
}

const mockProposals: Proposal[] = [
  { id: "PROP-001", clientName: "Lucas Oliveira", property: "Apt 2q Moema", value: 520000, status: "Em análise", date: "05/03/2026", paymentType: "Financiamento", validity: "7", conditions: "Sujeito à aprovação de crédito" },
  { id: "PROP-002", clientName: "João Oliveira", property: "Casa 3q Morumbi", value: 1250000, status: "Aceita", date: "01/03/2026", paymentType: "À Vista" },
  { id: "PROP-003", clientName: "Ana Costa", property: "Apt 3q Vila Mariana", value: 480000, status: "Rejeitada", date: "25/02/2026", paymentType: "Financiamento" },
  { id: "PROP-004", clientName: "Carlos Mendes", property: "Studio Pinheiros", value: 350000, status: "Contraproposta", date: "03/03/2026", paymentType: "Parcelado Direto", counterValue: 380000, conditions: "Proprietário solicita valor maior" },
  { id: "PROP-005", clientName: "Maria Santos", property: "Apt 2q Consolação", value: 590000, status: "Em análise", date: "06/03/2026", paymentType: "Financiamento", validity: "5" },
  { id: "PROP-006", clientName: "Roberto Lima", property: "Cobertura Itaim", value: 2100000, status: "Aceita", date: "20/02/2026", paymentType: "À Vista", conditions: "Escritura em 30 dias" },
];

const statusConfig: Record<string, { className: string; label: string }> = {
  "Em análise": { className: "bg-warning/10 text-warning border-warning/30", label: "Em análise" },
  "Aceita": { className: "bg-success/10 text-success border-success/30", label: "Aceita" },
  "Rejeitada": { className: "bg-destructive/10 text-destructive border-destructive/30", label: "Rejeitada" },
  "Contraproposta": { className: "bg-info/10 text-info border-info/30", label: "Contraproposta" },
};

const statusOptions = ["Todos", "Em análise", "Aceita", "Rejeitada", "Contraproposta"];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const ProposalsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const filtered = mockProposals.filter((p) => {
    const matchSearch =
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.property.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: mockProposals.length,
    analysis: mockProposals.filter((p) => p.status === "Em análise").length,
    accepted: mockProposals.filter((p) => p.status === "Aceita").length,
    rejected: mockProposals.filter((p) => p.status === "Rejeitada").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Propostas</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as propostas enviadas</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} /> Nova Proposta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Em análise", value: stats.analysis, color: "text-warning" },
          { label: "Aceitas", value: stats.accepted, color: "text-success" },
          { label: "Rejeitadas", value: stats.rejected, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, imóvel ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="text-xs"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="shadow-card border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">Nenhuma proposta encontrada</p>
              <p className="text-xs">Ajuste os filtros ou crie uma nova proposta</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((proposal, i) => {
            const config = statusConfig[proposal.status] || statusConfig["Em análise"];
            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card
                  className="shadow-card border-border/50 hover:shadow-card-hover transition-all cursor-pointer"
                  onClick={() => setSelectedProposal(proposal)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {proposal.clientName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{proposal.clientName}</p>
                            <Badge variant="outline" className={cn("text-[10px]", config.className)}>
                              {config.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building2 size={12} /> {proposal.property}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar size={12} /> {proposal.date}
                            </span>
                            {proposal.paymentType && (
                              <span className="text-xs text-muted-foreground">
                                {proposal.paymentType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <p className="text-sm font-bold text-primary">{formatCurrency(proposal.value)}</p>
                        {proposal.counterValue && (
                          <p className="text-xs text-info">
                            Contra: {formatCurrency(proposal.counterValue)}
                          </p>
                        )}
                        <span className="text-[10px] text-muted-foreground">{proposal.id}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreateProposalModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <ProposalDetailModal proposal={selectedProposal} onClose={() => setSelectedProposal(null)} />
    </div>
  );
};

export default ProposalsPage;
