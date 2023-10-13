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

import { close } from "@/redux/features/modal.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useUpdateTransactionMutation } from "@/redux/services/transactions-api";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";

import { Transaction } from "@/app/api/";
import {
  TransactionForm,
  useTransactionForm,
} from "@/components/transaction/transaction-form";

export function EditTransactionModal() {
  const { form } = useTransactionForm();
  const { type, isOpen, data } = useAppSelector((state) => state.modalReducer);
  const [updateTransaction, updateRequest] = useUpdateTransactionMutation();
  const dispatch = useAppDispatch();
  const isModalOpen = isOpen && type === "editTransaction";

  useErrorToastHandler(updateRequest?.error);

  const setFormInitialData = useCallback(() => {
    Object.keys(data as Transaction)
      .filter((key) => key != "id")
      .forEach((key) => {
        const newValue = key === "date" ? new Date(data[key]) : data[key];
        form.setValue(key, newValue);
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
    if (updateRequest.status === "fulfilled") {
      handleClose();
    }
  }, [updateRequest.status, handleClose]);

  function onSubmit(updatedTransaction) {
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
