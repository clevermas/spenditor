"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";

import { Amount } from "@/components/amount";
import { TransactionCategory } from "@/components/transaction/transaction-category";

import { TransactionClass } from "@/db/transaction";
import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";
import { FlattenTransactionsRow } from "./page";

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

function DataTableActions({ data }: { data: TransactionClass }) {
  const dispatch = useAppDispatch();

  function openEditTransactionModal() {
    dispatch(open({ type: "editTransaction", data }));
  }

  function openRemoveTransactionModal() {
    dispatch(
      open({ type: "removeTransaction", data: { transactionId: data?._id } })
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-7 h-7 p-1 hover:bg-slate-200">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={openEditTransactionModal}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openRemoveTransactionModal}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
