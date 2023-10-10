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
import { useAddTransactionMutation } from "@/redux/services/transactions-api";
import { useCallback, useEffect } from "react";

export function AddTransactionModal() {
  const { form } = useTransactionForm();
  const { type, isOpen } = useAppSelector((state) => state.modalReducer);
  const [addTransaction, updateRequest] = useAddTransactionMutation();
  const dispatch = useAppDispatch();
  const isModalOpen = isOpen && type === "addTransaction";

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  const handleClose = useCallback(() => {
    resetForm();
    updateRequest?.reset();
    dispatch(close());
  }, [dispatch, form, updateRequest, resetForm]);

  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (updateRequest.status === "fulfilled") {
      handleClose();
    }
  }, [updateRequest.status, handleClose]);

  function onSubmit(transaction) {
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
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
