import moment from "moment";

import { Transaction, TransactionClass } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { getPage, PaginationDataResponseDTO } from "@/lib/pagination";

import { AccountClass } from "@/db/account";
import { DailyTransactionsList } from "@/lib/transaction/transaction";
import { NextResponse } from "next/server";

export interface GetAccountDataResponseDTO {
  name: string;
  currency: string;
  balance: string;
  recentTransactions: PaginationDataResponseDTO<DailyTransactionsList[]>;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = +(searchParams.get("page") || 1);
  const limit = +(searchParams.get("limit") || 5);

  const account = (await currentAccount()) as AccountClass;

  if (account instanceof NextResponse) {
    return account;
  }

  const { name, currency, balance } = account;
  const accountData = { name, currency, balance };

  return await handleMongoDbQuery(
    async () =>
      await Transaction.find({ accountId: account?.id }, { __v: 0 }).sort({
        date: -1,
      }),
    {
      successMap: (data) => ({
        ...accountData,
        recentTransactions: getPage(
          createDailyTransactionGroups(data),
          page,
          limit
        ),
      }),
    }
  );
}

function createDailyTransactionGroups(
  transactions: TransactionClass[]
): DailyTransactionsList[] {
  const groups = [] as DailyTransactionsList[];

  transactions.forEach((transaction) => {
    const date = moment(transaction.date).startOf("day").toISOString();

    let i = groups.findIndex((g) => g.date === date);
    if (i !== -1) {
      groups[i].transactions.push(transaction);
    } else {
      groups.push({ date, transactions: [transaction] });
    }
  });

  return groups;
}
