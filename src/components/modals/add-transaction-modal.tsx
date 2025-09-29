"use client";

import { useAppDispatch } from "@/redux/hooks";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { TransactionForm, useTransactionForm } from "@/components/transaction/transaction-form";
import { TransactionClass } from "@/db/transaction";
import { useTransactionModal } from "@/hooks/use-transaction-modal";
import { isEqual } from "@/lib/utils";
import { close } from "@/redux/features/modal.slice";
import { useAddTransactionMutation } from "@/redux/services/account-api";

export function AddTransactionModal() {
  const { form } = useTransactionForm();
  const dispatch = useAppDispatch();

  const mutation = useAddTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;
  const [isOpen] = useTransactionModal(
    "addTransaction",
    mutation,
    () => {},
    onClose
  );

  const isPending = mutationResult.status === "pending";
  const isChanged = !isEqual(form.formState?.defaultValues, form.getValues());

  function onClose() {
    mutationResult?.reset();
    form.reset();
  }

  function handleClose() {
    dispatch(close());
  }

  function handleSubmit(
    transaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    mutationTrigger(transaction);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm form={form} onSubmit={handleSubmit}></TransactionForm>
        <DialogFooter>
          <Button
            type="submit"
            disabled={!isChanged || isPending}
            onClick={form.handleSubmit(handleSubmit)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
