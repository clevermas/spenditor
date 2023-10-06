"use client";

import * as moment from "moment";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { Amount } from "@/components/amount";
import {
  Category,
  CategoryType,
  ExpenseCategories,
} from "@/components/category";

export type TransactionType = "income" | "expense";

export type Transaction = {
  type: TransactionType;
  amount: number;
  date: string;
  category: CategoryType;
  tags: string[];
  comment: string;
};

export interface IDailyTransactionsDividerRow {
  date: string;
  isDividerRow: boolean;
}

export interface DailyTransactionsList {
  date: string;
  transactions: Transaction[];
}

export type FlattenTransactionsRow = Transaction | IDailyTransactionsDividerRow;

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({
      row: {
        original: { type, category },
      },
    }) => {
      return <Category category={category} type={type}></Category>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags");
      return (
        <>
          {tags.map((tag) => (
            <Badge key={tag} className="font-light">
              {tag.toUpperCase()}
            </Badge>
          ))}
        </>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return <Amount value={amount}></Amount>;
    },
  },
];

export function flattenTransactions(
  data: DailyTransactionsList[]
): FlattenTransactionsRow[] {
  return data.reduce(
    (accumulator, { date, transactions }) => [
      ...accumulator,
      { date, isDividerRow: true },
      ...transactions,
    ],
    [] as FlattenTransactionsRow[]
  );
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
    tags: ["test"],
    comment: "",
  }));
}

function getRandomPrice() {
  return Number((-Math.random() * 500).toFixed(2));
}

function getRandomExpenseCategory(): CategoryType {
  const categories = Object.keys(ExpenseCategories);
  const randomIndex = Math.ceil(Math.random() * categories.length);
  const category = categories[randomIndex - 1] as CategoryType;
  return category;
}
