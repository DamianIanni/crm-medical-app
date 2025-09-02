"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Plus,
  Building2,
  Home,
  Info,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { ToastFeedback } from "../feedback/toastFeedback";
import { ActionDialog } from "../feedback/actionDialog";

export function TeamSwitcher() {
  const t = useTranslations("TeamSwitcher");
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const {
    rejectInvitation,
    isSuccessRejectInvitation,
    isErrorRejectInvitation,
  } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const [selectedCenterName, setSelectedCenterName] = useState<string | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const showIconOnly = isCollapsed || isMobile || isSmallScreen;

  // Refs para los elementos
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  // Check if sidebar is collapsed by checking the cookie
  useEffect(() => {
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
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        dialogTriggerRef.current &&
        !dialogTriggerRef.current.contains(target)
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

  const handleLeaveCenter = async () => {
    const centerId = sessionStorage.getItem("selectedCenterId");
    if (!centerId) return;
    await rejectInvitation(centerId);

    if (isSuccessRejectInvitation) {
      ToastFeedback({
        type: "info",
        title: t("toast.leftCenter"),
        description: t("toast.leftCenterDescription"),
      });
    }

    if (isErrorRejectInvitation) {
      ToastFeedback({
        type: "error",
        title: t("toast.error"),
        description: t("toast.leaveCenterError"),
      });
    }
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
            title={selectedCenterName || t("selectCenter")}
            onClick={toggleDropdown}
          >
            {/* {showIconOnly ? (
              <div className="flex items-center justify-center">
                <Home className="size-5" />
              </div>
            ) : ( */}
            <div className="flex items-center gap-2 w-full">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Home className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">
                  {selectedCenterName || t("selectCenter")}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </div>
            {/* )} */}
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
                {t("centers")}
              </div>
              <div
                className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleCenters}
              >
                <div className="flex size-6 items-center justify-center rounded-md">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                <span className="font-bold">{t("viewCenters")}</span>
              </div>
              <div
                className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={handleAddCenter}
              >
                <div className="flex size-6 items-center justify-center rounded-2xl border ">
                  <Plus className="size-4" />
                </div>
                <span className="font-bold">{t("addCenter")}</span>
              </div>
              <div className="h-px bg-border my-1" />
              {user?.role === "admin" ? (
                <div
                  className="flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={handleViewCenter}
                >
                  <div className="flex size-6 items-center justify-center rounded-md">
                    <Info className="size-4" />
                  </div>
                  <span className="font-bold">{t("infoCenter")}</span>
                </div>
              ) : (
                <ActionDialog
                  title={t("leaveCenterTitle")}
                  description={t("leaveCenterDescription")}
                  onConfirm={handleLeaveCenter}
                  confirmLabel={t("leaveCenter")}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 text-sm font-bold text-destructive hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="size-4" />
                    {t("leaveCenter")}
                  </Button>
                </ActionDialog>
              )}
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
