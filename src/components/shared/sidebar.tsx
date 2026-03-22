"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Rows3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  {
    title: "Dashboard",
    url: "/",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: <LayoutDashboard />
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: <Rows3 />
      },
    ],
  },
];

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="flex flex-row items-center justify-between pl-4 group-data-[state=collapsed]:pl-2 group-data-[state=collapsed]:flex-col">
                <UserButton/>
                <div className="flex group-data-[state=collapsed]:hidden">
                  spenditor
                </div>
                <SidebarTrigger className="group-data-[state=collapsed]:order-first"/>
            </SidebarHeader>
          
            <SidebarContent>
                <SidebarNav items={nav} path={path}></SidebarNav>
            </SidebarContent>

            <SidebarFooter className="items-end  group-data-[state=collapsed]:items-center">
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}