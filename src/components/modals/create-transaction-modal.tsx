"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  TransactionForm,
  useTransactionForm,
} from "@/components/transaction/transaction-form";
import { close } from "@/redux/features/modal.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function CreateTransactionModal() {
  const { form } = useTransactionForm();

  const { type, isOpen } = useAppSelector((state) => state.modalReducer);
  const dispatch = useAppDispatch();

  const isModalOpen = isOpen && type === "createTransaction";

  function onSubmit(values) {
    console.log(values);
  }

  function handleClose() {
    form.reset();
    dispatch(close());
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm form={form} onSubmit={onSubmit}></TransactionForm>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
