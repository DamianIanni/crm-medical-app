// src/components/ui/overlay-loader.tsx
"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OverlayLoaderProps = {
  className?: string;
};

export function OverlayLoader({ className }: OverlayLoaderProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md-sm",
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
