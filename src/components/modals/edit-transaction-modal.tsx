"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { close } from "@/redux/features/modal.slice";

import { Transaction } from "@/app/api/transactions/";
import {
  TransactionForm,
  useTransactionForm,
} from "@/components/transaction/transaction-form";

export function EditTransactionModal() {
  const { type, isOpen, data } = useAppSelector((state) => state.modalReducer);

  const { form } = useTransactionForm();

  const dispatch = useAppDispatch();

  const isModalOpen = isOpen && type === "editTransaction";

  useMemo(() => {
    if (isModalOpen) {
      setFormInitialData();
    }
  }, [isModalOpen]);

  function setFormInitialData() {
    Object.keys(data as Transaction)
      .filter((key) => key != "id")
      .forEach((key) => {
        const newValue = key === "date" ? new Date(data[key]) : data[key];
        form.setValue(key, newValue);
      });
  }

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
          <DialogTitle>Edit transaction</DialogTitle>
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
