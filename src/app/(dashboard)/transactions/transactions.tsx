"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { NoResults } from "@/components/no-results";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { flattenTransactions } from "@/lib/transaction/transaction";
import { cn, createList } from "@/lib/utils";

import { useErrorToastHandler } from "@/hooks/use-error-toast-handler";
import { useAppDispatch } from "@/redux/hooks";
import { accountApi, useAccountDataQuery } from "@/redux/services/account-api";

import { DataTable } from "@/app/(dashboard)/components/transaction/data-table";
import { AddTransactionModal } from "@/components/modals/add-transaction-modal";
import { Container } from "@/components/shared/container";

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, error, isSuccess, isFetching } =
    useAccountDataQuery(currentPage);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const dispatch = useAppDispatch();

  const transactions = useMemo(
    () => flattenTransactions(data?.recentTransactions?.data || []),
    [data?.recentTransactions]
  );
  const totalPages = data?.recentTransactions?.totalPages || 1;
  const updatedCurrentPage = data?.recentTransactions?.currentPage || 1;
  const isLastPage = currentPage === totalPages;

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

  function loadMore() {
    setCurrentPage((p) => p + 1);
  }

  return (
    <section>
      <Container>
        <div className="flex flex-1 flex-col gap-4">
          <div className="w-full flex flex-row items-center gap-x-2">
            <h1 className="text-md leading-7">Recent transactions</h1>
          
            <Button
              disabled={isFetching}
              onClick={() => setIsAddTransactionOpen(true)}
              aria-label="add-transaction-button"
              size="icon"
              className="rounded-full w-8 h-8"
            >
              <Plus size={18} strokeWidth={2} />
            </Button>
            <AddTransactionModal 
              open={isAddTransactionOpen} 
              onClose={() => setIsAddTransactionOpen(false)}
            />
          </div>

          <Card className="w-full">
            <CardContent>
              {isSuccess ? (
                <DataTable data={transactions}></DataTable>
              ) : isFetching ? (
                <div className="space-y-4" data-testid="main-skeleton">
                  {createList(10, (i) => (
                    <Skeleton className="h-7" key={i} />
                  ))}
                </div>
              ) : (
                error && <NoResults></NoResults>
              )}
            </CardContent>
          </Card>

          <div className={cn("w-full flex justify-center", !isLastPage && " pb-4")}>
            {!isLastPage && (
              <Button variant="ghost" onClick={loadMore} disabled={isFetching}>
                Load more <ChevronDown size={16} strokeWidth={2}/>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
