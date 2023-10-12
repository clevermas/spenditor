"use client";
import * as moment from "moment";

import { memo } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { columns } from "./columns";

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export const DataTable = memo(
  <TData, TValue>({ data }: DataTableProps<TData, TValue>) => {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <div>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, i) =>
            row.original.isDividerRow ? (
              <DailyTransactionsDividerRow
                className={(i === 0 ? "" : "border-t ") + "border-b"}
                key={row.id}
                date={row.original.date}
              ></DailyTransactionsDividerRow>
            ) : (
              <div
                key={row.id}
                className={
                  "group grid gap-0 md:gap-2 items-center py-0 pt-2 md:pt-0 -mx-6 px-6 md:h-14 cursor-pointer hover:bg-slate-100 " +
                  "grid-cols-[minmax(58%,_1fr)_30%_16px] md:grid-cols-[minmax(175px,_30%)_minmax(100px,_1fr)_100px_16px]"
                }
              >
                {row.getVisibleCells().map((cell, i) => (
                  <div
                    key={cell.id}
                    className={
                      i === 1
                        ? "order-last flex items-center h-8 col-span-3 -mx-6 px-6 bg-slate-50 group-hover:bg-inherit " +
                          "md:order-none md:px-0 md:mx-0 md:col-span-1 md:bg-inherit"
                        : ""
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          )
        ) : (
          <div className="h-24 flex justify-center items-center">
            No results.
          </div>
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
    <h3 className={cn("text-base text-slate-800 py-4 -mx-6 px-6", className)}>
      {isEqualDay() ? "Today" : isEqualDay(1) ? "Yesterday" : formatDate()}
    </h3>
  );
}
