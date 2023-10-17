import { TransactionClass } from "@/db/transaction";

import { createSlice } from "@reduxjs/toolkit";

export type ModalType = "addTransaction" | "editTransaction";

export type AddTransactionModalData = Exclude<TransactionClass, { id: string }>;
export type EditTransactionModalData = TransactionClass;
export type RemoveTransactionModalData = { transactionId: string };

type ModalData =
  | AddTransactionModalData
  | EditTransactionModalData
  | RemoveTransactionModalData;

type ModalState = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
};

const initialState = {
  type: null,
  data: {},
  isOpen: false,
} as ModalState;

export const modal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    reset: () => initialState,
    open: (state, { payload: { type, data } }) => ({
      ...state,
      isOpen: true,
      type,
      data,
    }),
    close: (state) => ({ ...state, type: null, isOpen: false }),
  },
});

export const { open, close, reset } = modal.actions;
export default modal.reducer;
