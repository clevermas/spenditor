import moment from "moment";
import { useState } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { TransactionFormValues } from "@/components/transaction/transaction-form";

interface DateFieldProps {
  field: ControllerRenderProps<TransactionFormValues, "date">,
  fieldState: ControllerFieldState
}
export const DateField = ({ field, fieldState }: DateFieldProps) => {
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
          aria-invalid={fieldState.invalid}
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