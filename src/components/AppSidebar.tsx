import { useState } from "react";
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
  Menu,
  LogOut,
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

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <img src={logoIsafy} alt="ISAFY" className={cn("h-8 transition-all", collapsed ? "h-7" : "h-8")} />
        </Link>
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
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
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        {bottomItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
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
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
