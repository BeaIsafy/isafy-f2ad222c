export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startHour: number;
  endHour: number;
  type: "visit" | "task" | "meeting";
  pipeline?: "captacao" | "atendimento" | "pos-venda";
  contact?: string;
  address?: string;
  notes?: string;
  corretorId?: string;
}
