"use client";

import Link from "next/link";
import type * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

type SidebarNavProps = {
  items: NavGroupItem[];
  path: string;
};

type NavGroupItem = {
  title: string;
  url: string;
  icon?: React.ReactNode;
  items?: NavItem[];
};

type NavItem = {
  title: string;
  url: string;
  icon?: React.ReactElement
};

export const SidebarNav = ({ items, path }: SidebarNavProps) => {
  return items.map((item) => (
    <SidebarMenu key={item.title} className="space-y-2 px-2">
      {item.items?.map((item) => (
        <SidebarMenuItem key={item.title} className="flex justify-center">
          <SidebarMenuButton asChild isActive={item.url === path}>
            <Link href={item.url}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  ));
};
