export interface PropertyProposal {
  id: string;
  propertyId: string;
  clientName: string;
  clientPhone: string;
  value: string;
  paymentType: string;
  status: "Em análise" | "Aprovada" | "Recusada" | "Em negociação" | "Contraproposta";
  date: string;
  notes?: string;
}

export interface PropertyVisit {
  id: string;
  propertyId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: "Agendada" | "Realizada" | "Cancelada" | "Não compareceu";
  brokerName: string;
  feedback?: string;
}

export interface PropertyTimelineEvent {
  id: string;
  propertyId: string;
  type: "proposta" | "visita" | "status" | "edicao" | "publicacao" | "captacao";
  description: string;
  date: string;
  actor?: string;
}

export const propertyProposals: PropertyProposal[] = [
  { id: "pp1", propertyId: "prop1", clientName: "Maria Santos", clientPhone: "(11) 99123-4567", value: "R$ 820.000", paymentType: "Financiamento", status: "Em análise", date: "2026-03-05", notes: "Cliente com pré-aprovação bancária" },
  { id: "pp2", propertyId: "prop1", clientName: "Fernanda Lima", clientPhone: "(11) 95567-8901", value: "R$ 800.000", paymentType: "À vista", status: "Recusada", date: "2026-02-20" },
  { id: "pp3", propertyId: "prop2", clientName: "Roberto Almeida", clientPhone: "(11) 94678-9012", value: "R$ 2.000.000", paymentType: "Financiamento + FGTS", status: "Em negociação", date: "2026-03-01" },
  { id: "pp4", propertyId: "prop3", clientName: "Carlos Mendes", clientPhone: "(11) 96456-7890", value: "R$ 400.000", paymentType: "À vista", status: "Aprovada", date: "2026-02-15" },
  { id: "pp5", propertyId: "prop4", clientName: "João Oliveira", clientPhone: "(11) 98234-5678", value: "R$ 4.400.000", paymentType: "Financiamento", status: "Aprovada", date: "2025-12-01" },
  { id: "pp6", propertyId: "prop5", clientName: "Maria Santos", clientPhone: "(11) 99123-4567", value: "R$ 3.500/mês", paymentType: "Locação", status: "Em análise", date: "2026-03-07" },
];

export const propertyVisits: PropertyVisit[] = [
  { id: "pv1", propertyId: "prop1", clientName: "Maria Santos", clientPhone: "(11) 99123-4567", date: "2026-03-02", time: "10:00", status: "Realizada", brokerName: "Ana Costa", feedback: "Cliente gostou muito do imóvel, pediu desconto." },
  { id: "pv2", propertyId: "prop1", clientName: "Fernanda Lima", clientPhone: "(11) 95567-8901", date: "2026-02-18", time: "14:00", status: "Realizada", brokerName: "Ana Costa", feedback: "Achou o valor alto para a região." },
  { id: "pv3", propertyId: "prop1", clientName: "Carlos Mendes", clientPhone: "(11) 96456-7890", date: "2026-03-10", time: "09:00", status: "Agendada", brokerName: "Ana Costa" },
  { id: "pv4", propertyId: "prop2", clientName: "Roberto Almeida", clientPhone: "(11) 94678-9012", date: "2026-02-28", time: "11:00", status: "Realizada", brokerName: "João Silva", feedback: "Muito interessado, vai enviar proposta." },
  { id: "pv5", propertyId: "prop3", clientName: "Carlos Mendes", clientPhone: "(11) 96456-7890", date: "2026-02-10", time: "15:00", status: "Realizada", brokerName: "Ana Costa", feedback: "Fechou negócio na visita." },
  { id: "pv6", propertyId: "prop5", clientName: "Maria Santos", clientPhone: "(11) 99123-4567", date: "2026-03-08", time: "16:00", status: "Agendada", brokerName: "Ana Costa" },
  { id: "pv7", propertyId: "prop6", clientName: "Fernanda Lima", clientPhone: "(11) 95567-8901", date: "2026-02-25", time: "10:00", status: "Não compareceu", brokerName: "João Silva" },
];

export const propertyTimeline: PropertyTimelineEvent[] = [
  { id: "pt1", propertyId: "prop1", type: "captacao", description: "Imóvel captado e cadastrado no sistema", date: "2026-01-15", actor: "Ana Costa" },
  { id: "pt2", propertyId: "prop1", type: "publicacao", description: "Publicado no site e portais ZAP e Viva Real", date: "2026-01-18", actor: "Sistema" },
  { id: "pt3", propertyId: "prop1", type: "visita", description: "Visita realizada com Fernanda Lima", date: "2026-02-18", actor: "Ana Costa" },
  { id: "pt4", propertyId: "prop1", type: "proposta", description: "Proposta de R$ 800.000 recusada (Fernanda Lima)", date: "2026-02-20", actor: "Ana Costa" },
  { id: "pt5", propertyId: "prop1", type: "visita", description: "Visita realizada com Maria Santos", date: "2026-03-02", actor: "Ana Costa" },
  { id: "pt6", propertyId: "prop1", type: "proposta", description: "Nova proposta de R$ 820.000 em análise (Maria Santos)", date: "2026-03-05", actor: "Ana Costa" },
  { id: "pt7", propertyId: "prop1", type: "edicao", description: "Valor de IPTU atualizado", date: "2026-03-06", actor: "Ana Costa" },
  { id: "pt8", propertyId: "prop2", type: "captacao", description: "Imóvel captado e cadastrado", date: "2026-01-20", actor: "João Silva" },
  { id: "pt9", propertyId: "prop2", type: "visita", description: "Visita realizada com Roberto Almeida", date: "2026-02-28", actor: "João Silva" },
  { id: "pt10", propertyId: "prop2", type: "proposta", description: "Proposta de R$ 2.000.000 em negociação", date: "2026-03-01", actor: "João Silva" },
  { id: "pt11", propertyId: "prop4", type: "proposta", description: "Proposta de R$ 4.400.000 aprovada (João Oliveira)", date: "2025-12-01", actor: "Marco Reis" },
  { id: "pt12", propertyId: "prop4", type: "status", description: "Status alterado para Vendido", date: "2025-12-10", actor: "Marco Reis" },
];
