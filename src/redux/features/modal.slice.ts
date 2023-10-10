import { Transaction } from "@/app/api/";
import { createSlice } from "@reduxjs/toolkit";

export type ModalType = "addTransaction" | "editTransaction";

type AddTransactionModalData = Exclude<Transaction, { id: string }>;
type EditTransactionModalData = Transaction;
type RemoveTransactionModalData = { transactionId: string };

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
