import * as moment from "moment";

import { ExpenseCategoriesList } from "@/lib/transaction/transaction-categories";
import { createList, randomNItems } from "@/lib/utils";
import { randomUUID } from "crypto";

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

export const createMockData = () =>
  createList(24, (i) => createDailyTransactions(i + 1));

export function createDailyTransactions(
  subtractDays: number = 0
): DailyTransactionsList {
  const date = moment().subtract(subtractDays, "day").toISOString();

  return {
    date,
    transactions: createTransactions(date),
  };
}

function createTransactions(date: string): Transaction[] {
  return createList(randomNItems(5), (i) => ({
    id: randomUUID(),
    type: "expense",
    amount: getRandomPrice(),
    date: moment(date)
      .subtract(15 * i, "minute")
      .toISOString(),
    category: getRandomExpenseCategory(),
    tags: Math.random() > 0.5 ? ["test"] : [],
    comment: "",
  }));
}

function getRandomPrice() {
  return (-Math.random() * 500).toFixed(2);
}

function getRandomExpenseCategory() {
  const categories = ExpenseCategoriesList;
  const randomIndex = randomNItems(categories.length);
  const category = categories[randomIndex - 1];
  return category;
}
