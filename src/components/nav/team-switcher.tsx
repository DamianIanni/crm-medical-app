"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2, Home } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
// Using direct import to avoid hook name conflict

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Check if sidebar is collapsed by checking the cookie
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isSidebarCollapsed = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar_state="))
        ?.split("=")[1];

      setIsCollapsed(isSidebarCollapsed === "collapsed");
    }
  }, []);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [selectedCenterName, setSelectedCenterName] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const showIconOnly = isCollapsed || isMobile || isSmallScreen;

  useEffect(() => {
    const updateCenterName = () => {
      try {
        const name = localStorage.getItem("selectedCenterName");
        if (name) setSelectedCenterName(name);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    };

    // Initial load
    updateCenterName();

    // Listen for storage changes
    window.addEventListener("storage", updateCenterName);
    return () => window.removeEventListener("storage", updateCenterName);
  }, []);

  const handleCenters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    router.push("/centers");
  };

  const handleAddCenter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    router.push("/centers/new");
  };

  const displayContent = selectedCenterName ? (
    <div className="flex items-center gap-2 min-w-0">
      {showIconOnly ? (
        <Home className="size-5 flex-shrink-0" />
      ) : (
        <>
          <span className="font-semibold truncate">{selectedCenterName}</span>
        </>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Home className="size-5 flex-shrink-0" />
      {!showIconOnly && <span>Select center</span>}
    </div>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-center md:justify-between cursor-pointer min-w-0"
              onClick={() => setIsOpen(!isOpen)}
              title={selectedCenterName || "Select center"}
            >
              {displayContent}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[200px] rounded-lg z-[100]"
            align="start"
            side={isMobile || isSmallScreen ? "bottom" : "right"}
            sideOffset={4}
            onInteractOutside={(e) => {
              // Prevent closing when clicking on the trigger
              const target = e.target as HTMLElement;
              if (target.closest("[data-radix-popper-content-wrapper]")) {
                e.preventDefault();
              }
            }}
          >
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={handleCenters}
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Building2 className="size-3.5 shrink-0" />
              </div>
              <div className="font-bold">Centers</div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={handleAddCenter}
            >
              <div className="flex size-6 items-center justify-center rounded-md border ">
                <Plus className="size-3.5 shrink-0" />
              </div>
              <div className="font-bold">New center</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
