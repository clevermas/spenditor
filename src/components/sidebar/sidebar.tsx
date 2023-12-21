import { cn } from "@/lib/utils";
import { toggle } from "@/redux/features/sidebar.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import SidebarDesktop from "./sidebar-desktop";
import SidebarMobile from "./sidebar-mobile";

export const sidebarBurgerMenuColorVariant =
  "text-sidebar-foreground hover:text-sidebar-foreground";
export const sidebarBurgerMenuVariant = cn(
  "hover:bg-sidebar-accent",
  sidebarBurgerMenuColorVariant
);

function Sidebar() {
  const dispatch = useAppDispatch();
  const currentUrl = usePathname();
  const { isOpen } = useAppSelector((state) => state.sidebarReducer);

  function onToggle() {
    dispatch(toggle());
  }

  return (
    <aside
      className={cn(
        "z-[50] fixed left-0 top-0 bg-sidebar",
        "dark:border-r-[1px]",
        "lg:block lg:h-screen",
        "h-12 w-screen",
        isOpen ? "lg:w-[240px]" : "lg:w-[56px]"
      )}
    >
      <SidebarDesktop isOpen={isOpen} onToggle={onToggle}></SidebarDesktop>
      <SidebarMobile></SidebarMobile>
    </aside>
  );
}

export default Sidebar;
