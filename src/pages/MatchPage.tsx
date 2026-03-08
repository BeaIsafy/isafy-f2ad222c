import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, Car, Maximize, MapPin, DollarSign, Calendar, X, FileText, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoIsafy from "@/assets/logo-isafy.png";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const mockMatchProperties = [
  { id: "p1", title: "Apt 2q Moema", price: 520000, area: 68, bedrooms: 2, bathrooms: 2, parking: 1, address: "Rua dos Lírios, 240 - Moema", image: "/placeholder.svg", match: 95 },
  { id: "p2", title: "Apt 2q Vila Mariana", price: 480000, area: 62, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Domingos de Morais, 800", image: "/placeholder.svg", match: 88 },
  { id: "p3", title: "Apt 3q Moema", price: 590000, area: 75, bedrooms: 3, bathrooms: 2, parking: 2, address: "Al. dos Anapurus, 100", image: "/placeholder.svg", match: 82 },
  { id: "p4", title: "Apt 2q Vila Clementino", price: 450000, area: 58, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Pedro de Toledo, 500", image: "/placeholder.svg", match: 78 },
  { id: "p5", title: "Apt 2q Saúde", price: 420000, area: 60, bedrooms: 2, bathrooms: 1, parking: 1, address: "Rua Loefgren, 300", image: "/placeholder.svg", match: 72 },
];

const MatchPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <img src={logoIsafy} alt="Logo" className="h-8" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Imóveis Selecionados para Você</p>
            <p className="text-xs text-muted-foreground">Confira as melhores opções de acordo com seu perfil</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft size={18} /></Button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Seus Imóveis em Destaque</h1>
          <p className="text-sm text-muted-foreground mt-1">Selecionamos {mockMatchProperties.length} imóveis compatíveis com seu perfil</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockMatchProperties.map((p) => (
            <Card key={p.id} className="overflow-hidden border-border/50 hover:shadow-card-hover transition-shadow">
              <div className="relative h-40 bg-muted">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                <Badge className="absolute top-2 right-2 gradient-primary text-primary-foreground text-xs">{p.match}% match</Badge>
              </div>
              <CardContent className="pt-4 space-y-3">
                <div>
                  <p className="font-semibold text-foreground">{p.title}</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(p.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={12} /> {p.address}
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Maximize size={12} />{p.area}m²</span>
                  <span className="flex items-center gap-1"><BedDouble size={12} />{p.bedrooms}q</span>
                  <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms}b</span>
                  <span className="flex items-center gap-1"><Car size={12} />{p.parking}v</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => toast.success("Visita agendada!")}>
                    <Calendar size={12} /> Visita
                  </Button>
                  <Button size="sm" className="flex-1 text-xs gap-1 gradient-primary text-primary-foreground" onClick={() => toast.success("Proposta iniciada!")}>
                    <FileText size={12} /> Proposta
                  </Button>
                </div>
                <Button size="sm" variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => toast("Imóvel descartado")}>
                  <X size={12} className="mr-1" /> Descartar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
