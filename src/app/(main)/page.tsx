"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";

import { open } from "@/redux/features/modal.slice";
import { useAppDispatch } from "@/redux/hooks";

import { createList } from "@/lib/utils";

import { accountApi, useAccountDataQuery } from "@/redux/services/account-api";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";
import { flattenTransactions } from "@/lib/transaction/transaction";
import { DataTable } from "./(data-table)/data-table";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isSuccess, isFetching } =
    useAccountDataQuery(currentPage);
  const dispatch = useAppDispatch();

  const transactions = useMemo(
    () => flattenTransactions(data?.recentTransactions?.data || []),
    [data?.recentTransactions]
  );
  const totalPages = data?.recentTransactions?.totalPages || 1;
  const updatedCurrentPage = data?.recentTransactions?.currentPage || 1;

  useEffect(
    () => () => {
      dispatch(accountApi.util.resetApiState());
    },
    [dispatch]
  );

  useEffect(() => {
    if (currentPage !== updatedCurrentPage) {
      setCurrentPage(updatedCurrentPage);
    }
  }, [currentPage, updatedCurrentPage]);

  useErrorToastHandler(error);

  function openAddTransactionModal() {
    dispatch(open({ type: "addTransaction" }));
  }

  function loadMore() {
    setCurrentPage((p) => p + 1);
  }

  return (
    <section className="flex justify-center">
      <div className="flex flex-wrap flex-col sm:flex-row gap-2 w-full lg:w-[768px] px-4 lg:px-8 py-2">
        <div className="grow flex gap-2">
          <h1 className="text-lg">Recent transactions</h1>

          <Button
            className="rounded h-6 w-6 p-0"
            disabled={isFetching}
            onClick={openAddTransactionModal}
            aria-label="add-transaction-button"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isFetching && !isSuccess ? (
          <Skeleton
            className="h-6 w-[96px] self-end"
            data-testid="balance-skeleton-container"
          />
        ) : (
          !error && (
            <Card className="self-end">
              <CardContent className="flex gap-2 items-center justify-end py-1 px-3">
                <span className="leading-2">Balance:</span>{" "}
                <Amount
                  value={+data?.balance}
                  currency={data?.currency}
                ></Amount>
              </CardContent>
            </Card>
          )
        )}

        <Card className="w-full">
          <CardContent className="pb-0">
            {isSuccess ? (
              <DataTable data={transactions}></DataTable>
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
    </section>
  );
}
