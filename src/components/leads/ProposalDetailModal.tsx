import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, User, Building2, Clock, ExternalLink, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Proposal {
  id: string;
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

const statusConfig: Record<string, { className: string; label: string }> = {
  "Em análise": { className: "bg-warning/10 text-warning border-warning/30", label: "Em análise" },
  "Aceita": { className: "bg-success/10 text-success border-success/30", label: "Aceita" },
  "Rejeitada": { className: "bg-destructive/10 text-destructive border-destructive/30", label: "Rejeitada" },
  "Contraproposta": { className: "bg-info/10 text-info border-info/30", label: "Contraproposta" },
};

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

interface ProposalDetailModalProps {
  proposal: Proposal | null;
  onClose: () => void;
}

export function ProposalDetailModal({ proposal, onClose }: ProposalDetailModalProps) {
  if (!proposal) return null;
  const config = statusConfig[proposal.status] || statusConfig["Em análise"];

  return (
    <Dialog open={!!proposal} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText size={16} className="text-primary" /> Proposta {proposal.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs", config.className)}>{config.label}</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Building2 size={14} className="text-muted-foreground shrink-0" />
            <span>{proposal.property}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign size={14} className="text-muted-foreground shrink-0" />
            <span className="font-semibold text-primary">{formatCurrency(proposal.value)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className="text-muted-foreground shrink-0" />
            <span>Enviada em {proposal.date}</span>
          </div>
          {proposal.paymentType && (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-muted-foreground shrink-0" />
              <span>Pagamento: {proposal.paymentType}</span>
            </div>
          )}
          {proposal.conditions && (
            <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
              {proposal.conditions}
            </div>
          )}
          {proposal.status === "Contraproposta" && proposal.counterValue && (
            <div className="rounded-md border border-info/30 bg-info/5 p-3">
              <p className="text-xs font-medium text-info mb-1">Contraproposta do proprietário</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(proposal.counterValue)}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open("#", "_blank")}>
            <ExternalLink size={14} /> Link Público
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
