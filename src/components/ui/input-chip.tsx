import * as React from "react";
import { useContext, useState } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";

type InputChipContextValue = {
  chips: string[];
  onChipsChange: (newChips: string[]) => any;
};

const InputChipContext = React.createContext<InputChipContextValue>(
  {} as InputChipContextValue
);

export interface InputChipProps {
  chips: string[];
  onChipsChange: (newChips: string[]) => any;
  children: React.ReactNode;
}

const InputChip = ({ chips, onChipsChange, children }: InputChipProps) => {
  return (
    <InputChipContext.Provider value={{ chips, onChipsChange }}>
      {children}
    </InputChipContext.Provider>
  );
};

InputChip.displayName = "InputChip";

const useInputChip = () => {
  const context = useContext(InputChipContext);

  return context;
};

const InputChipControl = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [value, setValue] = useState("");
  const { chips, onChipsChange } = useInputChip();

  if (!chips) {
    throw new Error("Use <InputChipControl> within <InputChip>");
  }

  function onChange(e) {
    setValue(e.target.value);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      const newChip = e.target.value;

      if (!chips.includes(newChip)) {
        onChipsChange([...(chips || []), newChip]);
        setValue("");
      }
    }
  }

  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      value={value}
      onKeyDown={onKeyDown}
      onChange={onChange}
      {...props}
    />
  );
});
InputChipControl.displayName = "InputChipControl";

const InputChipList = React.forwardRef<
  HTMLDivElement,
  React.InputHTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { chips, onChipsChange } = useInputChip();

  if (!chips) {
    throw new Error("Use <InputChipList> within <InputChip>");
  }

  function onChipRemove(chip: string) {
    onChipsChange(chips.filter((comparedChip) => comparedChip !== chip));
  }

  return (
    <div ref={ref} className={cn("space-x-2", className)} {...props}>
      {chips.map((chip: string) => (
        <Badge key={chip} className="font-light">
          {chip.toUpperCase()}
          <X
            className="w-[16px] cursor-pointer"
            onClick={() => onChipRemove(chip)}
          />
        </Badge>
      ))}
    </div>
  );
});
InputChipList.displayName = "InputChipList";

export { InputChip, InputChipControl, InputChipList };
