import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn
} from "react-hook-form";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import {
  ExpenseCategoriesList,
  IncomeCategoriesList,
} from "@/lib/transaction/transaction-categories";

import { TransactionFormValues } from "@/components/transaction/transaction-form";
import { Label } from "@/components/ui/label";

interface TypeFieldProps {
  field: ControllerRenderProps<TransactionFormValues, "type">,
  fieldState: ControllerFieldState,
  form: UseFormReturn<TransactionFormValues>
}
export const TypeField = ({ field, fieldState, form }: TypeFieldProps) => {
  const onTypeChange = (value: string, field: { onChange: (value: string) => void }) => {
    const isExpense = value === TransactionTypesEnum.Expense;
    const category = isExpense ? ExpenseCategoriesList[0] : IncomeCategoriesList[0];

    form.setValue("category", category);
    field.onChange(value);
  }

  return (
    <RadioGroup
      onValueChange={(value) => onTypeChange(value, field)}
      value={field.value}
      className="grid grid-cols-2 gap-2"
    >
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="type-income" value="income" aria-invalid={fieldState.invalid}/> 
          <Label htmlFor="type-income" className="text-muted-foreground">Income</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="type-expense" value="expense" aria-invalid={fieldState.invalid}/>
          <Label htmlFor="type-expense" className="text-muted-foreground">Expense</Label>
        </div>
    </RadioGroup>
  )
}