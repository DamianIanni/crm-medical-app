"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PatientFormSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl h-full flex flex-col rounded-xl p-6 animate-pulse",
        className
      )}
    >
      {/* Header */}
      <Skeleton className="h-10 w-40 mb-2" /> {/* Title */}
      <Skeleton className="h-6 w-72 mb-6" /> {/* Subtitle */}
      {/* Form fields container */}
      <div className="flex-grow space-y-6">
        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-10 w-full md:flex-1" />
          <Skeleton className="h-10 w-full md:flex-1" />
        </div>

        {/* Email and Phone */}
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-10 w-full md:flex-1" />
          <Skeleton className="h-10 w-full md:flex-1" />
        </div>

        {/* Treatment */}
        <Skeleton className="h-10 w-full" />

        {/* Calendar skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />

        {/* Date Picker Field Label */}
        <Skeleton className="h-10 w-32" />
      </div>
      {/* Submit button aligned bottom right */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
