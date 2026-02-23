import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Kanban,
  Building2,
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Home,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainTabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pipeline", icon: Kanban, path: "/pipeline" },
  { label: "Imóveis", icon: Building2, path: "/properties" },
];

const fabActions = [
  { label: "Add Imóvel", action: "add_property" },
  { label: "Add Lead", action: "add_lead" },
  { label: "Add Proprietário", action: "add_owner" },
];

const moreItems = [
  { label: "Contatos", icon: Users, path: "/contacts" },
  { label: "Agenda", icon: Calendar, path: "/calendar" },
  { label: "Relatórios", icon: BarChart3, path: "/reports" },
  { label: "Configurações", icon: Settings, path: "/settings" },
  { label: "Suporte", icon: HelpCircle, path: "/support" },
  { label: "Perfil", icon: User, path: "/profile" },
];

export function MobileBottomBar() {
  const location = useLocation();
  const [fabOpen, setFabOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Overlays */}
      {(fabOpen || moreOpen) && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => { setFabOpen(false); setMoreOpen(false); }}
        />
      )}

      {/* FAB menu */}
      {fabOpen && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200 lg:hidden">
          {fabActions.map((a) => (
            <button
              key={a.action}
              onClick={() => { setFabOpen(false); console.log(a.action); }}
              className="rounded-full bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg border border-border"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* More menu */}
      {moreOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-48 rounded-xl bg-card border border-border shadow-xl p-2 animate-in fade-in slide-in-from-bottom-4 duration-200 lg:hidden">
          {moreItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMoreOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-md lg:hidden safe-area-bottom">
        {mainTabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}

        {/* FAB */}
        <button
          onClick={() => { setFabOpen(!fabOpen); setMoreOpen(false); }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all shadow-lg -mt-6",
            fabOpen
              ? "bg-muted text-foreground rotate-45"
              : "gradient-primary text-primary-foreground shadow-primary"
          )}
        >
          {fabOpen ? <X size={22} /> : <Plus size={22} />}
        </button>

        {/* More */}
        <button
          onClick={() => { setMoreOpen(!moreOpen); setFabOpen(false); }}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1",
            moreOpen ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MoreHorizontal size={22} />
          <span className="text-[10px] font-medium">Mais</span>
        </button>
      </nav>
    </>
  );
}
