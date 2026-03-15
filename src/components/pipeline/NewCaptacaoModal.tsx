import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formatPhone, parseCurrencyInput } from "@/utils/formatters";

interface NewCaptacaoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
}

export function NewCaptacaoModal({ open, onClose, onConfirm }: NewCaptacaoModalProps) {
  const [form, setForm] = useState({ ownerName: "", phone: "", email: "", propertyType: "", address: "", estimatedValue: "", commission: "", notes: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Captação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nome do Proprietário *</Label>
            <Input placeholder="Nome completo" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Telefone</Label>
              <Input inputMode="tel" placeholder="(11) 99999-0000" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>E-mail</Label>
              <Input placeholder="email@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tipo de Imóvel</Label>
            <Select value={form.propertyType} onValueChange={(v) => set("propertyType", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartamento">Apartamento</SelectItem>
                <SelectItem value="Casa">Casa</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Terreno">Terreno</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Endereço do Imóvel</Label>
            <Input placeholder="Rua, número, bairro" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Valor Estimado</Label>
              <Input inputMode="numeric" placeholder="R$ 0" value={form.estimatedValue} onChange={(e) => set("estimatedValue", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Comissão (%)</Label>
              <Input inputMode="decimal" placeholder="6" value={form.commission} onChange={(e) => set("commission", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea placeholder="Notas sobre a captação..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" disabled={!form.ownerName.trim()} onClick={() => { onConfirm(form); onClose(); }}>
            Criar Captação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
