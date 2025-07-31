/**
 * @file DashboardLayout.tsx
 * @summary This file defines the DashboardLayout component, which provides the main layout structure
 * for the application's dashboard. It includes a sidebar, a header with a sidebar trigger and page title,
 * and a main content area for rendering child components.
 */

"use server";

import { AppSidebar } from "@/components/nav/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/nav/pageHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * DashboardLayout component.
 * This component sets up the overall layout for the dashboard. It uses a `SidebarProvider` to manage
 * the state of the sidebar, renders the `AppSidebar`, and then arranges the main content area
 * with a header and a dynamic main section for children components.
 *
 * @param {object} { children } - React children to be rendered within the main content area.
 * @returns {React.ReactElement} The rendered dashboard layout.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  return (
    <SidebarProvider>
      {/* Renders the application sidebar. */}
      <AppSidebar />
      <div className="pl-[--sidebar-width] flex min-h-screen w-full flex-col bg-muted ">
        <header className=" flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <PageHeader />
          </div>
        </header>
        <main className="flex flex-grow p-2  ">
          <div className="w-full h-full rounded-xl bg-background">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
