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

import { useTransactionModal } from "@/hooks/use-transaction-modal";
import {
  close,
  RemoveTransactionModalData,
} from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";
import { useRemoveTransactionMutation } from "@/redux/services/account-api";

export function RemoveTransactionModal() {
  const dispatch = useAppDispatch();

  const mutation = useRemoveTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;

  const [isOpen, data] = useTransactionModal(
    "removeTransaction",
    mutation,
    () => {},
    onClose
  );

  const isPending = mutationResult.status === "pending";

  function onClose() {
    mutationResult?.reset();
  }

  function handleClose() {
    dispatch(close());
  }

  function handleSubmit() {
    mutationTrigger((data as RemoveTransactionModalData).transactionId);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove transaction</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. This will permanently delete the
          transaction.
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={handleClose}>
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
