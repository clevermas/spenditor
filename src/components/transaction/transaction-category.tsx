"use client";

import { TransactionType } from "@/app/(main)/columns";
import { titleCase } from "@/lib/utils";
import { Bus, CircleOff, Home, ShoppingBasket } from "lucide-react";

export const ExpenseCategoriesMap = {
  uncategorised: <CircleOff />,
  food: <ShoppingBasket />,
  home: <Home />,
  transport: <Bus />,
};

export const ExpenseCategoriesList = Object.keys(ExpenseCategoriesMap);

export type CategoryType = keyof typeof ExpenseCategoriesMap;

export function TransactionCategory({
  type,
  category,
}: {
  type: TransactionType;
  category: CategoryType | string;
}) {
  return (
    <div className="flex content-center gap-2 text-slate-500">
      {ExpenseCategoriesMap[category as CategoryType] || <CircleOff />}{" "}
      {titleCase(category)}
    </div>
  );
}
