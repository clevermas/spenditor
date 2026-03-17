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
  className?: string;
}

export const DataTable = memo<DataTableProps<FlattenTransactionsRow>>(
  ({ data, readonly = false, className = "-mt-2" }: DataTableProps<FlattenTransactionsRow>) => {
    const table = useReactTable({
      data,
      columns: readonly ? columnsWithoutActions : columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <div className={className}>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, i) => {
            const dividerRow = row.original as IDailyTransactionsDividerRow;
            if (dividerRow.isDividerRow) {
              return (
                <DailyTransactionsDividerRow
                  key={row.id}
                  date={dividerRow.date}
                ></DailyTransactionsDividerRow>
              );
            } else {
              return (
                <div
                  key={row.id}
                  className={
                    "group grid gap-0 md:gap-2 items-center py-1 sm:py-0 md:h-11 " +
                    (readonly
                      ? "grid-cols-[minmax(58%,1fr)_30%] md:grid-cols-[minmax(270px,30%)_minmax(120px,1fr)_100px]"
                      : "grid-cols-[minmax(58%,1fr)_30%_16px] md:grid-cols-[200px_minmax(120px,1fr)_100px_25px]" 
                    )
                  }
                >
                  {row
                    .getVisibleCells()
                    .map(
                      (cell: Cell<FlattenTransactionsRow, any>, i: number) => (
                        <div
                          key={cell.id}
                          className={i === 1 ? "hidden md:block" : ""}
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
  className
}: {
  date: string;
  className?: string;
}) {
  const momentDate = moment(date);

  const isEqualDay = (subtractDays = 0) =>
    moment().subtract(subtractDays, "day").startOf("day").toISOString() ===
    momentDate.startOf("day").toISOString();

  const isSameYear = moment().year() === momentDate.year();

  const formatDate = () =>
    momentDate.format("DD MMMM") + (isSameYear ? "" : " " + momentDate.year());

  return (
    <div className={cn("text-base py-2", className || {})}>
      {isEqualDay() ? "Today" : isEqualDay(1) ? "Yesterday" : formatDate()}
    </div>
  );
}
