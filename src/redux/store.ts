import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import modalReducer from "./features/modal.slice";
import { transactionsApi } from "./services/transactions-api";

export const store = configureStore({
  reducer: {
    modalReducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([transactionsApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
