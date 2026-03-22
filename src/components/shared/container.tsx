"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { useContainer } from "@/components/shared/container-provider";
import { useSidebar } from "@/components/ui/sidebar";
import styles from "./container.module.css";

interface AdminContainerProps {
  children?: React.ReactNode;
  // provided null option to let dependent containers obtain parameters from the main container
  // e.g. header navbar in layout and page containers
  type?: string | null;
  size?: string | null;
  className?: string;
}
export const Container = ({
  children,
  type: _type,
  size: _size,
  className,
}: AdminContainerProps) => {
  const [isShown, setIsShown] = useState(false);
  const { open, isMobile } = useSidebar();
  const container = useContainer();
  const path = usePathname();
  const prevPath = useRef(path);

  useEffect(() => {
    if (!isShown) {
      setIsShown(true);
    }
  }, [isShown]);

  useEffect(() => {
    if (_type === null && path !== prevPath.current) {
      prevPath.current = path;
      setIsShown(false);
    }
  }, [_type, path]);

  useEffect(() => {
    if (_type !== null) {
      container?.updateType(_type ?? "default");
    }
  }, [_type, container]);

  useEffect(() => {
    if (_size !== null) {
      container?.updateSize(_size ?? "max-w-3xl");
    }
  }, [_size, container]);

  if (!container) return <div className="container">{children}</div>;

  const { type, size } = container;

  // 8 rem = sidebar width / 2
  const containerStyle = cn(
    "container px-4 mx-auto",
    !isShown && "opacity-0",

    type === "default" &&
      cn(open ? "xl:-translate-x-[7.28rem]" : "-translate-x-0", size),

    type === "full-width" &&
      cn(
        "xl:max-w-[80rem] 2xl:max-w-[96rem]",
        open && !isMobile
          ? styles["full-width--sidebar-open"]
          : styles["full-width"],
      ),
    className,
  );

  return <div className={containerStyle}>{children}</div>;
};
