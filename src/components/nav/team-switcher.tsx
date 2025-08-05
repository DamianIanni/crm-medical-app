"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [selectedCenterName, setSelectedCenterName] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Try to get selected center info from localStorage or cookies
    // Here we assume you store center name in localStorage as 'selectedCenterName'
    // If you only store the ID, you might need to fetch the name from a list or API
    const name =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedCenterName")
        : null;
    if (name) setSelectedCenterName(name);
  }, []);

  function handleCenters() {
    redirect("/centers");
  }

  function handleAddCenter() {
    redirect("/centers/new");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {/* <activeTeam.logo className="size-5" /> */}
                <span className="font-semibold">
                  {selectedCenterName || "Select center"}
                </span>
              </div>
              <ChevronsUpDown className="size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={handleCenters}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Building2 className="size-3.5 shrink-0" />
              </div>
              <div className="text-muted-foreground font-medium">Centers</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={handleAddCenter}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-3.5 shrink-0" />
              </div>
              <div className="text-muted-foreground font-medium">
                New center
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
