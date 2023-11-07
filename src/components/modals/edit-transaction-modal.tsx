"use client";

import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { close, ModalType } from "@/redux/features/modal.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useUpdateTransactionMutation } from "@/redux/services/transactions-api";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";

import {
  TransactionForm,
  useTransactionForm,
} from "@/components/transaction/transaction-form";
import { TransactionClass } from "@/db/transaction";

export function EditTransactionModal() {
  const { form } = useTransactionForm();
  const { type, isOpen, data } = useAppSelector((state) => state.modalReducer);
  const [updateTransaction, updateRequest] = useUpdateTransactionMutation();
  const dispatch = useAppDispatch();
  const isModalOpen = (isOpen &&
    type &&
    type === ("editTransaction" as ModalType)) as boolean | undefined;

  useErrorToastHandler(updateRequest?.error);

  const setFormInitialData = useCallback(() => {
    const transaction = data as TransactionClass;
    Object.keys(transaction)
      .filter((key) => key != "id")
      .forEach((key) => {
        const newValue =
          key === "date"
            ? new Date(transaction[key as "date"])
            : transaction[key as keyof TransactionClass];
        form.setValue(key as any, newValue);
      });
  }, [form, data]);

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  const handleClose = useCallback(() => {
    resetForm();
    updateRequest?.reset();
    dispatch(close());
  }, [dispatch, updateRequest, resetForm]);

  useEffect(() => {
    if (isModalOpen) {
      setFormInitialData();
    } else {
      resetForm();
    }
  }, [isModalOpen, resetForm, setFormInitialData]);

  useEffect(() => {
    if (updateRequest.status === "fulfilled" && isModalOpen) {
      handleClose();
    }
  }, [updateRequest.status, handleClose, isModalOpen]);

  function onSubmit(
    updatedTransaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    const result = { ...data, ...updatedTransaction };
    updateTransaction(result);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
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
