"use client";

import Sidebar from "@/components/sidebar/sidebar";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useAppSelector((state) => state.sidebarReducer);
  return (
    <>
      <div
        className={cn(
          "min-h-screen pt-12 lg:pt-0 xl:px-[280px] bg-neutral-50 dark:bg-background",
          isOpen ? "lg:pl-[240px]" : "lg:pl-[56px]"
        )}
      >
        <Sidebar></Sidebar>
        <main>{children}</main>
      </div>
    </>
  );
}
