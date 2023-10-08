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

import { Transaction } from "@/api/transactions/";
import { Button } from "@/components/ui/button";

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
