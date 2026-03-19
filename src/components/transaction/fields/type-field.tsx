import {
  ControllerFieldState,
  ControllerRenderProps
} from "react-hook-form";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";


import { TransactionFormValues } from "@/components/transaction/transaction-form";
import { Label } from "@/components/ui/label";

interface TypeFieldProps {
  field: ControllerRenderProps<TransactionFormValues, "type">,
  fieldState: ControllerFieldState,
  onChange: (value: string) => void
}
export const TypeField = ({ field, fieldState, onChange }: TypeFieldProps) => {
  const onTypeChange = (value: string, field: { onChange: (value: string) => void }) => {
    field.onChange(value);
    onChange(value);
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