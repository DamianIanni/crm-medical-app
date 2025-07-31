"use client";

import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useAuth } from "../providers/AuthProvider";
import { useTheme } from "next-themes";

export function NavUser({
  user,
}: {
  user: {
    name: string | undefined;
    lastname: string | undefined;
    email: string | undefined;
    // avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const FirstLett = `${user.name?.charAt(0)}${user.lastname?.charAt(0)}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {FirstLett}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {FirstLett}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="gap-4">
              <Button
                variant={"ghost"}
                className="hover:cursor-pointer hover:bg-cover w-full flex justify-start"
              >
                <Settings />
                Account
              </Button>
              <Button
                variant={"ghost"}
                className="hover:cursor-pointer hover:bg-cover w-full flex justify-start"
              >
                <CreditCard />
                Billing
              </Button>
              <Button
                variant={"ghost"}
                className="hover:cursor-pointer hover:bg-cover w-full flex justify-start"
              >
                <Bell />
                Notifications
              </Button>
              <Button
                variant={"ghost"}
                className=" hover:bg-cover w-full flex justify-start hover:cursor-pointer "
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                Theme
              </Button>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <Button
              variant={"ghost"}
              onClick={() => handleLogout()}
              className="hover:cursor-pointer hover:bg-cover w-full flex justify-start"
            >
              <LogOut />
              Log out
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
