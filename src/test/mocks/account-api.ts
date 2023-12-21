import moment from "moment";
import mongoose from "mongoose";

import { AccountDataResponseDTO } from "@/app/api/account/route";
import { StatisticsResponseDTO } from "@/app/api/account/statistics/route";
import { TransactionClass } from "@/db/transaction";
import { DailyTransactionsList } from "@/lib/transaction/transaction";
import { ExpenseCategoriesList } from "@/lib/transaction/transaction-categories";
import { createList, ListItem, randomNItems } from "@/lib/utils";
import { randomUUID } from "crypto";

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

export function generateDefaultGetAccountDataDTO(): AccountDataResponseDTO {
  return {
    name: "mocked",
    currency: "USD",
    balance: "60",
    recentTransactions: {
      data: [
        {
          date: new Date().toISOString(),
          transactions: [{ ...generateTransaction(), amount: "66" }],
        },
      ],
      currentPage: 1,
      totalPages: 1,
      offset: 1,
      limit: 5,
    },
  };
}

export function generateDefaultGetStatisticsDTO(): StatisticsResponseDTO {
  return {
    currentMonth: {
      expenseCategories: [{ name: "mocked", value: 666 }],
      weeklyExpenses: [{ name: "mocked", value: 666 }],
      total: 666,
    },
  };
}

export function generateFourChartDataItems(): ListItem[] {
  return [
    { name: "mocked", value: 1 },
    { name: "mocked 2", value: 2 },
    { name: "mocked 3", value: 3 },
    { name: "mocked 4", value: 4 },
  ];
}
