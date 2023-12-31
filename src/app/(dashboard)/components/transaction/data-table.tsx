"use client";
import moment from "moment";

import {
  Cell,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo } from "react";

import { NoResults } from "@/components/no-results";
import {
  FlattenTransactionsRow,
  IDailyTransactionsDividerRow,
} from "@/lib/transaction/transaction";
import { cn } from "@/lib/utils";
import { columns, columnsWithoutActions } from "./columns";

interface DataTableProps<TData> {
  data: TData[];
  readonly?: boolean;
}

export const DataTable = memo<DataTableProps<FlattenTransactionsRow>>(
  ({ data, readonly = false }: DataTableProps<FlattenTransactionsRow>) => {
    const table = useReactTable({
      data,
      columns: readonly ? columnsWithoutActions : columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <div>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, i) => {
            const dividerRow = row.original as IDailyTransactionsDividerRow;
            if (dividerRow.isDividerRow) {
              return (
                <DailyTransactionsDividerRow
                  className={(i === 0 ? "" : "border-t ") + "border-b"}
                  key={row.id}
                  date={dividerRow.date}
                ></DailyTransactionsDividerRow>
              );
            } else {
              return (
                <div
                  key={row.id}
                  className={
                    "group grid gap-0 md:gap-2 items-center py-0 pt-2 md:pt-0 -mx-6 px-6 md:h-14 " +
                    (readonly
                      ? "grid-cols-[minmax(58%,_1fr)_30%] md:grid-cols-[minmax(175px,_30%)_minmax(100px,_1fr)_100px]"
                      : "grid-cols-[minmax(58%,_1fr)_30%_16px] md:grid-cols-[minmax(175px,_30%)_minmax(100px,_1fr)_100px_16px]" +
                        " cursor-pointer hover:bg-accent/50")
                  }
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (cell: Cell<FlattenTransactionsRow, any>, i: number) => (
                        <div
                          key={cell.id}
                          className={
                            i === 1
                              ? "order-last flex items-center h-8 col-span-3 -mx-6 px-6 bg-accent/70 dark:bg-accent/20 md:bg-transparent md:dark:bg-transparent " +
                                "md:order-none md:px-0 md:mx-0 md:col-span-1" +
                                (readonly ? "" : " group-hover:bg-transparent")
                              : ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      )
                    )}
                </div>
              );
            }
          })
        ) : (
          <NoResults></NoResults>
        )}
      </div>
    );
  }
);

DataTable.displayName = "DataTable";

export function DailyTransactionsDividerRow({
  date,
  className,
}: {
  date: string;
  className: string;
}) {
  const momentDate = moment(date);

  const isEqualDay = (subtractDays = 0) =>
    moment().subtract(subtractDays, "day").startOf("day").toISOString() ===
    momentDate.startOf("day").toISOString();

  const formatDate = () =>
    momentDate.format("dddd").substring(0, 3) +
    ", " +
    momentDate.format("DD MMM");

  return (
    <h3 className={cn("text-base py-4 -mx-6 px-6", className)}>
      {isEqualDay() ? "Today" : isEqualDay(1) ? "Yesterday" : formatDate()}
    </h3>
  );
}
