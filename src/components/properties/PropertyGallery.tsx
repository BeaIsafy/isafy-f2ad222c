import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  images: string[];
  title: string;
}

export function PropertyGallery({ open, onClose, images, title }: Props) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="relative aspect-[16/10] bg-muted flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
            <Building2 size={80} />
          </div>
          {images.length > 1 && (
            <>
              <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 h-8 w-8" onClick={prev}>
                <ChevronLeft size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm hover:bg-background/80 h-8 w-8" onClick={next}>
                <ChevronRight size={18} />
              </Button>
            </>
          )}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/70 backdrop-blur-sm px-3 py-1 text-xs text-foreground">
            {current + 1} / {images.length}
          </div>
        </div>
        <div className="p-3 text-center">
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
