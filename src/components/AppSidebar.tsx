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
  LogOut } from
"lucide-react";
import logoIsafy from "@/assets/logo-isafy.png";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger } from
"@/components/ui/tooltip";

const navItems = [
{ label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", panel: null },
{ label: "Agenda", icon: Calendar, path: "/calendar", panel: null },
{ label: "Pipeline", icon: Kanban, path: "/pipeline", panel: "pipeline" as const },
{ label: "Imóveis", icon: Building2, path: "/properties", panel: "properties" as const },
{ label: "Contatos", icon: Users, path: "/contacts", panel: "contacts" as const },
{ label: "Relatórios", icon: BarChart3, path: "/reports", panel: null }];


const bottomItems = [
{ label: "Suporte", icon: HelpCircle, path: "/support" },
{ label: "Configurações", icon: Settings, path: "/settings" },
{ label: "Perfil", icon: User, path: "/profile" }];


export type PanelType = "pipeline" | "properties" | "contacts" | null;

export function AppSidebar({
  activePanel,
  onPanelToggle



}: {activePanel: PanelType;onPanelToggle: (panel: PanelType) => void;}) {
  const location = useLocation();

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.panel) {
      onPanelToggle(activePanel === item.panel ? null : item.panel);
    } else {
      onPanelToggle(null);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[60px] flex-col items-center border-r border-sidebar-border bg-sidebar py-3">
        {/* Logo */}
        <Link to="/dashboard" className="mb-4 flex h-6 w-10 items-center justify-center">
          <img alt="ISAFY" className="h-6" src="/lovable-uploads/452b857a-96d9-4bef-bc73-fa5da4890a86.jpg" />
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => {
            const active =
            location.pathname === item.path ||
            item.panel && activePanel === item.panel;
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                      active ?
                      "gradient-primary text-primary-foreground shadow-primary" :
                      "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>

                    <item.icon size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>);

          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-1">
          {bottomItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    onClick={() => onPanelToggle(null)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                      active ?
                      "bg-sidebar-accent text-sidebar-accent-foreground" :
                      "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>

                    <item.icon size={20} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>);

          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
                <LogOut size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>

          {/* User avatar */}
          <div className="mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <User size={16} className="text-primary" />
          </div>
        </div>
      </aside>
    </TooltipProvider>);

}