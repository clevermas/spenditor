"use client";

import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { Provider } from "react-redux";
import { setupStore } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
  const store = setupStore();

  setupListeners(store.dispatch);

  return <Provider store={store}>{children}</Provider>;
}
