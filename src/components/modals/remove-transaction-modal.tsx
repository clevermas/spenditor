"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  RemoveTransactionModalData
} from "@/redux/features/modal.slice";
import { useRemoveTransactionMutation } from "@/redux/services/account-api";
import { useEffect } from "react";

interface RemoveTransactionModalProps {
  data: RemoveTransactionModalData,
  open: boolean;
  onClose: () => void;
}
export function RemoveTransactionModal({ data, open, onClose }: RemoveTransactionModalProps) {
  const mutation = useRemoveTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;

  const isPending = mutationResult.status === "pending";
  const isSuccess = mutationResult.status === "fulfilled";

  useEffect(() => {
    if (isSuccess) {
        mutationResult.reset();
        onClose();
    }
  }, [isSuccess, mutationResult]);

  function handleSubmit() {
    mutationTrigger(data.transactionId);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the
          transaction.
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} onClick={handleSubmit}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
