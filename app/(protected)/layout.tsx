import React from "react";
import { SidebarProvider } from "../../components/ui/sidebar.tsx";
import { UserButton } from "@clerk/nextjs";
import AppSidebar from "./AppSidebar.tsx";
type SidebarLayoutProps = {
  children: React.ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen m-2 ">
        <div className="flex items-center gap-3 border-sidebar-border bg-sidebar border shadow-sm rounded p-2 px-4">
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        <div className="h-4"></div>
        <div className="border-sidebar-border bg-sidebar border shadow-sm rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4 scrollbar-hidden">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
