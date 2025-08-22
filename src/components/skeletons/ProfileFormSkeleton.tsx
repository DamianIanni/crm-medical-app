"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end">
        <Skeleton className="h-10 w-full sm:w-24" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>
  );
}
