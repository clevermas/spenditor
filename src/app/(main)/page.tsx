"use client";

import { Plus } from "lucide-react";

import { Amount } from "@/components/amount";
import { CreateTransactionModal } from "@/components/modals/create-transaction-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";

import { DailyTransactionsList, Transaction } from "@/api/transactions/";
import { useGetTransactionsQuery } from "@/redux/services/transactions-api";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Home() {
  const { isLoading, isFetching, data, error } = useGetTransactionsQuery(null);

  const dispatch = useAppDispatch();

  function openCreateTransactionModal() {
    dispatch(open({ type: "createTransaction" }));
  }

  return (
    <main className="flex justify-center">
      <div className="flex flex-wrap flex-col sm:flex-row gap-2 w-full lg:w-[768px] px-4 lg:px-8 pt-2">
        <section className="grow flex gap-2">
          <h1 className="text-lg text-slate-950">Recent transactions</h1>

          <Button
            className="rounded h-6 w-6 p-0"
            onClick={openCreateTransactionModal}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <CreateTransactionModal></CreateTransactionModal>
        </section>

        <Card className="self-end">
          <CardContent className="flex gap-2 content-center justify-end py-1 px-3 text-slate-600">
            <span className="leading-2">Balance:</span>{" "}
            <Amount value={"12354"}></Amount>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pb-0">
            <DataTable
              data={flattenTransactions(data?.data || [])}
              columns={columns}
            ></DataTable>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export interface IDailyTransactionsDividerRow {
  date: string;
  isDividerRow: boolean;
}

export type FlattenTransactionsRow = Transaction | IDailyTransactionsDividerRow;

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
