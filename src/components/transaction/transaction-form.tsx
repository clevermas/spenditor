"use client";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
  UseFormReturn
} from "react-hook-form";

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

import { validateTransactionForm } from "@/lib/transaction/transaction-validation";

import { TypeField, DateField, CategoryField } from "./fields";

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

export const useTransactionForm = () => {
  const defaultValues = {
    type: "expense",
    category: "expense",
    tags: [],
    amount: "",
  };
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return { form };
};

interface TransactionFormProps {
  form: UseFormReturn<TransactionFormValues>;
  onSubmit: SubmitHandler<TransactionFormValues>;
};
export function TransactionForm({
  form,
  onSubmit,
}: TransactionFormProps) {
  return (
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-col-1 gap-2"
      >
        <Controller
          control={form.control}
          name="type"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Type</FieldLabel>
              <TypeField field={field} fieldState={fieldState} form={form} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        
        <FieldSet className="grid grid-cols-2 gap-2">
          <Controller
            control={form.control}
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
            control={form.control}
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
          control={form.control}
          name="category"
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <CategoryField field={field} fieldState={fieldState} form={form} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )
          }}
        />

        <Controller
          control={form.control}
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
          control={form.control}
          name="comment"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Comment</FieldLabel>
              <Input placeholder="Comment" {...field} aria-invalid={fieldState.invalid} />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </form>
  );
}
