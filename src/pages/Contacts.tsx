import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Download, Eye, LayoutGrid, List, X,
  FileSpreadsheet, FileText, Phone, Mail, User, Building2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useContacts, useCreateContact, useBrokers } from "@/hooks/useSupabaseData";

const typeBadge: Record<string, string> = {
  Lead: "bg-primary/10 text-primary",
  Cliente: "bg-emerald-500/10 text-emerald-600",
  Proprietário: "bg-sky-500/10 text-sky-600",
};

const Contacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: contacts = [], isLoading } = useContacts();
  const { data: brokers = [] } = useBrokers();
  const createContact = useCreateContact();
  
  const [view, setView] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewContact, setShowNewContact] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterBroker, setFilterBroker] = useState("");

  // New contact form
  const [newContact, setNewContact] = useState({
    name: "", type: "Lead" as "Lead" | "Cliente" | "Proprietário", phone: "", email: "",
    cpf: "", address: "", notes: "", broker_id: "",
  });

  const activeFilters = [filterType, filterStatus, filterBroker].filter(Boolean).length;

  const filtered = useMemo(() => {
    return contacts.filter((c: any) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) || c.broker?.name?.toLowerCase().includes(q);
      const matchesType = !filterType || c.type === filterType;
      const matchesStatus = !filterStatus || c.status === filterStatus;
      const matchesBroker = !filterBroker || c.broker_id === filterBroker;
      return matchesSearch && matchesType && matchesStatus && matchesBroker;
    });
  }, [contacts, search, filterType, filterStatus, filterBroker]);

  const clearFilters = () => { setFilterType(""); setFilterStatus(""); setFilterBroker(""); };

  const handleExport = (format: "excel" | "pdf") => {
    toast({ title: `Exportando ${format.toUpperCase()}`, description: `${filtered.length} contatos serão exportados.` });
  };

  const handleSaveContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({ title: "Campos obrigatórios", description: "Preencha pelo menos o nome e telefone.", variant: "destructive" });
      return;
    }
    try {
      await createContact.mutateAsync({
        name: newContact.name,
        type: newContact.type,
        phone: newContact.phone,
        email: newContact.email || undefined,
        cpf: newContact.cpf || undefined,
        address: newContact.address || undefined,
        notes: newContact.notes || undefined,
        broker_id: newContact.broker_id || undefined,
      });
      toast({ title: "Contato criado", description: `${newContact.name} foi adicionado com sucesso.` });
      setShowNewContact(false);
      setNewContact({ name: "", type: "Lead", phone: "", email: "", cpf: "", address: "", notes: "", broker_id: "" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} contatos encontrados</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2"><Download size={16} /> Exportar <ChevronDown size={14} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2"><FileSpreadsheet size={16} /> Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2"><FileText size={16} /> PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="gradient-primary text-primary-foreground shadow-primary gap-2" onClick={() => setShowNewContact(true)}>
            <Plus size={16} /> Novo Contato
          </Button>
        </div>
      </div>

      {/* Search + Filters + View Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, telefone, e-mail ou corretor..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 relative">
                <Filter size={16} /> Filtros
                {activeFilters > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{activeFilters}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 space-y-4" align="end">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filtros</h4>
                {activeFilters > 0 && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">Limpar</Button>}
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tipo</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                      <SelectItem value="Proprietário">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Corretor responsável</Label>
                  <Select value={filterBroker} onValueChange={setFilterBroker}>
                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      {brokers.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex border border-border rounded-md overflow-hidden">
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="rounded-none h-10 w-10" onClick={() => setView("list")}><List size={16} /></Button>
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-none h-10 w-10" onClick={() => setView("grid")}><LayoutGrid size={16} /></Button>
          </div>
        </div>
      </div>

      {/* Active filter badges */}
      {activeFilters > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filterType && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterType("")}>Tipo: {filterType} <X size={12} /></Badge>}
          {filterStatus && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterStatus("")}>Status: {filterStatus} <X size={12} /></Badge>}
          {filterBroker && <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setFilterBroker("")}>Corretor <X size={12} /></Badge>}
        </div>
      )}

      {/* List View */}
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                    <TableHead className="hidden md:table-cell">E-mail</TableHead>
                    <TableHead className="hidden lg:table-cell">Corretor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum contato encontrado.</TableCell></TableRow>
                  ) : (
                    filtered.map((c: any) => (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/contacts/${c.id}`)}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[c.type] || ""}`}>{c.type}</span></TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{c.phone}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{c.email}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{c.broker?.name || "—"}</TableCell>
                        <TableCell><Badge variant={c.status === "Ativo" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                        <TableCell><Eye size={16} className="text-muted-foreground hover:text-primary" /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum contato encontrado.</div>
              ) : (
                filtered.map((c: any) => (
                  <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/contacts/${c.id}`)}>
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{c.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[c.type] || ""}`}>{c.type}</span>
                        </div>
                        <Badge variant={c.status === "Ativo" ? "default" : "secondary"}>{c.status}</Badge>
                      </div>
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Phone size={13} />{c.phone || "—"}</div>
                        <div className="flex items-center gap-2"><Mail size={13} />{c.email || "—"}</div>
                        <div className="flex items-center gap-2"><User size={13} />{c.broker?.name || "—"}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Contact Modal */}
      <Dialog open={showNewContact} onOpenChange={setShowNewContact}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nome *</Label>
                <Input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Nome completo" />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo *</Label>
                <Select value={newContact.type} onValueChange={(v) => setNewContact({ ...newContact, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Proprietário">Proprietário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Telefone *</Label>
                <Input value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-1.5">
                <Label>E-mail</Label>
                <Input type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="email@exemplo.com" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>CPF</Label>
                <Input value={newContact.cpf} onChange={(e) => setNewContact({ ...newContact, cpf: e.target.value })} placeholder="000.000.000-00" />
              </div>
              <div className="space-y-1.5">
                <Label>Corretor responsável</Label>
                <Select value={newContact.broker_id} onValueChange={(v) => setNewContact({ ...newContact, broker_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {brokers.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Endereço</Label>
              <Input value={newContact.address} onChange={(e) => setNewContact({ ...newContact, address: e.target.value })} placeholder="Rua, número - Cidade/UF" />
            </div>
            <div className="space-y-1.5">
              <Label>Observações</Label>
              <Textarea value={newContact.notes} onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })} placeholder="Anotações sobre o contato..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewContact(false)}>Cancelar</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={handleSaveContact} disabled={createContact.isPending}>
              {createContact.isPending ? "Salvando..." : "Salvar Contato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
