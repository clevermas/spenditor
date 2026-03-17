"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useMemo } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Amount } from "@/components/amount"
import { Skeleton } from "@/components/ui/skeleton";
import { NoResults } from "@/components/no-results";

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
      color: "#432dd7",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center">
        <NoResults />
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          bottom: -10,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="weekStartDate"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
          minTickGap={0}
          type="category"
          scale="point"
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
        <defs>
          <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-expenses)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="expenses"
          type="natural"
          fill="url(#fillExpenses)"
          fillOpacity={0.4}
          stroke="var(--color-expenses)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
