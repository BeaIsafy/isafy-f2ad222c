import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const lossReasons = [
  "Preço acima do orçamento",
  "Optou por outra imobiliária",
  "Desistiu da compra/locação",
  "Sem resposta após tentativas",
  "Imóvel não disponível",
  "Outro",
];

interface LostReasonModalProps {
  open: boolean;
  onConfirm: (reason: string, notes: string) => void;
  onCancel: () => void;
  leadName: string;
}

export function LostReasonModal({ open, onConfirm, onCancel, leadName }: LostReasonModalProps) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm(reason, notes);
    setReason("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como Perdido</DialogTitle>
          <DialogDescription>
            Informe o motivo da perda de <span className="font-semibold text-foreground">{leadName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Motivo *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {lossReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Observação (opcional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalhes adicionais..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!reason}>Confirmar Perda</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
