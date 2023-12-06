"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";
import { flattenTransactions } from "@/lib/transaction/transaction";
import { createList } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import {
  accountApi,
  useAccountDataQuery,
  useStatisticsQuery,
} from "@/redux/services/account-api";
import { Fragment, useEffect, useMemo } from "react";
import { DataTable } from "./transaction/data-table";

export default function Home() {
  const {
    data,
    error,
    isSuccess: dataLoaded,
    isFetching,
  } = useAccountDataQuery(1);
  const { data: statistics, isSuccess: statisticsLoaded } =
    useStatisticsQuery();
  const dispatch = useAppDispatch();

  const totalExpenses = statistics?.totalExpenses;

  const transactions = useMemo(
    () => flattenTransactions(data?.recentTransactions?.data || []),
    [data?.recentTransactions]
  );

  useEffect(
    () => () => {
      dispatch(accountApi.util.resetApiState());
    },
    [dispatch]
  );

  useErrorToastHandler(error);

  return (
    <section className="flex justify-center">
      <div className="flex flex-wrap flex-col sm:flex-row gap-4 w-full lg:w-[768px] px-4 lg:px-8 py-2">
        <h1 className="text-xl">Your dashboard</h1>

        <section className="w-full grid grid-cols-2 gap-4">
          <Card className="p-4">
            <CardContent className="p-0">
              {statisticsLoaded ? (
                <>
                  <h2 className="text-lg">Expenses (Current month)</h2>
                  <Amount
                    className="text-3xl text-left"
                    value={totalExpenses}
                    currency={data?.currency}
                  ></Amount>
                </>
              ) : (
                <>
                  <Skeleton className="h-5" />
                  <Skeleton className="h-8 mt-3" />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardContent className="p-0">
              {dataLoaded ? (
                <>
                  <h2 className="text-lg">Balance</h2>
                  <Amount
                    className="text-3xl text-left"
                    value={+data?.balance}
                    currency={data?.currency}
                  ></Amount>
                </>
              ) : (
                <>
                  <Skeleton className="h-5" />
                  <Skeleton className="h-8 mt-3" />
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="w-full flex gap-4 justify-between">
          <h2 className="text-lg leading-9">Recent transactions</h2>

          <Link
            href="/transactions"
            aria-label="manage"
            className={buttonVariants("default")}
          >
            Manage
          </Link>
        </div>

        <Card className="w-full">
          <CardContent className="pb-0">
            {dataLoaded ? (
              <DataTable data={transactions} readonly={true}></DataTable>
            ) : isFetching ? (
              <div
                className="py-4 space-y-4"
                data-testid="main-skeleton-container"
              >
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
            ) : (
              error && <NoResults></NoResults>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
