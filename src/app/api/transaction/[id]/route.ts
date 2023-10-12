import moment from "moment";

import { Transaction } from "@/db/transaction";
import { currentAccount } from "@/lib/current-account";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const transaction = await req.json();

  const account = await currentAccount();

  if (!account) {
    return NextResponse.json(
      { error: "Account or profile data not found" },
      { status: 400 }
    );
  }

  const transactionId = params.id;

  let data = await Transaction.findByIdAndUpdate(
    transactionId,
    { ...transaction, date: moment(transaction?.date) },
    {
      new: true,
    }
  )
    .lean()
    .exec();

  if (!data) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 400 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const account = await currentAccount();

  if (!account) {
    return NextResponse.json(
      { error: "Account or profile data not found" },
      { status: 400 }
    );
  }

  const transactionId = params.id;

  let data = await Transaction.findByIdAndDelete(transactionId).exec();

  if (!data) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
