"use client";

import { useTheme } from "next-themes";
import {
  LogOut,
  Settings,
  CreditCard,
  Bell,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";

export function AccountActions() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const getInitials = (name: string, lastname: string) => {
    return `${name?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-accent/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage />
            <AvatarFallback className="text-background bg-primary font-bold">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        onInteractOutside={(e) => {
          // Prevent closing when clicking on dropdown items
          const target = e.target as HTMLElement;
          if (target.closest('[role="menuitem"]')) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="font-bold">Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span className="font-bold">Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Bell className="mr-2 h-4 w-4" />
            <span className="font-bold">Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className="mr-2 h-4 w-4" />
            ) : (
              <MoonIcon className="mr-2 h-4 w-4" />
            )}
            <span className="font-bold">Theme</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
