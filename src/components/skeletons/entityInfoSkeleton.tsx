"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EntityInfoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 animate-pulse",
        className
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-8 w-40" /> {/* Name */}
          <Skeleton className="h-8 w-10 rounded-md" /> {/* Actions */}
        </div>
        <Skeleton className="h-4 w-24" /> {/* ID */}
      </div>

      {/* Info Fields */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-wrap md:flex-nowrap justify-between items-center border-b pb-1 last:border-none"
          >
            <Skeleton className="h-4 w-32" /> {/* Label */}
            <Skeleton className="h-4 w-40 md:w-64" /> {/* Value */}
          </div>
        ))}
      </div>

      {/* Accordion placeholder */}
      <div className="mt-6 space-y-2">
        <Skeleton className="h-6 w-40" /> {/* Accordion trigger */}
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="space-y-1">
            <Skeleton className="h-6 w-28" /> {/* Date */}
            <Skeleton className="h-6 w-full" /> {/* Note line */}
            <Skeleton className="h-6 w-5/6" /> {/* Note line */}
          </div>
        ))}
      </div>
    </div>
  );
}
