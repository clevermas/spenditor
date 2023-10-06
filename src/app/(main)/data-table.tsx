"use client";
import * as moment from "moment";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { columns } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: columns,
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
              className="grid grid-cols-[minmax(58%,_1fr)_40%] md:grid-cols-[minmax(175px,_30%)_minmax(100px,_1fr)_100px] gap-2 py-3"
            >
              {row.getVisibleCells().map((cell, i) => (
                <div
                  key={cell.id}
                  className={i === 1 ? "order-last md:order-none" : ""}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          )
        )
      ) : (
        <div>
          <div className="h-24 text-center">No results.</div>
        </div>
      )}
    </div>
  );
}

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
    <h3 className={cn("text-sm text-slate-800 py-4", className)}>
      {isEqualDay() ? "Today" : isEqualDay(1) ? "Yesterday" : formatDate()}
    </h3>
  );
}
