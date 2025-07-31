"use client";

import { usePathname } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PageHeader() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "dashboard");

  return (
    <BreadcrumbList>
      {segments.map((segment, index) => {
        const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        let label = segment;

        if (label === "patients") label = "Patients";
        else if (label === "team") label = "Team";
        else if (label === "new") label = "New";
        else if (label === "edit") label = "Edit";
        else if (!isNaN(Number(label))) label = `${label}`;

        return (
          <span key={href} className="flex items-center gap-1">
            <BreadcrumbItem>
              <BreadcrumbLink href={isLast ? undefined : href}>
                {label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </span>
        );
      })}
    </BreadcrumbList>
  );
}
