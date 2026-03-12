import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, User, Building2, FileText, Calendar, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContactDetail, useContactProposals, useContactPropertiesInterest, useTimelineEvents } from "@/hooks/useSupabaseData";

const typeBadge: Record<string, string> = {
  Lead: "bg-primary/10 text-primary",
  Cliente: "bg-emerald-500/10 text-emerald-600",
  "Proprietário": "bg-sky-500/10 text-sky-600",
};

const proposalStatusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  "Em análise": "secondary",
  "Em negociação": "secondary",
  "Aprovada": "default",
  "Recusada": "destructive",
  "Contraproposta": "secondary",
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contact, isLoading } = useContactDetail(id);
  const { data: proposals = [] } = useContactProposals(id);
  const { data: propertiesInterest = [] } = useContactPropertiesInterest(id);
  const { data: timelineEvents = [] } = useTimelineEvents({ contact_id: id });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Contato não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/contacts")}>Voltar</Button>
      </div>
    );
  }

  const contactType = contact.type || "Lead";
  const contactStatus = contact.status || "Ativo";
  const brokerName = (contact.broker as any)?.name || "Não atribuído";
  const responsibleName = (contact.responsible as any)?.full_name || "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/contacts")}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{contact.name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge[contactType] || typeBadge.Lead}`}>
              {contactType}
            </span>
            <Badge variant={contactStatus === "Ativo" ? "default" : "secondary"}>{contactStatus}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Cadastrado em {new Date(contact.created_at || "").toLocaleDateString("pt-BR")}</p>
        </div>
        <Button variant="outline" className="gap-2"><Edit2 size={16} /> Editar</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground" /><span>{contact.phone || "Não informado"}</span></div>
            <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground" /><span>{contact.email || "Não informado"}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-muted-foreground" /><span>{contact.address || "Não informado"}</span></div>
            <div className="flex items-center gap-2 text-sm"><FileText size={14} className="text-muted-foreground" /><span>CPF: {contact.cpf || "Não informado"}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground" /><span>Corretor: {brokerName}</span></div>
            <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground" /><span>Responsável: {responsibleName}</span></div>
            <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-muted-foreground" /><span>Desde: {new Date(contact.created_at || "").toLocaleDateString("pt-BR")}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Observações</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{contact.notes || "Sem observações."}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties">Imóveis de Interesse ({propertiesInterest.length})</TabsTrigger>
          <TabsTrigger value="proposals">Propostas ({proposals.length})</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {propertiesInterest.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum imóvel de interesse registrado.</CardContent></Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {propertiesInterest.map((pi: any) => (
                  <Card key={pi.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/properties/${pi.property?.id}`)}>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-foreground">{pi.property?.title || "Imóvel"}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{pi.property?.neighborhood}, {pi.property?.city}</p>
                      <p className="text-sm font-semibold text-primary mt-2">
                        {pi.property?.sale_price ? fmt(pi.property.sale_price) : pi.property?.rent_price ? `${fmt(pi.property.rent_price)}/mês` : "—"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="proposals">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {proposals.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma proposta registrada.</CardContent></Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imóvel</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposals.map((pr: any) => (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">{(pr.property as any)?.title || "—"}</TableCell>
                        <TableCell>{fmt(pr.value)}</TableCell>
                        <TableCell><Badge variant={proposalStatusBadge[pr.status] || "secondary"}>{pr.status}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{new Date(pr.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="timeline">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {timelineEvents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">Nenhum evento registrado.</p>
                  ) : (
                    timelineEvents.map((event: any) => (
                      <div key={event.id} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.actor_name && `${event.actor_name} · `}
                            {new Date(event.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactDetail;
