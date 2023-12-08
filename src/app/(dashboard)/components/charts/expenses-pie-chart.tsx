"use client";

import { Amount } from "@/components/amount";
import { TransactionCategory } from "@/components/transaction/transaction-category";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { Circle } from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

const Colors = ["#e42b41", "#0088fe", "#00c49f", "#ff8042", "#5d5d5d"];

interface ExpensesPieChartProps {
  data: { name: string; value: number }[];
  currency: string;
}

function ExpensesPieChart({ data, currency }: ExpensesPieChartProps) {
  return (
    <>
      <div className="flex justify-center">
        <PieChart
          width={300}
          height={250}
          margin={{ top: 5, right: 0, left: 0, bottom: 15 }}
        >
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            fill="#82ca9d"
            labelLine={false}
            label={false}
          >
            {data?.map((_, i) => (
              <Cell key={`cell-${i}`} fill={Colors[i % Colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
      <div className="space-y-1 mt-4">
        {data?.map(({ name, value }, i) => (
          <div className="flex justify-between" key={name}>
            {name === "other" ? (
              <div className="flex gap-2">
                <Circle style={{ color: Colors[i] }} />
                Other
              </div>
            ) : (
              <TransactionCategory
                iconColor={Colors[i]}
                type={TransactionTypesEnum.Expense}
                category={name}
              ></TransactionCategory>
            )}

            <Amount value={value} currency={currency}></Amount>
          </div>
        ))}
      </div>
    </>
  );
}

export default ExpensesPieChart;
