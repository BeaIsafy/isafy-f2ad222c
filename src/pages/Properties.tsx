import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProperties } from "@/data/propertiesMockData";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters, defaultFilters, type FilterState } from "@/components/properties/PropertyFilters";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState("");
  const [gallery, setGallery] = useState<{ images: string[]; title: string } | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let items = mockProperties;
    const q = search.toLowerCase();
    if (q) {
      items = items.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.brokerName.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") items = items.filter(p => p.status === filters.status);
    if (filters.category !== "all") items = items.filter(p => p.category === filters.category);
    if (filters.type) items = items.filter(p => p.type === filters.type);
    if (filters.purposes.length > 0) items = items.filter(p => filters.purposes.some(fp => p.purpose.includes(fp)));
    if (filters.city) items = items.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.neighborhood) items = items.filter(p => p.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase()));
    if (filters.bedroomsMin) items = items.filter(p => p.bedrooms >= parseInt(filters.bedroomsMin));
    if (filters.suitesMin) items = items.filter(p => p.suites >= parseInt(filters.suitesMin));
    if (filters.bathroomsMin) items = items.filter(p => p.bathrooms >= parseInt(filters.bathroomsMin));
    if (filters.parkingMin) items = items.filter(p => p.parkingSpaces >= parseInt(filters.parkingMin));
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      items = items.filter(p => (p.salePrice ?? p.rentPrice ?? 0) >= min);
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      items = items.filter(p => (p.salePrice ?? p.rentPrice ?? 0) <= max);
    }
    if (filters.areaMin) items = items.filter(p => p.totalArea >= parseFloat(filters.areaMin));
    if (filters.areaMax) items = items.filter(p => p.totalArea <= parseFloat(filters.areaMax));
    return items;
  }, [search, filters]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "search") return false;
    if (k === "purposes") return (v as string[]).length > 0;
    if (typeof v === "string") return v !== "" && v !== "all";
    return false;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imóveis</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} imóveis no catálogo</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={() => navigate("/properties/new")}>
          <Plus size={16} /> Novo Imóvel
        </Button>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, endereço, bairro, proprietário, código..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant={showFilters ? "default" : "outline"} className={showFilters ? "gradient-primary text-primary-foreground gap-2" : "gap-2"} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filtros
            {activeFilterCount > 0 && <span className="rounded-full bg-primary-foreground/20 px-1.5 text-[10px] font-bold">{activeFilterCount}</span>}
          </Button>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`px-2.5 py-1.5 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
          <PropertyFilters filters={filters} onChange={setFilters} onClose={() => setShowFilters(false)} />
        </motion.div>
      )}

      {/* Property grid/list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Search size={48} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhum imóvel encontrado</p>
          <p className="text-sm">Tente ajustar os filtros ou termo de busca</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <PropertyCard
                property={p}
                viewMode="grid"
                onView={() => navigate(`/properties/${p.id}`)}
                onEdit={() => navigate(`/properties/${p.id}`)}
                onImageClick={() => setGallery({ images: p.images, title: p.title })}
                onDuplicate={() => {}}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <PropertyCard
                property={p}
                viewMode="list"
                onView={() => navigate(`/properties/${p.id}`)}
                onEdit={() => navigate(`/properties/${p.id}`)}
                onImageClick={() => setGallery({ images: p.images, title: p.title })}
                onDuplicate={() => {}}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Gallery popup */}
      {gallery && <PropertyGallery open={!!gallery} onClose={() => setGallery(null)} images={gallery.images} title={gallery.title} />}

    </div>
  );
};

export default Properties;
