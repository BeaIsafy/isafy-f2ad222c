import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewEventModalProps {
  open: boolean;
  onClose: () => void;
}

type EventType = "visit" | "task";

export function NewEventModal({ open, onClose }: NewEventModalProps) {
  const [type, setType] = useState<EventType>("visit");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pipeline, setPipeline] = useState("atendimento");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setType("visit");
    setTitle("");
    setDate("");
    setTime("");
    setEndTime("");
    setPipeline("atendimento");
    setContact("");
    setAddress("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!title || !date || !time) return;
    toast.success(`${type === "visit" ? "Visita" : "Tarefa"} criada com sucesso!`);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus size={18} className="text-primary" /> Novo Evento
          </DialogTitle>
          <DialogDescription>Preencha as informações do evento</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            {/* Type toggle */}
            <div className="space-y-2">
              <Label>Tipo de Evento *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={type === "visit" ? "default" : "outline"}
                  onClick={() => setType("visit")}
                  className={type === "visit" ? "gradient-primary text-primary-foreground" : ""}
                >
                  Visita
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={type === "task" ? "default" : "outline"}
                  onClick={() => setType("task")}
                  className={type === "task" ? "gradient-primary text-primary-foreground" : ""}
                >
                  Tarefa
                </Button>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "visit" ? "Ex: Visita Apt. Vila Mariana" : "Ex: Follow-up com cliente"}
              />
            </div>

            {/* Date / Time */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Início *</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fim</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            {/* Pipeline */}
            <div className="space-y-2">
              <Label>Funil</Label>
              <select
                value={pipeline}
                onChange={(e) => setPipeline(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="captacao">Captação</option>
                <option value="atendimento">Atendimento</option>
                <option value="pos-venda">Pós-Venda</option>
              </select>
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label>Contato / Lead</Label>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Nome do contato" />
            </div>

            {/* Visit-specific: address */}
            {type === "visit" && (
              <div className="space-y-2">
                <Label>Endereço do Imóvel</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro" />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalhes adicionais..." rows={2} />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!title || !date || !time}>
            Criar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
