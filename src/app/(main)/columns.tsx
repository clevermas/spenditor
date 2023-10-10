"use client";

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
import { TransactionCategory } from "@/components/transaction/transaction-category";

import { Transaction } from "@/api/";
import { Button } from "@/components/ui/button";

import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";

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
    cell: ({ row }) => (
      <DataTableActions data={row.original}></DataTableActions>
    ),
  },
];

function DataTableActions({ data }: { data: Transaction }) {
  const dispatch = useAppDispatch();

  function openEditTransactionModal() {
    dispatch(open({ type: "editTransaction", data }));
  }

  function openRemoveTransactionModal() {
    dispatch(
      open({ type: "removeTransaction", data: { transactionId: data?.id } })
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
