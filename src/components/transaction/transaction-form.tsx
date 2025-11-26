"use client";

import moment from "moment";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn
} from "react-hook-form";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import {
  Field,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TransactionCategory } from "@/components/transaction/transaction-category";

import { cn } from "@/lib/utils";

import {
  InputChip,
  InputChipControl,
  InputChipList,
} from "@/components/ui/input-chip";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import {
  ExpenseCategoriesList,
  IncomeCategoriesList,
} from "@/lib/transaction/transaction-categories";
import { validateTransactionForm } from "@/lib/transaction/transaction-validation";

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

export const useTransactionForm = () => {
  const defaultValues = {
    type: "expense",
    category: "expense",
    tags: [],
    amount: "",
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return { form };
};

type TransactionFormProps<TFormValues extends FieldValues> = {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
};

export function TransactionForm<TFormValues extends FieldValues>({
  form,
  onSubmit,
}: TransactionFormProps<TFormValues>) {
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
              <TypeField field={field} form={form} />
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
                <DateField field={field} />
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
                <CategoryField field={field} form={form} />
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
              <InputChip chips={field.value} onChipsChange={field.onChange}>
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

const TypeField = ({ field, form }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "type">, form: UseFormReturn<z.infer<typeof formSchema>> }) => {
  const onTypeChange = (value: string, field: { onChange: (value: string) => void }) => {
    const isExpense = value === TransactionTypesEnum.Expense;
    const category = isExpense ? ExpenseCategoriesList[0] : IncomeCategoriesList[0];

    form.resetField("category", { defaultValue: category});
    field.onChange(value);
  }

  return (
    <RadioGroup
      onValueChange={(value) => onTypeChange(value, field)}
      value={field.value}
      className="grid grid-cols-2 gap-2"
    >
        <FieldLabel className="flex items-center space-x-2"><RadioGroupItem value="income" aria-invalid={field.invalid}/> <span className="text-muted-foreground">Income</span></FieldLabel>
        <FieldLabel className="flex items-center space-x-2"><RadioGroupItem value="expense" aria-invalid={field.invalid}/> <span className="text-muted-foreground">Expense</span></FieldLabel>
    </RadioGroup>
  )
}

const DateField = ({ field }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "date"> }) => {
  const [open, setOpen] = useState(false);

  const onDateChange = (date: Date | undefined, field: { onChange: (value: Date) => void }) => {
    const newDate = moment.utc(moment(date).format("YYYY-MM-DD")).toDate();
    field.onChange(newDate);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full",
            !field.value && "text-muted-foreground"
          )}
          aria-invalid={field.invalid}
        >
          {field.value ? (
            moment.utc(field.value).format("YYYY-MM-DD")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
      >
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(date) => onDateChange(date, field)}
          disabled={[
            { after: new Date() },
            { before: new Date("1900-01-01") },
          ]}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}

const CategoryField = ({ field, form }: { field: ControllerRenderProps<z.infer<typeof formSchema>, "category">, form: UseFormReturn<z.infer<typeof formSchema>> }) => {
  const transactionType = form.watch("type");
  const isExpense = transactionType === TransactionTypesEnum.Expense;

  const onCategoryChange = (value: string, field: { onChange: (value: string) => void }) => {
    // FIXME: investigate why '' is popped up
    if (value !== '') {
      field.onChange(value);
    }
  }

  return (
    <Select
      onValueChange={(value) => onCategoryChange(value, field)}
      value={field.value}
    >
      <SelectTrigger className="w-full" aria-invalid={field.invalid}>
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {(isExpense
          ? ExpenseCategoriesList
          : IncomeCategoriesList
        ).map((category) => (
          <SelectItem key={category} value={category}>
            <TransactionCategory
              type={transactionType}
              category={category}
              className="text-sm"
            ></TransactionCategory>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
