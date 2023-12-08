"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/components/sidebar/logo";
import ModeToggle from "@/components/sidebar/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContentWithoutClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toggle } from "@/redux/features/sidebar.slice";
import { UserButton } from "@clerk/nextjs";
import { Home, Menu, TableProperties } from "lucide-react";
import { useState } from "react";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  function toggleMobileDialog() {
    setIsMobileOpen((s) => !s);
  }

  return (
    <aside
      className={cn(
        " z-[50] fixed left-0 top-0 bg-sidebar",
        "dark:border-r-[1px]",
        "lg:block lg:h-screen",
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
      <div className="hidden lg:flex w-full p-2 justify-center">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>

      <div className="hidden lg:flex flex-col gap-2 p-2">
        <NavigationLinksMenu isOpen={isOpen} currentUrl={pathname} />
      </div>

      {/* mobile navigation */}
      <div className="container px-2 w-full h-full flex gap-2 justify-between items-center lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className={cn("py-2", sidebarIconVariant)}
          onClick={toggleMobileDialog}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo
          className={cn(
            "flex grow justify-center pl-8 md:pl-20",
            sidebarIconColorVariant
          )}
        />
        <ModeToggle className={cn("py-2", sidebarIconVariant)}></ModeToggle>
        <div className="">
          <UserButton afterSignOutUrl="/"></UserButton>
        </div>
      </div>

      <Dialog open={isMobileOpen} onOpenChange={toggleMobileDialog}>
        <DialogContentWithoutClose className="sidebar-mobile-dialog bg-sidebar border-sidebar top-[50vh] max-w-[240px] left-[120px] h-screen p-0">
          <div className="container p-2 flex flex-col gap-2">
            <NavigationLinksMenu
              isOpen={isOpen}
              currentUrl={pathname}
              isMobile={true}
              onLinkClick={toggleMobileDialog}
            />
          </div>
        </DialogContentWithoutClose>
      </Dialog>
    </aside>
  );
}

interface NavigationLinksMenuProps {
  isOpen: boolean;
  currentUrl: string;
  isMobile?;
  onLinkClick?: () => void;
}
const NavigationLinksMenu = ({
  isOpen,
  currentUrl,
  isMobile,
  onLinkClick = () => {},
}: NavigationLinksMenuProps) => {
  return navigationLinks.map(([url, label]) => (
    <Link
      href={url}
      key={label}
      onClick={isMobile ? () => onLinkClick() : () => {}}
      className={buttonVariants({
        variant: "ghost",
        size: isMobile ? "default" : isOpen ? "default" : "sm",
        className: cn(
          currentUrl === url
            ? "bg-sidebar-accent/80 dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent"
            : "",
          "space-x-2",
          sidebarIconVariant
        ),
      })
        .replace("inline-flex", "flex")
        .replace("px-4", "px-2")
        .replace("justify-center", "justify-start")}
    >
      {NavigationLinksIcons[label]}
      <span className={isMobile ? "" : isOpen ? "" : "hidden"}>{label}</span>
    </Link>
  ));
};

export default Sidebar;
