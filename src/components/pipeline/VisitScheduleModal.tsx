import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";

interface VisitScheduleModalProps {
  open: boolean;
  onConfirm: (data: { date: string; time: string; notes: string }) => void;
  onCancel: () => void;
  leadName: string;
}

export function VisitScheduleModal({ open, onConfirm, onCancel, leadName }: VisitScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (!date || !time) return;
    onConfirm({ date, time, notes });
    setDate("");
    setTime("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus size={18} className="text-primary" /> Agendar Visita
          </DialogTitle>
          <DialogDescription>
            Agende a visita para <span className="font-semibold text-foreground">{leadName}</span>. Um evento será criado automaticamente na agenda.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Horário *</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Observação (opcional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Endereço, imóvel, detalhes..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleConfirm} disabled={!date || !time}>Confirmar Visita</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
