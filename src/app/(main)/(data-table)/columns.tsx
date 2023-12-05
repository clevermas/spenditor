"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Amount } from "@/components/amount";
import { TransactionCategory } from "@/components/transaction/transaction-category";
import { Badge } from "@/components/ui/badge";

import { TransactionClass } from "@/db/transaction";
import { FlattenTransactionsRow } from "@/lib/transaction/transaction";
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
        ></TransactionCategory>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="space-x-2">
          {tags.map((tag) => (
            <Badge key={tag} className="font-light">
              {tag.toUpperCase()}
            </Badge>
          ))}
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
