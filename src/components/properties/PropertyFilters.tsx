import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryTypes, type PropertyStatus, type PropertyPurpose, type PropertyCategory } from "@/data/propertiesMockData";

export interface FilterState {
  search: string;
  status: PropertyStatus | "all";
  purposes: PropertyPurpose[];
  category: PropertyCategory | "all";
  type: string;
  bedroomsMin: string;
  suitesMin: string;
  bathroomsMin: string;
  parkingMin: string;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  city: string;
  neighborhood: string;
}

export const defaultFilters: FilterState = {
  search: "", status: "all", purposes: [], category: "all", type: "",
  bedroomsMin: "", suitesMin: "", bathroomsMin: "", parkingMin: "",
  priceMin: "", priceMax: "", areaMin: "", areaMax: "",
  city: "", neighborhood: "",
};

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
}

const statuses: { value: PropertyStatus; label: string }[] = [
  { value: "ativo", label: "Ativo" }, { value: "inativo", label: "Inativo" },
  { value: "vendido", label: "Vendido" }, { value: "alugado", label: "Alugado" },
  { value: "reservado", label: "Reservado" }, { value: "pendente", label: "Pendente" },
  { value: "rascunho", label: "Rascunho" },
];

const purposes: { value: PropertyPurpose; label: string }[] = [
  { value: "venda", label: "Venda" }, { value: "locação", label: "Locação" },
  { value: "temporada", label: "Temporada" }, { value: "lançamento", label: "Lançamento" },
  { value: "exclusividade", label: "Exclusividade" },
];

const categories: { value: PropertyCategory; label: string }[] = [
  { value: "residencial", label: "Residencial" }, { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" }, { value: "rural", label: "Rural" },
  { value: "terreno", label: "Terreno" },
];

export function PropertyFilters({ filters, onChange, onClose }: Props) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });
  const types = filters.category !== "all" ? categoryTypes[filters.category] : [];
  const togglePurpose = (p: PropertyPurpose) => {
    const next = filters.purposes.includes(p) ? filters.purposes.filter(x => x !== p) : [...filters.purposes, p];
    update({ purposes: next });
  };
  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "search") return false;
    if (k === "purposes") return (v as string[]).length > 0;
    if (typeof v === "string") return v !== "" && v !== "all";
    return false;
  }).length;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
          {activeCount > 0 && <Badge variant="secondary" className="text-[10px]">{activeCount} ativos</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => onChange(defaultFilters)}>Limpar</Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X size={14} /></Button>
        </div>
      </div>

      <ScrollArea className="max-h-[60vh]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Status */}
          <div>
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select value={filters.status} onValueChange={v => update({ status: v as any })}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label className="text-xs text-muted-foreground">Categoria</Label>
            <Select value={filters.category} onValueChange={v => update({ category: v as any, type: "" })}>
              <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          {types.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select value={filters.type} onValueChange={v => update({ type: v })}>
                <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* City */}
          <div>
            <Label className="text-xs text-muted-foreground">Cidade</Label>
            <Input className="mt-1 h-8 text-xs" placeholder="Ex: São Paulo" value={filters.city} onChange={e => update({ city: e.target.value })} />
          </div>

          {/* Neighborhood */}
          <div>
            <Label className="text-xs text-muted-foreground">Bairro</Label>
            <Input className="mt-1 h-8 text-xs" placeholder="Ex: Moema" value={filters.neighborhood} onChange={e => update({ neighborhood: e.target.value })} />
          </div>

          {/* Bedrooms */}
          <div>
            <Label className="text-xs text-muted-foreground">Dormitórios (mín)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" min="0" value={filters.bedroomsMin} onChange={e => update({ bedroomsMin: e.target.value })} />
          </div>

          {/* Suites */}
          <div>
            <Label className="text-xs text-muted-foreground">Suítes (mín)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" min="0" value={filters.suitesMin} onChange={e => update({ suitesMin: e.target.value })} />
          </div>

          {/* Bathrooms */}
          <div>
            <Label className="text-xs text-muted-foreground">Banheiros (mín)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" min="0" value={filters.bathroomsMin} onChange={e => update({ bathroomsMin: e.target.value })} />
          </div>

          {/* Parking */}
          <div>
            <Label className="text-xs text-muted-foreground">Vagas (mín)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" min="0" value={filters.parkingMin} onChange={e => update({ parkingMin: e.target.value })} />
          </div>

          {/* Price */}
          <div>
            <Label className="text-xs text-muted-foreground">Valor mínimo</Label>
            <Input className="mt-1 h-8 text-xs" type="number" placeholder="R$" value={filters.priceMin} onChange={e => update({ priceMin: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Valor máximo</Label>
            <Input className="mt-1 h-8 text-xs" type="number" placeholder="R$" value={filters.priceMax} onChange={e => update({ priceMax: e.target.value })} />
          </div>

          {/* Area */}
          <div>
            <Label className="text-xs text-muted-foreground">Área mínima (m²)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" value={filters.areaMin} onChange={e => update({ areaMin: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Área máxima (m²)</Label>
            <Input className="mt-1 h-8 text-xs" type="number" value={filters.areaMax} onChange={e => update({ areaMax: e.target.value })} />
          </div>
        </div>

        {/* Purposes */}
        <div className="mt-4">
          <Label className="text-xs text-muted-foreground mb-2 block">Finalidade</Label>
          <div className="flex flex-wrap gap-2">
            {purposes.map(p => (
              <label key={p.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
                <Checkbox checked={filters.purposes.includes(p.value)} onCheckedChange={() => togglePurpose(p.value)} className="h-3.5 w-3.5" />
                {p.label}
              </label>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
