"use client";

import { Amount } from "@/components/amount";
import { NoResults } from "@/components/no-results";
import { Skeleton } from "@/components/ui/skeleton";
import { ListItem } from "@/lib/utils";
import { Line, LineChart, Tooltip, YAxis } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active) {
    return <Amount value={payload?.[0]?.value ?? 0}></Amount>;
  }

  return null;
};

interface WeeklyExpensesChartProps {
  data: ListItem[];
  currency: string;
  loading?: boolean;
}

function WeeklyExpensesChart({
  data,
  currency,
  loading,
}: WeeklyExpensesChartProps) {
  return loading ? (
    <div className="space-y-2" data-testid="weekly-expenses-chart-skeleton">
      <Skeleton className="h-[218px] my-4" />
      <Skeleton className="h-5" />
      <Skeleton className="h-5" />
      <Skeleton className="h-5" />
      <Skeleton className="h-5" />
    </div>
  ) : data?.length ? (
    <>
      <div className="flex justify-center">
        <LineChart
          width={300}
          height={250}
          data={data}
          margin={{ top: 15, right: 10, left: -15, bottom: 15 }}
        >
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0088fe"
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="space-y-1 mt-4">
        {data?.map(({ name, value }, i) => (
          <div className="flex justify-between" key={name}>
            {name}

            <Amount value={value} currency={currency}></Amount>
          </div>
        ))}
      </div>
    </>
  ) : (
    <NoResults />
  );
}

export default WeeklyExpensesChart;
