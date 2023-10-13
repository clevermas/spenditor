"use client";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { titleCase } from "@/lib/utils";
import { Bus, CircleOff, Home, ShoppingBasket } from "lucide-react";

const IncomeCategoriesMap = {
  uncategorised: <CircleOff />,
};

const ExpenseCategoriesMap = {
  uncategorised: <CircleOff />,
  food: <ShoppingBasket />,
  home: <Home />,
  transport: <Bus />,
};

export function TransactionCategory({
  type,
  category,
}: {
  type: TransactionTypesEnum;
  category: string;
}) {
  return (
    <div className="flex content-center gap-2 text-slate-500">
      {(type === TransactionTypesEnum.Expense
        ? ExpenseCategoriesMap[category]
        : IncomeCategoriesMap[category]) || <CircleOff />}{" "}
      {titleCase(category)}
    </div>
  );
}
