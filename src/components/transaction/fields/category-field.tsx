import {
  ControllerFieldState,
  ControllerRenderProps
} from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import {
  ExpenseCategoriesList,
  IncomeCategoriesList,
} from "@/lib/transaction/transaction-categories";

import { TransactionCategory } from "@/components/transaction/transaction-category";
import { TransactionFormValues } from "@/components/transaction/transaction-form";

interface CategoryFieldProps {
  field: ControllerRenderProps<TransactionFormValues, "category">,
  fieldState: ControllerFieldState,
  type: TransactionTypesEnum
} 
export const CategoryField = ({ field, fieldState, type }: CategoryFieldProps) => {
  const isExpense = type === TransactionTypesEnum.Expense;

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
      <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {(isExpense
          ? ExpenseCategoriesList
          : IncomeCategoriesList
        ).map((category) => (
          <SelectItem key={category} value={category}>
            <TransactionCategory
              type={type}
              category={category}
              className="text-sm"
            ></TransactionCategory>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}