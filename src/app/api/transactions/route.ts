import * as moment from "moment";

import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { createList } from "@/lib/utils";

import { getPage, PaginationDataResponseDTO } from "@/lib/pagination";

import { CategoryType, ExpenseCategoriesList } from "@/lib/expense-categories";

import { DailyTransactionsList, Transaction } from "@/api/common";

export type GetTransactionsResponseDTO = PaginationDataResponseDTO<
  DailyTransactionsList[]
>;

export const data = {
  data: createList(24, (i) => createDailyTransactions(i + 1)),
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = +searchParams.get("page") || 1;
  const limit = +searchParams.get("limit") || 5;

  return NextResponse.json(getPage(data.data, page, limit));
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
  return createList(5, (i) => ({
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
