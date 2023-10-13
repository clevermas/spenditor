export interface DailyTransactionsList {
  date: string;
  transactions: Transaction[];
}

export enum TransactionTypesEnum {
  Income = "income",
  Expense = "expense",
}

export type TransactionType = "income" | "expense";

// TODO: refactor type usage to TransactionClass
export type Transaction = {
  id?: string;
  type: TransactionType;
  amount: string;
  date: string;
  category: string;
  tags: string[];
  comment: string;
};
