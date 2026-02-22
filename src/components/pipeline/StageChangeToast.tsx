import { toast } from "sonner";
import { CalendarPlus, FileText, Trophy, XCircle } from "lucide-react";

export function notifyStageChange(leadName: string, newStage: string) {
  switch (newStage) {
    case "Visita Agendada":
      toast.success(`Visita agendada para ${leadName}`, {
        description: "Evento criado automaticamente na agenda.",
        icon: <CalendarPlus size={16} />,
      });
      break;
    case "Proposta Enviada":
      toast.info(`${leadName} movido para Proposta Enviada`, {
        description: "Lembre-se de vincular uma proposta.",
        icon: <FileText size={16} />,
      });
      break;
    case "Fechado":
      toast.success(`🎉 Negócio fechado com ${leadName}!`, {
        description: "Status do imóvel e metas atualizados.",
        icon: <Trophy size={16} />,
      });
      break;
    case "Perdido":
      toast(`${leadName} marcado como perdido`, {
        icon: <XCircle size={16} />,
      });
      break;
    default:
      toast(`${leadName} movido para ${newStage}`);
  }
}
