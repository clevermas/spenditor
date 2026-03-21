"use client";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { TransactionForm } from "@/components/transaction/transaction-form";
import { TransactionClass } from "@/db/transaction";

import { useAddTransactionMutation } from "@/redux/services/account-api";
import { useEffect } from "react";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}
export function AddTransactionModal({ open, onClose }: AddTransactionModalProps) {
  const mutation = useAddTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;
  
  const isPending = mutationResult.status === "pending";
  const isSuccess = mutationResult.status === "fulfilled";

  useEffect(() => {
      if (isSuccess) {
          mutationResult.reset();
          onClose();
      }
  }, [isSuccess, mutationResult]);
  
  function handleSubmit(
    transaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    mutationTrigger(transaction);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm isPending={isPending} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
