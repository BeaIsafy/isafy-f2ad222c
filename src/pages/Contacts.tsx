import { motion } from "framer-motion";
import { Plus, Search, Filter, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const contacts = [
  { name: "Maria Santos", type: "Lead", phone: "(11) 99123-4567", email: "maria@email.com", status: "Ativo" },
  { name: "João Oliveira", type: "Cliente", phone: "(11) 98234-5678", email: "joao@email.com", status: "Ativo" },
  { name: "Ana Costa", type: "Proprietário", phone: "(11) 97345-6789", email: "ana@email.com", status: "Ativo" },
  { name: "Carlos Mendes", type: "Lead", phone: "(11) 96456-7890", email: "carlos@email.com", status: "Inativo" },
  { name: "Fernanda Lima", type: "Lead", phone: "(11) 95567-8901", email: "fernanda@email.com", status: "Ativo" },
];

const typeBadge: Record<string, string> = {
  Lead: "bg-primary/10 text-primary",
  Cliente: "bg-success/10 text-success",
  Proprietário: "bg-info/10 text-info",
};

const Contacts = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
        <p className="text-sm text-muted-foreground">Gerencie leads, clientes e proprietários</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Download size={16} /> Exportar</Button>
        <Button className="gradient-primary text-primary-foreground shadow-primary gap-2"><Plus size={16} /> Novo Contato</Button>
      </div>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nome, telefone ou e-mail..." className="pl-9" />
      </div>
      <Button variant="outline" className="gap-2"><Filter size={16} /> Filtros</Button>
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden sm:table-cell">Telefone</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.email} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[c.type]}`}>{c.type}</span></TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{c.phone}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{c.email}</TableCell>
                <TableCell><Badge variant={c.status === "Ativo" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                <TableCell><Eye size={16} className="text-muted-foreground hover:text-primary cursor-pointer" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  </div>
);

export default Contacts;
