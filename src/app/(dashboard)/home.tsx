"use client";

import { useEffect, useMemo } from "react";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { flattenTransactions } from "@/lib/transaction/transaction";
import { cn, createList } from "@/lib/utils";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";
import { useAppDispatch } from "@/redux/hooks";
import {
  accountApi,
  useAccountDataQuery,
  useStatisticsQuery,
} from "@/redux/services/account-api";

import { DataTable } from "./components/transaction/data-table";
import { ChevronDown } from "lucide-react";
import { ExpensesPieChart } from "./components/charts/expenses-pie-chart";
import { WeeklyExpensesChart } from "./components/charts/weekly-expenses-chart";

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

  const totalExpenses = statistics?.monthlyExpenses?.total;
  const expenseCategories = statistics?.monthlyExpenses?.categories;
  const weeklyExpenses = statistics?.weeklyExpenses;

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
        <h1 className="text-lg">Your dashboard</h1>

        <section className={cn("w-full grid grid-cols-1 md:grid-cols-2 gap-4",
         "")}
        >
          <Card>
            {statisticsLoaded ? (
              <>
                <CardHeader>
                  <CardTitle>Monthly expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Amount
                    className="text-3xl text-left"
                    value={totalExpenses}
                    currency={data?.currency}
                  ></Amount>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <Skeleton className="h-7" />
                </CardHeader>
                <CardContent data-testid="expenses-skeleton">
                  <Skeleton className="h-9" />
                </CardContent>
              </>
            )}
          </Card>

          <Card>
            {dataLoaded && statisticsLoaded ? (
              <>
                <CardHeader>
                  <CardTitle>Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Amount
                    className="text-3xl text-left"
                    value={+data?.balance}
                    currency={data?.currency}
                  ></Amount>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <Skeleton className="h-7" />
                </CardHeader>
                <CardContent data-testid="balance-skeleton">
                  <Skeleton className="h-9" />
                </CardContent>
              </>
            )}
          </Card>
          <Card>
            <CardHeader>
              {statisticsLoaded ? (
                <CardTitle>Categories</CardTitle>
              ) : (
                <Skeleton className="h-7" />
              )}
            </CardHeader>
            <CardContent>
              <ExpensesPieChart
                data={expenseCategories}
                currency={data?.currency}
                loading={!statisticsLoaded}
              ></ExpensesPieChart>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              {statisticsLoaded ? (
                <CardTitle>Weekly expenses</CardTitle>
              ) : (
                <Skeleton className="h-7" />
              )}
            </CardHeader>
            <CardContent>
              <WeeklyExpensesChart
                data={weeklyExpenses}
                currency={data?.currency}
                loading={!statisticsLoaded}
              ></WeeklyExpensesChart>
            </CardContent>
          </Card>
        </section>

        <div className="w-full flex gap-4 justify-between items-center">
          <h2 className="text-base">Recent transactions</h2>
          <Link
            href="/transactions"
            aria-label="manage"
            className={buttonVariants({ variant: 'ghost' })}
          >
              Show more <ChevronDown size={16} strokeWidth={2}/>
          </Link>
        </div>

        <Card className="w-full">
          <CardContent className="pb-3">
            {dataLoaded ? (
              <DataTable data={transactions} readonly={true} className="-mt-2"></DataTable>
            ) : isFetching ? (
              <div className="space-y-4" data-testid="main-skeleton">
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
