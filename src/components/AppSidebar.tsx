import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react";
import logoIsafy from "@/assets/logo-isafy.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Pipeline", icon: Kanban, path: "/pipeline" },
  { label: "Contatos", icon: Users, path: "/contacts" },
  { label: "Imóveis", icon: Building2, path: "/properties" },
  { label: "Agenda", icon: Calendar, path: "/calendar" },
  { label: "Relatórios", icon: BarChart3, path: "/reports" },
];

const bottomItems = [
  { label: "Suporte", icon: HelpCircle, path: "/support" },
  { label: "Configurações", icon: Settings, path: "/settings" },
  { label: "Perfil", icon: User, path: "/profile" },
];

const pipelineSummary = [
  { label: "Funil Captação", sub: "Captação de Imóveis", count: 0, path: "/pipeline?type=captacao" },
  { label: "Funil Vendas", sub: "Atendimento e Agenda", count: 9, path: "/pipeline?type=atendimento" },
  { label: "Pós-Vendas", sub: "Em aberto", count: 0, path: "/pipeline?type=pos_venda" },
];

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo + User header */}
      <div className={cn("flex items-center gap-3 border-b border-sidebar-border px-4", collapsed ? "h-16 justify-center" : "h-auto py-4")}>
        {collapsed ? (
          <Link to="/dashboard">
            <img src={logoIsafy} alt="ISAFY" className="h-7" />
          </Link>
        ) : (
          <>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User size={20} className="text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">Corretor</p>
              <p className="truncate text-xs text-muted-foreground">corretor@isafy.com</p>
            </div>
            <button
              onClick={onToggle}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <div className="flex justify-center py-2">
          <button
            onClick={onToggle}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Nav icons */}
      <nav className="flex-1 space-y-1 px-3 pt-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                collapsed && "justify-center px-0",
                active
                  ? "gradient-primary text-primary-foreground shadow-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Pipeline summary - only when expanded */}
        {!collapsed && (
          <div className="mt-4 space-y-1 border-t border-sidebar-border pt-4">
            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visão Geral</p>
            {pipelineSummary.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-sidebar-foreground">{item.label}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{item.sub}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-sidebar-foreground">{item.count}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Meta mensal - only when expanded */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <p className="text-xs font-semibold text-sidebar-foreground">Minha Meta</p>
          <p className="text-[10px] text-muted-foreground">Meta Mensal de Comissões</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-12 w-12">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeDasharray="57, 100"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-primary">57%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">R$ 6.884</p>
              <p className="text-[11px] text-muted-foreground">de R$ 12.000</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        {bottomItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                collapsed && "justify-center px-0",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
