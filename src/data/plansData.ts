import { Zap, Rocket, Crown } from "lucide-react";

export const plans = [
  {
    id: "start",
    name: "Start",
    price: 207,
    period: "/mês",
    icon: Zap,
    color: "border-info/50 bg-info/5",
    members: 1,
    storage: "5 GB",
    teamEnabled: false,
    features: [
      "1 usuário",
      "CRM com funil de captação e vendas",
      "Cadastro ilimitado de imóveis",
      "Site com domínio personalizado",
      "Suporte por e-mail",
      "Relatórios básicos",
    ],
  },
  {
    id: "performance",
    name: "Performance",
    price: 335,
    period: "/mês",
    icon: Rocket,
    color: "border-primary/50 bg-primary/5",
    popular: true,
    members: 5,
    storage: "50 GB",
    teamEnabled: true,
    features: [
      "5 usuários",
      "Tudo do plano Start +",
      "Integração com portais",
      "Análise de campanhas Ads",
      "Integração com IA no WhatsApp para o corretor",
      "Suporte via WhatsApp",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 557,
    period: "/mês",
    icon: Crown,
    color: "border-accent/50 bg-accent/5",
    members: 10,
    storage: "200 GB",
    teamEnabled: true,
    features: [
      "10 usuários",
      "Tudo do plano Start +",
      "Tudo do plano Performance +",
      "Agente de atendimento ao cliente por IA incluso",
      "Suporte prioritário via WhatsApp",
      "Acesso antecipado a novidades",
    ],
  },
];

export type Plan = (typeof plans)[number];
