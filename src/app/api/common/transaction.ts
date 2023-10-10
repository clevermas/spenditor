import { CategoryType } from "@/lib/expense-categories";

export interface DailyTransactionsList {
  date: string;
  transactions: Transaction[];
}

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
