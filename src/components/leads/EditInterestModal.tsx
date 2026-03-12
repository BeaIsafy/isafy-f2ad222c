import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface InterestProfile {
  propertyType: string;
  purpose: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  minArea: number;
  neighborhoods: string[];
}

interface EditInterestModalProps {
  open: boolean;
  onClose: () => void;
  data: InterestProfile;
  onSave: (data: InterestProfile) => void;
}

export function EditInterestModal({ open, onClose, data, onSave }: EditInterestModalProps) {
  const [form, setForm] = useState(data);
  const [newNeighborhood, setNewNeighborhood] = useState("");
  useEffect(() => { if (open) setForm(data); }, [open, data]);

  const addNeighborhood = () => {
    if (newNeighborhood.trim() && !form.neighborhoods.includes(newNeighborhood.trim())) {
      setForm({ ...form, neighborhoods: [...form.neighborhoods, newNeighborhood.trim()] });
      setNewNeighborhood("");
    }
  };

  const removeNeighborhood = (n: string) => {
    setForm({ ...form, neighborhoods: form.neighborhoods.filter((x) => x !== n) });
  };

  const handleSave = () => {
    onSave(form);
    toast.success("Perfil de interesse atualizado!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2"><Pencil size={16} className="text-primary" /> Editar Perfil de Interesse</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Terreno">Terreno</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Finalidade</Label>
                <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="Compra">Compra</option>
                  <option value="Locação">Locação</option>
                  <option value="Temporada">Temporada</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Preço Mín.</Label><Input inputMode="numeric" value={form.minPrice} onChange={(e) => setForm({ ...form, minPrice: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Preço Máx.</Label><Input inputMode="numeric" value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><Label>Quartos</Label><Input inputMode="numeric" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Banheiros</Label><Input inputMode="numeric" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Vagas</Label><Input inputMode="numeric" value={form.parkingSpots} onChange={(e) => setForm({ ...form, parkingSpots: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2"><Label>Área mín. (m²)</Label><Input inputMode="decimal" value={form.minArea} onChange={(e) => setForm({ ...form, minArea: Number(e.target.value) })} /></div>
            <div className="space-y-2">
              <Label>Bairros</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {form.neighborhoods.map((n) => (
                  <Badge key={n} variant="secondary" className="gap-1 text-xs">
                    {n}
                    <button onClick={() => removeNeighborhood(n)}><X size={10} /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)} placeholder="Adicionar bairro" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNeighborhood())} />
                <Button type="button" variant="outline" size="sm" onClick={addNeighborhood}>+</Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
