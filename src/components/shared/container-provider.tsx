"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ContainerContextProps {
  type: string;
  size: string;
  updateType: (type: string) => void;
  updateSize: (size: string) => void;
}
const ContainerContext = createContext<ContainerContextProps | null>(null);

export const ContainerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [type, setType] = useState("default");
  const [size, setSize] = useState("max-w-3xl");

  const updateType = useCallback(setType, []);
  const updateSize = useCallback(setSize, []);

  return (
    <ContainerContext value={{ type, size, updateType, updateSize }}>
      {children}
    </ContainerContext>
  );
};

export const useContainer = () => {
  const context = useContext(ContainerContext);

  return context;
};
