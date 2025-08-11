"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2, Home, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [selectedCenterName, setSelectedCenterName] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const showIconOnly = isCollapsed || isMobile || isSmallScreen;

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

  useEffect(() => {
    const updateCenterName = () => {
      try {
        const name = sessionStorage.getItem("selectedCenterName");
        if (name) setSelectedCenterName(name);
      } catch (error) {
        console.error("Error accessing sessionStorage:", error);
      }
    };

    // Initial load
    updateCenterName();
    window.addEventListener("storage", updateCenterName);
    return () => window.removeEventListener("storage", updateCenterName);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleCenters = () => {
    setIsOpen(false);
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      router.replace("/centers");
    }, 100);
  };

  const handleAddCenter = () => {
    setIsOpen(false);
    // Use setTimeout to ensure dropdown closes before navigation
    setTimeout(() => {
      router.push("/centers/new");
    }, 100);
  };

  const handleViewCenter = () => {
    const centerId = sessionStorage.getItem("selectedCenterId");
    if (centerId) {
      router.push(`/centers/${centerId}`);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative" ref={dropdownRef}>
          <SidebarMenuButton
            size="lg"
            className={cn(
              "w-full justify-center md:justify-between cursor-pointer min-w-0",
              isOpen && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
            title={selectedCenterName || "Select center"}
            onClick={toggleDropdown}
          >
            {showIconOnly ? (
              <div className="flex items-center justify-center">
                <Home className="size-5" />
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Home className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-medium">
                    {selectedCenterName || "Select center"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </div>
            )}
          </SidebarMenuButton>

          {isOpen && (
            <div
              className={cn(
                "absolute z-[100] min-w-56 rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg",
                isMobile || isSmallScreen
                  ? "top-full left-0 mt-1 w-full"
                  : "left-full top-0 ml-1"
              )}
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Centers
              </div>
              <div
                className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleCenters}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <span className="font-medium">Centers</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div
                className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleViewCenter}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Info className="size-4" />
                </div>
                <span className="font-medium">Info Center</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleAddCenter}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <span className="font-medium">Add center</span>
              </div>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
