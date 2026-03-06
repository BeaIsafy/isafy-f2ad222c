export interface Contact {
  id: string;
  name: string;
  type: "Lead" | "Cliente" | "Proprietário";
  phone: string;
  email: string;
  status: "Ativo" | "Inativo";
  responsible: string;
  property: string;
  cpf?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  propertiesOfInterest: { id: string; title: string; value: string; location: string }[];
  proposals: { id: string; property: string; value: string; status: string; date: string }[];
}

export const contactsMockData: Contact[] = [
  {
    id: "1",
    name: "Maria Santos",
    type: "Lead",
    phone: "(11) 99123-4567",
    email: "maria@email.com",
    status: "Ativo",
    responsible: "Carlos Mendes",
    property: "Apt 302 - Ed. Aurora",
    cpf: "123.456.789-00",
    address: "Rua das Flores, 123 - São Paulo/SP",
    notes: "Interessada em apartamentos de 3 quartos na zona sul.",
    createdAt: "2025-01-15",
    propertiesOfInterest: [
      { id: "p1", title: "Apt 302 - Ed. Aurora", value: "R$ 450.000", location: "Vila Mariana, SP" },
      { id: "p2", title: "Apt 501 - Ed. Solar", value: "R$ 520.000", location: "Moema, SP" },
    ],
    proposals: [
      { id: "pr1", property: "Apt 302 - Ed. Aurora", value: "R$ 430.000", status: "Em análise", date: "2025-02-10" },
    ],
  },
  {
    id: "2",
    name: "João Oliveira",
    type: "Cliente",
    phone: "(11) 98234-5678",
    email: "joao@email.com",
    status: "Ativo",
    responsible: "Ana Costa",
    property: "Casa 12 - Cond. Verde",
    cpf: "987.654.321-00",
    address: "Av. Paulista, 1000 - São Paulo/SP",
    notes: "Cliente fechou negócio em janeiro. Acompanhar pós-venda.",
    createdAt: "2024-11-20",
    propertiesOfInterest: [
      { id: "p3", title: "Casa 12 - Cond. Verde", value: "R$ 890.000", location: "Alphaville, SP" },
    ],
    proposals: [
      { id: "pr2", property: "Casa 12 - Cond. Verde", value: "R$ 870.000", status: "Aprovada", date: "2025-01-05" },
    ],
  },
  {
    id: "3",
    name: "Ana Costa",
    type: "Proprietário",
    phone: "(11) 97345-6789",
    email: "ana@email.com",
    status: "Ativo",
    responsible: "Carlos Mendes",
    property: "Sala Comercial 45",
    cpf: "456.789.123-00",
    address: "Rua Augusta, 500 - São Paulo/SP",
    notes: "Proprietária de sala comercial. Quer alugar.",
    createdAt: "2024-12-01",
    propertiesOfInterest: [],
    proposals: [
      { id: "pr3", property: "Sala Comercial 45", value: "R$ 3.500/mês", status: "Em negociação", date: "2025-02-20" },
    ],
  },
  {
    id: "4",
    name: "Carlos Mendes",
    type: "Lead",
    phone: "(11) 96456-7890",
    email: "carlos@email.com",
    status: "Inativo",
    responsible: "Fernanda Lima",
    property: "Apt 101 - Ed. Horizonte",
    cpf: "321.654.987-00",
    address: "Rua Oscar Freire, 200 - São Paulo/SP",
    notes: "Sem retorno há 30 dias.",
    createdAt: "2024-10-10",
    propertiesOfInterest: [
      { id: "p4", title: "Apt 101 - Ed. Horizonte", value: "R$ 380.000", location: "Pinheiros, SP" },
    ],
    proposals: [],
  },
  {
    id: "5",
    name: "Fernanda Lima",
    type: "Lead",
    phone: "(11) 95567-8901",
    email: "fernanda@email.com",
    status: "Ativo",
    responsible: "Ana Costa",
    property: "Cobertura - Ed. Premium",
    cpf: "654.987.321-00",
    address: "Rua Haddock Lobo, 300 - São Paulo/SP",
    notes: "Busca cobertura duplex com vista.",
    createdAt: "2025-02-01",
    propertiesOfInterest: [
      { id: "p5", title: "Cobertura - Ed. Premium", value: "R$ 1.200.000", location: "Jardins, SP" },
      { id: "p6", title: "Cobertura - Ed. Skyline", value: "R$ 1.500.000", location: "Itaim Bibi, SP" },
    ],
    proposals: [
      { id: "pr4", property: "Cobertura - Ed. Premium", value: "R$ 1.150.000", status: "Recusada", date: "2025-02-15" },
    ],
  },
  {
    id: "6",
    name: "Roberto Almeida",
    type: "Cliente",
    phone: "(11) 94678-9012",
    email: "roberto@email.com",
    status: "Ativo",
    responsible: "Carlos Mendes",
    property: "Apt 204 - Ed. Parque",
    cpf: "789.123.456-00",
    address: "Av. Brasil, 800 - São Paulo/SP",
    notes: "Comprou imóvel para investimento.",
    createdAt: "2025-01-20",
    propertiesOfInterest: [
      { id: "p7", title: "Apt 204 - Ed. Parque", value: "R$ 620.000", location: "Brooklin, SP" },
    ],
    proposals: [
      { id: "pr5", property: "Apt 204 - Ed. Parque", value: "R$ 600.000", status: "Aprovada", date: "2025-01-18" },
    ],
  },
];

export const responsibleOptions = ["Carlos Mendes", "Ana Costa", "Fernanda Lima"];
