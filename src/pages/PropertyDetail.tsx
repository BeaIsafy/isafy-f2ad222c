import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Pencil, MapPin, BedDouble, Bath, Car, Maximize, Building2,
  DollarSign, Percent, User, FileText, Globe, Calendar, Eye, Phone,
  Clock, CheckCircle2, XCircle, AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePropertyDetail, usePropertyProposals, usePropertyVisits, useTimelineEvents, useUpdateProperty } from "@/hooks/useSupabaseData";
import { PropertyGallery } from "@/components/properties/PropertyGallery";

const statusConfig: Record<string, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground border-border" },
  vendido: { label: "Vendido", className: "bg-primary/10 text-primary border-primary/20" },
  alugado: { label: "Alugado", className: "bg-info/10 text-info border-info/20" },
  reservado: { label: "Reservado", className: "bg-warning/10 text-warning border-warning/20" },
  pendente: { label: "Pendente", className: "bg-accent/10 text-accent border-accent/20" },
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
};

const purposeLabels: Record<string, string> = {
  venda: "Venda", "locação": "Locação", temporada: "Temporada", "lançamento": "Lançamento", exclusividade: "Exclusividade",
};

const proposalStatusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  "Em análise": "secondary", "Em negociação": "secondary", Aprovada: "default", Recusada: "destructive", Contraproposta: "secondary",
};

const visitStatusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  Realizada: { icon: CheckCircle2, color: "text-success" },
  Agendada: { icon: Clock, color: "text-primary" },
  Cancelada: { icon: XCircle, color: "text-destructive" },
  "Não compareceu": { icon: AlertCircle, color: "text-warning" },
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: property, isLoading } = usePropertyDetail(id);
  const { data: proposals = [] } = usePropertyProposals(id);
  const { data: visits = [] } = usePropertyVisits(id);
  const { data: timeline = [] } = useTimelineEvents({ property_id: id });
  const [gallery, setGallery] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Imóvel não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/properties")}>Voltar</Button>
      </div>
    );
  }

  const sc = statusConfig[property.status || "rascunho"] || statusConfig.rascunho;
  const mainPrice = Number(property.sale_price) || Number(property.rent_price) || Number(property.season_price) || 0;
  const priceLabel = property.sale_price ? "" : property.rent_price ? "/mês" : "/dia";
  const broker = property.assigned_broker as any;
  const owner = property.owner as any;
  const images = property.images || [];
  const purposes = (property.purpose || []) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/properties")}><ArrowLeft size={20} /></Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground truncate">{property.title}</h1>
            <span className="text-sm text-muted-foreground">{property.code}</span>
            <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
            {purposes.map(p => <Badge key={p} variant="secondary" className="text-xs">{purposeLabels[p] || p}</Badge>)}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={13} /> {property.address}, {property.neighborhood} - {property.city}/{property.state}
          </p>
        </div>
      </div>

      {/* Gallery + Price bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-48 sm:h-56 sm:w-96 shrink-0 rounded-xl bg-muted relative overflow-hidden cursor-pointer group" onClick={() => setGallery(true)}>
          {property.cover_image ? (
            <img src={property.cover_image} alt={property.title} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20"><Building2 size={64} /></div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium">{images.length} fotos</div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Preço Principal</p>
            <p className="text-lg font-bold text-primary mt-1">{mainPrice > 0 ? fmt(mainPrice) : "—"}<span className="text-xs font-normal text-muted-foreground">{priceLabel}</span></p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Preço/m²</p>
            <p className="text-lg font-bold text-foreground mt-1">{property.price_per_m2 ? fmt(Number(property.price_per_m2)) : "—"}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Propostas</p>
            <p className="text-lg font-bold text-foreground mt-1">{proposals.length}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Visitas</p>
            <p className="text-lg font-bold text-foreground mt-1">{visits.length}</p>
          </CardContent></Card>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="proposals">Propostas ({proposals.length})</TabsTrigger>
          <TabsTrigger value="visits">Visitas ({visits.length})</TabsTrigger>
          <TabsTrigger value="timeline">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Dados do Imóvel</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Categoria" value={property.category || "—"} />
                <Row label="Tipo" value={property.type || "—"} />
                <Row label="Condição" value={property.condition || "—"} />
                <Row label="Ocupação" value={property.occupation || "—"} />
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <StatBox icon={BedDouble} label="Dorm." value={property.bedrooms || 0} />
                  <StatBox icon={Bath} label="Banh." value={property.bathrooms || 0} />
                  <StatBox icon={Car} label="Vagas" value={property.parking_spaces || 0} />
                  <StatBox icon={Maximize} label="Suítes" value={property.suites || 0} />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xs text-muted-foreground">Área Total</p>
                    <p className="font-semibold">{property.total_area || 0} m²</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xs text-muted-foreground">Área Útil</p>
                    <p className="font-semibold">{property.useful_area || 0} m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Endereço</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Logradouro" value={property.address || "—"} />
                <Row label="Bairro" value={property.neighborhood || "—"} />
                <Row label="Cidade" value={`${property.city || "—"}/${property.state || "—"}`} />
                {property.zip_code && <Row label="CEP" value={property.zip_code} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Valores & Custos</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {property.sale_price && <Row label="Valor de Venda" value={fmt(Number(property.sale_price))} highlight />}
                {property.rent_price && <Row label="Valor de Locação" value={`${fmt(Number(property.rent_price))}/mês`} highlight />}
                {property.season_price && <Row label="Valor Temporada" value={`${fmt(Number(property.season_price))}/dia`} />}
                {property.price_per_m2 && <Row label="Preço/m²" value={fmt(Number(property.price_per_m2))} />}
                <div className="border-t border-border/50 pt-2 mt-2" />
                <Row label="IPTU" value={property.iptu ? fmt(Number(property.iptu)) : "—"} />
                <Row label="Condomínio" value={property.condo_fee ? fmt(Number(property.condo_fee)) : "—"} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Comissão</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Venda Direta" value={`${property.commission_direct || 0}%`} />
                <Row label="Parceria" value={`${property.commission_partner || 0}%`} />
                {mainPrice > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Comissão Direta</p>
                      <p className="font-semibold text-primary">{fmt(mainPrice * (Number(property.commission_direct) || 0) / 100)}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Comissão Parceria</p>
                      <p className="font-semibold text-accent">{fmt(mainPrice * (Number(property.commission_partner) || 0) / 100)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Proprietário</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Proprietário" value={owner?.full_name || "—"} />
                <Row label="Corretor" value={broker?.name || "—"} />
                <Row label="Cadastrado em" value={new Date(property.created_at || "").toLocaleDateString("pt-BR")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Descrição</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{property.description || "Sem descrição."}</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="proposals">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {proposals.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma proposta registrada para este imóvel.</CardContent></Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((pr: any) => {
                      const contactData = pr.contact as any;
                      const clientPhone = pr.client_phone || contactData?.phone || "";
                      return (
                        <TableRow key={pr.id}>
                          <TableCell className="font-medium">{pr.client_name || contactData?.name || "—"}</TableCell>
                          <TableCell>
                            {clientPhone && (
                              <a href={`https://wa.me/55${clientPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                <Phone size={12} /> {clientPhone}
                              </a>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">{fmt(pr.value)}</TableCell>
                          <TableCell className="text-muted-foreground">{pr.payment_type || "—"}</TableCell>
                          <TableCell><Badge variant={proposalStatusBadge[pr.status] || "secondary"}>{pr.status}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{new Date(pr.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="visits">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {visits.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma visita registrada para este imóvel.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {visits.map((v: any) => {
                  const cfg = visitStatusConfig[v.status] || visitStatusConfig.Agendada;
                  const Icon = cfg.icon;
                  const visitContact = v.contact as any;
                  const visitBroker = v.broker as any;
                  return (
                    <Card key={v.id}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`mt-0.5 ${cfg.color}`}><Icon size={20} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{v.client_name || visitContact?.name || "—"}</span>
                            <Badge variant="outline" className="text-[10px]">{v.status}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(v.date).toLocaleDateString("pt-BR")}</span>
                            {v.time && <span className="flex items-center gap-1"><Clock size={11} /> {v.time}</span>}
                            <span>Corretor: {visitBroker?.full_name || "—"}</span>
                          </div>
                          {v.feedback && <p className="text-xs text-muted-foreground mt-2 italic">"{v.feedback}"</p>}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="timeline">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="pt-6">
                {timeline.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento registrado.</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map((ev: any) => {
                      const typeColors: Record<string, string> = {
                        proposta: "bg-primary", visita: "bg-accent", status: "bg-warning",
                        edicao: "bg-muted-foreground", publicacao: "bg-success", captacao: "bg-info",
                      };
                      return (
                        <div key={ev.id} className="flex gap-3 items-start">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${typeColors[ev.type] || "bg-primary"}`} />
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{ev.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">{new Date(ev.created_at).toLocaleDateString("pt-BR")}</span>
                              {ev.actor_name && <span className="text-xs text-muted-foreground">· {ev.actor_name}</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {gallery && <PropertyGallery open images={images} title={property.title} onClose={() => setGallery(false)} />}
    </div>
  );
};

export default PropertyDetail;

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted p-2.5 text-center">
      <Icon size={16} className="mx-auto text-muted-foreground mb-1" />
      <p className="text-base font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
