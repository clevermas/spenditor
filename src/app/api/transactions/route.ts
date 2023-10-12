import * as moment from "moment";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { DailyTransactionsList } from "@/api/common";
import { Transaction, TransactionClass } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { CategoryType, ExpenseCategoriesList } from "@/lib/expense-categories";
import { getPage, PaginationDataResponseDTO } from "@/lib/pagination";
import { createList, randomNItems } from "@/lib/utils";

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

  const account = await currentAccount();

  let data = await Transaction.find(
    { accountId: account?.id },
    { __v: 0 }
  ).sort({ date: -1 });

  data = createDailyTransactionGroups(data);

  return NextResponse.json(getPage(data, page, limit));
}

function createDailyTransactionGroups(
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

function getRandomExpenseCategory(): CategoryType {
  const categories = ExpenseCategoriesList;
  const randomIndex = randomNItems(categories.length);
  const category = categories[randomIndex - 1] as CategoryType;
  return category;
}
