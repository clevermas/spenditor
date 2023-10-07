"use client";

import * as moment from "moment";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";

import { Amount } from "@/components/amount";
import {
  CategoryType,
  ExpenseCategoriesList,
  TransactionCategory,
} from "@/components/transaction/transaction-category";

import { Button } from "@/components/ui/button";

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
      return (
        <TransactionCategory
          category={category}
          type={type}
        ></TransactionCategory>
      );
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
  {
    accessorKey: "actions",
    header: "Actions",
    cell: () => {
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-7 h-7 p-1 hover:bg-slate-200"
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
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
