"use client";

import { Amount } from "@/components/amount";
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
  data: { name: string; amount: number }[];
  currency: string;
}

function WeeklyExpensesChart({ data, currency }: WeeklyExpensesChartProps) {
  return (
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
            dataKey="amount"
            stroke="#0088fe"
            strokeWidth={3}
          />
        </LineChart>
      </div>
      <div className="space-y-1">
        {data?.map(({ name, amount }, i) => (
          <div className="flex justify-between" key={name}>
            {name}

            <Amount value={amount} currency={currency}></Amount>
          </div>
        ))}
      </div>
    </>
  );
}

export default WeeklyExpensesChart;
