"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/sidebar/logo";
import ModeToggle from "@/components/sidebar/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggle } from "@/redux/features/sidebar.slice";
import { UserButton } from "@clerk/nextjs";
import { Home, Menu, TableProperties } from "lucide-react";

const NavigationLinksIcons = {
  Home: <Home />,
  Transactions: <TableProperties />,
};

const navigationLinks = [
  ["/", "Home"],
  ["/transactions", "Transactions"],
];

const sidebarIconColorVariant =
  "text-sidebar-foreground hover:text-sidebar-foreground";
const sidebarIconVariant = cn(
  "hover:bg-sidebar-accent",
  sidebarIconColorVariant
);

function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { isOpen } = useAppSelector((state) => state.sidebarReducer);

  return (
    <aside
      className={cn(
        "lg:block z-[50] fixed left-0 top-0 h-[calc(100vh)] bg-background bg-sidebar",
        "dark:border-r-[1px]",
        isOpen ? "w-[240px]" : "w-[56px]"
      )}
    >
      <div
        className={cn(
          "flex items-center pt-2",
          isOpen ? "pl-2 pr-2 space-x-2 lg:h-12" : "flex-col space-y-1"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn("py-2", sidebarIconVariant)}
          onClick={() => dispatch(toggle())}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo
          className={cn(
            "hidden",
            isOpen ? "flex grow justify-center" : "hidden",
            sidebarIconColorVariant
          )}
        />
        <ModeToggle className={cn("py-2", sidebarIconVariant)}></ModeToggle>
      </div>
      <div className="w-full p-2 flex justify-center">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>
      <div className="p-2 flex flex-col gap-2">
        {navigationLinks.map(([url, label]) => (
          <Link
            href={url}
            key={label}
            className={buttonVariants({
              variant: "ghost",
              size: isOpen ? "default" : "sm",
              className: cn(
                pathname === url
                  ? "bg-sidebar-accent/80 dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent"
                  : "",
                "space-x-2",
                sidebarIconVariant
              ),
            })
              .replace("justify-center", "justify-start")
              .replace("px-4", "px-2")}
          >
            {NavigationLinksIcons[label]}
            <span className={isOpen ? "" : "hidden"}>{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
