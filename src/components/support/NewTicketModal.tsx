import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewTicketModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewTicketModal({ open, onClose }: NewTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("bug");
  const [priority, setPriority] = useState("media");
  const [description, setDescription] = useState("");

  const reset = () => {
    setSubject("");
    setCategory("bug");
    setPriority("media");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) return;
    toast.success("Chamado aberto com sucesso!");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Send size={18} className="text-primary" /> Novo Chamado
          </DialogTitle>
          <DialogDescription>Descreva o problema ou solicitação</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Assunto *</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Erro ao carregar página de imóveis"
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="bug">Bug / Erro</option>
                  <option value="feature">Sugestão</option>
                  <option value="duvida">Dúvida</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva detalhadamente o problema ou solicitação..."
                rows={5}
                maxLength={2000}
              />
              <p className="text-[11px] text-muted-foreground text-right">{description.length}/2000</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={handleSubmit}
            disabled={!subject.trim() || !description.trim()}
          >
            Enviar Chamado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
