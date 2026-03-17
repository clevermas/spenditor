"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Amount } from "@/components/amount";
import { TransactionCategory } from "@/components/transaction/transaction-category";

import { TransactionClass } from "@/db/transaction";
import { FlattenTransactionsRow } from "@/lib/transaction/transaction";
import { cn } from "@/lib/utils";

import { DataTableActions } from "./data-table-actions";

export const columns: ColumnDef<FlattenTransactionsRow>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const transaction = row.original as TransactionClass;
      const { type, category } = transaction;
      return (
        <TransactionCategory
          category={category}
          type={type}
          className="text-muted-foreground"
        ></TransactionCategory>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      const transaction = row.original as TransactionClass;
      const contentLength = transaction.comment?.length;
      const categoryLength = transaction.category?.length;
      return (
        <div className={
          cn("text-muted-foreground text-base text-ellipsis text-center whitespace-nowrap overflow-hidden",
              (contentLength <= 34 && categoryLength < 10) || (contentLength < 27 && categoryLength > 10) ? '-ml-[71px]' : ""
        )}>
         {transaction.comment}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      // TODO: provide currency
      return <Amount value={amount}></Amount>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const transaction = row.original as TransactionClass;
      return <DataTableActions data={transaction}></DataTableActions>;
    },
  },
];

export const columnsWithoutActions = columns.slice(0, 3);
