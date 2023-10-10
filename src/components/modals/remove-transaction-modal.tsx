"use client";

import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { close } from "@/redux/features/modal.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRemoveTransactionMutation } from "@/redux/services/transactions-api";

export function RemoveTransactionModal() {
  const { type, isOpen, data } = useAppSelector((state) => state.modalReducer);
  const [removeTransaction, removeRequest] = useRemoveTransactionMutation();
  const dispatch = useAppDispatch();
  const isModalOpen = isOpen && type === "removeTransaction";

  const handleClose = useCallback(() => {
    removeRequest?.reset();
    dispatch(close());
  }, [dispatch, removeRequest]);

  useEffect(() => {
    if (removeRequest.status === "fulfilled") {
      handleClose();
    }
  }, [removeRequest.status, handleClose]);

  function onSubmit() {
    removeTransaction(data.transactionId);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
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
          <Button
            type="submit"
            disabled={removeRequest.status === "pending"}
            onClick={onSubmit}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
