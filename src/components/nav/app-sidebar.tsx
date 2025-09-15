"use client";

import * as React from "react";
import { Bot, BookUser } from "lucide-react";
import { useTranslations } from "next-intl";

import { NavMain } from "@/components/nav/nav-main";
import { AccountActions } from "@/components/nav/account-actions";
import { TeamSwitcher } from "@/components/nav/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../providers/AuthProvider";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const t = useTranslations("AppSidebar");

  if (!user) return null;

  const navItems = [
    ...(user.role !== "employee"
      ? [
          {
            title: t("team.title"),
            isActive: true,
            url: "#",
            icon: Bot,
            items: [
              {
                title: t("team.members"),
                url: "/dashboard/team",
              },
              {
                title: t("team.addMember"),
                url: "/dashboard/team/new",
              },
            ],
          },
        ]
      : []),
    {
      title: t("patients.title"),
      url: "/dashboard/patients",
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: t("patients.all"),
          url: "/dashboard/patients",
        },
        {
          title: t("patients.addNew"),
          url: "/dashboard/patients/new",
        },
      ],
    },
    // Centers navigation removed - now handled via center selection page
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      {state === "expanded" && (
        <SidebarFooter className="px-3 pb-3">
          <AccountActions fullWidth />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
