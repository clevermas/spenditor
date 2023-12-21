import moment from "moment";

import { AccountClass } from "@/db/account";
import { Transaction } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { createList, ListItem } from "@/lib/utils";

export interface StatisticsResponseDTO {
  currentMonth: {
    expenseCategories: ListItem[];
    weeklyExpenses: ListItem[];
    total: number;
  };
}

export async function GET(req: Request) {
  const account = (await currentAccount()) as AccountClass;

  return await handleMongoDbQuery(
    async () =>
      await Transaction.find(
        {
          accountId: account?.id,
          type: TransactionTypesEnum.Expense,
        },
        { __v: 0 }
      ).sort({
        date: -1,
      }),
    {
      successMap: (data) => {
        const startOfMonth = moment().startOf("month");

        let expenseCategoriesMap = {};
        data = data.filter((t) => t.date >= startOfMonth);
        data.forEach(
          (t) =>
            (expenseCategoriesMap[t.category] =
              (+expenseCategoriesMap[t.category] || 0) + +t.amount)
        );
        let expenseCategories = Object.keys(expenseCategoriesMap)
          .sort((prev, next) =>
            expenseCategoriesMap[prev] > expenseCategoriesMap[next] ? 1 : -1
          )
          .map((category) => ({
            name: category,
            value: Math.abs(expenseCategoriesMap[category]),
          }));

        if (expenseCategories.length > 5) {
          expenseCategories = [
            ...expenseCategories.slice(0, 4),
            expenseCategories.slice(4).reduce(
              (other, category) => {
                return {
                  ...other,
                  value: other.value + category.value,
                };
              },
              {
                name: "other",
                value: 0,
              }
            ),
          ];
        }

        const weeklyExpenses =
          data?.length &&
          createList(4, (i) => ({
            name: "Week " + (i + 1),
            value: data.reduce((value, transaction) => {
              const onThisWeek =
                transaction.date >=
                  moment(startOfMonth).add(i, "weeks").toDate() &&
                transaction.date <
                  moment(startOfMonth)
                    .add(i + 1, "weeks")
                    .toDate();

              return value + (onThisWeek ? Math.abs(transaction.amount) : 0);
            }, 0),
          }));

        const total = Math.abs(
          data.reduce((amount, t) => amount + +t.amount, 0)
        );

        return {
          currentMonth: {
            expenseCategories,
            weeklyExpenses,
            total,
          },
        };
      },
    }
  );
}
