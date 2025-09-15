"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  LogOut,
  Settings,
  SunIcon,
  MoonIcon,
  Globe,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

interface AccountActionsProps {
  fullWidth?: boolean;
}

export function AccountActions({ fullWidth = false }: AccountActionsProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("AccountActions");

  function changeLanguage(lang: string) {
    if (lang === locale) return;
    Cookies.set("NEXT_LOCALE", lang, { expires: 365 });
    router.refresh();
  }

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
          className={cn(
            "h-12 hover:bg-accent/50 ",
            fullWidth ? "w-full justify-start px-3 gap-3" : "w-4"
          )}
        >
          <Avatar className="h-8 w-8">
            {/* <AvatarImage /> */}
            <AvatarFallback className="text-background bg-primary font-bold">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          {fullWidth && (
            <span className="text-sm flex flex-col items-start font-medium truncate">
              {user.first_name} {user.last_name}
              <span className="text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </span>
          )}
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
            onSelect={(e) => {
              router.push("/account");
              e.preventDefault();
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span className="font-bold">{t("account")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Globe className="mr-2 h-4 w-4" />
            <span className="font-bold">{t("language")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="pl-8 hover:cursor-pointer"
            onClick={() => changeLanguage("en")}
          >
            {locale === "en" && <Check className="mr-2 h-4 w-4" />}{" "}
            {t("english")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="pl-8 hover:cursor-pointer"
            onClick={() => changeLanguage("es")}
          >
            {locale === "es" && <Check className="mr-2 h-4 w-4" />}{" "}
            {t("spanish")}
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
            <span className="font-bold">{t("theme")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-bold">{t("logOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
