import moment from "moment";

import { AccountClass } from "@/db/account";
import { Transaction } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";

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
        const startOfMonth = moment().startOf("month").toDate();

        const expenses = {};
        data = data.filter((t) => t.date >= startOfMonth);
        data.forEach(
          (t) =>
            (expenses[t.category] = (+expenses[t.category] || 0) + +t.amount)
        );

        const totalExpenses = data.reduce((amount, t) => amount + +t.amount, 0);

        return {
          statistics: { expenses },
          totalExpenses,
        };
      },
    }
  );
}
