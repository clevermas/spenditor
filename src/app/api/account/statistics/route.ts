import moment from "moment";

import { AccountClass } from "@/db/account";
import { Transaction } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { createList } from "@/lib/utils";

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

        let expenseCategories = {};
        data = data.filter((t) => t.date >= startOfMonth);
        data.forEach(
          (t) =>
            (expenseCategories[t.category] =
              (+expenseCategories[t.category] || 0) + +t.amount)
        );
        expenseCategories = Object.keys(expenseCategories)
          .sort((prev, next) =>
            expenseCategories[prev] > expenseCategories[next] ? 1 : -1
          )
          .map((category) => ({
            name: category,
            value: Math.abs(expenseCategories[category]),
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

        const weeklyExpenses = createList(4, (i) => ({
          name: "Week " + (i + 1),
          amount: data.reduce((amount, transaction) => {
            const onThisWeek =
              transaction.date >=
                moment(startOfMonth).add(i, "weeks").toDate() &&
              transaction.date <
                moment(startOfMonth)
                  .add(i + 1, "weeks")
                  .toDate();

            return amount + (onThisWeek ? Math.abs(transaction.amount) : 0);
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
