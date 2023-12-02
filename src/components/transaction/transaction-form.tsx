"use client";

import moment from "moment";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import {
  FieldValues,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    category: "uncategorised",
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

export function TransactionForm({
  form,
  onSubmit,
}: TransactionFormProps<z.infer<typeof formSchema>>) {
  const transactionType = form.getValues("type");
  const isExpense = form.getValues("type") === TransactionTypesEnum.Expense;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-col-1 gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction type</FormLabel>
              <FormControl>
                <Select
                  placeholder="Type"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="text-slate-500">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Category"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(isExpense
                      ? ExpenseCategoriesList
                      : IncomeCategoriesList
                    ).map((category) => (
                      <SelectItem key={category} value={category}>
                        <TransactionCategory
                          type={transactionType}
                          category={category}
                        ></TransactionCategory>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full font-normal mt-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          moment(field.value).format("DD/MM/YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <InputChip chips={field.value} onChipsChange={field.onChange}>
                <FormControl>
                  <InputChipControl placeholder="Enter tag" />
                </FormControl>
                <InputChipList></InputChipList>
              </InputChip>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Input placeholder="Comment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
