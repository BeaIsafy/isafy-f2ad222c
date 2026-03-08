import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Building2,
  Users,
  UserPlus,
  UserCheck,
  ListTodo,
  CalendarCheck,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NewLeadModal } from "@/components/pipeline/NewLeadModal";
import { CreateTaskModal } from "@/components/pipeline/CreateTaskModal";
import { CreateProposalModal } from "@/components/pipeline/CreateProposalModal";
import { VisitScheduleModal } from "@/components/pipeline/VisitScheduleModal";
import { NewClientModal } from "@/components/dashboard/NewClientModal";
import { NewOwnerModal } from "@/components/dashboard/NewOwnerModal";
import { toast } from "sonner";

const actions = [
  { id: "imovel", label: "Imóvel", icon: Building2, color: "bg-primary" },
  { id: "cliente", label: "Cliente", icon: Users, color: "bg-info" },
  { id: "lead", label: "Lead", icon: UserPlus, color: "bg-accent" },
  { id: "proprietario", label: "Proprietário", icon: UserCheck, color: "bg-success" },
  { id: "tarefa", label: "Tarefa", icon: ListTodo, color: "bg-warning" },
  { id: "visita", label: "Visita", icon: CalendarCheck, color: "bg-hot" },
  { id: "proposta", label: "Proposta", icon: FileText, color: "bg-cold" },
];

type ModalType = "lead" | "cliente" | "proprietario" | "tarefa" | "visita" | "proposta" | null;

export function QuickCreateFAB() {
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const navigate = useNavigate();

  const handleAction = (id: string) => {
    setOpen(false);
    if (id === "imovel") {
      navigate("/properties/new");
    } else {
      setActiveModal(id as ModalType);
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB + Cloud */}
      <div className="fixed bottom-20 right-6 z-50 sm:bottom-8 sm:right-8 lg:bottom-8">
        <AnimatePresence>
          {open && (
            <div className="absolute bottom-16 right-0 flex flex-col items-end gap-3 mb-2">
              {actions.map((action, i) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 group"
                >
                  <span className="rounded-lg bg-background border border-border/50 px-3 py-1.5 text-sm font-medium text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {action.label}
                  </span>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${action.color} text-primary-foreground shadow-lg hover:scale-110 transition-transform`}>
                    <action.icon size={20} />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen((p) => !p)}
          className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-shadow"
        >
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
            {open ? <X size={24} /> : <Plus size={24} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Modals */}
      <NewLeadModal
        open={activeModal === "lead"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          setActiveModal(null);
          toast.success("Lead criado com sucesso!");
        }}
      />
      <CreateTaskModal
        open={activeModal === "tarefa"}
        onClose={() => setActiveModal(null)}
      />
      <CreateProposalModal
        open={activeModal === "proposta"}
        onClose={() => setActiveModal(null)}
      />
      <VisitScheduleModal
        open={activeModal === "visita"}
        leadName=""
        onConfirm={(data) => {
          setActiveModal(null);
          toast.success("Visita agendada com sucesso!");
        }}
        onCancel={() => setActiveModal(null)}
      />
      <NewClientModal
        open={activeModal === "cliente"}
        onClose={() => setActiveModal(null)}
      />
      <NewOwnerModal
        open={activeModal === "proprietario"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
