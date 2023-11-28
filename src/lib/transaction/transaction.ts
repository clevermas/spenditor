import moment from "moment";

import mongoose from "mongoose";

import { TransactionClass } from "@/db/transaction";
import { ExpenseCategoriesList } from "@/lib/transaction/transaction-categories";
import { createList, randomNItems } from "@/lib/utils";
import { randomUUID } from "crypto";

export interface DailyTransactionsList {
  date: string;
  transactions: TransactionClass[];
}

export enum TransactionTypesEnum {
  Income = "income",
  Expense = "expense",
}

export type TransactionType = "income" | "expense";

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

function createTransactions(date: string): TransactionClass[] {
  return createList(randomNItems(5), (i) => ({
    ...generateTransaction(date),
    date: moment(date)
      .subtract(15 * i, "minute")
      .toDate(),
  }));
}

export function generateTransaction(
  date = new Date().toISOString()
): TransactionClass {
  return {
    _id: randomUUID(),
    id: randomUUID(),
    profileId: randomUUID(),
    accountId: randomUUID(),
    type: "expense",
    amount: getRandomPrice(),
    date: moment(date).toDate(),
    category: getRandomExpenseCategory(),
    tags: (Math.random() > 0.5 ? ["test"] : []) as mongoose.Types.Array<string>,
    comment: "",
  };
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
