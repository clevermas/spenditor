"use client";

import { AppSidebar } from "@/components/shared/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="pt-18 md:pt-2">
        <header className="fixed bg-header w-full flex justify-between items-center top-0 p-2 md:p-0 md:relative">
          <SidebarTrigger className="md:hidden"/>
          <div className="md:hidden">
            spenditor
          </div>
          <div className="flex items-center md:hidden">
            <UserButton/>
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}
