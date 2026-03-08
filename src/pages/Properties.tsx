import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters, defaultFilters, type FilterState } from "@/components/properties/PropertyFilters";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { useNavigate } from "react-router-dom";
import { useProperties } from "@/hooks/useSupabaseData";

const Properties = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState("");
  const [gallery, setGallery] = useState<{ images: string[]; title: string } | null>(null);
  const navigate = useNavigate();
  const { data: properties = [], isLoading } = useProperties();

  const filtered = useMemo(() => {
    let items = properties as any[];
    const q = search.toLowerCase();
    if (q) {
      items = items.filter((p: any) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q) ||
        (p.neighborhood || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q) ||
        (p.code || "").toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") items = items.filter((p: any) => p.status === filters.status);
    if (filters.category !== "all") items = items.filter((p: any) => p.category === filters.category);
    if (filters.type) items = items.filter((p: any) => p.type === filters.type);
    if (filters.purposes.length > 0) items = items.filter((p: any) => filters.purposes.some((fp: any) => (p.purpose || []).includes(fp)));
    if (filters.city) items = items.filter((p: any) => (p.city || "").toLowerCase().includes(filters.city.toLowerCase()));
    if (filters.neighborhood) items = items.filter((p: any) => (p.neighborhood || "").toLowerCase().includes(filters.neighborhood.toLowerCase()));
    if (filters.bedroomsMin) items = items.filter((p: any) => (p.bedrooms || 0) >= parseInt(filters.bedroomsMin));
    if (filters.suitesMin) items = items.filter((p: any) => (p.suites || 0) >= parseInt(filters.suitesMin));
    if (filters.bathroomsMin) items = items.filter((p: any) => (p.bathrooms || 0) >= parseInt(filters.bathroomsMin));
    if (filters.parkingMin) items = items.filter((p: any) => (p.parking_spaces || 0) >= parseInt(filters.parkingMin));
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin);
      items = items.filter((p: any) => (p.sale_price ?? p.rent_price ?? 0) >= min);
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax);
      items = items.filter((p: any) => (p.sale_price ?? p.rent_price ?? 0) <= max);
    }
    if (filters.areaMin) items = items.filter((p: any) => (p.total_area || 0) >= parseFloat(filters.areaMin));
    if (filters.areaMax) items = items.filter((p: any) => (p.total_area || 0) <= parseFloat(filters.areaMax));
    return items;
  }, [properties, search, filters]);

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "search") return false;
    if (k === "purposes") return (v as string[]).length > 0;
    if (typeof v === "string") return v !== "" && v !== "all";
    return false;
  }).length;

  // Adapt DB format to PropertyCard expected format
  const adaptProperty = (p: any) => ({
    id: p.id,
    title: p.title || "",
    code: p.code || "",
    category: p.category || "residencial",
    type: p.type || "",
    status: p.status || "rascunho",
    purpose: p.purpose || [],
    bedrooms: p.bedrooms || 0,
    suites: p.suites || 0,
    bathrooms: p.bathrooms || 0,
    parkingSpaces: p.parking_spaces || 0,
    totalArea: p.total_area || 0,
    usefulArea: p.useful_area || 0,
    address: p.address || "",
    neighborhood: p.neighborhood || "",
    city: p.city || "",
    state: p.state || "",
    salePrice: p.sale_price,
    rentPrice: p.rent_price,
    seasonPrice: p.season_price,
    pricePerM2: p.price_per_m2,
    iptu: p.iptu,
    condoFee: p.condo_fee,
    commissionDirect: p.commission_direct || 6,
    commissionPartner: p.commission_partner || 3,
    ownerName: "",
    brokerName: p.assigned_broker?.name || "",
    brokerInitials: p.assigned_broker?.initials || "",
    images: p.images || [],
    coverImage: p.cover_image || "/placeholder.svg",
    createdAt: p.created_at || "",
    occupation: p.occupation || "",
    condition: p.condition || "",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
          <Input placeholder="Buscar por nome, endereço, bairro, código..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
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
          {filtered.map((p: any, i: number) => {
            const adapted = adaptProperty(p);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <PropertyCard
                  property={adapted}
                  viewMode="grid"
                  onView={() => navigate(`/properties/${p.id}`)}
                  onEdit={() => navigate(`/properties/${p.id}`)}
                  onImageClick={() => setGallery({ images: adapted.images, title: adapted.title })}
                  onDuplicate={() => {}}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p: any, i: number) => {
            const adapted = adaptProperty(p);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <PropertyCard
                  property={adapted}
                  viewMode="list"
                  onView={() => navigate(`/properties/${p.id}`)}
                  onEdit={() => navigate(`/properties/${p.id}`)}
                  onImageClick={() => setGallery({ images: adapted.images, title: adapted.title })}
                  onDuplicate={() => {}}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Gallery popup */}
      {gallery && <PropertyGallery open={!!gallery} onClose={() => setGallery(null)} images={gallery.images} title={gallery.title} />}
    </div>
  );
};

export default Properties;
