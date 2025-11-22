import moment from "moment";
import { createList, ListItem } from "@/lib/utils";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";

export function monthlyExpenses(data: any[], startOfMonth: string | moment.Moment) {
  startOfMonth = moment.utc(startOfMonth);

  const endOfMonth = startOfMonth.clone().endOf('month');

  const expensesData = data.filter((t) => {
    return t.date >= startOfMonth.toDate() &&
           t.date <= endOfMonth.toDate() &&
           t.type === TransactionTypesEnum.Expense;
  });

  let categoriesMap: { [key: string]: number } = {};
  expensesData.forEach(
    (t) =>
      (categoriesMap[t.category] =
        (+categoriesMap[t.category] || 0) + +t.amount)
  );

  let categories = Object.keys(categoriesMap)
    .map((category) => ({
      name: category,
      value: Math.abs(categoriesMap[category]),
    }))
    .sort((prev, next) => next.value - prev.value);

  if (categories.length > 5) {
    const otherExpensesSum = categories
      .slice(4)
      .reduce((sum, category) => sum + category.value, 0);

    categories = [
      ...categories.slice(0, 4),
      {
        name: "other",
        value: otherExpensesSum,
      },
    ];
  }

  const total = Math.abs(
    expensesData.reduce((amount, t) => amount + +t.amount, 0)
  );

  return {
    monthlyExpenses: {
      categories,
      total,
    },
  };
};