import * as moment from "moment";
import { NextResponse } from "next/server";

import { getPage, PaginationDataResponseDTO } from "@/lib/pagination";

import { CategoryType, ExpenseCategoriesList } from "@/lib/expense-categories";

export type TransactionType = "income" | "expense";

export type Transaction = {
  type: TransactionType;
  amount: number;
  date: string;
  category: CategoryType;
  tags: string[];
  comment: string;
};

export interface DailyTransactionsList {
  date: string;
  transactions: Transaction[];
}

export type GetTransactionsResponseDTO = PaginationDataResponseDTO<
  DailyTransactionsList[]
>;

export async function GET(req: Request) {
  const data = Array.from(Array(4), (_, i) => createDailyTransactions(i));
  return NextResponse.json(getPage(data, 1));
}

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
  return Array.from(Array(5), (_, i) => ({
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
  return Number((-Math.random() * 500).toFixed(2));
}

function getRandomExpenseCategory(): CategoryType {
  const categories = ExpenseCategoriesList;
  const randomIndex = Math.ceil(Math.random() * categories.length);
  const category = categories[randomIndex - 1] as CategoryType;
  return category;
}
