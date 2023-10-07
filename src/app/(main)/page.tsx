"use client";

import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import {
  createDailyTransactions,
  DailyTransactionsList,
  flattenTransactions,
} from "./columns";

import { Amount } from "@/components/amount";
import { CreateTransactionModal } from "@/components/modals/create-transaction-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";

import { DataTable } from "./data-table";

export default function Home() {
  const [transactions, setTransactions] = useState(
    [] as DailyTransactionsList[]
  );
  const dispatch = useAppDispatch();

  const balance = 1325.25;

  useEffect(
    () =>
      setTransactions(
        Array.from(Array(4), (_, i) => createDailyTransactions(i))
      ),
    []
  );

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
            <Amount value={balance}></Amount>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="pb-0">
            <DataTable data={flattenTransactions(transactions)}></DataTable>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
