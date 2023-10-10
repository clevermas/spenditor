"use client";

import { Fragment, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Amount } from "@/components/amount";

import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";

import { createList } from "@/lib/utils";

import { Transaction } from "@/api/";
import { DailyTransactionsList } from "@/api/transactions/";
import { useGetTransactionsQuery } from "@/redux/services/transactions-api";

import { DataTable } from "./data-table";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isSuccess, isFetching } = useGetTransactionsQuery(currentPage);
  const dispatch = useAppDispatch();

  const transactions = useMemo(
    () => flattenTransactions(data?.data || []),
    [data]
  );
  const totalPages = data?.totalPages ?? 1;

  function openAddTransactionModal() {
    dispatch(open({ type: "addTransaction" }));
  }

  function loadMore() {
    setCurrentPage((p) => p + 1);
  }

  return (
    <main className="flex justify-center">
      <div className="flex flex-wrap flex-col sm:flex-row gap-2 w-full lg:w-[768px] px-4 lg:px-8 py-2">
        <section className="grow flex gap-2">
          <h1 className="text-lg text-slate-950">Recent transactions</h1>

          <Button
            className="rounded h-6 w-6 p-0"
            disabled={isFetching}
            onClick={openAddTransactionModal}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </section>

        <Card className="self-end">
          <CardContent className="flex gap-2 content-center justify-end py-1 px-3 text-slate-600">
            <span className="leading-2">Balance:</span>{" "}
            <Amount value={"12354"}></Amount>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pb-0">
            {isSuccess ? (
              <DataTable data={transactions}></DataTable>
            ) : (
              isFetching && (
                <div className="py-4 space-y-4">
                  {createList(3, (i) => (
                    <Fragment key={i}>
                      <Skeleton className="h-8" />
                      <Skeleton className="h-8 ml-4" />
                      <Skeleton className="h-8 ml-4" />
                      <Skeleton className="h-8 ml-4" />
                      <Skeleton className="h-8 ml-4" />
                    </Fragment>
                  ))}
                </div>
              )
            )}

            {currentPage !== totalPages && (
              <div className="flex justify-center py-2">
                <Button onClick={loadMore} disabled={isFetching}>
                  Load More
                </Button>
              </div>
            )}
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
