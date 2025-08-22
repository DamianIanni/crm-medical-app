"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardPageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function DashboardPageWrapper(
  props: DashboardPageWrapperProps
): ReactNode {
  const { children, className } = props;
  return (
    <div
      className={cn(
        "min-h-[calc(100vh-4rem)] flex flex-grow h-full flex-col items-center bg-sidebar rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}
