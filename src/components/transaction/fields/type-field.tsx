import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn
} from "react-hook-form";

import {
  FieldLabel,
} from "@/components/ui/field";
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
        <FieldLabel className="flex items-center space-x-2">
          <RadioGroupItem value="income" aria-invalid={fieldState.invalid}/> 
          <span className="text-muted-foreground">Income</span>
        </FieldLabel>
        <FieldLabel className="flex items-center space-x-2">
          <RadioGroupItem value="expense" aria-invalid={fieldState.invalid}/>
          <span className="text-muted-foreground">Expense</span>
        </FieldLabel>
    </RadioGroup>
  )
}