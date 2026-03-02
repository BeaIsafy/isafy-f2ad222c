export type PropertyStatus = "ativo" | "inativo" | "vendido" | "alugado" | "reservado" | "pendente" | "rascunho";
export type PropertyPurpose = "venda" | "locação" | "temporada" | "lançamento" | "exclusividade";
export type PropertyCategory = "residencial" | "comercial" | "industrial" | "rural" | "terreno";

export interface Property {
  id: string;
  title: string;
  code: string;
  category: PropertyCategory;
  type: string;
  status: PropertyStatus;
  purpose: PropertyPurpose[];
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpaces: number;
  totalArea: number;
  usefulArea: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  salePrice: number | null;
  rentPrice: number | null;
  seasonPrice: number | null;
  pricePerM2: number | null;
  iptu: number | null;
  condoFee: number | null;
  commissionDirect: number;
  commissionPartner: number;
  ownerName: string;
  brokerName: string;
  brokerInitials: string;
  images: string[];
  coverImage: string;
  createdAt: string;
  occupation: string;
  condition: string;
}

export const categoryTypes: Record<PropertyCategory, string[]> = {
  residencial: ["Apartamento", "Casa", "Cobertura", "Studio", "Flat", "Sobrado", "Loft", "Kitnet"],
  comercial: ["Sala Comercial", "Loja", "Galpão", "Prédio Comercial", "Ponto Comercial"],
  industrial: ["Galpão Industrial", "Barracão", "Fábrica"],
  rural: ["Fazenda", "Sítio", "Chácara", "Haras"],
  terreno: ["Terreno Urbano", "Terreno Rural", "Lote", "Área"],
};

export const statusConfig: Record<PropertyStatus, { label: string; className: string }> = {
  ativo: { label: "Ativo", className: "bg-success/10 text-success border-success/20" },
  inativo: { label: "Inativo", className: "bg-muted text-muted-foreground border-border" },
  vendido: { label: "Vendido", className: "bg-primary/10 text-primary border-primary/20" },
  alugado: { label: "Alugado", className: "bg-info/10 text-info border-info/20" },
  reservado: { label: "Reservado", className: "bg-warning/10 text-warning border-warning/20" },
  pendente: { label: "Pendente", className: "bg-accent/10 text-accent border-accent/20" },
  rascunho: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
};

export const purposeLabels: Record<PropertyPurpose, string> = {
  venda: "Venda",
  "locação": "Locação",
  temporada: "Temporada",
  "lançamento": "Lançamento",
  exclusividade: "Exclusividade",
};

