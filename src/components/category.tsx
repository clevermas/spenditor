import { TransactionType } from "@/app/(main)/columns";
import { titleCase } from "@/lib/utils";
import { Bus, CircleOff, Home, ShoppingBasket } from "lucide-react";

export const ExpenseCategories = {
  uncategorised: <CircleOff />,
  food: <ShoppingBasket />,
  home: <Home />,
  transport: <Bus />,
};

export type CategoryType = keyof typeof ExpenseCategories;

export function Category({
  type,
  category,
}: {
  type: TransactionType;
  category: CategoryType | string;
}) {
  return (
    <div className="flex content-center gap-2 text-slate-500">
      {ExpenseCategories[category as CategoryType] || <CircleOff />}{" "}
      {titleCase(category)}
    </div>
  );
}
