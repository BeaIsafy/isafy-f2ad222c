import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, MapPin, User, Building2, FileText, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { contactsMockData } from "@/data/contactsMockData";

const typeBadge: Record<string, string> = {
  Lead: "bg-primary/10 text-primary",
  Cliente: "bg-emerald-500/10 text-emerald-600",
  Proprietário: "bg-sky-500/10 text-sky-600",
};

const proposalStatusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  "Em análise": "secondary",
  "Em negociação": "secondary",
  "Aprovada": "default",
  "Recusada": "destructive",
};

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = contactsMockData.find((c) => c.id === id);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Contato não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/contacts")}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/contacts")}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{contact.name}</h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge[contact.type]}`}>
              {contact.type}
            </span>
            <Badge variant={contact.status === "Ativo" ? "default" : "secondary"}>{contact.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Cadastrado em {new Date(contact.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
        <Button variant="outline" className="gap-2"><Edit2 size={16} /> Editar</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-muted-foreground" /><span>{contact.phone}</span></div>
            <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-muted-foreground" /><span>{contact.email}</span></div>
            <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-muted-foreground" /><span>{contact.address || "Não informado"}</span></div>
            <div className="flex items-center gap-2 text-sm"><FileText size={14} className="text-muted-foreground" /><span>CPF: {contact.cpf || "Não informado"}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm"><User size={14} className="text-muted-foreground" /><span>Corretor: {contact.responsible}</span></div>
            <div className="flex items-center gap-2 text-sm"><Building2 size={14} className="text-muted-foreground" /><span>Imóvel: {contact.property}</span></div>
            <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-muted-foreground" /><span>Desde: {new Date(contact.createdAt).toLocaleDateString("pt-BR")}</span></div>
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
          <TabsTrigger value="properties">Imóveis de Interesse ({contact.propertiesOfInterest.length})</TabsTrigger>
          <TabsTrigger value="proposals">Propostas ({contact.proposals.length})</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="properties">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {contact.propertiesOfInterest.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum imóvel de interesse registrado.</CardContent></Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {contact.propertiesOfInterest.map((p) => (
                  <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-foreground">{p.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{p.location}</p>
                      <p className="text-sm font-semibold text-primary mt-2">{p.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="proposals">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {contact.proposals.length === 0 ? (
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
                    {contact.proposals.map((pr) => (
                      <TableRow key={pr.id}>
                        <TableCell className="font-medium">{pr.property}</TableCell>
                        <TableCell>{pr.value}</TableCell>
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

        <TabsContent value="timeline">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[
                    { date: contact.createdAt, text: `Contato cadastrado como ${contact.type}` },
                    ...(contact.proposals.length > 0 ? [{ date: contact.proposals[0].date, text: `Proposta enviada para ${contact.proposals[0].property}` }] : []),
                  ]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{event.text}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </div>
                    ))}
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
