import { CategoryType } from "@/lib/expense-categories";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id?: string;
  type: TransactionType;
  amount: string;
  date: string;
  category: CategoryType;
  tags: string[];
  comment: string;
};
