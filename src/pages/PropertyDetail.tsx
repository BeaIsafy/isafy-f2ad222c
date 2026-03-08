import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Pencil, MapPin, BedDouble, Bath, Car, Maximize, Building2,
  DollarSign, Percent, User, FileText, Globe, Calendar, Eye, Phone,
  Clock, CheckCircle2, XCircle, AlertCircle, X, Check
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { mockProperties, statusConfig, purposeLabels, categoryTypes, type PropertyCategory, type PropertyPurpose, type Property } from "@/data/propertiesMockData";
import { propertyProposals, propertyVisits, propertyTimeline } from "@/data/propertyHistoryMockData";
import { PropertyGallery } from "@/components/properties/PropertyGallery";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const visitStatusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  Realizada: { icon: CheckCircle2, color: "text-success" },
  Agendada: { icon: Clock, color: "text-primary" },
  Cancelada: { icon: XCircle, color: "text-destructive" },
  "Não compareceu": { icon: AlertCircle, color: "text-warning" },
};

const proposalStatusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  "Em análise": "secondary",
  "Em negociação": "secondary",
  Aprovada: "default",
  Recusada: "destructive",
  Contraproposta: "secondary",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = mockProperties.find(p => p.id === id);
  const [editSection, setEditSection] = useState<string | null>(null);
  const [gallery, setGallery] = useState(false);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Imóvel não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/properties")}>Voltar</Button>
      </div>
    );
  }

  const sc = statusConfig[property.status];
  const mainPrice = property.salePrice ?? property.rentPrice ?? property.seasonPrice ?? 0;
  const priceLabel = property.salePrice ? "" : property.rentPrice ? "/mês" : "/dia";
  const proposals = propertyProposals.filter(p => p.propertyId === id);
  const visits = propertyVisits.filter(v => v.propertyId === id);
  const timeline = propertyTimeline.filter(t => t.propertyId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const SectionHeader = ({ title, section }: { title: string; section: string }) => (
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditSection(section)}>
        <Pencil size={14} className="text-muted-foreground" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/properties")}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground truncate">{property.title}</h1>
            <span className="text-sm text-muted-foreground">{property.code}</span>
            <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
            {property.purpose.map(p => (
              <Badge key={p} variant="secondary" className="text-xs">{purposeLabels[p]}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={13} /> {property.address}, {property.neighborhood} - {property.city}/{property.state}
          </p>
        </div>
      </div>

      {/* Gallery + Price bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className="h-48 sm:h-56 sm:w-96 shrink-0 rounded-xl bg-muted relative overflow-hidden cursor-pointer group"
          onClick={() => setGallery(true)}
        >
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <Building2 size={64} />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute bottom-2 right-2 rounded bg-background/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium">
            {property.images.length} fotos
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Preço Principal</p>
            <p className="text-lg font-bold text-primary mt-1">{fmt(mainPrice)}<span className="text-xs font-normal text-muted-foreground">{priceLabel}</span></p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Preço/m²</p>
            <p className="text-lg font-bold text-foreground mt-1">{property.pricePerM2 ? fmt(property.pricePerM2) : "—"}</p>
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

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="proposals">Propostas ({proposals.length})</TabsTrigger>
          <TabsTrigger value="visits">Visitas ({visits.length})</TabsTrigger>
          <TabsTrigger value="timeline">Histórico</TabsTrigger>
        </TabsList>

        {/* ── INFO TAB ── */}
        <TabsContent value="info">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2">
            {/* Dados do Imóvel */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Dados do Imóvel" section="property" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Categoria" value={property.category} />
                <Row label="Tipo" value={property.type} />
                <Row label="Condição" value={property.condition} />
                <Row label="Ocupação" value={property.occupation} />
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <Stat icon={BedDouble} label="Dorm." value={property.bedrooms} />
                  <Stat icon={Bath} label="Banh." value={property.bathrooms} />
                  <Stat icon={Car} label="Vagas" value={property.parkingSpaces} />
                  <Stat icon={Maximize} label="Suítes" value={property.suites} />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xs text-muted-foreground">Área Total</p>
                    <p className="font-semibold">{property.totalArea} m²</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xs text-muted-foreground">Área Útil</p>
                    <p className="font-semibold">{property.usefulArea} m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Endereço" section="address" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Logradouro" value={property.address} />
                <Row label="Bairro" value={property.neighborhood} />
                <Row label="Cidade" value={`${property.city}/${property.state}`} />
                <div className="rounded-xl bg-muted h-32 flex items-center justify-center mt-3">
                  <div className="text-center text-muted-foreground">
                    <MapPin size={24} className="mx-auto mb-1" />
                    <p className="text-xs">Mapa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Valores */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Valores & Custos" section="values" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {property.salePrice && <Row label="Valor de Venda" value={fmt(property.salePrice)} highlight />}
                {property.rentPrice && <Row label="Valor de Locação" value={`${fmt(property.rentPrice)}/mês`} highlight />}
                {property.seasonPrice && <Row label="Valor Temporada" value={`${fmt(property.seasonPrice)}/dia`} />}
                {property.pricePerM2 && <Row label="Preço/m²" value={fmt(property.pricePerM2)} />}
                <div className="border-t border-border/50 pt-2 mt-2" />
                <Row label="IPTU" value={property.iptu ? fmt(property.iptu) : "—"} />
                <Row label="Condomínio" value={property.condoFee ? fmt(property.condoFee) : "—"} />
              </CardContent>
            </Card>

            {/* Comissão */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Comissão" section="commission" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Venda Direta" value={`${property.commissionDirect}%`} />
                <Row label="Parceria" value={`${property.commissionPartner}%`} />
                {mainPrice > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Comissão Direta</p>
                      <p className="font-semibold text-primary">{fmt(mainPrice * property.commissionDirect / 100)}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <p className="text-xs text-muted-foreground">Comissão Parceria</p>
                      <p className="font-semibold text-accent">{fmt(mainPrice * property.commissionPartner / 100)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proprietário */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Proprietário" section="owner" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Nome" value={property.ownerName} />
                <Row label="Corretor Responsável" value={property.brokerName} />
                <Row label="Cadastrado em" value={new Date(property.createdAt).toLocaleDateString("pt-BR")} />
              </CardContent>
            </Card>

            {/* Mídias/Divulgação */}
            <Card>
              <CardHeader className="pb-3"><SectionHeader title="Mídias & Divulgação" section="media" /></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Fotos" value={`${property.images.length} imagens`} />
                <Row label="Finalidades" value={property.purpose.map(p => purposeLabels[p]).join(", ")} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── PROPOSALS TAB ── */}
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
                    {proposals.map(pr => (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">{pr.clientName}</TableCell>
                        <TableCell>
                          <a href={`https://wa.me/55${pr.clientPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                            <Phone size={12} /> {pr.clientPhone}
                          </a>
                        </TableCell>
                        <TableCell className="font-semibold">{pr.value}</TableCell>
                        <TableCell className="text-muted-foreground">{pr.paymentType}</TableCell>
                        <TableCell><Badge variant={proposalStatusBadge[pr.status] || "secondary"}>{pr.status}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{new Date(pr.date).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* ── VISITS TAB ── */}
        <TabsContent value="visits">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {visits.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma visita registrada para este imóvel.</CardContent></Card>
            ) : (
              <div className="space-y-3">
                {visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(v => {
                  const cfg = visitStatusConfig[v.status] || visitStatusConfig.Agendada;
                  const Icon = cfg.icon;
                  return (
                    <Card key={v.id}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={`mt-0.5 ${cfg.color}`}><Icon size={20} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{v.clientName}</span>
                            <Badge variant="outline" className="text-[10px]">{v.status}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(v.date).toLocaleDateString("pt-BR")}</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {v.time}</span>
                            <span>Corretor: {v.brokerName}</span>
                          </div>
                          {v.feedback && <p className="text-xs text-muted-foreground mt-2 italic">"{v.feedback}"</p>}
                        </div>
                        <a href={`https://wa.me/55${v.clientPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Phone size={14} /></Button>
                        </a>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </TabsContent>

        {/* ── TIMELINE TAB ── */}
        <TabsContent value="timeline">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="pt-6">
                {timeline.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum evento registrado.</p>
                ) : (
                  <div className="space-y-4">
                    {timeline.map(ev => {
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
                              <span className="text-xs text-muted-foreground">{new Date(ev.date).toLocaleDateString("pt-BR")}</span>
                              {ev.actor && <span className="text-xs text-muted-foreground">· {ev.actor}</span>}
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

      {/* Edit Modals */}
      <EditPropertyModal open={editSection === "property"} onClose={() => setEditSection(null)} property={property} />
      <EditAddressModal open={editSection === "address"} onClose={() => setEditSection(null)} property={property} />
      <EditValuesModal open={editSection === "values"} onClose={() => setEditSection(null)} property={property} />
      <EditCommissionModal open={editSection === "commission"} onClose={() => setEditSection(null)} property={property} />
      <EditOwnerModal open={editSection === "owner"} onClose={() => setEditSection(null)} property={property} />
      <EditMediaModal open={editSection === "media"} onClose={() => setEditSection(null)} property={property} />

      {gallery && <PropertyGallery open images={property.images} title={property.title} onClose={() => setGallery(false)} />}
    </div>
  );
};

export default PropertyDetail;

/* ─── Helper components ─── */

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted p-2.5 text-center">
      <Icon size={16} className="mx-auto text-muted-foreground mb-1" />
      <p className="text-base font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── Edit Modals ─── */

function EditPropertyModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Editar Dados do Imóvel</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">Título</Label><Input className="mt-1" defaultValue={property.title} /></div>
            <div><Label className="text-xs">Código</Label><Input className="mt-1" defaultValue={property.code} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label className="text-xs">Status</Label>
              <Select defaultValue={property.status}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["ativo", "inativo", "reservado", "pendente", "rascunho"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Categoria</Label>
              <Select defaultValue={property.category}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{(["residencial", "comercial", "industrial", "rural", "terreno"] as const).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Tipo</Label>
              <Select defaultValue={property.type}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{categoryTypes[property.category].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">Condição</Label>
              <Select defaultValue={property.condition}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["novo", "usado", "em construção", "reformado"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Ocupação</Label>
              <Select defaultValue={property.occupation}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{["desocupado", "ocupado proprietário", "ocupado inquilino", "temporada"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-3 sm:grid-cols-6">
            <div><Label className="text-xs">Dorm.</Label><Input type="number" className="mt-1" defaultValue={property.bedrooms} /></div>
            <div><Label className="text-xs">Suítes</Label><Input type="number" className="mt-1" defaultValue={property.suites} /></div>
            <div><Label className="text-xs">Banh.</Label><Input type="number" className="mt-1" defaultValue={property.bathrooms} /></div>
            <div><Label className="text-xs">Vagas</Label><Input type="number" className="mt-1" defaultValue={property.parkingSpaces} /></div>
            <div><Label className="text-xs">Á. Útil</Label><Input type="number" className="mt-1" defaultValue={property.usefulArea} /></div>
            <div><Label className="text-xs">Á. Total</Label><Input type="number" className="mt-1" defaultValue={property.totalArea} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Dados do imóvel atualizados!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditAddressModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Editar Endereço</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label className="text-xs">Logradouro</Label><Input className="mt-1" defaultValue={property.address} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">Bairro</Label><Input className="mt-1" defaultValue={property.neighborhood} /></div>
            <div><Label className="text-xs">Cidade</Label><Input className="mt-1" defaultValue={property.city} /></div>
          </div>
          <div><Label className="text-xs">Estado</Label><Input className="mt-1" defaultValue={property.state} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Endereço atualizado!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditValuesModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Editar Valores & Custos</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label className="text-xs">Venda (R$)</Label><Input type="number" className="mt-1" defaultValue={property.salePrice ?? ""} /></div>
            <div><Label className="text-xs">Locação (R$/mês)</Label><Input type="number" className="mt-1" defaultValue={property.rentPrice ?? ""} /></div>
            <div><Label className="text-xs">Temporada (R$/dia)</Label><Input type="number" className="mt-1" defaultValue={property.seasonPrice ?? ""} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">IPTU (R$)</Label><Input type="number" className="mt-1" defaultValue={property.iptu ?? ""} /></div>
            <div><Label className="text-xs">Condomínio (R$)</Label><Input type="number" className="mt-1" defaultValue={property.condoFee ?? ""} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Valores atualizados!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditCommissionModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Editar Comissão</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label className="text-xs">% Comissão Venda Direta</Label><Input type="number" step="0.5" className="mt-1" defaultValue={property.commissionDirect} /></div>
          <div><Label className="text-xs">% Comissão Parceria</Label><Input type="number" step="0.5" className="mt-1" defaultValue={property.commissionPartner} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Comissão atualizada!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditOwnerModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Editar Proprietário</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label className="text-xs">Nome do Proprietário</Label><Input className="mt-1" defaultValue={property.ownerName} /></div>
          <div><Label className="text-xs">Corretor Responsável</Label><Input className="mt-1" defaultValue={property.brokerName} /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Proprietário atualizado!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditMediaModal({ open, onClose, property }: { open: boolean; onClose: () => void; property: Property }) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Editar Mídias & Divulgação</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><Label className="text-xs">Descrição</Label><Textarea className="mt-1 min-h-[120px]" placeholder="Descrição do imóvel..." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label className="text-xs">Link YouTube/Vimeo</Label><Input className="mt-1" placeholder="https://..." /></div>
            <div><Label className="text-xs">Link Tour 360</Label><Input className="mt-1" placeholder="https://..." /></div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox /> Publicar no Site</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox /> Publicar no Mapa</label>
            <div className="flex flex-wrap gap-3">
              {["ZAP Imóveis", "OLX", "Viva Real", "Imovelweb"].map(p =>
                <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer"><Checkbox />{p}</label>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={() => { toast.success("Mídias atualizadas!"); onClose(); }}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
