"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionClass } from "@/db/transaction";
import { useTransactionModal } from "@/hooks/use-transaction-modal";
import { isEqual } from "@/lib/utils";
import { close } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";
import { useUpdateTransactionMutation } from "@/redux/services/account-api";
import {
  TransactionForm,
  useTransactionForm,
} from "../transaction/transaction-form";

export function EditTransactionModal() {
  const { form } = useTransactionForm();
  const dispatch = useAppDispatch();

  const mutation = useUpdateTransactionMutation();
  const [mutationTrigger, mutationResult] = mutation;
  const [isOpen, data] = useTransactionModal(
    "editTransaction",
    mutation,
    setFormInitialData,
    onClose
  );

  const isPending = mutationResult.status === "pending";
  const isChanged = !isEqual(form.formState?.defaultValues, form.getValues());

  function setFormInitialData(formData) {
    const transaction = formData as TransactionClass;
    const newData = {};
    Object.keys(transaction)
      .filter((key) => key != "id")
      .forEach((key) => {
        const newValue =
          key === "date"
            ? new Date(transaction[key as "date"])
            : transaction[key as keyof TransactionClass];
        newData[key] = newValue;
      });
    form.reset(newData);
  }

  function onClose() {
    mutationResult?.reset();
    form.reset();
  }

  function handleClose() {
    dispatch(close());
  }

  function handleSubmit(
    updatedTransaction: Partial<TransactionClass | { tags: string[] }>
  ) {
    const result = { ...data, ...updatedTransaction };
    mutationTrigger(result);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
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