export const mockProperties: Property[] = [
  {
    id: "prop1", title: "Apartamento Vila Mariana", code: "ISF-001", category: "residencial", type: "Apartamento",
    status: "ativo", purpose: ["venda"], bedrooms: 3, suites: 1, bathrooms: 2, parkingSpaces: 2,
    totalArea: 98, usefulArea: 82, address: "Rua Domingos de Morais, 1200", neighborhood: "Vila Mariana",
    city: "São Paulo", state: "SP", salePrice: 850000, rentPrice: null, seasonPrice: null,
    pricePerM2: 8673, iptu: 380, condoFee: 950, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Roberto Almeida", brokerName: "Ana Costa", brokerInitials: "AC",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    coverImage: "/placeholder.svg", createdAt: "2026-01-15", occupation: "desocupado", condition: "usado",
  },
  {
    id: "prop2", title: "Casa Morumbi Alto Padrão", code: "ISF-002", category: "residencial", type: "Casa",
    status: "ativo", purpose: ["venda", "exclusividade"], bedrooms: 4, suites: 2, bathrooms: 3, parkingSpaces: 3,
    totalArea: 280, usefulArea: 240, address: "Rua das Palmeiras, 450", neighborhood: "Morumbi",
    city: "São Paulo", state: "SP", salePrice: 2100000, rentPrice: null, seasonPrice: null,
    pricePerM2: 7500, iptu: 850, condoFee: 0, commissionDirect: 6, commissionPartner: 3,
    ownerName: "Mariana Santos", brokerName: "João Silva", brokerInitials: "JS",
    images: ["/placeholder.svg", "/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-01-20", occupation: "ocupado proprietário", condition: "reformado",
  },
  {
    id: "prop3", title: "Studio Pinheiros Moderno", code: "ISF-003", category: "residencial", type: "Studio",
    status: "ativo", purpose: ["venda", "locação"], bedrooms: 1, suites: 0, bathrooms: 1, parkingSpaces: 1,
    totalArea: 35, usefulArea: 30, address: "Rua dos Pinheiros, 890", neighborhood: "Pinheiros",
    city: "São Paulo", state: "SP", salePrice: 420000, rentPrice: 2800, seasonPrice: null,
    pricePerM2: 12000, iptu: 150, condoFee: 600, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Felipe Torres", brokerName: "Ana Costa", brokerInitials: "AC",
    images: ["/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-02-01", occupation: "desocupado", condition: "novo",
  },
  {
    id: "prop4", title: "Cobertura Duplex Itaim Bibi", code: "ISF-004", category: "residencial", type: "Cobertura",
    status: "vendido", purpose: ["venda"], bedrooms: 4, suites: 4, bathrooms: 5, parkingSpaces: 4,
    totalArea: 320, usefulArea: 280, address: "Av. Juscelino Kubitschek, 1500", neighborhood: "Itaim Bibi",
    city: "São Paulo", state: "SP", salePrice: 4500000, rentPrice: null, seasonPrice: null,
    pricePerM2: 14063, iptu: 1200, condoFee: 2800, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Luciana Ferreira", brokerName: "Marco Reis", brokerInitials: "MR",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    coverImage: "/placeholder.svg", createdAt: "2025-12-10", occupation: "desocupado", condition: "novo",
  },
  {
    id: "prop5", title: "Apartamento Consolação", code: "ISF-005", category: "residencial", type: "Apartamento",
    status: "ativo", purpose: ["locação"], bedrooms: 2, suites: 0, bathrooms: 1, parkingSpaces: 1,
    totalArea: 72, usefulArea: 60, address: "Rua da Consolação, 2100", neighborhood: "Consolação",
    city: "São Paulo", state: "SP", salePrice: null, rentPrice: 3500, seasonPrice: null,
    pricePerM2: null, iptu: 220, condoFee: 750, commissionDirect: 100, commissionPartner: 50,
    ownerName: "Pedro Oliveira", brokerName: "Ana Costa", brokerInitials: "AC",
    images: ["/placeholder.svg", "/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-02-10", occupation: "ocupado inquilino", condition: "usado",
  },
  {
    id: "prop6", title: "Casa Alphaville Premium", code: "ISF-006", category: "residencial", type: "Casa",
    status: "reservado", purpose: ["venda"], bedrooms: 5, suites: 3, bathrooms: 4, parkingSpaces: 4,
    totalArea: 350, usefulArea: 300, address: "Alameda das Rosas, 120", neighborhood: "Alphaville",
    city: "Barueri", state: "SP", salePrice: 1800000, rentPrice: null, seasonPrice: null,
    pricePerM2: 5143, iptu: 720, condoFee: 1200, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Gustavo Lima", brokerName: "João Silva", brokerInitials: "JS",
    images: ["/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-01-28", occupation: "desocupado", condition: "usado",
  },
  {
    id: "prop7", title: "Sala Comercial Faria Lima", code: "ISF-007", category: "comercial", type: "Sala Comercial",
    status: "ativo", purpose: ["locação", "venda"], bedrooms: 0, suites: 0, bathrooms: 2, parkingSpaces: 2,
    totalArea: 85, usefulArea: 80, address: "Av. Faria Lima, 3000", neighborhood: "Itaim Bibi",
    city: "São Paulo", state: "SP", salePrice: 950000, rentPrice: 7500, seasonPrice: null,
    pricePerM2: 11176, iptu: 400, condoFee: 1500, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Carlos Mendes", brokerName: "Marco Reis", brokerInitials: "MR",
    images: ["/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-02-15", occupation: "desocupado", condition: "novo",
  },
  {
    id: "prop8", title: "Terreno Granja Viana", code: "ISF-008", category: "terreno", type: "Terreno Urbano",
    status: "ativo", purpose: ["venda"], bedrooms: 0, suites: 0, bathrooms: 0, parkingSpaces: 0,
    totalArea: 500, usefulArea: 500, address: "Estrada da Granja, km 12", neighborhood: "Granja Viana",
    city: "Cotia", state: "SP", salePrice: 380000, rentPrice: null, seasonPrice: null,
    pricePerM2: 760, iptu: 180, condoFee: 0, commissionDirect: 5, commissionPartner: 2.5,
    ownerName: "Regina Duarte", brokerName: "Ana Costa", brokerInitials: "AC",
    images: ["/placeholder.svg"], coverImage: "/placeholder.svg",
    createdAt: "2026-02-20", occupation: "desocupado", condition: "usado",
  },
];
