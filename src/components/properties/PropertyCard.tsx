import { MapPin, BedDouble, Bath, Car, Maximize, MoreHorizontal, Eye, Pencil, Copy, Pause, XCircle, Trash2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Property } from "@/data/propertiesMockData";
import { statusConfig, purposeLabels } from "@/data/propertiesMockData";
import { getPropertyCompletion, getCompletionColor, getCompletionBarColor } from "@/utils/propertyCompletion";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

interface Props {
  property: Property;
  viewMode: "grid" | "list";
  onView: () => void;
  onEdit: () => void;
  onImageClick: () => void;
  onDuplicate: () => void;
}

export function PropertyCard({ property: p, viewMode, onView, onEdit, onImageClick, onDuplicate }: Props) {
  const mainPrice = p.salePrice ?? p.rentPrice ?? p.seasonPrice ?? 0;
  const priceLabel = p.salePrice ? "" : p.rentPrice ? "/mês" : p.seasonPrice ? "/dia" : "";
  const sc = statusConfig[p.status];
  const completion = getPropertyCompletion(p);
  const completionColor = getCompletionColor(completion);
  const completionBarColor = getCompletionBarColor(completion);

  const ActionMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
        <button className="rounded p-1.5 text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView}><Eye size={14} className="mr-2" /> Ver</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}><Pencil size={14} className="mr-2" /> Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}><Copy size={14} className="mr-2" /> Duplicar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Pause size={14} className="mr-2" /> Pausar</DropdownMenuItem>
        <DropdownMenuItem><XCircle size={14} className="mr-2" /> Desativar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive"><Trash2 size={14} className="mr-2" /> Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (viewMode === "list") {
    return (
      <TooltipProvider delayDuration={200}>
        <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-3 shadow-card transition-all hover:shadow-card-hover cursor-pointer" onClick={onView}>
          <div
            className="h-20 w-28 shrink-0 rounded-lg bg-muted overflow-hidden relative cursor-pointer"
            onClick={e => { e.stopPropagation(); onImageClick(); }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
              <Building2 size={28} />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
              <span className="text-xs text-muted-foreground shrink-0">{p.code}</span>
              <Badge variant="outline" className={cn("text-[10px] shrink-0", sc.className)}>{sc.label}</Badge>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground truncate"><MapPin size={11} />{p.neighborhood}, {p.city}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {p.bedrooms > 0 && <span className="flex items-center gap-0.5"><BedDouble size={12} />{p.bedrooms}</span>}
              {p.bathrooms > 0 && <span className="flex items-center gap-0.5"><Bath size={12} />{p.bathrooms}</span>}
              {p.parkingSpaces > 0 && <span className="flex items-center gap-0.5"><Car size={12} />{p.parkingSpaces}</span>}
              <span className="flex items-center gap-0.5"><Maximize size={12} />{p.totalArea}m²</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", completionBarColor)} style={{ width: `${completion}%` }} />
                  </div>
                  <span className={cn("text-[11px] font-semibold tabular-nums", completionColor)}>{completion}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top"><p>Preenchimento do cadastro</p></TooltipContent>
            </Tooltip>
            <div className="text-right">
              <p className="text-base font-bold text-gradient">{formatCurrency(mainPrice)}{priceLabel}</p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Avatar className="h-4 w-4"><AvatarFallback className="text-[6px] font-bold bg-primary/10 text-primary">{p.brokerInitials}</AvatarFallback></Avatar>
                <span className="text-[10px] text-muted-foreground">{p.brokerName}</span>
              </div>
            </div>
            <ActionMenu />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="group cursor-pointer rounded-xl border border-border/50 bg-card shadow-card transition-all hover:shadow-card-hover overflow-hidden" onClick={onView}>
      <div
        className="h-40 bg-muted relative overflow-hidden cursor-pointer"
        onClick={e => { e.stopPropagation(); onImageClick(); }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
          <Building2 size={48} />
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="outline" className={cn("text-[10px] backdrop-blur-sm bg-background/80", sc.className)}>{sc.label}</Badge>
          {p.purpose.map(pur => (
            <Badge key={pur} variant="secondary" className="text-[10px] backdrop-blur-sm bg-background/80">{purposeLabels[pur]}</Badge>
          ))}
        </div>
        <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
          <ActionMenu />
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-background/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-foreground">
          {p.images.length} fotos
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate text-sm">{p.title}</h3>
            <span className="text-[10px] text-muted-foreground shrink-0">{p.code}</span>
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5"><MapPin size={11} />{p.neighborhood}, {p.city}</p>
        </div>
        <p className="text-lg font-bold text-gradient">{formatCurrency(mainPrice)}<span className="text-xs font-normal text-muted-foreground">{priceLabel}</span></p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {p.bedrooms > 0 && <span className="flex items-center gap-0.5"><BedDouble size={13} />{p.bedrooms}</span>}
            {p.bathrooms > 0 && <span className="flex items-center gap-0.5"><Bath size={13} />{p.bathrooms}</span>}
            {p.parkingSpaces > 0 && <span className="flex items-center gap-0.5"><Car size={13} />{p.parkingSpaces}</span>}
            <span className="flex items-center gap-0.5"><Maximize size={13} />{p.totalArea}m²</span>
          </div>
        </div>
        {/* Completion bar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", completionBarColor)} style={{ width: `${completion}%` }} />
              </div>
              <span className={cn("text-[11px] font-semibold tabular-nums shrink-0", completionColor)}>{completion}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top"><p>Preenchimento do cadastro</p></TooltipContent>
        </Tooltip>
        <div className="flex items-center justify-between border-t border-border/30 pt-2">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">{p.brokerInitials}</AvatarFallback></Avatar>
            <span className="text-[10px] text-muted-foreground">{p.brokerName}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{p.ownerName}</span>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
