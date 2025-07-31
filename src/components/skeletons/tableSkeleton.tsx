import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full h-full flex flex-col overflow-x-auto rounded-xl bg-sidebar">
      {/* Header */}
      <div className="px-2 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>

      {/* Table */}
      <div className="w-full min-w-[700px]">
        <div className="flex w-full border-b px-4 py-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full " />
          ))}
        </div>

        {[...Array(5)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex w-full border-b px-4 py-4 gap-4 items-center"
          >
            {[...Array(5)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-6 w-full " />
            ))}
          </div>
        ))}
      </div>

      {/* Footer / Pagination */}
      <div className="mt-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-2 py-4">
        <Skeleton className="h-5 w-[100px]" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>
    </div>
  );
}
