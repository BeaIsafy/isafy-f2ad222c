import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateCalendarEvent, useBrokers } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";

interface NewEventModalProps {
  open: boolean;
  onClose: () => void;
}

type EventType = "visit" | "task" | "meeting";

export function NewEventModal({ open, onClose }: NewEventModalProps) {
  const isMobile = useIsMobile();
  const createEvent = useCreateCalendarEvent();
  const { data: brokers = [] } = useBrokers();

  const [type, setType] = useState<EventType>("visit");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [pipeline, setPipeline] = useState("atendimento");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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
    setSelectedBrokers([]);
  };

  const toggleBroker = (brokerId: string) => {
    setSelectedBrokers((prev) =>
      prev.includes(brokerId) ? prev.filter((id) => id !== brokerId) : [...prev, brokerId]
    );
  };

  const handleSubmit = async () => {
    if (!title || !date || !time) return;
    setSaving(true);
    try {
      const startHour = parseInt(time.split(":")[0], 10);
      const endHour = endTime ? parseInt(endTime.split(":")[0], 10) : startHour + 1;

      const event = await createEvent.mutateAsync({
        title,
        date,
        start_hour: startHour,
        end_hour: endHour,
        type,
        pipeline: pipeline as any,
        contact: contact || undefined,
        address: address || undefined,
        notes: notes || undefined,
      });

      // Save participants for meetings
      if (type === "meeting" && selectedBrokers.length > 0 && event?.id) {
        const rows = selectedBrokers.map((broker_id) => ({
          event_id: event.id,
          broker_id,
        }));
        await supabase.from("calendar_event_participants" as any).insert(rows);
      }

      const labels: Record<EventType, string> = {
        visit: "Visita",
        task: "Tarefa",
        meeting: "Reunião",
      };
      toast.success(`${labels[type]} criada com sucesso!`);
      reset();
      onClose();
    } catch (err: any) {
      toast.error("Erro ao criar evento: " + (err?.message || "Erro desconhecido"));
    } finally {
      setSaving(false);
    }
  };

  const formContent = (
    <div className="space-y-4">
      {/* Type toggle */}
      <div className="space-y-2">
        <Label>Tipo de Evento *</Label>
        <div className="flex gap-2 flex-wrap">
          {([
            { value: "visit" as const, label: "Visita" },
            { value: "task" as const, label: "Tarefa" },
            { value: "meeting" as const, label: "Reunião" },
          ]).map((opt) => (
            <Button
              key={opt.value}
              type="button"
              size="sm"
              variant={type === opt.value ? "default" : "outline"}
              onClick={() => setType(opt.value)}
              className={type === opt.value ? "gradient-primary text-primary-foreground" : ""}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label>Título *</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            type === "visit" ? "Ex: Visita Apt. Vila Mariana" :
            type === "meeting" ? "Ex: Reunião de equipe" :
            "Ex: Follow-up com cliente"
          }
        />
      </div>

      {/* Date / Time */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      {/* Meeting-specific: invite members */}
      {type === "meeting" && (
        <div className="space-y-2">
          <Label>Convidar Membros</Label>
          {brokers.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum membro cadastrado.</p>
          ) : (
            <div className="max-h-36 overflow-y-auto rounded-md border border-input p-2 space-y-2">
              {brokers.map((b: any) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={selectedBrokers.includes(b.id)}
                    onCheckedChange={() => toggleBroker(b.id)}
                  />
                  <span className="text-foreground">{b.name}</span>
                  {b.email && <span className="text-muted-foreground text-xs">({b.email})</span>}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label>Observações</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalhes adicionais..." rows={2} />
      </div>
    </div>
  );

  const footerButtons = (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end w-full">
      <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={saving}>Cancelar</Button>
      <Button className="gradient-primary text-primary-foreground w-full sm:w-auto" onClick={handleSubmit} disabled={!title || !date || !time || saving}>
        {saving ? "Salvando..." : "Criar Evento"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent className="px-4 pb-6 max-h-[85vh]">
          <DrawerHeader className="px-0">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <CalendarPlus size={18} className="text-primary" /> Novo Evento
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 overflow-y-auto pr-1">
            {formContent}
          </ScrollArea>
          <div className="pt-4">
            {footerButtons}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

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
          <div className="py-4">
            {formContent}
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 pb-6 pt-2">
          {footerButtons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
