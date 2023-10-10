import { createList } from "@/lib/utils";
import { NextResponse } from "next/server";
import { createDailyTransactions, data } from "../transactions/route";

export async function POST(req: Request) {
  const res = await req.json();

  data.data = createList(24, createDailyTransactions);

  return NextResponse.json({}, { status: 201 });
}
