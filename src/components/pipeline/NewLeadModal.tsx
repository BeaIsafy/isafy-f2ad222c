import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { formatPhone, parseCurrencyInput } from "@/utils/formatters";

interface NewLeadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Record<string, string>) => void;
}

export function NewLeadModal({ open, onClose, onConfirm }: NewLeadModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", purpose: "", minPrice: "", maxPrice: "", neighborhood: "", notes: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nome *</Label>
            <Input placeholder="Nome do lead" value={form.name} onChange={(e) => set("name", e.target.value)} />
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
            <Label>Finalidade</Label>
            <Select value={form.purpose} onValueChange={(v) => set("purpose", v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Compra">Compra</SelectItem>
                <SelectItem value="Locação">Locação</SelectItem>
                <SelectItem value="Temporada">Temporada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Preço Mínimo</Label>
              <Input inputMode="numeric" placeholder="R$ 0" value={form.minPrice} onChange={(e) => set("minPrice", parseCurrencyInput(e.target.value).display)} />
            </div>
            <div className="grid gap-2">
              <Label>Preço Máximo</Label>
              <Input inputMode="numeric" placeholder="R$ 0" value={form.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Bairro / Região</Label>
            <Input placeholder="Bairro de interesse" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea placeholder="Notas sobre o lead..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" disabled={!form.name.trim()} onClick={() => { onConfirm(form); onClose(); }}>
            Criar Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
