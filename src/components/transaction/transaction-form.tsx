"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputChip,
  InputChipControl,
  InputChipList,
} from "@/components/ui/input-chip";
import {
  ExpenseCategoriesList,
  IncomeCategoriesList,
} from "@/lib/transaction/transaction-categories";

import { validateTransactionForm } from "@/lib/transaction/transaction-validation";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { CategoryField, DateField, TypeField } from "./fields";

export const formSchema = z
  .object({
    type: z.string(),
    category: z.string(),
    date: z.date({
      required_error: "Transaction date is required.",
    }),
    amount: z
      .string({
        required_error: "Amount is required.",
      })
      .min(1, { message: "Amount is required." }),
    tags: z.string().array(),
    comment: z.string().optional(),
  })
  .superRefine(validateTransactionForm as (transaction: any, ctx: any) => void);

export type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  defaultValues?: TransactionFormValues,
  isPending: boolean,
  onSubmit: (transaction: TransactionFormValues) => void;
};
export function TransactionForm({ defaultValues, isPending, onSubmit }: TransactionFormProps) {
   const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      type: "expense",
      category: "expense",
      tags: [],
      amount: "",
    },
  });

  const {
    formState: { isDirty },
    control,
    watch,
    handleSubmit
  } = form;

  const type = watch("type") as TransactionTypesEnum;
  
  function onTypeChange(value: string) {
    const isExpense = value === TransactionTypesEnum.Expense;
    const category = isExpense ? ExpenseCategoriesList[0] : IncomeCategoriesList[0];

    form.setValue("category", category);
  }

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-col-1 gap-2"
      >
        <Controller
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Type</FieldLabel>
              <TypeField field={field} fieldState={fieldState} onChange={onTypeChange} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        
        <FieldSet className="grid grid-cols-2 gap-2">
          <Controller
            control={control}
            name="date"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Transaction Date</FieldLabel>
                <DateField field={field} fieldState={fieldState} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Amount</FieldLabel>
                <Input placeholder="Amount" {...field} aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldSet>

        <Controller
          control={control}
          name="category"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <CategoryField field={field} fieldState={fieldState} type={type} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )
          }}
        />

        <Controller
          control={control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Tags</FieldLabel>
              <InputChip chips={field.value || []} onChipsChange={field.onChange}>
                <InputChipControl placeholder="Enter tag" />
                <InputChipList></InputChipList>
              </InputChip>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="comment"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Comment</FieldLabel>
              <Input placeholder="Comment" {...field} aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Button
          type="submit"
          disabled={!isDirty || isPending}
        >
          Save
        </Button>
      </form>
  );
}
