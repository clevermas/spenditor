"use client";

import { useEffect, useMemo } from "react";

import { createList } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";
import { flattenTransactions } from "@/lib/transaction/transaction";
import {
  accountApi,
  useAccountDataQuery,
  useStatisticsQuery,
} from "@/redux/services/account-api";
import ExpensesPieChart from "./charts/expenses-pie-chart";
import WeeklyExpensesChart from "./charts/weekly-expenses-chart";
import { DataTable } from "./transaction/data-table";

export default function Home() {
  const {
    data,
    error,
    isSuccess: dataLoaded,
    isFetching,
  } = useAccountDataQuery(1);
  const { data: statistics, isSuccess: statisticsLoaded } =
    useStatisticsQuery(1);

  const dispatch = useAppDispatch();

  const totalExpenses = statistics?.currentMonth?.total;
  const expenseCategories = statistics?.currentMonth?.expenseCategories;
  const weeklyExpenses = statistics?.currentMonth?.weeklyExpenses;

  const transactions = useMemo(
    () => flattenTransactions(data?.recentTransactions?.data.slice(0, 3) || []),
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
      <div className="flex flex-wrap flex-col sm:flex-row gap-4 w-full lg:w-[1024px] px-4 lg:px-8 py-2">
        <h1 className="text-xl">Your dashboard</h1>

        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <CardContent className="p-0">
              {statisticsLoaded ? (
                <>
                  <h2 className="text-lg">
                    Expenses{" "}
                    <span className="text-sm sm:text-base lg:text-lg">
                      (Current month)
                    </span>
                  </h2>
                  <Amount
                    className="text-3xl text-left"
                    value={totalExpenses}
                    currency={data?.currency}
                  ></Amount>
                </>
              ) : (
                <>
                  <Skeleton className="h-7" />
                  <Skeleton className="h-9 mt-2" />
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
                  <Skeleton className="h-7" />
                  <Skeleton className="h-9 mt-2" />
                </>
              )}
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent className="p-0">
              <h2 className="text-lg">Categories</h2>
              {statisticsLoaded ? (
                expenseCategories ? (
                  <ExpensesPieChart
                    data={expenseCategories}
                    currency={data?.currency}
                  ></ExpensesPieChart>
                ) : (
                  <NoResults></NoResults>
                )
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-[218px] my-4" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent className="p-0">
              <h2 className="text-lg">Weekly Expenses</h2>
              {statisticsLoaded ? (
                weeklyExpenses ? (
                  <WeeklyExpensesChart
                    data={weeklyExpenses}
                    currency={data?.currency}
                  ></WeeklyExpensesChart>
                ) : (
                  <NoResults></NoResults>
                )
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-[218px] my-4" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5" />
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="w-full flex gap-4 justify-between">
          <h2 className="text-lg leading-9">Recent transactions</h2>

          <Link
            href="/transactions"
            aria-label="manage"
            className={buttonVariants({ variant: "ghost" })}
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
                {createList(8, (i) => (
                  <Skeleton className="h-7" key={i} />
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
