import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  ChevronDown } from
"lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
"@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger } from
"@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const mockNotifications = [
{ id: "1", title: "Novo lead cadastrado", desc: "João Silva entrou no funil de captação", time: "5 min", read: false },
{ id: "2", title: "Visita agendada", desc: "Amanhã às 14h — Apt. Vila Mariana", time: "1h", read: false },
{ id: "3", title: "Proposta aceita", desc: "Casa Alphaville — R$ 1.2M", time: "3h", read: true }];


export function GlobalHeader() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userName = "Carlos";

  return (
    <header className="flex items-center justify-between pb-4 mb-2 px-[5px] py-[5px]">
      {/* Greeting — desktop only */}
      <div className="hidden lg:block">
        <h2 className="text-lg font-semibold text-foreground">
          Olá, {userName} 👋
        </h2>
      </div>
      <div className="lg:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground">
          
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground">
              
              <Bell size={18} />
              {unreadCount > 0 &&
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Notificações</p>
              {unreadCount > 0 &&
              <Badge variant="secondary" className="text-[10px]">
                  {unreadCount} novas
                </Badge>
              }
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) =>
              <div
                key={n.id}
                className={`border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                !n.read ? "bg-primary/5" : ""}`
                }>
                
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{n.time}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border px-4 py-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs text-primary w-full">
                Ver todas
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground ml-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <User size={14} className="text-primary" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">{userName}</span>
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
              <User size={14} className="mr-2" /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/")}
              className="cursor-pointer text-destructive focus:text-destructive">
              
              <LogOut size={14} className="mr-2" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>);

}