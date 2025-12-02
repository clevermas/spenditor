"use client"

import { Pie, PieChart } from "recharts";

import { NoResults } from "@/components/no-results";
import { Skeleton } from "@/components/ui/skeleton";
import { ListItem, titleCase } from "@/lib/utils";
import { useMemo } from "react";

import { Amount } from "@/components/amount";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "#3729ac",
  "#432dd7",
  "#4f3af7",
  "#625fff",
  "#7d86ff",
];

const CustomLegendIcon = ({ color }: { color: string }) => (
  <div
    className="h-2 w-2 shrink-0 rounded-full"
    style={{
      backgroundColor: color,
    }}
  />
);

interface ExpensesPieChartProps {
  data: ListItem[];
  currency: string;
  loading?: boolean;
}

export function ExpensesPieChart({
  data,
  currency,
  loading,
}: ExpensesPieChartProps) {
  const chartData = useMemo(() => {
    if (loading || !data) {
      return [];
    }
    return data.map((item, i) => ({
      category: `category-${i + 1}`,
      expenses: item.value,
      fill: COLORS[i % COLORS.length],
    }));
  }, [data, loading]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      expenses: {
        label: "Expenses",
      },
    };
     if (loading || !data) {
      return config;
    }
    data.forEach((item, i) => {
      const color = COLORS[i % COLORS.length];
      config[`category-${i + 1}`] = {
        label: titleCase(item.name),
        color: color,
        icon: () => <CustomLegendIcon color={color} />,
      };
    });
    return config;
  }, [data, loading]);

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
        <NoResults/>
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart margin={{ top: -10, bottom: 12 }}>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name) => {
                const categoryConfig = chartConfig[name as keyof typeof chartConfig];
                const color = categoryConfig?.color || "#000000";
                return (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color } as React.CSSProperties}
                    />
                    {titleCase((categoryConfig?.label || name) as string)}
                    <Amount value={+value} className="text-sm" currency={currency} />
                  </>
                );
              }}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="expenses"
          nameKey="category"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          className="translate-y-2.5 flex-wrap gap-2 *:basis-1/4 *:justify-center text-sm"
        />
      </PieChart>
    </ChartContainer>
  );
}
