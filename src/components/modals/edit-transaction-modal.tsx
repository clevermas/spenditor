"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { TransactionClass } from "@/db/transaction";
import { useUpdateTransactionMutation } from "@/redux/services/account-api";
import { useEffect } from "react";
import {
  TransactionForm
} from "../transaction/transaction-form";

interface EditTransactionModalProps {
  data: TransactionClass
  open: boolean;
  onClose: () => void;
}
export function EditTransactionModal({ data, open, onClose }: EditTransactionModalProps) {
  const mutation = useUpdateTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;

  const isPending = mutationResult.status === "pending";
  const isSuccess = mutationResult.status === "fulfilled";

  useEffect(() => {
      if (isSuccess) {
          mutationResult.reset();
          onClose();
      }
  }, [isSuccess, mutationResult]);

  const transaction = data as TransactionClass;
  const newData = {} as TransactionClass;
  
  Object.keys(transaction)
    .filter((key) => key != "id")
    .forEach((key) => {
      const newValue =
        key === "date"
          ? new Date(transaction[key as "date"])
          : transaction[key as keyof TransactionClass];
      newData[key] = newValue;
    });

  function handleSubmit(
    updatedTransaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    const result = { ...data, ...updatedTransaction };
    mutationTrigger(result);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
        </DialogHeader>
          <TransactionForm defaultValues={newData} isPending={isPending} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
