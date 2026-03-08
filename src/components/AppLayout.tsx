import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar, type PanelType } from "./AppSidebar";
import { SidebarSubPanel } from "./SidebarSubPanel";
import { MobileBottomBar } from "./MobileBottomBar";
import { GlobalHeader } from "./GlobalHeader";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const mainMargin = activePanel ? "lg:ml-[280px]" : "lg:ml-[60px]";

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar activePanel={activePanel} onPanelToggle={setActivePanel} />
        {activePanel &&
        <SidebarSubPanel panel={activePanel} onClose={() => setActivePanel(null)} />
        }
      </div>

      {/* Click-away for sub panel */}
      {activePanel &&
      <div
        className="fixed inset-0 z-20 hidden lg:block"
        onClick={() => setActivePanel(null)} />
      }

      {/* Main */}
      <main className={cn("transition-all duration-300 min-h-screen", mainMargin)}>
        <div className="p-3 md:p-4 lg:p-5 pb-20 lg:pb-5">
          <GlobalHeader />
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom bar */}
      <MobileBottomBar />
    </div>);

}