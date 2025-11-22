import moment from "moment";
import { NextResponse } from "next/server";

import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { monthlyExpenses, weeklyExpenses } from "@/lib/statistics";
import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { ListItem } from "@/lib/utils";

import { Transaction } from "@/db/transaction";

export interface StatisticsResponseDTO {
  currentMonth: {
    expenseCategories: ListItem[];
    weeklyExpenses: ListItem[];
    total: number;
  };
}

export async function GET(req: Request) {
  const account = await currentAccount();

  if (account instanceof NextResponse) {
    return account;
  }

  const startOfMonth = moment.utc().startOf("month");

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
      successMap: (data) => ({ 
        ...monthlyExpenses(data, startOfMonth),
        ...weeklyExpenses(data, startOfMonth),
      })
    }
  );
}
