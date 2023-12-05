import { TransactionClass } from "@/db/transaction";
import moment from "moment";

export interface DailyTransactionsList {
  date: string;
  transactions: TransactionClass[];
}

export enum TransactionTypesEnum {
  Income = "income",
  Expense = "expense",
}

export type TransactionType = "income" | "expense";

export function createDailyTransactionGroups(
  transactions: TransactionClass[]
): DailyTransactionsList[] {
  const groups = [] as DailyTransactionsList[];
  transactions.forEach((transaction) => {
    const date = moment(transaction.date).startOf("day").toISOString();

    let i = groups.findIndex((g) => g.date === date);
    if (i !== -1) {
      groups[i].transactions.push(transaction);
    } else {
      groups.push({ date, transactions: [transaction] });
    }
  });

  return groups;
}

export interface IDailyTransactionsDividerRow {
  date: string;
  isDividerRow: boolean;
}

export type FlattenTransactionsRow =
  | TransactionClass
  | IDailyTransactionsDividerRow;

export function flattenTransactions(
  data: DailyTransactionsList[]
): FlattenTransactionsRow[] {
  return data.reduce(
    (accumulator, { date, transactions }) => [
      ...accumulator,
      { date, isDividerRow: true },
      ...transactions,
    ],
    [] as unknown[]
  ) as FlattenTransactionsRow[];
}
