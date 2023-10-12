import * as moment from "moment";

import { Transaction } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let transaction = await req.json();

  const { profile, account } = await currentAccount(true);

  transaction = await Transaction.create({
    ...transaction,
    date: moment(transaction?.date),
    profileId: profile?.id,
    accountId: account?.id,
  });

  return NextResponse.json(transaction, { status: 201 });
}
