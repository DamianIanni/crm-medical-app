"use client";

import * as React from "react";
import { Bot, LucideHospital, HousePlus, BookUser } from "lucide-react";

import { NavMain } from "@/components/nav/nav-main";
import { NavUser } from "@/components/nav/nav-user";
import { TeamSwitcher } from "@/components/nav/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "../providers/AuthProvider";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    ...(user.role !== "employee"
      ? [
          {
            title: "Team",
            url: "#",
            icon: Bot,
            items: [
              {
                title: "Members",
                url: "/dashboard/team",
              },
            ],
          },
        ]
      : []),
    {
      title: "Patients",
      url: "/dashboard/patients",
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: "Patients",
          url: "/dashboard/patients",
        },
        {
          title: "Add new patient",
          url: "/dashboard/patients/new",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            { name: "Amager Hospital", logo: LucideHospital },
            { name: "Copenhagen Clinic", logo: HousePlus },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.firstName,
            lastname: user.lastName,
            email: user.email,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
