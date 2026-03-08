import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NewOwnerModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewOwnerModal({ open, onClose }: NewOwnerModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", cpf: "" });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    toast.success("Proprietário cadastrado com sucesso!");
    setForm({ name: "", phone: "", email: "", cpf: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Proprietário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome completo" />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>CPF/CNPJ</Label>
            <Input value={form.cpf} onChange={(e) => set("cpf", e.target.value)} placeholder="000.000.000-00" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Cadastrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
