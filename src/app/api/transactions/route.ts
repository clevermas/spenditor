import * as moment from "moment";

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { getPage, PaginationDataResponseDTO } from "@/lib/pagination";

import { CategoryType, ExpenseCategoriesList } from "@/lib/expense-categories";

import { Transaction } from "@/api/common";

export interface DailyTransactionsList {
  date: string;
  transactions: Transaction[];
}

export type GetTransactionsResponseDTO = PaginationDataResponseDTO<
  DailyTransactionsList[]
>;

const data = Array.from(Array(24), (_, i) => createDailyTransactions(i));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 5;

  return NextResponse.json(getPage(data, page, limit));
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

function getRandomExpenseCategory(): CategoryType {
  const categories = ExpenseCategoriesList;
  const randomIndex = Math.ceil(Math.random() * categories.length);
  const category = categories[randomIndex - 1] as CategoryType;
  return category;
}
