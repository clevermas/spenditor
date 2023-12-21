"use client";

import DarkModeToggle from "@/components/sidebar/dark-mode-toggle";
import Logo from "@/components/sidebar/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContentWithoutClose } from "@/components/ui/dialog";

import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import NavigationLinksMenu from "./navigation-links-menu";

const sidebarIconColorVariant =
  "text-sidebar-foreground hover:text-sidebar-foreground";
const sidebarIconVariant = cn(
  "hover:bg-sidebar-accent",
  sidebarIconColorVariant
);

function SidebarMobile() {
  const [isOpen, setIsOpen] = useState(false);

  function onToggle() {
    setIsOpen((state) => !state);
  }

  return (
    <>
      <div className="container pl-2 pr-4 w-full h-full flex gap-2 justify-between items-center lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className={cn("py-2", sidebarIconVariant)}
          aria-label="burger-menu"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo
          className={cn(
            "flex grow justify-center pl-8",
            sidebarIconColorVariant
          )}
        />
        <DarkModeToggle
          className={cn("py-2", sidebarIconVariant)}
        ></DarkModeToggle>
        <div>
          <UserButton afterSignOutUrl="/"></UserButton>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContentWithoutClose className="sidebar-mobile-dialog bg-sidebar border-sidebar top-[50vh] max-w-[240px] left-[120px] h-screen p-0">
          <div className="container p-2 flex flex-col gap-2">
            <NavigationLinksMenu
              isOpen={isOpen}
              isMobile={true}
              onLinkClick={onToggle}
            />
          </div>
        </DialogContentWithoutClose>
      </Dialog>
    </>
  );
}

export default SidebarMobile;
