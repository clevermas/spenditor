import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, TableProperties } from "lucide-react";
import { usePathname } from "next/navigation";
import { sidebarBurgerMenuVariant } from "./sidebar";

const NavigationLinksIcons = {
  Home: <Home />,
  Transactions: <TableProperties />,
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
      {navigationLinks.map(([url, label]) => (
        <Link
          href={url}
          key={label}
          onClick={() => onLinkClick()}
          className={buttonVariants({
            variant: "ghost",
            size: isMobile ? "default" : isOpen ? "default" : "sm",
            className: cn(
              currentUrl === url
                ? "bg-sidebar-accent/80 dark:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent"
                : "",
              "space-x-2",
              sidebarBurgerMenuVariant
            ),
          })
            .replace("inline-flex", "flex")
            .replace("px-4", "px-2")
            .replace("justify-center", "justify-start")}
        >
          {NavigationLinksIcons[label]}
          <span className={isMobile ? "" : isOpen ? "" : "hidden"}>
            {label}
          </span>
        </Link>
      ))}
    </>
  );
}

export default NavigationLinksMenu;
