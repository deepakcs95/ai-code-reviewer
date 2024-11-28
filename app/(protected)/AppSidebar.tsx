"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from "../../components/ui/sidebar.tsx";
import { Button } from "../../components/ui/button.tsx";
import { LayoutDashboard, MessageCircle, Presentation, CreditCard, Plus } from "lucide-react";
import React from "react";

import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils.ts";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "../../components/ui/sidebar.tsx";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: MessageCircle,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  {
    name: "Project 1",
    id: "1",
  },
  {
    name: "Project 2",
  },
  {
    name: "Project 3",
    id: "3",
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" width={40} height={40} />
          {open && (
            <h1 className="text-2xl font-bold text-primary text-nowrap overflow-hidden">
              Code Reviewer
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link.default
                      href={item.url}
                      className={cn(
                        {
                          "!bg-primary !text-white": pathname === item.url,
                        },
                        "list-none"
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link.default>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild>
                    <div>
                      <div
                        className={cn(
                          "rounded-md border text-sm flex items-center justify-center bg-white text-primary p-2 ",
                          {
                            "!bg-primary !text-white": true,
                          }
                        )}
                      >
                        {project.name[0]}
                      </div>
                      {open && <span className="text-xs">{project.name}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className="h-2">
                <SidebarMenuItem>
                  <Link.default href="/create">
                    <Button variant="outline" className="w-full my-2">
                      <Plus />
                      {open && "Create Project"}
                    </Button>
                  </Link.default>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
