import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, TableProperties } from "lucide-react";
import { usePathname } from "next/navigation";
import { sidebarBurgerMenuVariant } from "./sidebar";

const NavigationLinksIcons = {
  Home: Home,
  Transactions: TableProperties,
};

const navigationLinks = [
  ["/", "Home"],
  ["/transactions", "Transactions"],
];

interface NavigationLinksMenuProps {
  isOpen: boolean;
  isMobile?;
  onLinkClick?: () => void;
}
function NavigationLinksMenu({
  isOpen,
  isMobile,
  onLinkClick = () => {},
}: NavigationLinksMenuProps) {
  const currentUrl = usePathname();

  return (
    <>
      {navigationLinks.map(([url, label]) => {
        const Icon = NavigationLinksIcons[label];
        return (
          <Link
            href={url}
            key={label}
            onClick={() => onLinkClick()}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: isMobile ? "default" : isOpen ? "default" : "sm",
              }),
              currentUrl === url
                ? "bg-sidebar-accent/80 dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent"
                : "",
              "space-x-2",
              sidebarBurgerMenuVariant,
              "flex justify-start",
              isOpen ? "py-2" : "py-1"
            )}
          >
            <Icon size={16}/>
            <span className={cn(isMobile ? "" : isOpen ? "" : "hidden", isOpen ? "text-sm" : "text-xs")}>
              {label}
            </span>
          </Link>
        )
      })}
    </>
  );
}

export default NavigationLinksMenu;
