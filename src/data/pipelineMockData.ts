import type { LeadCard } from "@/components/pipeline/LeadKanbanCard";

export const atendimentoLeads: Record<string, LeadCard[]> = {
  "Novo Lead": [
    { id: "a1", name: "Carlos Mendes", temp: "warm", purpose: "Compra", minPrice: 400000, maxPrice: 600000, neighborhood: "Moema", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: false },
    { id: "a2", name: "Fernanda Lima", temp: "hot", purpose: "Locação", minPrice: 3000, maxPrice: 5000, neighborhood: "Alphaville", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Contato Inicial": [
    { id: "a3", name: "Roberto Silva", temp: "cold", purpose: "Compra", minPrice: 250000, maxPrice: 350000, neighborhood: "Vila Olímpia", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Há 3 dias", daysWithoutUpdate: 3, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Qualificação": [
    { id: "a4", name: "Patrícia Souza", temp: "hot", purpose: "Compra", minPrice: 1200000, maxPrice: 2000000, neighborhood: "Itaim Bibi", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Há 6 dias", daysWithoutUpdate: 6, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Visita Agendada": [
    { id: "a5", name: "Lucas Oliveira", temp: "warm", purpose: "Compra", minPrice: 800000, maxPrice: 1200000, neighborhood: "Jardins", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: true },
  ],
  "Proposta Enviada": [
    { id: "a6", name: "Maria Eduarda", temp: "hot", purpose: "Locação", minPrice: 4000, maxPrice: 6000, neighborhood: "Pinheiros", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: false, hasActiveProposal: true },
  ],
};

export const captacaoLeads: Record<string, LeadCard[]> = {
  "Novo Proprietário": [
    { id: "c1", name: "Helena Martins", temp: "hot", purpose: "Compra", minPrice: 850000, maxPrice: 850000, neighborhood: "Vila Madalena", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: false },
    { id: "c2", name: "Gustavo Ferreira", temp: "warm", purpose: "Locação", minPrice: 5500, maxPrice: 5500, neighborhood: "Perdizes", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Contato Inicial": [
    { id: "c3", name: "Beatriz Almeida", temp: "warm", purpose: "Compra", minPrice: 1200000, maxPrice: 1200000, neighborhood: "Moema", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Há 2 dias", daysWithoutUpdate: 2, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Avaliação Agendada": [
    { id: "c4", name: "Ricardo Nunes", temp: "hot", purpose: "Compra", minPrice: 2800000, maxPrice: 2800000, neighborhood: "Jardins", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Avaliação Realizada": [
    { id: "c5", name: "Camila Borges", temp: "cold", purpose: "Locação", minPrice: 4200, maxPrice: 4200, neighborhood: "Itaim Bibi", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Há 5 dias", daysWithoutUpdate: 5, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Proposta Captação": [
    { id: "c6", name: "Eduardo Campos", temp: "hot", purpose: "Compra", minPrice: 1500000, maxPrice: 1500000, neighborhood: "Pinheiros", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: false, hasActiveProposal: true },
  ],
};

export const posVendaLeads: Record<string, LeadCard[]> = {
  "Contrato Assinado": [
    { id: "p1", name: "Juliana Rocha", temp: "hot", purpose: "Compra", minPrice: 720000, maxPrice: 720000, neighborhood: "Vila Olímpia", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: true, hasActiveProposal: false },
  ],
  "Documentação": [
    { id: "p2", name: "André Lopes", temp: "warm", purpose: "Compra", minPrice: 1100000, maxPrice: 1100000, neighborhood: "Moema", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Há 2 dias", daysWithoutUpdate: 2, hasPendingTask: true, hasActiveProposal: false },
    { id: "p3", name: "Tatiana Mendes", temp: "warm", purpose: "Compra", minPrice: 480000, maxPrice: 480000, neighborhood: "Tatuapé", broker: "Marco Reis", brokerInitials: "MR", lastInteraction: "Ontem", daysWithoutUpdate: 1, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Escritura": [
    { id: "p4", name: "Fábio Santos", temp: "hot", purpose: "Compra", minPrice: 950000, maxPrice: 950000, neighborhood: "Jardins", broker: "Ana Costa", brokerInitials: "AC", lastInteraction: "Hoje", daysWithoutUpdate: 0, hasPendingTask: false, hasActiveProposal: false },
  ],
  "Follow-up 30d": [
    { id: "p5", name: "Renata Vieira", temp: "cold", purpose: "Compra", minPrice: 620000, maxPrice: 620000, neighborhood: "Perdizes", broker: "João Silva", brokerInitials: "JS", lastInteraction: "Há 8 dias", daysWithoutUpdate: 8, hasPendingTask: false, hasActiveProposal: false },
  ],
};
