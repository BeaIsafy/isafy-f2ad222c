import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { parseCurrencyInput } from "@/utils/formatters";

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
  leadName?: string;
}

export function CreateProposalModal({ open, onClose, leadName }: CreateProposalModalProps) {
  const [property, setProperty] = useState("");
  const [value, setValue] = useState("");
  const [paymentType, setPaymentType] = useState("avista");
  const [downPayment, setDownPayment] = useState("");
  const [installments, setInstallments] = useState("");
  const [validity, setValidity] = useState("7");
  const [conditions, setConditions] = useState("");

  const reset = () => { setProperty(""); setValue(""); setPaymentType("avista"); setDownPayment(""); setInstallments(""); setValidity("7"); setConditions(""); };

  const handleSubmit = () => {
    if (!property.trim() || !value) return;
    toast.success("Proposta criada com sucesso!");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} className="text-primary" /> Nova Proposta
          </DialogTitle>
          {leadName && <DialogDescription>Proposta para {leadName}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Imóvel *</Label>
              <select value={property} onChange={(e) => setProperty(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Selecione o imóvel</option>
                <option value="Apt 2q Moema">Apt 2q Moema - R$ 520.000</option>
                <option value="Apt 2q Vila Mariana">Apt 2q Vila Mariana - R$ 480.000</option>
                <option value="Apt 3q Moema">Apt 3q Moema - R$ 590.000</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Valor da Proposta (R$) *</Label>
              <Input inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="500000" />
            </div>
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="avista">À Vista</option>
                <option value="financiamento">Financiamento</option>
                <option value="parcelado">Parcelado Direto</option>
              </select>
            </div>
            {paymentType !== "avista" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Entrada (R$)</Label>
                  <Input inputMode="numeric" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="100000" />
                </div>
                <div className="space-y-2">
                  <Label>Parcelas</Label>
                  <Input inputMode="numeric" value={installments} onChange={(e) => setInstallments(e.target.value)} placeholder="360" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Validade (dias)</Label>
              <Input inputMode="numeric" value={validity} onChange={(e) => setValidity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Condições / Observações</Label>
              <Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Condições especiais, pendências..." rows={3} maxLength={1000} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSubmit} disabled={!property || !value}>Criar Proposta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
