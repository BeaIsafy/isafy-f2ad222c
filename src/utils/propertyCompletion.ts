import type { Property } from "@/data/propertiesMockData";

interface CompletionField {
  label: string;
  check: (p: Property) => boolean;
}

const fields: CompletionField[] = [
  // Etapa 1 — Informações
  { label: "Título", check: p => !!p.title },
  { label: "Código", check: p => !!p.code },
  { label: "Categoria", check: p => !!p.category },
  { label: "Tipo", check: p => !!p.type },
  { label: "Status", check: p => !!p.status },
  { label: "Finalidade", check: p => p.purpose.length > 0 },
  { label: "Condição", check: p => !!p.condition },
  { label: "Ocupação", check: p => !!p.occupation },
  { label: "Dormitórios", check: p => p.bedrooms > 0 },
  { label: "Banheiros", check: p => p.bathrooms > 0 },
  { label: "Área total", check: p => p.totalArea > 0 },
  { label: "Área útil", check: p => p.usefulArea > 0 },

  // Etapa 2 — Mídias
  { label: "Imagens", check: p => p.images.length > 0 },
  { label: "Imagem de capa", check: p => !!p.coverImage },

  // Etapa 3 — Endereço
  { label: "Endereço", check: p => !!p.address },
  { label: "Bairro", check: p => !!p.neighborhood },
  { label: "Cidade", check: p => !!p.city },
  { label: "Estado", check: p => !!p.state },

  // Etapa 4 — Valores
  { label: "Valor (venda/locação/temporada)", check: p => !!(p.salePrice || p.rentPrice || p.seasonPrice) },
  { label: "IPTU", check: p => p.iptu != null && p.iptu > 0 },

  // Etapa 5 — Comissão
  { label: "Comissão direta", check: p => p.commissionDirect > 0 },
  { label: "Comissão parceria", check: p => p.commissionPartner > 0 },

  // Etapa 8 — Proprietário
  { label: "Proprietário", check: p => !!p.ownerName },
];

export function getPropertyCompletion(p: Property): number {
  const filled = fields.filter(f => f.check(p)).length;
  return Math.round((filled / fields.length) * 100);
}

export function getCompletionColor(pct: number): string {
  if (pct >= 80) return "text-success";
  if (pct >= 50) return "text-warning";
  return "text-destructive";
}

export function getCompletionBarColor(pct: number): string {
  if (pct >= 80) return "bg-success";
  if (pct >= 50) return "bg-warning";
  return "bg-destructive";
}
