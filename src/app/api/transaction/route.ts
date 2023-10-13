import * as moment from "moment";

import { Account } from "@/db/account";
import { Transaction, TransactionClass } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { handleMongoDbQuery } from "@/lib/error-handling";
import { validateTransaction } from "@/lib/transaction/transaction-validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let transaction = (await req.json()) as TransactionClass;

  const { profile, account } = await currentAccount(true);
  if (account instanceof NextResponse) {
    return account;
  }

  transaction = {
    ...transaction,
    date: moment(transaction?.date),
    profileId: profile?.id,
    accountId: account?.id,
  };

  const validation = validateTransaction(transaction);
  if (validation instanceof NextResponse) {
    return validation;
  }

  const newTransaction = await handleMongoDbQuery(
    async () => await Transaction.create(transaction),
    {
      withoutResponse: true,
    }
  );
  if (newTransaction instanceof NextResponse) {
    return newTransaction;
  }

  const newBalance = +Number(
    +account?.balance + +newTransaction?.amount
  ).toFixed(2);

  return await handleMongoDbQuery(
    async () =>
      await Account.findByIdAndUpdate(account?.id, {
        balance: newBalance,
      }).exec(),
    {
      successMap: () => newTransaction,
      successStatus: 201,
    }
  );
}
