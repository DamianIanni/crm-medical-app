// src/components/tables/table-cell-fallback.tsx
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type TableCellFallbackProps = {
  value: string | null | undefined;
  fallback?: string;
  className?: string;
};

export function TableCellFallback({
  value,
  fallback,
  className,
}: TableCellFallbackProps) {
  const t = useTranslations("Table");
  const defaultFallback = t("noInformation");
  const display = value?.trim() ? value : fallback || defaultFallback;

  return (
    <div>
      {value ? (
        <span className={cn("text-sm font-semibold", className)}>
          {display}
        </span>
      ) : (
        <span className={cn("text-sm text-muted-foreground", className)}>
          {display}
        </span>
      )}
    </div>
  );
}
