import { motion } from "framer-motion";
import { Plus, Search, Filter, MapPin, BedDouble, Bath, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const properties = [
  { title: "Apartamento Vila Mariana", type: "Apartamento", price: "R$ 850.000", beds: 3, baths: 2, parking: 2, area: "98m²", status: "Disponível", address: "Vila Mariana, SP" },
  { title: "Casa Morumbi", type: "Casa", price: "R$ 2.100.000", beds: 4, baths: 3, parking: 3, area: "280m²", status: "Reservado", address: "Morumbi, SP" },
  { title: "Studio Pinheiros", type: "Studio", price: "R$ 420.000", beds: 1, baths: 1, parking: 1, area: "35m²", status: "Disponível", address: "Pinheiros, SP" },
  { title: "Cobertura Itaim Bibi", type: "Cobertura", price: "R$ 4.500.000", beds: 4, baths: 4, parking: 4, area: "320m²", status: "Vendido", address: "Itaim Bibi, SP" },
  { title: "Apt Consolação", type: "Apartamento", price: "R$ 680.000", beds: 2, baths: 1, parking: 1, area: "72m²", status: "Disponível", address: "Consolação, SP" },
  { title: "Casa Alphaville", type: "Casa", price: "R$ 1.800.000", beds: 5, baths: 4, parking: 4, area: "350m²", status: "Disponível", address: "Alphaville, SP" },
];

const statusColor: Record<string, string> = {
  Disponível: "bg-success/10 text-success",
  Reservado: "bg-warning/10 text-warning",
  Vendido: "bg-muted text-muted-foreground",
};

const Properties = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Imóveis</h1>
        <p className="text-sm text-muted-foreground">{properties.length} imóveis no catálogo</p>
      </div>
      <Button className="gradient-primary text-primary-foreground shadow-primary gap-2"><Plus size={16} /> Novo Imóvel</Button>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar imóveis..." className="pl-9" />
      </div>
      <Button variant="outline" className="gap-2"><Filter size={16} /> Filtros</Button>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((p, i) => (
        <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <div className="group cursor-pointer rounded-xl border border-border/50 bg-card shadow-card transition-all hover:shadow-card-hover overflow-hidden">
            <div className="h-40 gradient-primary relative">
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground/30">
                <Building2Icon size={48} />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[p.status]}`}>{p.status}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={12} />{p.address}</p>
              </div>
              <p className="text-lg font-bold text-gradient">{p.price}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><BedDouble size={14} />{p.beds}</span>
                <span className="flex items-center gap-1"><Bath size={14} />{p.baths}</span>
                <span className="flex items-center gap-1"><Car size={14} />{p.parking}</span>
                <span className="ml-auto font-medium">{p.area}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

function Building2Icon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  );
}

export default Properties;
