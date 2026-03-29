"use client"

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { WeeklyExpensesData } from "@/lib/statistics/weekly-expenses";

interface WeeklyExpensesChartProps {
  data: WeeklyExpensesData[];
  currency: string;
  loading?: boolean;
}
export function WeeklyExpensesChart({
  data,
  currency,
  loading,
}: WeeklyExpensesChartProps) {
  const chartData = useMemo(() => {
    if (loading || !data) {
      return [];
    }
    return data.map((item) => ({
      weekStartDate: item.weekStartDate,
      expenses: item.expenses,
    }));
  }, [data, loading]);

  const chartConfig = {
    expenses: {
      label: "expenses",
      color: "#4f3af7",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="flex h-24 md:h-[300px] flex-col items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex md:h-[300px] flex-col items-center justify-center">
        <NoResults />
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="weekStartDate"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
              formatter={(value) => <Amount value={+value} currency={currency} />}
            />
          }
        />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
