import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface EditContactModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    name: string;
    phone: string;
    email: string;
    origin: string;
    broker: string;
  };
  onSave: (data: EditContactModalProps["data"]) => void;
}

export function EditContactModal({ open, onClose, data, onSave }: EditContactModalProps) {
  const [form, setForm] = useState(data);
  useEffect(() => { if (open) setForm(data); }, [open, data]);

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave(form);
    toast.success("Dados do contato atualizados!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pencil size={16} className="text-primary" /> Editar Contato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2"><Label>Nome *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Telefone *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Origem</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} /></div>
          <div className="space-y-2"><Label>Corretor</Label><Input value={form.broker} onChange={(e) => setForm({ ...form, broker: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSave} disabled={!form.name.trim() || !form.phone.trim()}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
