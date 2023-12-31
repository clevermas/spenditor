"use client";

import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";

import {
  TransactionForm,
  useTransactionForm,
} from "@/components/transaction/transaction-form";

import { TransactionClass } from "@/db/transaction";
import { close, ModalType } from "@/redux/features/modal.slice";
import { useAddTransactionMutation } from "@/redux/services/account-api";

export function AddTransactionModal() {
  const { form } = useTransactionForm();
  const { type, isOpen } = useAppSelector((state) => state.modalReducer);
  const [addTransaction, updateRequest] = useAddTransactionMutation();
  const dispatch = useAppDispatch();
  const isModalOpen = (isOpen &&
    type &&
    type === ("addTransaction" as ModalType)) as boolean | undefined;

  useErrorToastHandler(updateRequest?.error);

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  const handleClose = useCallback(() => {
    resetForm();
    updateRequest?.reset();
    dispatch(close());
  }, [dispatch, updateRequest, resetForm]);

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen, resetForm]);

  useEffect(() => {
    if (updateRequest.status === "fulfilled" && isModalOpen) {
      handleClose();
    }
  }, [updateRequest.status, handleClose, isModalOpen]);

  function onSubmit(
    transaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    addTransaction(transaction);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm form={form} onSubmit={onSubmit}></TransactionForm>
        <DialogFooter>
          <Button
            type="submit"
            disabled={updateRequest.status === "pending"}
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
