"use client";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";

const navigationLinks = [
  ["/", "Home"],
  ["/transactions", "Transactions"],
];

function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useAppSelector((state) => state.sidebarReducer);

  return (
    <aside
      className={cn(
        "lg:block z-[50] fixed left-0 top-12 h-[calc(100vh-3rem)] w-[280px]",
        "bg-background dark:bg-surface border-neutral-200 dark:border-neutral-800 border-r-2",
        isOpen ? "" : "hidden"
      )}
    >
      <div className="p-2 flex flex-col gap-1">
        {navigationLinks.map(([url, label]) => (
          <Link
            href={url}
            key={label}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: pathname === url ? "bg-accent" : "",
            }).replace("justify-center", "justify-start")}
          >
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
