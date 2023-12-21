"use client";

import DarkModeToggle from "@/components/sidebar/dark-mode-toggle";
import Logo from "@/components/sidebar/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import NavigationLinksMenu from "./navigation-links-menu";
import {
  sidebarBurgerMenuColorVariant,
  sidebarBurgerMenuVariant,
} from "./sidebar";

function SidebarDesktop({ isOpen, onToggle }) {
  return (
    <div
      className={cn(
        "z-[50] fixed left-0 top-0 bg-sidebar",
        "dark:border-r-[1px]",
        "hidden lg:block lg:h-screen",
        "h-12 w-screen",
        isOpen ? "lg:w-[240px]" : "lg:w-[56px]"
      )}
    >
      <div
        className={cn(
          "hidden lg:flex items-center pt-2 px-2",
          isOpen ? "space-x-2 h-12" : "ml-[1px] flex-col space-y-1"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn("py-2", sidebarBurgerMenuVariant)}
          aria-label="burger-menu"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo
          className={cn(
            "hidden",
            isOpen ? "flex grow justify-center" : "hidden",
            sidebarBurgerMenuColorVariant
          )}
        />
        <DarkModeToggle
          className={cn("py-2", sidebarBurgerMenuVariant)}
        ></DarkModeToggle>
      </div>
      <div className="hidden lg:flex w-full p-2 justify-center">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>

      <div className="hidden lg:flex flex-col gap-2 p-2">
        <NavigationLinksMenu isOpen={isOpen} />
      </div>
    </div>
  );
}

export default SidebarDesktop;
