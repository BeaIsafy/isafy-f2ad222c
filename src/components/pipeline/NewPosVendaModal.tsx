import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formatPhone } from "@/utils/formatters";

interface NewPosVendaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
}

export function NewPosVendaModal({ open, onClose, onConfirm }: NewPosVendaModalProps) {
  const [form, setForm] = useState({ clientName: "", phone: "", email: "", propertyRef: "", contractDate: "", notes: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pós-Venda</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nome do Cliente *</Label>
            <Input placeholder="Nome completo" value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input inputMode="tel" placeholder="(11) 99999-0000" value={form.phone} onChange={(e) => set("phone", formatPhone(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input placeholder="email@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Referência do Imóvel</Label>
            <Input placeholder="Código ou endereço" value={form.propertyRef} onChange={(e) => set("propertyRef", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Data do Contrato</Label>
            <Input type="date" value={form.contractDate} onChange={(e) => set("contractDate", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea placeholder="Notas sobre o pós-venda..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" disabled={!form.clientName.trim()} onClick={() => { onConfirm(form); onClose(); }}>
            Criar Pós-Venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
