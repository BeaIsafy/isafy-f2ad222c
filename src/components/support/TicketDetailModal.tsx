import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Send, User, Headphones } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TicketMessage {
  id: string;
  sender: "user" | "support";
  senderName: string;
  content: string;
  date: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  date: string;
}

const mockMessages: Record<string, TicketMessage[]> = {
  "#1024": [
    { id: "1", sender: "user", senderName: "Você", content: "Ao acessar a página de imóveis, aparece um erro 500 e os cards não carregam. Já tentei limpar o cache.", date: "20/02/2026 09:15" },
    { id: "2", sender: "support", senderName: "Suporte ISAFY", content: "Olá! Identificamos o problema e já estamos trabalhando na correção. Pode informar qual navegador está usando?", date: "20/02/2026 10:30" },
    { id: "3", sender: "user", senderName: "Você", content: "Estou usando o Chrome versão 120. O problema acontece tanto no desktop quanto no celular.", date: "20/02/2026 11:00" },
  ],
  "#1023": [
    { id: "1", sender: "user", senderName: "Você", content: "Gostaria de integrar o WhatsApp Business para envio de mensagens automáticas aos leads.", date: "18/02/2026 14:00" },
    { id: "2", sender: "support", senderName: "Suporte ISAFY", content: "Essa funcionalidade está em desenvolvimento! Previsão de lançamento: março/2026. Vamos te notificar.", date: "18/02/2026 16:45" },
  ],
  "#1022": [
    { id: "1", sender: "user", senderName: "Você", content: "Preciso exportar os relatórios mensais em PDF para apresentar aos proprietários.", date: "15/02/2026 08:00" },
    { id: "2", sender: "support", senderName: "Suporte ISAFY", content: "A funcionalidade de exportação em PDF já está disponível! Acesse Relatórios > Exportar > PDF.", date: "15/02/2026 09:20" },
    { id: "3", sender: "user", senderName: "Você", content: "Perfeito, consegui! Muito obrigado.", date: "15/02/2026 09:45" },
    { id: "4", sender: "support", senderName: "Suporte ISAFY", content: "Ótimo! Fico feliz em ajudar. Vou encerrar este chamado.", date: "15/02/2026 10:00" },
  ],
};

const statusColor: Record<string, string> = {
  Aberto: "bg-destructive/10 text-destructive",
  "Em andamento": "bg-warning/10 text-warning",
  Finalizado: "bg-success/10 text-success",
};

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDetailModal({ ticket, onClose }: TicketDetailModalProps) {
  const [reply, setReply] = useState("");

  if (!ticket) return null;

  const messages = mockMessages[ticket.id] || [];
  const isClosed = ticket.status === "Finalizado";

  const handleReply = () => {
    if (!reply.trim()) return;
    toast.success("Resposta enviada!");
    setReply("");
  };

  const handleClose = () => {
    toast.success("Chamado finalizado!");
    onClose();
  };

  return (
    <Dialog open={!!ticket} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-base">{ticket.subject}</DialogTitle>
            <Badge variant="outline" className={cn("text-xs shrink-0", statusColor[ticket.status])}>
              {ticket.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{ticket.id} · Aberto em {ticket.date}</p>
        </DialogHeader>

        {/* Messages thread */}
        <ScrollArea className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.sender === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  msg.sender === "user" ? "bg-primary/10" : "bg-muted"
                )}>
                  {msg.sender === "user" ? (
                    <User size={14} className="text-primary" />
                  ) : (
                    <Headphones size={14} className="text-muted-foreground" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[75%] rounded-xl px-4 py-3",
                  msg.sender === "user"
                    ? "bg-primary/10 rounded-tr-sm"
                    : "bg-muted/60 rounded-tl-sm"
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{msg.senderName}</span>
                    <span className="text-[10px] text-muted-foreground">{msg.date}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Reply / Actions */}
        {!isClosed ? (
          <div className="border-t border-border/50 px-6 py-4 space-y-3">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escreva sua resposta..."
              rows={2}
              maxLength={2000}
            />
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="gap-1.5 text-success hover:text-success" onClick={handleClose}>
                <Check size={14} /> Concluir Chamado
              </Button>
              <Button size="sm" className="gap-1.5 gradient-primary text-primary-foreground" onClick={handleReply} disabled={!reply.trim()}>
                <Send size={14} /> Enviar Resposta
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-border/50 px-6 py-4">
            <div className="flex items-center gap-2 justify-center text-sm text-success">
              <Check size={14} />
              <span className="font-medium">Chamado finalizado</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
