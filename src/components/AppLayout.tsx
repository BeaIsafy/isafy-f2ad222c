import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Sidebar - mobile */}
      <div className={cn("lg:hidden fixed z-40 transition-transform duration-300", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main */}
      <main className={cn("transition-all duration-300 min-h-screen", collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]")}>
        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="rounded-md p-2 text-muted-foreground hover:bg-muted">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gradient">ISAFY</span>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
